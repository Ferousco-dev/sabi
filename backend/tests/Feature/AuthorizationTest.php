<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role): User
    {
        $s = School::firstOrCreate(['name' => 'Alpha']);

        return User::create([
            'name' => ucfirst($role), 'email' => $role . '@alpha.test',
            'password' => bcrypt('password'), 'role' => $role,
            'status' => 'active', 'school_id' => $s->id,
        ]);
    }

    public function test_guests_cannot_read_protected_routes(): void
    {
        $this->getJson('/api/classes')->assertUnauthorized(); // 401
    }

    public function test_policy_blocks_a_teacher_from_creating_a_class(): void
    {
        Sanctum::actingAs($this->user('teacher'));
        $this->postJson('/api/classes', ['name' => 'JSS 1'])->assertForbidden(); // 403 via SchoolClassPolicy
    }

    public function test_admin_can_create_a_class(): void
    {
        Sanctum::actingAs($this->user('school_admin'));
        $this->postJson('/api/classes', ['name' => 'JSS 1'])->assertCreated(); // 201
    }

    public function test_role_middleware_blocks_a_teacher_from_creating_a_subject(): void
    {
        Sanctum::actingAs($this->user('teacher'));
        $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])->assertForbidden(); // 403 via role middleware
    }

    public function test_admin_can_create_a_subject(): void
    {
        Sanctum::actingAs($this->user('school_admin'));
        $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])->assertCreated();
    }
}
