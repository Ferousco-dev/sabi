<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
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

    public function test_show_returns_the_current_tenants_school(): void
    {
        $alpha = $this->admin('alpha');

        Sanctum::actingAs($alpha);
        $this->getJson('/api/profile')
            ->assertOk()
            ->assertJsonFragment(['id' => $alpha->school_id, 'name' => 'alpha']);
    }

    public function test_update_persists_and_is_tenant_scoped(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        Sanctum::actingAs($alpha);
        $this->putJson('/api/profile', [
            'name' => 'Alpha Academy',
            'short_name' => 'AA',
            'email' => 'info@alpha.test',
            'city' => 'Lagos',
            'school_type' => 'Secondary',
        ])->assertOk()
            ->assertJsonFragment(['name' => 'Alpha Academy', 'short_name' => 'AA']);

        // Persisted on Alpha's school only.
        $this->assertDatabaseHas('schools', ['id' => $alpha->school_id, 'name' => 'Alpha Academy']);
        $this->assertDatabaseHas('schools', ['id' => $bright->school_id, 'name' => 'bright']);

        // Bright's own profile is untouched by Alpha's update.
        Sanctum::actingAs($bright);
        $this->getJson('/api/profile')
            ->assertOk()
            ->assertJsonFragment(['id' => $bright->school_id, 'name' => 'bright']);
    }

    public function test_update_is_admin_only(): void
    {
        $s = School::create(['name' => 'gamma']);
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@gamma.test',
            'password' => bcrypt('password'),
            'role' => 'teacher',
            'status' => 'active',
            'school_id' => $s->id,
        ]);

        Sanctum::actingAs($teacher);
        $this->putJson('/api/profile', ['name' => 'Hacked'])->assertForbidden();
    }
}
