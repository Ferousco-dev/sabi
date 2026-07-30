<?php

namespace Tests\Feature;

use App\Models\AcademicSession;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SessionTenancyTest extends TestCase
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

    public function test_sessions_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        Sanctum::actingAs($alpha);
        $this->postJson('/api/sessions', [
            'name' => '2025/2026',
            'start_date' => '2025-09-01',
            'end_date' => '2026-07-31',
        ])->assertCreated();

        // Bright reuses the same name — allowed, uniqueness is per-school.
        Sanctum::actingAs($bright);
        $this->postJson('/api/sessions', [
            'name' => '2025/2026',
            'start_date' => '2025-09-01',
            'end_date' => '2026-07-31',
        ])->assertCreated();

        $this->getJson('/api/sessions')
            ->assertOk()
            ->assertJsonCount(1);

        $this->assertSame(2, AcademicSession::withoutGlobalScope('school')->count());
    }

    public function test_set_current_unsets_previous_current_within_tenant(): void
    {
        $alpha = $this->admin('alpha');
        Sanctum::actingAs($alpha);

        $first = $this->postJson('/api/sessions', [
            'name' => '2024/2025',
            'start_date' => '2024-09-01',
            'end_date' => '2025-07-31',
            'is_current' => true,
        ])->assertCreated()->json();

        $second = $this->postJson('/api/sessions', [
            'name' => '2025/2026',
            'start_date' => '2025-09-01',
            'end_date' => '2026-07-31',
        ])->assertCreated()->json();

        $this->postJson("/api/sessions/{$second['id']}/set-current")->assertOk();

        $this->assertFalse(AcademicSession::withoutGlobalScope('school')->find($first['id'])->is_current);
        $this->assertTrue(AcademicSession::withoutGlobalScope('school')->find($second['id'])->is_current);
        $this->assertSame(1, AcademicSession::where('is_current', true)->count());
    }

    public function test_set_current_cannot_reach_across_tenants(): void
    {
        $alpha = $this->admin('alpha');
        Sanctum::actingAs($alpha);
        $alphaSession = $this->postJson('/api/sessions', [
            'name' => '2025/2026',
            'start_date' => '2025-09-01',
            'end_date' => '2026-07-31',
        ])->assertCreated()->json();

        $bright = $this->admin('bright');
        Sanctum::actingAs($bright);
        $this->postJson("/api/sessions/{$alphaSession['id']}/set-current")->assertNotFound();
    }
}
