<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserManagementTest extends TestCase
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

    private function student(User $admin, string $name): User
    {
        return User::create([
            'name' => $name,
            'email' => strtolower(str_replace(' ', '', $name)) . '@test.test',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'active',
            'school_id' => $admin->school_id,
        ]);
    }

    public function test_set_status_changes_a_users_status(): void
    {
        $alpha = $this->admin('alpha');
        $student = $this->student($alpha, 'Ada Alpha');

        Sanctum::actingAs($alpha);
        $this->postJson("/api/users/{$student->id}/status", ['status' => 'graduated'])
            ->assertOk()
            ->assertJsonFragment(['status' => 'graduated']);

        $this->assertSame('graduated', $student->fresh()->status);
    }

    public function test_set_status_404s_for_a_cross_tenant_user(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');
        $brightStudent = $this->student($bright, 'Ben Bright');

        Sanctum::actingAs($alpha);
        $this->postJson("/api/users/{$brightStudent->id}/status", ['status' => 'inactive'])
            ->assertNotFound();

        // Untouched.
        $this->assertSame('active', $brightStudent->fresh()->status);
    }

    public function test_update_role_changes_a_users_role(): void
    {
        $alpha = $this->admin('alpha');
        $student = $this->student($alpha, 'Ada Alpha');

        Sanctum::actingAs($alpha);
        $this->postJson("/api/users/{$student->id}/role", ['role' => 'teacher'])
            ->assertOk()
            ->assertJsonFragment(['role' => 'teacher']);

        $this->assertSame('teacher', $student->fresh()->role);
    }

    public function test_update_role_404s_for_a_cross_tenant_user(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');
        $brightStudent = $this->student($bright, 'Ben Bright');

        Sanctum::actingAs($alpha);
        $this->postJson("/api/users/{$brightStudent->id}/role", ['role' => 'teacher'])
            ->assertNotFound();
    }
}
