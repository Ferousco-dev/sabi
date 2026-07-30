<?php

namespace Tests\Feature;

use App\Models\Enrollment;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EnrollmentTenancyTest extends TestCase
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

    public function test_enrollments_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        // Alpha creates a class + student and enrols them through the API.
        Sanctum::actingAs($alpha);
        $alphaClass = SchoolClass::create(['name' => 'JSS1', 'school_id' => $alpha->school_id]);
        $alphaStudent = $this->student($alpha, 'Ada Alpha');
        $this->postJson('/api/enrollments', [
            'student_id' => $alphaStudent->id,
            'school_class_id' => $alphaClass->id,
        ])->assertCreated();

        // Bright does the same in their own school.
        Sanctum::actingAs($bright);
        $brightClass = SchoolClass::create(['name' => 'JSS1', 'school_id' => $bright->school_id]);
        $brightStudent = $this->student($bright, 'Ben Bright');
        $this->postJson('/api/enrollments', [
            'student_id' => $brightStudent->id,
            'school_class_id' => $brightClass->id,
        ])->assertCreated();

        // Bright sees only their own enrollment.
        $this->getJson('/api/enrollments')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['student_id' => $brightStudent->id])
            ->assertJsonMissing(['student_id' => $alphaStudent->id]);

        $this->assertSame(2, Enrollment::withoutGlobalScope('school')->count());
    }

    public function test_cannot_enrol_a_student_from_another_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        $brightStudent = $this->student($bright, 'Ben Bright');

        Sanctum::actingAs($alpha);
        $alphaClass = SchoolClass::create(['name' => 'JSS1', 'school_id' => $alpha->school_id]);

        // Alpha tries to enrol Bright's student — rejected by the tenant-scoped exists rule.
        $this->postJson('/api/enrollments', [
            'student_id' => $brightStudent->id,
            'school_class_id' => $alphaClass->id,
        ])->assertStatus(422);
    }

    public function test_duplicate_enrollment_is_prevented(): void
    {
        $alpha = $this->admin('alpha');

        Sanctum::actingAs($alpha);
        $class = SchoolClass::create(['name' => 'JSS1', 'school_id' => $alpha->school_id]);
        $student = $this->student($alpha, 'Ada Alpha');

        $this->postJson('/api/enrollments', [
            'student_id' => $student->id,
            'school_class_id' => $class->id,
        ])->assertCreated();

        // Same student, same class again → 409.
        $this->postJson('/api/enrollments', [
            'student_id' => $student->id,
            'school_class_id' => $class->id,
        ])->assertStatus(409);

        $this->assertSame(1, Enrollment::count());
    }
}
