<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SectionTenancyTest extends TestCase
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

    public function test_sections_are_isolated_per_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        $alphaClass = SchoolClass::create(['school_id' => $alpha->school_id, 'name' => 'JSS1']);
        $brightClass = SchoolClass::create(['school_id' => $bright->school_id, 'name' => 'JSS1']);

        Sanctum::actingAs($alpha);
        $this->postJson('/api/sections', ['name' => 'Alpha A', 'school_class_id' => $alphaClass->id])->assertCreated();

        Sanctum::actingAs($bright);
        $this->postJson('/api/sections', ['name' => 'Bright B', 'school_class_id' => $brightClass->id])->assertCreated();

        $this->getJson('/api/sections')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Bright B'])
            ->assertJsonMissing(['name' => 'Alpha A']);

        $this->assertSame(2, Section::withoutGlobalScope('school')->count());
    }

    public function test_class_must_belong_to_the_same_school(): void
    {
        $alpha = $this->admin('alpha');
        $bright = $this->admin('bright');

        $alphaClass = SchoolClass::create(['school_id' => $alpha->school_id, 'name' => 'JSS1']);

        // Bright cannot attach a section to Alpha's class.
        Sanctum::actingAs($bright);
        $this->postJson('/api/sections', [
            'name' => 'Sneaky',
            'school_class_id' => $alphaClass->id,
        ])->assertStatus(422);
    }

    public function test_index_filters_by_class_id(): void
    {
        $alpha = $this->admin('alpha');

        $classA = SchoolClass::create(['school_id' => $alpha->school_id, 'name' => 'JSS1']);
        $classB = SchoolClass::create(['school_id' => $alpha->school_id, 'name' => 'JSS2']);

        Sanctum::actingAs($alpha);
        $this->postJson('/api/sections', ['name' => 'A1', 'school_class_id' => $classA->id])->assertCreated();
        $this->postJson('/api/sections', ['name' => 'B1', 'school_class_id' => $classB->id])->assertCreated();

        $this->getJson('/api/sections?class_id=' . $classA->id)
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'A1'])
            ->assertJsonMissing(['name' => 'B1']);
    }
}
