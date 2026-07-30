<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\SchoolClass;
use App\Models\TimetableEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TimetableDeleteTest extends TestCase
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

    private function entry(User $admin): array
    {
        Sanctum::actingAs($admin);
        $class = SchoolClass::create(['name' => 'JSS1', 'school_id' => $admin->school_id]);

        return $this->postJson('/api/timetable', [
            'school_class_id' => $class->id,
            'day' => 'Monday',
            'start_time' => '08:00',
            'end_time' => '09:00',
        ])->assertCreated()->json();
    }

    public function test_admin_can_delete_a_timetable_entry(): void
    {
        $alpha = $this->admin('alpha');
        $entry = $this->entry($alpha);

        $this->deleteJson("/api/timetable/{$entry['id']}")->assertNoContent();

        $this->assertSame(0, TimetableEntry::withoutGlobalScope('school')->count());
    }

    public function test_delete_only_removes_own_tenant_rows(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        $brightEntry = $this->entry($bright);

        // Alpha cannot delete Bright's entry — global scope makes it 404.
        Sanctum::actingAs($alpha);
        $this->deleteJson("/api/timetable/{$brightEntry['id']}")->assertNotFound();

        // Bright's row is untouched.
        $this->assertSame(1, TimetableEntry::withoutGlobalScope('school')->count());
    }
}
