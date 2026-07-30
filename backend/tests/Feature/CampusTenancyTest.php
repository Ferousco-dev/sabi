<?php

namespace Tests\Feature;

use App\Models\Campus;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CampusTenancyTest extends TestCase
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

    public function test_campuses_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        Sanctum::actingAs($alpha);
        $this->postJson('/api/campuses', ['name' => 'Alpha Main', 'is_main' => true])->assertCreated();

        Sanctum::actingAs($bright);
        $this->postJson('/api/campuses', ['name' => 'Bright Annex'])->assertCreated();

        $this->getJson('/api/campuses')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Bright Annex'])
            ->assertJsonMissing(['name' => 'Alpha Main']);

        $this->assertSame(2, Campus::withoutGlobalScope('school')->count());
    }
}
