<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Courses are NOT tenant-scoped — they belong to a creator on a cross-school
 * marketplace. These tests exercise ownership scoping (creator_id), the owner-only
 * policy, the published-only marketplace, and the role:creator write gate.
 */
class CourseTest extends TestCase
{
    use RefreshDatabase;

    private function creator(string $email = 'creator@sabihub.test'): User
    {
        // A school is required by the users table FK, but it is irrelevant to
        // course ownership — courses are not school-scoped.
        $school = School::firstOrCreate(['name' => 'Alpha']);

        return User::create([
            'name' => 'Creator', 'email' => $email,
            'password' => bcrypt('password'), 'role' => 'creator',
            'status' => 'active', 'school_id' => $school->id,
        ]);
    }

    private function student(): User
    {
        $school = School::firstOrCreate(['name' => 'Alpha']);

        return User::create([
            'name' => 'Student', 'email' => 'student@sabihub.test',
            'password' => bcrypt('password'), 'role' => 'student',
            'status' => 'active', 'school_id' => $school->id,
        ]);
    }

    public function test_index_returns_only_the_current_creators_courses(): void
    {
        $me = $this->creator('me@sabihub.test');
        $other = $this->creator('other@sabihub.test');

        Course::create(['creator_id' => $me->id, 'title' => 'Mine']);
        Course::create(['creator_id' => $other->id, 'title' => 'Theirs']);

        Sanctum::actingAs($me);

        $response = $this->getJson('/api/courses');
        $response->assertOk()->assertJsonCount(1);
        $this->assertSame('Mine', $response->json('0.title'));
    }

    public function test_a_creator_cannot_update_another_creators_course(): void
    {
        $me = $this->creator('me@sabihub.test');
        $other = $this->creator('other@sabihub.test');

        $course = Course::create(['creator_id' => $other->id, 'title' => 'Theirs']);

        Sanctum::actingAs($me);

        $this->putJson("/api/courses/{$course->id}", ['title' => 'Hijacked'])
            ->assertForbidden(); // 403 via CoursePolicy@update
    }

    public function test_marketplace_shows_only_published_courses(): void
    {
        $creator = $this->creator();

        Course::create(['creator_id' => $creator->id, 'title' => 'Published', 'is_published' => true]);
        Course::create(['creator_id' => $creator->id, 'title' => 'Draft', 'is_published' => false]);

        Sanctum::actingAs($this->student());

        $response = $this->getJson('/api/marketplace/courses');
        $response->assertOk()->assertJsonCount(1, 'data');
        $this->assertSame('Published', $response->json('data.0.title'));
    }

    public function test_role_middleware_blocks_a_student_from_creating_a_course(): void
    {
        Sanctum::actingAs($this->student());

        $this->postJson('/api/courses', ['title' => 'Sneaky'])
            ->assertForbidden(); // 403 via role:creator middleware
    }

    public function test_a_creator_can_create_a_course(): void
    {
        Sanctum::actingAs($this->creator());

        $this->postJson('/api/courses', ['title' => 'My Course', 'price' => 25])
            ->assertCreated();
    }
}
