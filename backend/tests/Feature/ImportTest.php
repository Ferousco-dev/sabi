<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ImportTest extends TestCase
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

    public function test_bulk_import_creates_students_in_the_tenant(): void
    {
        $alpha = $this->admin('alpha');
        Sanctum::actingAs($alpha);

        $csv = "Ada Alpha,ada@alpha.test,08011112222\nBen Beta,ben@alpha.test";

        $this->postJson('/api/import/students', ['csv_data' => $csv])
            ->assertOk()
            ->assertJsonFragment(['imported' => 2, 'duplicates' => 0]);

        $this->assertSame(2, User::where('school_id', $alpha->school_id)->where('role', 'student')->count());
    }

    public function test_bulk_import_reports_duplicates_and_errors(): void
    {
        $alpha = $this->admin('alpha');
        Sanctum::actingAs($alpha);

        // ada already exists; second row is a dup on email; third row is malformed.
        User::create([
            'name' => 'Ada Alpha', 'email' => 'ada@alpha.test',
            'password' => bcrypt('x'), 'role' => 'student',
            'status' => 'active', 'school_id' => $alpha->school_id,
        ]);

        $csv = "Ada Alpha,ada@alpha.test\nBen Beta,ben@alpha.test\nNoEmailRow,";

        $this->postJson('/api/import/students', ['csv_data' => $csv])
            ->assertOk()
            ->assertJsonFragment(['imported' => 1, 'duplicates' => 1])
            ->assertJsonPath('errors', fn ($errors) => count($errors) === 1);
    }

    public function test_bulk_import_creates_teachers(): void
    {
        $alpha = $this->admin('alpha');
        Sanctum::actingAs($alpha);

        $csv = "Tina Teacher,tina@alpha.test";

        $this->postJson('/api/import/teachers', ['csv_data' => $csv])
            ->assertOk()
            ->assertJsonFragment(['imported' => 1]);

        $this->assertSame('teacher', User::where('email', 'tina@alpha.test')->first()->role);
    }
}
