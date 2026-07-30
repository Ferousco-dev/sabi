<?php

namespace Tests\Feature;

use App\Models\AttendanceRecord;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AttendanceCorrectionTest extends TestCase
{
    use RefreshDatabase;

    /** @return array{0:School,1:User,2:SchoolClass,3:User} [$school,$admin,$class,$student] */
    private function makeSchool(string $name): array
    {
        $s = School::create(['name' => $name]);
        $slug = strtolower(str_replace(' ', '', $name));
        $admin = User::create(['name' => "Admin $name", 'email' => "$slug-admin@test.test", 'password' => bcrypt('password'), 'role' => 'school_admin', 'status' => 'active', 'school_id' => $s->id]);
        $class = SchoolClass::create(['school_id' => $s->id, 'name' => "$name Class"]);
        $student = User::create(['name' => "$name Student", 'email' => "$slug-student@test.test", 'password' => bcrypt('password'), 'role' => 'student', 'status' => 'active', 'school_id' => $s->id]);

        return [$s, $admin, $class, $student];
    }

    private function record(School $s, SchoolClass $c, User $student, string $status): AttendanceRecord
    {
        return AttendanceRecord::withoutGlobalScope('school')->create([
            'school_id' => $s->id, 'school_class_id' => $c->id, 'student_id' => $student->id,
            'date' => '2026-07-30', 'status' => $status,
        ]);
    }

    public function test_student_files_and_admin_approves_which_updates_the_record(): void
    {
        [$s, $admin, $class, $student] = $this->makeSchool('Alpha');
        $rec = $this->record($s, $class, $student, 'absent');

        // Student files a correction on their own day.
        Sanctum::actingAs($student);
        $this->postJson('/api/attendance-corrections', [
            'attendance_record_id' => $rec->id,
            'date' => '2026-07-30',
            'requested_status' => 'present',
            'reason' => 'I was in class but marked absent.',
        ])->assertCreated();

        // Admin sees it in the review queue, shaped for the dashboard.
        Sanctum::actingAs($admin);
        $this->getJson('/api/attendance-corrections')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['student_name' => 'Alpha Student', 'original_status' => 'absent', 'new_status' => 'present', 'status' => 'pending']);

        // Approving applies the requested status to the record.
        $id = \App\Models\AttendanceCorrection::withoutGlobalScope('school')->first()->id;
        $this->postJson("/api/attendance-corrections/{$id}/approve")->assertOk();

        $this->assertDatabaseHas('attendance_records', ['id' => $rec->id, 'status' => 'present']);
        $this->assertDatabaseHas('attendance_corrections', ['id' => $id, 'status' => 'approved', 'reviewed_by' => $admin->id]);
    }

    public function test_rejecting_leaves_the_record_unchanged(): void
    {
        [$s, $admin, $class, $student] = $this->makeSchool('Alpha');
        $rec = $this->record($s, $class, $student, 'absent');

        Sanctum::actingAs($student);
        $this->postJson('/api/attendance-corrections', ['attendance_record_id' => $rec->id, 'date' => '2026-07-30', 'requested_status' => 'present', 'reason' => 'test'])->assertCreated();

        Sanctum::actingAs($admin);
        $id = \App\Models\AttendanceCorrection::withoutGlobalScope('school')->first()->id;
        $this->postJson("/api/attendance-corrections/{$id}/reject")->assertOk();

        $this->assertDatabaseHas('attendance_records', ['id' => $rec->id, 'status' => 'absent']);
        $this->assertDatabaseHas('attendance_corrections', ['id' => $id, 'status' => 'rejected']);
    }

    public function test_a_second_review_is_rejected(): void
    {
        [$s, $admin, $class, $student] = $this->makeSchool('Alpha');
        $rec = $this->record($s, $class, $student, 'absent');
        Sanctum::actingAs($student);
        $this->postJson('/api/attendance-corrections', ['attendance_record_id' => $rec->id, 'date' => '2026-07-30', 'requested_status' => 'present', 'reason' => 'test'])->assertCreated();

        Sanctum::actingAs($admin);
        $id = \App\Models\AttendanceCorrection::withoutGlobalScope('school')->first()->id;
        $this->postJson("/api/attendance-corrections/{$id}/approve")->assertOk();
        $this->postJson("/api/attendance-corrections/{$id}/approve")->assertStatus(422);
    }

    public function test_corrections_are_tenant_isolated(): void
    {
        [$sa, $adminA, $classA, $studentA] = $this->makeSchool('Alpha');
        [$sb, $adminB, $classB, $studentB] = $this->makeSchool('Bright');
        $recA = $this->record($sa, $classA, $studentA, 'absent');

        Sanctum::actingAs($studentA);
        $this->postJson('/api/attendance-corrections', ['attendance_record_id' => $recA->id, 'date' => '2026-07-30', 'requested_status' => 'present', 'reason' => 'test'])->assertCreated();

        // Bright's admin sees none of Alpha's corrections.
        Sanctum::actingAs($adminB);
        $this->getJson('/api/attendance-corrections')->assertOk()->assertJsonCount(0);
    }

    public function test_a_student_cannot_review_corrections(): void
    {
        [$s, $admin, $class, $student] = $this->makeSchool('Alpha');
        $rec = $this->record($s, $class, $student, 'absent');
        Sanctum::actingAs($student);
        $this->postJson('/api/attendance-corrections', ['attendance_record_id' => $rec->id, 'date' => '2026-07-30', 'requested_status' => 'present', 'reason' => 'test'])->assertCreated();

        // Student hitting the review queue / approve is forbidden (admin/teacher only).
        $id = \App\Models\AttendanceCorrection::withoutGlobalScope('school')->first()->id;
        $this->getJson('/api/attendance-corrections')->assertForbidden();
        $this->postJson("/api/attendance-corrections/{$id}/approve")->assertForbidden();
    }
}
