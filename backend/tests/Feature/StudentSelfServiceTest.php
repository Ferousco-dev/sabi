<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\StudentSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StudentSelfServiceTest extends TestCase
{
    use RefreshDatabase;

    private function school(string $name): School
    {
        return School::create(['name' => $name]);
    }

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

    // ── (a) score-history ───────────────────────────────────────────────────

    public function test_score_history_returns_only_callers_own_published_results(): void
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
        // Published Maths result for our student.
        $published = $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $maths['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertCreated()->json();
        // Pending English result for our student (should stay hidden).
        $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $english['id'],
            'assessment_config_id' => $config['id'],
            'score' => 55,
        ])->assertCreated();
        // Published result for a different student (should stay hidden).
        $otherPublished = $this->postJson('/api/results', [
            'student_id' => $otherStudent->id,
            'subject_id' => $maths['id'],
            'assessment_config_id' => $config['id'],
            'score' => 90,
        ])->assertCreated()->json();

        Sanctum::actingAs($admin);
        $this->postJson("/api/results/{$published['id']}/publish")->assertOk();
        $this->postJson("/api/results/{$otherPublished['id']}/publish")->assertOk();

        // Our student: exactly one subject group (Maths), one score, correct max.
        Sanctum::actingAs($student);
        $this->getJson('/api/score-history')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['subject' => 'Maths'])
            ->assertJsonFragment(['assessment' => 'First Test', 'score' => '80.00', 'max' => 100])
            ->assertJsonMissing(['subject' => 'English']);
    }

    // ── (b) settings GET creates+returns defaults, PUT updates, isolated ─────

    public function test_settings_get_creates_defaults_and_put_persists(): void
    {
        $school = $this->school('Alpha');
        $student = $this->user($school, 'student');

        Sanctum::actingAs($student);

        // GET creates a default row.
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonFragment([
                'user_id' => $student->id,
                'notify_email' => true,
                'notify_sms' => false,
                'notify_push' => true,
                'high_contrast' => false,
                'large_text' => false,
                'reduce_motion' => false,
            ]);

        $this->assertSame(1, StudentSetting::withoutGlobalScope('school')->count());

        // PUT updates and persists.
        $this->putJson('/api/settings', [
            'notify_sms' => true,
            'high_contrast' => true,
            'reduce_motion' => true,
        ])->assertOk()
            ->assertJsonFragment([
                'notify_sms' => true,
                'high_contrast' => true,
                'reduce_motion' => true,
                'notify_email' => true, // untouched
            ]);

        // Still one row (updated, not duplicated), values persisted.
        $this->assertSame(1, StudentSetting::withoutGlobalScope('school')->count());
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonFragment(['notify_sms' => true, 'high_contrast' => true]);
    }

    public function test_each_user_only_sees_and_edits_their_own_settings_row(): void
    {
        $school = $this->school('Alpha');
        $studentA = $this->user($school, 'student');
        $studentB = $this->user($school, 'student');

        // A sets high_contrast on.
        Sanctum::actingAs($studentA);
        $this->putJson('/api/settings', ['high_contrast' => true])->assertOk();

        // B gets fresh defaults (does NOT see A's row) and edits independently.
        Sanctum::actingAs($studentB);
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonFragment(['user_id' => $studentB->id, 'high_contrast' => false]);
        $this->putJson('/api/settings', ['large_text' => true])->assertOk();

        // A's row is unchanged by B's edit.
        Sanctum::actingAs($studentA);
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonFragment(['user_id' => $studentA->id, 'high_contrast' => true, 'large_text' => false]);

        // Two distinct rows, one per user.
        $this->assertSame(2, StudentSetting::withoutGlobalScope('school')->count());
    }

    // ── (c) tenancy isolation on settings ────────────────────────────────────

    public function test_settings_are_isolated_per_school(): void
    {
        $alpha = $this->school('Alpha');
        $bright = $this->school('Bright');

        $alphaStudent = $this->user($alpha, 'student');
        $brightStudent = $this->user($bright, 'student');

        // Alpha's student creates a settings row.
        Sanctum::actingAs($alphaStudent);
        $this->getJson('/api/settings')->assertOk();

        // Bright's student gets their own fresh row, not Alpha's.
        Sanctum::actingAs($brightStudent);
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonFragment(['user_id' => $brightStudent->id]);

        // Bright only ever sees one row within its tenant scope.
        $this->assertSame(1, StudentSetting::count());
        // But globally there are two rows across both schools.
        $this->assertSame(2, StudentSetting::withoutGlobalScope('school')->count());
    }
}
