<?php

namespace Tests\Feature;

use App\Models\AcademicSession;
use App\Models\School;
use App\Models\Term;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TermTenancyTest extends TestCase
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

    private function makeSession(User $admin, string $name): array
    {
        Sanctum::actingAs($admin);

        return $this->postJson('/api/sessions', [
            'name' => $name,
            'start_date' => '2025-09-01',
            'end_date' => '2026-07-31',
        ])->assertCreated()->json();
    }

    public function test_terms_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        $alphaSession = $this->makeSession($alpha, '2025/2026');
        Sanctum::actingAs($alpha);
        $this->postJson('/api/terms', [
            'academic_session_id' => $alphaSession['id'],
            'name' => 'First Term',
            'start_date' => '2025-09-01',
            'end_date' => '2025-12-15',
        ])->assertCreated();

        $brightSession = $this->makeSession($bright, '2025/2026');
        Sanctum::actingAs($bright);
        $this->postJson('/api/terms', [
            'academic_session_id' => $brightSession['id'],
            'name' => 'First Term',
            'start_date' => '2025-09-01',
            'end_date' => '2025-12-15',
        ])->assertCreated();

        $this->getJson('/api/terms')
            ->assertOk()
            ->assertJsonCount(1);

        $this->assertSame(2, Term::withoutGlobalScope('school')->count());
    }

    public function test_index_filters_by_session_id(): void
    {
        $alpha = $this->admin('alpha');
        $s1 = $this->makeSession($alpha, '2024/2025');
        $s2 = $this->makeSession($alpha, '2025/2026');

        Sanctum::actingAs($alpha);
        $this->postJson('/api/terms', [
            'academic_session_id' => $s1['id'],
            'name' => 'First Term',
            'start_date' => '2024-09-01',
            'end_date' => '2024-12-15',
        ])->assertCreated();
        $this->postJson('/api/terms', [
            'academic_session_id' => $s2['id'],
            'name' => 'First Term',
            'start_date' => '2025-09-01',
            'end_date' => '2025-12-15',
        ])->assertCreated();

        $this->getJson("/api/terms?session_id={$s2['id']}")
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['academic_session_id' => $s2['id']]);
    }

    public function test_set_current_unsets_previous_current_within_tenant(): void
    {
        $alpha = $this->admin('alpha');
        $session = $this->makeSession($alpha, '2025/2026');

        Sanctum::actingAs($alpha);
        $first = $this->postJson('/api/terms', [
            'academic_session_id' => $session['id'],
            'name' => 'First Term',
            'start_date' => '2025-09-01',
            'end_date' => '2025-12-15',
            'is_current' => true,
        ])->assertCreated()->json();

        $second = $this->postJson('/api/terms', [
            'academic_session_id' => $session['id'],
            'name' => 'Second Term',
            'start_date' => '2026-01-05',
            'end_date' => '2026-04-10',
        ])->assertCreated()->json();

        $this->postJson("/api/terms/{$second['id']}/set-current")->assertOk();

        $this->assertFalse(Term::withoutGlobalScope('school')->find($first['id'])->is_current);
        $this->assertTrue(Term::withoutGlobalScope('school')->find($second['id'])->is_current);
        $this->assertSame(1, Term::where('is_current', true)->count());
    }
}
