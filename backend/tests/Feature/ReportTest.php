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

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private function admin(string $school): User
    {
        $s = School::create(['name' => $school]);

        return User::create([
            'name' => "Admin $school",
            'email' => strtolower($school) . '@test.test',
            'password' => bcrypt('password'),
            'role' => 'school_admin',
            'status' => 'active',
            'school_id' => $s->id,
        ]);
    }

    /**
     * Seed one graded subject in the given admin's school and return the subject.
     */
    private function seedResult(User $admin, string $subjectName, float $score, int $max): Subject
    {
        Sanctum::actingAs($admin);

        $subject = Subject::create([
            'school_id' => $admin->school_id,
            'name' => $subjectName,
            'code' => strtoupper(substr($subjectName, 0, 3)),
        ]);
        $config = AssessmentConfig::create([
            'school_id' => $admin->school_id,
            'name' => 'Exam',
            'max_score' => $max,
            'term' => 'T1',
        ]);
        $student = User::create([
            'name' => "Student $subjectName",
            'email' => strtolower($subjectName) . '.student@test.test',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'active',
            'school_id' => $admin->school_id,
        ]);
        Result::create([
            'school_id' => $admin->school_id,
            'student_id' => $student->id,
            'subject_id' => $subject->id,
            'assessment_config_id' => $config->id,
            'score' => $score,
            'status' => 'published',
        ]);

        return $subject;
    }

    public function test_performance_report_is_scoped_to_the_tenant(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        $this->seedResult($alpha, 'Mathematics', 80, 100); // pass
        $this->seedResult($bright, 'Biology', 30, 100);     // fail, other school

        Sanctum::actingAs($alpha);

        $this->getJson('/api/reports/performance')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['subject' => 'Mathematics'])
            ->assertJsonMissing(['subject' => 'Biology']);
    }

    public function test_performance_report_returns_expected_shape(): void
    {
        $alpha = $this->admin('alpha');
        $this->seedResult($alpha, 'Mathematics', 80, 100);

        Sanctum::actingAs($alpha);

        $this->getJson('/api/reports/performance')
            ->assertOk()
            ->assertJsonStructure([
                '*' => ['subject', 'average_score', 'pass_rate', 'student_count'],
            ])
            ->assertJsonFragment(['subject' => 'Mathematics', 'student_count' => 1]);
    }

    public function test_activity_report_returns_200_with_shape(): void
    {
        $alpha = $this->admin('alpha');
        $this->seedResult($alpha, 'Mathematics', 80, 100);

        Sanctum::actingAs($alpha);

        $this->getJson('/api/reports/activity')
            ->assertOk()
            ->assertJsonStructure([
                'totals' => ['results', 'attendance_records', 'submissions'],
                'recent_30_days' => ['results', 'attendance_records', 'submissions'],
                'note',
            ])
            ->assertJsonPath('totals.results', 1);
    }

    public function test_non_admin_cannot_read_admin_reports(): void
    {
        $alpha = $this->admin('alpha');
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@test.test',
            'password' => bcrypt('password'),
            'role' => 'teacher',
            'status' => 'active',
            'school_id' => $alpha->school_id,
        ]);

        Sanctum::actingAs($teacher);

        $this->getJson('/api/reports/performance')->assertForbidden();
    }
}
