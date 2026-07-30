<?php

namespace Tests\Feature;

use App\Models\Holiday;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HolidayTenancyTest extends TestCase
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

    public function test_holidays_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        Sanctum::actingAs($alpha);
        $this->postJson('/api/holidays', [
            'title' => 'Independence Day',
            'date' => '2025-10-01',
            'description' => 'National holiday',
        ])->assertCreated();

        Sanctum::actingAs($bright);
        $this->postJson('/api/holidays', [
            'title' => 'Founders Day',
            'date' => '2025-11-15',
        ])->assertCreated();

        $this->getJson('/api/holidays')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Founders Day'])
            ->assertJsonMissing(['title' => 'Independence Day']);

        $this->assertSame(2, Holiday::withoutGlobalScope('school')->count());
    }
}
