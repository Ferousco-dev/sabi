<?php

namespace Tests\Feature;

use App\Models\AssessmentConfig;
use App\Models\Result;
use App\Models\School;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ResultTest extends TestCase
{
    use RefreshDatabase;

    private function school(string $name): School
    {
        return School::create(['name' => $name]);
    }

    private static int $seq = 0;

    private function user(School $school, string $role): User
    {
        static::$seq++; // keep emails unique even for two students in one school

        return User::create([
            'name' => ucfirst($role) . ' ' . $school->name,
            'email' => $role . static::$seq . '.' . strtolower($school->name) . '@test.test',
            'password' => bcrypt('password'),
            'role' => $role,
            'status' => 'active',
            'school_id' => $school->id,
        ]);
    }

    public function test_results_are_isolated_per_school(): void
    {
        $alpha = $this->school('Alpha');
        $bright = $this->school('Bright');

        $alphaAdmin = $this->user($alpha, 'school_admin');
        $alphaTeacher = $this->user($alpha, 'teacher');
        $alphaStudent = $this->user($alpha, 'student');

        // Seed data inside Alpha's tenant context via the API.
        Sanctum::actingAs($alphaAdmin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $subject = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();

        Sanctum::actingAs($alphaTeacher);
        $this->postJson('/api/results', [
            'student_id' => $alphaStudent->id,
            'subject_id' => $subject['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertCreated();

        // Bright's admin sees no results and no configs from Alpha.
        $brightAdmin = $this->user($bright, 'school_admin');
        Sanctum::actingAs($brightAdmin);
        $this->getJson('/api/results')->assertOk()->assertJsonCount(0);
        $this->getJson('/api/assessment-configs')->assertOk()->assertJsonCount(0);

        $this->assertSame(1, Result::withoutGlobalScope('school')->count());
    }

    public function test_full_flow_submit_pending_then_approve_then_publish(): void
    {
        $school = $this->school('Alpha');
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $subject = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();

        // Teacher submits -> pending, submitted_by = teacher.
        Sanctum::actingAs($teacher);
        $result = $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $subject['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertCreated()
            ->assertJsonFragment(['status' => 'pending'])
            ->assertJsonFragment(['submitted_by' => $teacher->id])
            ->json();

        // Admin approves -> approved, reviewed_by = admin.
        Sanctum::actingAs($admin);
        $this->postJson("/api/results/{$result['id']}/approve")
            ->assertOk()
            ->assertJsonFragment(['status' => 'approved'])
            ->assertJsonFragment(['reviewed_by' => $admin->id]);

        // Admin publishes -> published.
        $this->postJson("/api/results/{$result['id']}/publish")
            ->assertOk()
            ->assertJsonFragment(['status' => 'published']);
    }

    public function test_student_cannot_submit_a_result(): void
    {
        $school = $this->school('Alpha');
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $subject = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();

        Sanctum::actingAs($student);
        $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $subject['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertForbidden(); // 403 via ResultPolicy@create
    }

    public function test_teacher_cannot_publish_a_result(): void
    {
        $school = $this->school('Alpha');
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

        // Teacher tries to publish -> forbidden.
        $this->postJson("/api/results/{$result['id']}/publish")
            ->assertForbidden(); // 403 via ResultPolicy@publish
    }

    public function test_student_sees_only_their_own_published_results(): void
    {
        $school = $this->school('Alpha');
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');
        $otherStudent = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $maths = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();
        $english = $this->postJson('/api/subjects', ['name' => 'English', 'code' => 'ENG'])
            ->assertCreated()->json();

        Sanctum::actingAs($teacher);
        // Published result for our student.
        $published = $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $maths['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertCreated()->json();
        // Pending result for our student (should stay hidden).
        $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $english['id'],
            'assessment_config_id' => $config['id'],
            'score' => 55,
        ])->assertCreated();
        // Result belonging to another student.
        $this->postJson('/api/results', [
            'student_id' => $otherStudent->id,
            'subject_id' => $maths['id'],
            'assessment_config_id' => $config['id'],
            'score' => 90,
        ])->assertCreated();

        // Publish only the first one.
        Sanctum::actingAs($admin);
        $this->postJson("/api/results/{$published['id']}/publish")->assertOk();

        // Student sees exactly one result: their own published Maths score.
        Sanctum::actingAs($student);
        $this->getJson('/api/results')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $published['id'], 'status' => 'published'])
            ->assertJsonMissing(['status' => 'pending']);
    }
}
