<?php

namespace Tests\Feature;

use App\Models\Lesson;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LessonTest extends TestCase
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

    public function test_lessons_are_isolated_per_school(): void
    {
        $alpha = $this->school('Alpha');
        $bright = $this->school('Bright');

        $alphaTeacher = $this->user($alpha, 'teacher');
        Sanctum::actingAs($alphaTeacher);
        $this->postJson('/api/lessons', ['title' => 'Photosynthesis'])
            ->assertCreated();

        // Bright's teacher sees none of Alpha's lessons.
        $brightTeacher = $this->user($bright, 'teacher');
        Sanctum::actingAs($brightTeacher);
        $this->getJson('/api/lessons')->assertOk()->assertJsonCount(0);

        $this->assertSame(1, Lesson::withoutGlobalScope('school')->count());
    }

    public function test_teacher_can_create_a_lesson_forcing_author(): void
    {
        $school = $this->school('Alpha');
        $teacher = $this->user($school, 'teacher');

        Sanctum::actingAs($teacher);
        $this->postJson('/api/lessons', ['title' => 'Algebra basics'])
            ->assertCreated()
            ->assertJsonFragment(['title' => 'Algebra basics'])
            ->assertJsonFragment(['teacher_id' => $teacher->id]);
    }

    public function test_student_cannot_create_a_lesson(): void
    {
        $school = $this->school('Alpha');
        $student = $this->user($school, 'student');

        Sanctum::actingAs($student);
        $this->postJson('/api/lessons', ['title' => 'Sneaky lesson'])
            ->assertForbidden(); // 403 via LessonPolicy@create
    }
}
