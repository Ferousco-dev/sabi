<?php

namespace Tests\Feature;

use App\Models\Enrollment;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransferTest extends TestCase
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

    private function student(User $admin, string $name): User
    {
        return User::create([
            'name' => $name,
            'email' => strtolower(str_replace(' ', '', $name)) . '@test.test',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'active',
            'school_id' => $admin->school_id,
        ]);
    }

    public function test_promote_moves_a_student_to_the_new_class(): void
    {
        $alpha = $this->admin('alpha');

        Sanctum::actingAs($alpha);
        $jss1 = SchoolClass::create(['name' => 'JSS1', 'school_id' => $alpha->school_id]);
        $jss2 = SchoolClass::create(['name' => 'JSS2', 'school_id' => $alpha->school_id]);
        $student = $this->student($alpha, 'Ada Alpha');

        $this->postJson('/api/enrollments', [
            'student_id' => $student->id,
            'school_class_id' => $jss1->id,
        ])->assertCreated();

        $this->postJson('/api/transfers', [
            'student_id' => $student->id,
            'new_class_id' => $jss2->id,
            'action' => 'promote',
        ])->assertOk()
            ->assertJsonFragment(['school_class_id' => $jss2->id]);

        // The single enrollment now points at the new class (no new row).
        $this->assertSame(1, Enrollment::count());
        $this->assertSame($jss2->id, Enrollment::first()->school_class_id);
    }

    public function test_repeat_keeps_the_student_in_their_current_class(): void
    {
        $alpha = $this->admin('alpha');

        Sanctum::actingAs($alpha);
        $jss1 = SchoolClass::create(['name' => 'JSS1', 'school_id' => $alpha->school_id]);
        $jss2 = SchoolClass::create(['name' => 'JSS2', 'school_id' => $alpha->school_id]);
        $student = $this->student($alpha, 'Ada Alpha');

        $this->postJson('/api/enrollments', [
            'student_id' => $student->id,
            'school_class_id' => $jss1->id,
        ])->assertCreated();

        $this->postJson('/api/transfers', [
            'student_id' => $student->id,
            'new_class_id' => $jss2->id,
            'action' => 'repeat',
        ])->assertOk()
            ->assertJsonFragment(['school_class_id' => $jss1->id]);

        $this->assertSame($jss1->id, Enrollment::first()->school_class_id);
    }

    public function test_transfer_is_tenant_scoped(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        // Bright has a student enrolled in a Bright class.
        Sanctum::actingAs($bright);
        $brightClass = SchoolClass::create(['name' => 'JSS1', 'school_id' => $bright->school_id]);
        $brightStudent = $this->student($bright, 'Ben Bright');
        $this->postJson('/api/enrollments', [
            'student_id' => $brightStudent->id,
            'school_class_id' => $brightClass->id,
        ])->assertCreated();

        // Alpha cannot transfer Bright's student — rejected by the tenant-scoped exists rule.
        Sanctum::actingAs($alpha);
        $alphaClass = SchoolClass::create(['name' => 'JSS2', 'school_id' => $alpha->school_id]);
        $this->postJson('/api/transfers', [
            'student_id' => $brightStudent->id,
            'new_class_id' => $alphaClass->id,
            'action' => 'promote',
        ])->assertStatus(422);
    }
}
