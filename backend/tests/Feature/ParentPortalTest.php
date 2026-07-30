<?php

namespace Tests\Feature;

use App\Models\ParentChild;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ParentPortalTest extends TestCase
{
    use RefreshDatabase;

    private function school(string $name): School
    {
        return School::create(['name' => $name]);
    }

    private static int $seq = 0;

    private function user(School $school, string $role): User
    {
        static::$seq++;

        return User::create([
            'name' => ucfirst($role) . ' ' . $school->name,
            'email' => $role . static::$seq . '.' . strtolower($school->name) . '@test.test',
            'password' => bcrypt('password'),
            'role' => $role,
            'status' => 'active',
            'school_id' => $school->id,
        ]);
    }

    /**
     * Seed a published + a pending result for a student, inside the tenant, via
     * the API. Returns the published result's id.
     */
    private function seedResults(School $school, User $admin, User $teacher, User $student): int
    {
        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'First Test'])
            ->assertCreated()->json();
        $maths = $this->postJson('/api/subjects', ['name' => 'Maths', 'code' => 'MTH'])
            ->assertCreated()->json();
        $english = $this->postJson('/api/subjects', ['name' => 'English', 'code' => 'ENG'])
            ->assertCreated()->json();

        Sanctum::actingAs($teacher);
        $published = $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $maths['id'],
            'assessment_config_id' => $config['id'],
            'score' => 80,
        ])->assertCreated()->json();
        // Pending result — must stay hidden from the parent.
        $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $english['id'],
            'assessment_config_id' => $config['id'],
            'score' => 55,
        ])->assertCreated();

        Sanctum::actingAs($admin);
        $this->postJson("/api/results/{$published['id']}/publish")->assertOk();

        return $published['id'];
    }

    public function test_admin_links_parent_to_child_and_parent_lists_children(): void
    {
        $school = $this->school('Alpha');
        $admin = $this->user($school, 'school_admin');
        $parent = $this->user($school, 'parent');
        $child = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $this->postJson('/api/parent-links', [
            'parent_id' => $parent->id,
            'child_id' => $child->id,
        ])->assertCreated();

        Sanctum::actingAs($parent);
        $this->getJson('/api/children')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $child->id]);
    }

    public function test_non_admin_cannot_link_parent_to_child(): void
    {
        $school = $this->school('Alpha');
        $teacher = $this->user($school, 'teacher');
        $parent = $this->user($school, 'parent');
        $child = $this->user($school, 'student');

        Sanctum::actingAs($teacher);
        $this->postJson('/api/parent-links', [
            'parent_id' => $parent->id,
            'child_id' => $child->id,
        ])->assertForbidden(); // 403 via role:school_admin middleware
    }

    public function test_parent_sees_only_their_linked_childs_published_results(): void
    {
        $school = $this->school('Alpha');
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $parent = $this->user($school, 'parent');
        $child = $this->user($school, 'student');
        $otherChild = $this->user($school, 'student');

        $publishedId = $this->seedResults($school, $admin, $teacher, $child);
        // The other (unlinked) child also has a published result.
        $this->seedOtherPublished($admin, $teacher, $otherChild);

        Sanctum::actingAs($admin);
        $this->postJson('/api/parent-links', [
            'parent_id' => $parent->id,
            'child_id' => $child->id,
        ])->assertCreated();

        Sanctum::actingAs($parent);
        // Own child: exactly the one published result, no pending.
        $this->getJson('/api/child-results?child_id=' . $child->id)
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $publishedId, 'status' => 'published'])
            ->assertJsonMissing(['status' => 'pending']);

        // Another child the parent is NOT linked to: forbidden.
        $this->getJson('/api/child-results?child_id=' . $otherChild->id)
            ->assertForbidden();
    }

    private function seedOtherPublished(User $admin, User $teacher, User $student): void
    {
        Sanctum::actingAs($admin);
        $config = $this->postJson('/api/assessment-configs', ['name' => 'Other Test'])
            ->assertCreated()->json();
        $subject = $this->postJson('/api/subjects', ['name' => 'Science', 'code' => 'SCI'])
            ->assertCreated()->json();

        Sanctum::actingAs($teacher);
        $r = $this->postJson('/api/results', [
            'student_id' => $student->id,
            'subject_id' => $subject['id'],
            'assessment_config_id' => $config['id'],
            'score' => 90,
        ])->assertCreated()->json();

        Sanctum::actingAs($admin);
        $this->postJson("/api/results/{$r['id']}/publish")->assertOk();
    }

    public function test_parent_linked_to_no_child_is_forbidden(): void
    {
        $school = $this->school('Alpha');
        $admin = $this->user($school, 'school_admin');
        $teacher = $this->user($school, 'teacher');
        $parent = $this->user($school, 'parent');
        $child = $this->user($school, 'student');

        $this->seedResults($school, $admin, $teacher, $child);

        // Parent has no links at all.
        Sanctum::actingAs($parent);
        $this->getJson('/api/children')->assertOk()->assertJsonCount(0);
        $this->getJson('/api/child-results?child_id=' . $child->id)->assertForbidden();
    }

    public function test_parent_child_link_is_isolated_per_school(): void
    {
        $alpha = $this->school('Alpha');
        $bright = $this->school('Bright');

        $alphaAdmin = $this->user($alpha, 'school_admin');
        $alphaParent = $this->user($alpha, 'parent');
        $alphaChild = $this->user($alpha, 'student');

        Sanctum::actingAs($alphaAdmin);
        $this->postJson('/api/parent-links', [
            'parent_id' => $alphaParent->id,
            'child_id' => $alphaChild->id,
        ])->assertCreated();

        // Bright's admin cannot see Alpha's links. Set the tenant the way the
        // ResolveTenant middleware would on a real request (these are direct
        // model calls, not HTTP requests, so the middleware doesn't run).
        $brightAdmin = $this->user($bright, 'school_admin');
        \App\Support\Tenant::set($bright->id);
        $this->assertSame(0, ParentChild::count());
        $this->assertSame(1, ParentChild::withoutGlobalScope('school')->count());
    }

    public function test_parent_manages_emergency_contacts_for_linked_child_only(): void
    {
        $school = $this->school('Alpha');
        $admin = $this->user($school, 'school_admin');
        $parent = $this->user($school, 'parent');
        $child = $this->user($school, 'student');
        $otherChild = $this->user($school, 'student');

        Sanctum::actingAs($admin);
        $this->postJson('/api/parent-links', [
            'parent_id' => $parent->id,
            'child_id' => $child->id,
        ])->assertCreated();

        Sanctum::actingAs($parent);
        // Store for own child.
        $this->postJson('/api/emergency-contacts?student_id=' . $child->id, [
            'name' => 'Aunt Ada',
            'phone' => '08000000000',
            'relationship' => 'aunt',
            'is_primary' => true,
        ])->assertCreated();

        $this->getJson('/api/emergency-contacts?student_id=' . $child->id)
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Aunt Ada']);

        // Cannot manage a child they are not linked to.
        $this->getJson('/api/emergency-contacts?student_id=' . $otherChild->id)
            ->assertForbidden();
        $this->postJson('/api/emergency-contacts?student_id=' . $otherChild->id, [
            'name' => 'Intruder',
            'phone' => '08111111111',
            'relationship' => 'none',
        ])->assertForbidden();
    }
}
