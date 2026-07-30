<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Two schools with their own admin + classes — enough to see isolation by hand.
     */
    public function run(): void
    {
        $alpha = School::create(['name' => 'Alpha Academy']);
        $bright = School::create(['name' => 'Bright Stars College']);

        User::create(['name' => 'Admin Alpha', 'email' => 'admin@alpha.test', 'password' => Hash::make('password'), 'role' => 'school_admin', 'status' => 'active', 'school_id' => $alpha->id]);
        User::create(['name' => 'Admin Bright', 'email' => 'admin@bright.test', 'password' => Hash::make('password'), 'role' => 'school_admin', 'status' => 'active', 'school_id' => $bright->id]);

        // school_id passed explicitly here — the seeder runs with no logged-in
        // user, so the trait has no tenant to infer from.
        foreach (['JSS 1', 'JSS 2', 'SSS 1'] as $name) {
            SchoolClass::create(['school_id' => $alpha->id, 'name' => $name]);
        }
        foreach (['Grade 4', 'Grade 5'] as $name) {
            SchoolClass::create(['school_id' => $bright->id, 'name' => $name]);
        }
    }
}
