<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClassTenancyTest extends TestCase
{
    use RefreshDatabase; // fresh DB per test

    private function makeSchoolWithClass(string $school, string $class): array
    {
        $s = School::create(['name' => $school]);
        $u = User::create([
            'name' => "Admin $school",
            'email' => strtolower(str_replace(' ', '', $school)) . '@test.test',
            'password' => bcrypt('password'),
            'role' => 'school_admin',
            'status' => 'active',
            'school_id' => $s->id,
        ]);
        SchoolClass::create(['school_id' => $s->id, 'name' => $class]);

        return [$s, $u];
    }

    public function test_a_user_only_sees_their_own_schools_classes(): void
    {
        [$alpha, $adminAlpha] = $this->makeSchoolWithClass('Alpha', 'JSS 1');
        [$bright, $adminBright] = $this->makeSchoolWithClass('Bright', 'Grade 4');

        Sanctum::actingAs($adminAlpha);

        $response = $this->getJson('/api/classes');

        $response->assertOk();
        $response->assertJsonCount(1);                 // only Alpha's one class
        $response->assertJsonFragment(['name' => 'JSS 1']);
        $response->assertJsonMissing(['name' => 'Grade 4']); // never Bright's
    }

    public function test_created_classes_are_stamped_with_the_callers_school(): void
    {
        [$alpha, $adminAlpha] = $this->makeSchoolWithClass('Alpha', 'JSS 1');

        Sanctum::actingAs($adminAlpha);

        $this->postJson('/api/classes', ['name' => 'JSS 2'])->assertCreated();

        // The new row landed in Alpha, with no school_id passed by the caller.
        $this->assertDatabaseHas('school_classes', [
            'name' => 'JSS 2',
            'school_id' => $alpha->id,
        ]);
    }
}
