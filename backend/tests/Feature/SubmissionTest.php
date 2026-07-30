<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\School;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SubmissionTest extends TestCase
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

    private function assignment(User $teacher): array
    {
        Sanctum::actingAs($teacher);

        return $this->postJson('/api/assignments', ['title' => 'Essay 1'])
            ->assertCreated()->json();
    }

    public function test_student_can_submit_and_resubmit_updates_the_same_row(): void
    {
        $school = $this->school('Alpha');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');
        $assignment = $this->assignment($teacher);

        Sanctum::actingAs($student);

        // First submit -> 201 created.
        $first = $this->postJson('/api/submissions', [
            'assignment_id' => $assignment['id'],
            'content' => 'My first draft',
        ])->assertCreated()->json();

        // Second submit to the same assignment -> 200, updates same row.
        $this->postJson('/api/submissions', [
            'assignment_id' => $assignment['id'],
            'content' => 'My revised draft',
        ])->assertOk()
            ->assertJsonFragment(['id' => $first['id']])
            ->assertJsonFragment(['content' => 'My revised draft']);

        $this->assertSame(1, Submission::withoutGlobalScope('school')->count());
    }

    public function test_student_forces_own_student_id_and_sees_only_their_own(): void
    {
        $school = $this->school('Alpha');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');
        $other = $this->user($school, 'student');
        $assignment = $this->assignment($teacher);

        // Our student submits.
        Sanctum::actingAs($student);
        $this->postJson('/api/submissions', [
            'assignment_id' => $assignment['id'],
            'content' => 'Mine',
        ])->assertCreated()
            ->assertJsonFragment(['student_id' => $student->id]);

        // Other student submits too.
        Sanctum::actingAs($other);
        $this->postJson('/api/submissions', [
            'assignment_id' => $assignment['id'],
            'content' => 'Theirs',
        ])->assertCreated();

        // Our student sees only their own submission.
        Sanctum::actingAs($student);
        $this->getJson('/api/submissions')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['student_id' => $student->id]);
    }

    public function test_teacher_can_grade_a_submission(): void
    {
        $school = $this->school('Alpha');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');
        $assignment = $this->assignment($teacher);

        Sanctum::actingAs($student);
        $submission = $this->postJson('/api/submissions', [
            'assignment_id' => $assignment['id'],
            'content' => 'Done',
        ])->assertCreated()->json();

        Sanctum::actingAs($teacher);
        $this->postJson("/api/submissions/{$submission['id']}/grade", [
            'grade' => 'A',
            'feedback' => 'Excellent work',
        ])->assertOk()
            ->assertJsonFragment(['grade' => 'A'])
            ->assertJsonFragment(['feedback' => 'Excellent work']);
    }

    public function test_student_cannot_grade_a_submission(): void
    {
        $school = $this->school('Alpha');
        $teacher = $this->user($school, 'teacher');
        $student = $this->user($school, 'student');
        $assignment = $this->assignment($teacher);

        Sanctum::actingAs($student);
        $submission = $this->postJson('/api/submissions', [
            'assignment_id' => $assignment['id'],
            'content' => 'Done',
        ])->assertCreated()->json();

        // Student tries to grade their own -> forbidden.
        $this->postJson("/api/submissions/{$submission['id']}/grade", [
            'grade' => 'A',
        ])->assertForbidden(); // 403 via SubmissionPolicy@grade
    }
}
