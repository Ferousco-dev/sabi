<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InvitationTest extends TestCase
{
    use RefreshDatabase;

    private function adminOf(School $s): User
    {
        return User::create([
            'name' => 'Admin', 'email' => 'admin@' . $s->id . '.test',
            'password' => bcrypt('password'), 'role' => 'school_admin',
            'status' => 'active', 'school_id' => $s->id,
        ]);
    }

    public function test_full_invite_then_accept_flow_sets_own_password(): void
    {
        $school = School::create(['name' => 'Alpha']);
        Sanctum::actingAs($this->adminOf($school));

        // 1. Admin invites a teacher.
        $invite = $this->postJson('/api/invitations', [
            'email' => 'teacher@alpha.test', 'role' => 'teacher',
        ])->assertCreated()->json();

        $token = $invite['token'];

        // 2. The teacher accepts, choosing their OWN password (no sabihub123).
        $accept = $this->postJson('/api/invitations/accept', [
            'token' => $token,
            'name' => 'Miss Ada',
            'password' => 'my-own-secret-1',
            'password_confirmation' => 'my-own-secret-1',
        ])->assertCreated()->json();

        // 3. The account is real, in the right school, with the right role.
        $this->assertDatabaseHas('users', [
            'email' => 'teacher@alpha.test',
            'role' => 'teacher',
            'school_id' => $school->id,
            'status' => 'active',
        ]);
        $this->assertArrayHasKey('token', $accept);

        // 4. They can log in with the password THEY chose.
        $this->postJson('/api/login', [
            'email' => 'teacher@alpha.test', 'password' => 'my-own-secret-1',
        ])->assertOk()->assertJsonStructure(['token', 'user']);

        // 5. The invite is single-use.
        $this->postJson('/api/invitations/accept', [
            'token' => $token, 'name' => 'X',
            'password' => 'another-pass-1', 'password_confirmation' => 'another-pass-1',
        ])->assertStatus(410);
    }

    public function test_cannot_invite_an_existing_email(): void
    {
        $school = School::create(['name' => 'Alpha']);
        Sanctum::actingAs($this->adminOf($school));

        User::create([
            'name' => 'Existing', 'email' => 'dupe@alpha.test', 'password' => bcrypt('x'),
            'role' => 'teacher', 'status' => 'active', 'school_id' => $school->id,
        ]);

        $this->postJson('/api/invitations', ['email' => 'dupe@alpha.test', 'role' => 'teacher'])
            ->assertStatus(409);
    }
}
