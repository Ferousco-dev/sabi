<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\School;
use App\Models\User;
use App\Support\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationTenancyTest extends TestCase
{
    use RefreshDatabase;

    private static int $seq = 0;

    private function user(string $school, string $role): User
    {
        $s = School::firstOrCreate(['name' => $school]);
        static::$seq++;

        return User::create([
            'name' => "$role $school",
            'email' => strtolower("$role.$school") . (static::$seq) . '@test.test',
            'password' => bcrypt('password'),
            'role' => $role,
            'status' => 'active',
            'school_id' => $s->id,
        ]);
    }

    private function notify(User $user, string $title): Notification
    {
        Tenant::set($user->school_id);

        return Notification::create([
            'user_id' => $user->id,
            'title' => $title,
        ]);
    }

    public function test_user_sees_only_their_own_notifications(): void
    {
        $alice = $this->user('alpha', 'teacher');
        $bob = $this->user('alpha', 'teacher');

        $this->notify($alice, 'For Alice');
        $this->notify($bob, 'For Bob');

        Sanctum::actingAs($alice);
        $this->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'For Alice'])
            ->assertJsonMissing(['title' => 'For Bob']);
    }

    public function test_owner_can_mark_read_but_others_get_404(): void
    {
        $alice = $this->user('alpha', 'teacher');
        $bob = $this->user('alpha', 'teacher');
        $n = $this->notify($alice, 'For Alice');

        // Bob cannot mark Alice's notification read.
        Sanctum::actingAs($bob);
        $this->postJson("/api/notifications/{$n->id}/read")->assertNotFound();

        // Alice can.
        Sanctum::actingAs($alice);
        $this->postJson("/api/notifications/{$n->id}/read")->assertOk();
        $this->assertNotNull($n->fresh()->read_at);
    }

    public function test_notifications_are_isolated_per_school(): void
    {
        $alpha = $this->user('alpha', 'teacher');
        $bright = $this->user('bright', 'teacher');
        $this->notify($alpha, 'Alpha note');
        $this->notify($bright, 'Bright note');

        Sanctum::actingAs($bright);
        $this->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonMissing(['title' => 'Alpha note']);

        $this->assertSame(2, Notification::withoutGlobalScope('school')->count());
    }
}
