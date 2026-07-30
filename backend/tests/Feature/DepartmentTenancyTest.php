<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DepartmentTenancyTest extends TestCase
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

    public function test_departments_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        Sanctum::actingAs($alpha);
        $this->postJson('/api/departments', ['name' => 'Sciences'])->assertCreated();

        Sanctum::actingAs($bright);
        $this->postJson('/api/departments', ['name' => 'Arts'])->assertCreated();

        $this->getJson('/api/departments')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Arts'])
            ->assertJsonMissing(['name' => 'Sciences']);

        $this->assertSame(2, Department::withoutGlobalScope('school')->count());
    }

    public function test_head_teacher_must_belong_to_the_same_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        // Bright cannot set Alpha's admin as its department head.
        Sanctum::actingAs($bright);
        $this->postJson('/api/departments', [
            'name' => 'Sciences',
            'head_teacher_id' => $alpha->id,
        ])->assertStatus(422);
    }
}
