<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\TimetableEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeacherDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_derives_subjects_and_classes_from_the_timetable(): void
    {
        $s = School::create(['name' => 'Alpha']);
        $admin = User::create(['name' => 'Admin', 'email' => 'a-admin@test.test', 'password' => bcrypt('password'), 'role' => 'school_admin', 'status' => 'active', 'school_id' => $s->id]);
        $teacher = User::create(['name' => 'Ada Teacher', 'email' => 'a-teacher@test.test', 'password' => bcrypt('password'), 'role' => 'teacher', 'status' => 'active', 'school_id' => $s->id]);
        $class = SchoolClass::create(['school_id' => $s->id, 'name' => 'JSS 1']);
        $math = Subject::create(['school_id' => $s->id, 'name' => 'Maths', 'code' => 'MTH']);

        // Two slots, same subject/class → should dedupe to one subject, one class.
        foreach (['Monday', 'Tuesday'] as $day) {
            TimetableEntry::create(['school_id' => $s->id, 'school_class_id' => $class->id, 'subject_id' => $math->id, 'teacher_id' => $teacher->id, 'day' => $day, 'start_time' => '09:00', 'end_time' => '10:00']);
        }

        Sanctum::actingAs($admin);
        $this->getJson("/api/teachers/{$teacher->id}")
            ->assertOk()
            ->assertJsonFragment(['name' => 'Ada Teacher', 'subject_count' => 1, 'class_count' => 1])
            ->assertJsonFragment(['id' => $math->id, 'name' => 'Maths'])
            ->assertJsonFragment(['id' => $class->id, 'name' => 'JSS 1']);
    }

    public function test_show_is_tenant_isolated(): void
    {
        $a = School::create(['name' => 'Alpha']);
        $b = School::create(['name' => 'Bright']);
        $adminB = User::create(['name' => 'AdminB', 'email' => 'b-admin@test.test', 'password' => bcrypt('password'), 'role' => 'school_admin', 'status' => 'active', 'school_id' => $b->id]);
        $teacherA = User::create(['name' => 'A Teacher', 'email' => 'a-t@test.test', 'password' => bcrypt('password'), 'role' => 'teacher', 'status' => 'active', 'school_id' => $a->id]);

        // Bright's admin cannot fetch Alpha's teacher.
        Sanctum::actingAs($adminB);
        $this->getJson("/api/teachers/{$teacherA->id}")->assertNotFound();
    }
}
