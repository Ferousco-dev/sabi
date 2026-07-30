<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StudentManagementTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $school, string $role): User
    {
        $s = School::create(['name' => $school]);

        return User::create([
            'name' => "$role $school",
            'email' => strtolower("$role.$school") . '@test.test',
            'password' => bcrypt('password'),
            'role' => $role,
            'status' => 'active',
            'school_id' => $s->id,
        ]);
    }

    public function test_admin_can_create_a_student(): void
    {
        $admin = $this->user('alpha', 'school_admin');

        Sanctum::actingAs($admin);
        $this->postJson('/api/students', [
            'name' => 'Ada Student',
            'email' => 'ada.student@test.test',
        ])->assertCreated()
            ->assertJsonFragment(['role' => 'student', 'school_id' => $admin->school_id]);

        $this->assertDatabaseHas('users', [
            'email' => 'ada.student@test.test',
            'role' => 'student',
            'school_id' => $admin->school_id,
        ]);
    }

    public function test_teacher_cannot_create_a_student(): void
    {
        $teacher = $this->user('alpha', 'teacher');

        Sanctum::actingAs($teacher);
        $this->postJson('/api/students', [
            'name' => 'Ada Student',
            'email' => 'ada.student@test.test',
        ])->assertStatus(403);
    }

    public function test_creating_a_student_with_an_existing_email_returns_409(): void
    {
        $admin = $this->user('alpha', 'school_admin');

        Sanctum::actingAs($admin);
        // Reuse the admin's own email.
        $this->postJson('/api/students', [
            'name' => 'Clashing Student',
            'email' => $admin->email,
        ])->assertStatus(409);
    }

    public function test_student_list_is_tenant_scoped(): void
    {
        $alphaAdmin = $this->user('alpha', 'school_admin');
        $brightAdmin = $this->user('bright', 'school_admin');

        // A student in each school.
        User::create([
            'name' => 'Ada Alpha', 'email' => 'ada.alpha@test.test',
            'password' => bcrypt('x'), 'role' => 'student', 'status' => 'active',
            'school_id' => $alphaAdmin->school_id,
        ]);
        User::create([
            'name' => 'Ben Bright', 'email' => 'ben.bright@test.test',
            'password' => bcrypt('x'), 'role' => 'student', 'status' => 'active',
            'school_id' => $brightAdmin->school_id,
        ]);

        Sanctum::actingAs($alphaAdmin);
        $this->getJson('/api/students')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Ada Alpha'])
            ->assertJsonMissing(['name' => 'Ben Bright']);
    }
}
