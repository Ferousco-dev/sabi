<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ResultRejectTest extends TestCase
{
    use RefreshDatabase;

    private static int $seq = 0;

    private function user(School $school, string $role): User
    {
        static::$seq++;

        return User::create([
            'name' => ucfirst($role) . ' ' . $school->name,
            'email' => $role . static::$seq . '.' . strtolower($school->name) . '@test.test',
            'password' => bcrypt('password'),
            'role' => $role,
            'status' => 'active',
            'school_id' => $school->id,
        ]);
    }

    public function test_admin_can_reject_a_result(): void
    {
        $school = School::create(['name' => 'Alpha']);
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $subject = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();

        Sanctum::actingAs($teacher);
        $result = $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $subject['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertCreated()->json();

        Sanctum::actingAs($admin);
        $this->postJson("/api/results/{$result['id']}/reject")
            ->assertOk()
            ->assertJsonFragment(['status' => 'rejected'])
            ->assertJsonFragment(['reviewed_by' => $admin->id]);
    }

    public function test_teacher_cannot_reject_a_result(): void
    {
        $school = School::create(['name' => 'Alpha']);
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $subject = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();

        Sanctum::actingAs($teacher);
        $result = $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $subject['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertCreated()->json();

        // Teacher tries to reject -> forbidden.
        $this->postJson("/api/results/{$result['id']}/reject")
            ->assertForbidden(); // 403 via ResultPolicy@reject
    }

    public function test_admin_can_bulk_publish_all_approved_results(): void
    {
        $school = School::create(['name' => 'Alpha']);
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $maths = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();
        $english = $this->postJson('/api/subjects', ['name' => 'English', 'code' => 'ENG'])
            ->assertCreated()->json();

        Sanctum::actingAs($teacher);
        $r1 = $this->postJson('/api/results', [
            'student_id' => $student->id, 'subject_id' => $maths['id'],
            'assessment_config_id' => $config['id'], 'score' => 80,
        ])->assertCreated()->json();
        $r2 = $this->postJson('/api/results', [
            'student_id' => $student->id, 'subject_id' => $english['id'],
            'assessment_config_id' => $config['id'], 'score' => 55,
        ])->assertCreated()->json();

        // Approve only r1, leave r2 pending.
        Sanctum::actingAs($admin);
        $this->postJson("/api/results/{$r1['id']}/approve")->assertOk();

        // Publish all approved -> exactly 1 published.
        $this->postJson('/api/results/publish-all')
            ->assertOk()
            ->assertJsonFragment(['published' => 1]);

        // Student now sees only the published result.
        Sanctum::actingAs($student);
        $this->getJson('/api/results')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $r1['id'], 'status' => 'published']);
    }
}
