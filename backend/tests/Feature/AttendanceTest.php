<?php

namespace Tests\Feature;

use App\Models\AttendanceRecord;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Build a school with an admin, one class, and a set of student users.
     * Returns [$school, $admin, $class, [$students...]].
     */
    private function makeSchool(string $name, int $students = 2): array
    {
        $s = School::create(['name' => $name]);
        $slug = strtolower(str_replace(' ', '', $name));

        $admin = User::create([
            'name' => "Admin $name",
            'email' => "$slug-admin@test.test",
            'password' => bcrypt('password'),
            'role' => 'school_admin',
            'status' => 'active',
            'school_id' => $s->id,
        ]);

        $class = SchoolClass::create(['school_id' => $s->id, 'name' => "$name Class"]);

        $roster = [];
        for ($i = 1; $i <= $students; $i++) {
            $roster[] = User::create([
                'name' => "$name Student $i",
                'email' => "$slug-student$i@test.test",
                'password' => bcrypt('password'),
                'role' => 'student',
                'status' => 'active',
                'school_id' => $s->id,
            ]);
        }

        return [$s, $admin, $class, $roster];
    }

    public function test_attendance_is_isolated_per_school(): void
    {
        [$alpha, $alphaAdmin, $alphaClass, $alphaStudents] = $this->makeSchool('Alpha');
        [$bright, $brightAdmin, $brightClass, $brightStudents] = $this->makeSchool('Bright');

        // Alpha records attendance.
        Sanctum::actingAs($alphaAdmin);
        $this->postJson('/api/attendance', [
            'class_id' => $alphaClass->id,
            'date' => '2026-07-30',
            'records' => [
                ['student_id' => $alphaStudents[0]->id, 'status' => 'present'],
                ['student_id' => $alphaStudents[1]->id, 'status' => 'absent'],
            ],
        ])->assertCreated();

        // Bright records its own attendance.
        Sanctum::actingAs($brightAdmin);
        $this->postJson('/api/attendance', [
            'class_id' => $brightClass->id,
            'date' => '2026-07-30',
            'records' => [
                ['student_id' => $brightStudents[0]->id, 'status' => 'late'],
            ],
        ])->assertCreated();

        // Bright only sees its single record, never Alpha's.
        $this->getJson('/api/attendance')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['status' => 'late'])
            ->assertJsonMissing(['status' => 'absent']);

        // 2 (Alpha) + 1 (Bright) rows total across all tenants.
        $this->assertSame(3, AttendanceRecord::withoutGlobalScope('school')->count());
    }

    public function test_replaying_the_same_offline_batch_is_idempotent(): void
    {
        [$alpha, $admin, $class, $students] = $this->makeSchool('Alpha');
        Sanctum::actingAs($admin);

        $batch = [
            'class_id' => $class->id,
            'date' => '2026-07-30',
            'records' => [
                ['student_id' => $students[0]->id, 'status' => 'present', 'client_uuid' => 'uuid-1'],
                ['student_id' => $students[1]->id, 'status' => 'absent', 'client_uuid' => 'uuid-2'],
            ],
        ];

        // First send.
        $this->postJson('/api/attendance', $batch)->assertCreated();
        $this->assertSame(2, AttendanceRecord::withoutGlobalScope('school')->count());

        // Replay the EXACT same offline batch (e.g. the queue flushed twice).
        $this->postJson('/api/attendance', $batch)->assertCreated();

        // Still 2 rows — updated, not duplicated.
        $this->assertSame(2, AttendanceRecord::withoutGlobalScope('school')->count());

        // A replay with a corrected status updates the existing row (LWW).
        $batch['records'][0]['status'] = 'late';
        $this->postJson('/api/attendance', $batch)->assertCreated();

        $this->assertSame(2, AttendanceRecord::withoutGlobalScope('school')->count());
        $this->assertDatabaseHas('attendance_records', [
            'student_id' => $students[0]->id,
            'date' => '2026-07-30',
            'status' => 'late',
        ]);
    }

    public function test_a_student_has_only_one_record_per_day(): void
    {
        [$alpha, $admin, $class, $students] = $this->makeSchool('Alpha');
        Sanctum::actingAs($admin);

        // Same student twice in the same day (two separate posts) stays one row.
        $this->postJson('/api/attendance', [
            'class_id' => $class->id,
            'date' => '2026-07-30',
            'records' => [['student_id' => $students[0]->id, 'status' => 'present']],
        ])->assertCreated();

        $this->postJson('/api/attendance', [
            'class_id' => $class->id,
            'date' => '2026-07-30',
            'records' => [['student_id' => $students[0]->id, 'status' => 'excused']],
        ])->assertCreated();

        $this->assertSame(1, AttendanceRecord::withoutGlobalScope('school')
            ->where('student_id', $students[0]->id)
            ->whereDate('date', '2026-07-30')
            ->count());
    }

    public function test_a_student_cannot_write_attendance(): void
    {
        [$alpha, $admin, $class, $students] = $this->makeSchool('Alpha');

        // Act as a student — forbidden by the role:school_admin,teacher middleware.
        Sanctum::actingAs($students[0]);

        $this->postJson('/api/attendance', [
            'class_id' => $class->id,
            'date' => '2026-07-30',
            'records' => [['student_id' => $students[1]->id, 'status' => 'present']],
        ])->assertForbidden();

        $this->assertSame(0, AttendanceRecord::withoutGlobalScope('school')->count());
    }
}
