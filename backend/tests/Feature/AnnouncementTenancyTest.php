<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnnouncementTenancyTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $school, string $role): User
    {
        $s = School::firstOrCreate(['name' => $school]);

        return User::create([
            'name' => "$role $school",
            'email' => strtolower("$role.$school") . '@test.test',
            'password' => bcrypt('password'),
            'role' => $role,
            'status' => 'active',
            'school_id' => $s->id,
        ]);
    }

    public function test_admin_can_post_and_targeting_filters_by_role(): void
    {
        $admin = $this->user('alpha', 'school_admin');

        Sanctum::actingAs($admin);
        $this->postJson('/api/announcements', [
            'title' => 'Staff meeting',
            'body' => 'Teachers only',
            'target_role' => 'teacher',
        ])->assertCreated();
        $this->postJson('/api/announcements', [
            'title' => 'School closed',
            'body' => 'Everyone',
            'target_role' => 'all',
        ])->assertCreated();

        // A student sees the 'all' announcement but NOT the teacher-targeted one.
        $student = $this->user('alpha', 'student');
        Sanctum::actingAs($student);
        $this->getJson('/api/announcements')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'School closed'])
            ->assertJsonMissing(['title' => 'Staff meeting']);

        // A teacher sees both.
        $teacher = $this->user('alpha', 'teacher');
        Sanctum::actingAs($teacher);
        $this->getJson('/api/announcements')
            ->assertOk()
            ->assertJsonCount(2);
    }

    public function test_non_admin_cannot_post_announcement(): void
    {
        $teacher = $this->user('alpha', 'teacher');
        Sanctum::actingAs($teacher);

        $this->postJson('/api/announcements', [
            'title' => 'Nope',
            'body' => 'Not allowed',
            'target_role' => 'all',
        ])->assertForbidden();
    }

    public function test_announcements_are_isolated_per_school(): void
    {
        $alphaAdmin = $this->user('alpha', 'school_admin');
        Sanctum::actingAs($alphaAdmin);
        $this->postJson('/api/announcements', [
            'title' => 'Alpha news',
            'body' => 'Alpha only',
            'target_role' => 'all',
        ])->assertCreated();

        $brightAdmin = $this->user('bright', 'school_admin');
        Sanctum::actingAs($brightAdmin);
        $this->getJson('/api/announcements')
            ->assertOk()
            ->assertJsonMissing(['title' => 'Alpha news']);

        $this->assertSame(1, Announcement::withoutGlobalScope('school')->count());
    }
}
