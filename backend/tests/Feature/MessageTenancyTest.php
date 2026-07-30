<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\School;
use App\Models\User;
use App\Support\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MessageTenancyTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $school, string $role): User
    {
        $s = School::firstOrCreate(['name' => $school]);

        return User::create([
            'name' => "$role $school " . uniqid(),
            'email' => strtolower("$role.$school.") . uniqid() . '@test.test',
            'password' => bcrypt('password'),
            'role' => $role,
            'status' => 'active',
            'school_id' => $s->id,
        ]);
    }

    public function test_user_sees_only_messages_they_are_party_to(): void
    {
        $alice = $this->user('alpha', 'teacher');
        $bob = $this->user('alpha', 'teacher');

        // Alice sends to Bob.
        Sanctum::actingAs($alice);
        $this->postJson('/api/messages', [
            'recipient_id' => $bob->id,
            'subject' => 'Hi Bob',
            'body' => 'Hello',
        ])->assertCreated();

        // A third party in the same school sees nothing.
        $carol = $this->user('alpha', 'teacher');
        Sanctum::actingAs($carol);
        $this->getJson('/api/messages')
            ->assertOk()
            ->assertJsonCount(0);

        // Both parties see it.
        Sanctum::actingAs($bob);
        $this->getJson('/api/messages')->assertOk()->assertJsonCount(1)
            ->assertJsonFragment(['subject' => 'Hi Bob']);
        Sanctum::actingAs($alice);
        $this->getJson('/api/messages')->assertOk()->assertJsonCount(1);
    }

    public function test_cannot_message_a_user_in_another_school(): void
    {
        $alice = $this->user('alpha', 'teacher');
        $outsider = $this->user('bright', 'teacher');

        Sanctum::actingAs($alice);
        $this->postJson('/api/messages', [
            'recipient_id' => $outsider->id,
            'body' => 'Cross-tenant',
        ])->assertStatus(422);
    }

    public function test_messages_are_isolated_per_school(): void
    {
        $alice = $this->user('alpha', 'teacher');
        $bob = $this->user('alpha', 'teacher');
        Sanctum::actingAs($alice);
        $this->postJson('/api/messages', [
            'recipient_id' => $bob->id,
            'body' => 'Alpha message',
        ])->assertCreated();

        // A user in another school sees no messages.
        $bright = $this->user('bright', 'teacher');
        Sanctum::actingAs($bright);
        $this->getJson('/api/messages')->assertOk()->assertJsonCount(0);

        $this->assertSame(1, Message::withoutGlobalScope('school')->count());
    }
}
