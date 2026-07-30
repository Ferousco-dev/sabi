<?php

namespace Tests\Feature;

use App\Models\LoginHistory;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityTest extends TestCase
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

    public function test_successful_login_writes_a_login_history_row(): void
    {
        $admin = $this->admin('alpha');

        $this->postJson('/api/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertOk();

        $this->assertSame(1, LoginHistory::withoutGlobalScope('school')->count());

        $row = LoginHistory::withoutGlobalScope('school')->first();
        $this->assertSame($admin->id, $row->user_id);
        $this->assertSame($admin->school_id, $row->school_id);
        $this->assertNotNull($row->logged_in_at);
    }

    public function test_admin_sees_only_their_tenant_login_history(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        // Each admin logs in, creating a row in their own school.
        $this->postJson('/api/login', ['email' => $alpha->email, 'password' => 'password'])->assertOk();
        $this->postJson('/api/login', ['email' => $bright->email, 'password' => 'password'])->assertOk();

        // Bright's admin sees only Bright's login history.
        Sanctum::actingAs($bright);
        $response = $this->getJson('/api/security/login-history')->assertOk();

        $this->assertSame(1, $response->json('total'));
        $this->assertSame($bright->id, $response->json('data.0.user_id'));
    }

    public function test_revoking_a_session_deletes_the_token(): void
    {
        $alpha = $this->admin('alpha');

        // A live token for a user in this school.
        $token = $alpha->createToken('api')->accessToken;

        Sanctum::actingAs($alpha);
        $this->postJson("/api/security/sessions/{$token->id}/revoke")->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->id]);
    }

    public function test_revoking_a_token_in_another_school_returns_404(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        $brightToken = $bright->createToken('api')->accessToken;

        Sanctum::actingAs($alpha);
        $this->postJson("/api/security/sessions/{$brightToken->id}/revoke")->assertNotFound();

        // Bright's token is untouched.
        $this->assertDatabaseHas('personal_access_tokens', ['id' => $brightToken->id]);
    }

    public function test_non_admin_is_forbidden_from_security_endpoints(): void
    {
        $s = School::create(['name' => 'gamma']);
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@test.test',
            'password' => bcrypt('password'),
            'role' => 'teacher',
            'status' => 'active',
            'school_id' => $s->id,
        ]);

        Sanctum::actingAs($teacher);

        $this->getJson('/api/security/login-history')->assertForbidden();
        $this->getJson('/api/security/audit-logs')->assertForbidden();
        $this->getJson('/api/security/sessions')->assertForbidden();
        $this->postJson('/api/security/sessions/1/revoke')->assertForbidden();
    }
}
