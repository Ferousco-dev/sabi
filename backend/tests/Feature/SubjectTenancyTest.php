<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SubjectTenancyTest extends TestCase
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

    public function test_subjects_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        // Alpha adds a subject through the API.
        Sanctum::actingAs($alpha);
        $this->postJson('/api/subjects', ['name' => 'Mathematics', 'code' => 'MTH'])->assertCreated();

        // Bright reuses the same code — allowed, because uniqueness is per-school.
        Sanctum::actingAs($bright);
        $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])->assertCreated();

        // Bright sees only their own subject.
        $this->getJson('/api/subjects')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Maths'])
            ->assertJsonMissing(['name' => 'Mathematics']);

        $this->assertSame(2, Subject::withoutGlobalScope('school')->count());
    }
}
