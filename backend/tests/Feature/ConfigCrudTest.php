<?php

namespace Tests\Feature;

use App\Models\Campus;
use App\Models\Holiday;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConfigCrudTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Build a school with an admin. Returns [$school, $admin].
     */
    private function makeSchool(string $name): array
    {
        $s = School::create(['name' => $name]);
        $slug = strtolower(str_replace(' ', '', $name));

        $admin = User::create([
            'name' => "Admin $name",
            'email' => "$slug-admin@test.test",
            'password' => bcrypt('password'),
            'role' => 'school_admin',
            'status' => 'active',
            'school_id' => $s->id,
        ]);

        return [$s, $admin];
    }

    public function test_admin_can_update_and_delete_a_class(): void
    {
        [$school, $admin] = $this->makeSchool('Alpha');
        Sanctum::actingAs($admin);

        $class = SchoolClass::create(['school_id' => $school->id, 'name' => 'JSS1']);

        $this->putJson("/api/classes/{$class->id}", ['name' => 'JSS1 Renamed'])
            ->assertOk()
            ->assertJsonFragment(['name' => 'JSS1 Renamed']);

        $this->deleteJson("/api/classes/{$class->id}")->assertNoContent();

        $this->assertSame(0, SchoolClass::withoutGlobalScope('school')->count());
    }

    public function test_admin_can_update_and_delete_a_subject(): void
    {
        [$school, $admin] = $this->makeSchool('Alpha');
        Sanctum::actingAs($admin);

        $subject = Subject::create(['school_id' => $school->id, 'name' => 'Maths', 'code' => 'MTH']);

        // Updating the same row while keeping its own code must pass (ignore-self).
        $this->putJson("/api/subjects/{$subject->id}", ['name' => 'Mathematics', 'code' => 'MTH'])
            ->assertOk()
            ->assertJsonFragment(['name' => 'Mathematics']);

        // A second subject cannot take the first's code.
        $other = Subject::create(['school_id' => $school->id, 'name' => 'English', 'code' => 'ENG']);
        $this->putJson("/api/subjects/{$other->id}", ['name' => 'English', 'code' => 'MTH'])
            ->assertStatus(422);

        $this->deleteJson("/api/subjects/{$subject->id}")->assertNoContent();
    }

    public function test_admin_can_update_and_delete_a_holiday(): void
    {
        [$school, $admin] = $this->makeSchool('Alpha');
        Sanctum::actingAs($admin);

        $holiday = Holiday::create([
            'school_id' => $school->id,
            'title' => 'Founders Day',
            'date' => '2026-09-01',
        ]);

        $this->putJson("/api/holidays/{$holiday->id}", [
            'title' => 'Founders Day Renamed',
            'date' => '2026-09-02',
        ])->assertOk()->assertJsonFragment(['title' => 'Founders Day Renamed']);

        $this->deleteJson("/api/holidays/{$holiday->id}")->assertNoContent();

        $this->assertSame(0, Holiday::withoutGlobalScope('school')->count());
    }

    public function test_setting_a_campus_as_main_unsets_others(): void
    {
        [$school, $admin] = $this->makeSchool('Alpha');
        Sanctum::actingAs($admin);

        $first = Campus::create(['school_id' => $school->id, 'name' => 'Main Campus', 'is_main' => true]);
        $second = Campus::create(['school_id' => $school->id, 'name' => 'Annex', 'is_main' => false]);

        // Promote the annex to main.
        $this->putJson("/api/campuses/{$second->id}", ['name' => 'Annex', 'is_main' => true])
            ->assertOk()
            ->assertJsonFragment(['is_main' => true]);

        // Only one main campus survives.
        $this->assertTrue($second->fresh()->is_main);
        $this->assertFalse($first->fresh()->is_main);
        $this->assertSame(1, Campus::withoutGlobalScope('school')->where('is_main', true)->count());

        $this->deleteJson("/api/campuses/{$first->id}")->assertNoContent();
    }
}
