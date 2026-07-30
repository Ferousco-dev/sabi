<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    /**
     * Bulk import students from CSV text. Write access is gated by the
     * `role:school_admin` middleware on the route.
     */
    public function students(Request $request)
    {
        return $this->import($request, 'student');
    }

    /**
     * Bulk import teachers from CSV text. Write access is gated by the
     * `role:school_admin` middleware on the route.
     */
    public function teachers(Request $request)
    {
        return $this->import($request, 'teacher');
    }

    /**
     * Parse `csv_data` (rows of `name,email[,phone]`) and create users with the
     * given role in the current tenant. Each account gets a random hashed
     * password (no shared default). Duplicates are deduped on email (globally
     * unique) and reported; malformed rows are collected in `errors`.
     */
    private function import(Request $request, string $role)
    {
        $data = $request->validate([
            'csv_data' => ['required', 'string'],
        ]);

        $imported = 0;
        $duplicates = 0;
        $errors = [];

        $lines = preg_split('/\r\n|\r|\n/', $data['csv_data']);

        foreach ($lines as $index => $line) {
            $line = trim($line);

            if ($line === '') {
                continue; // skip blank lines
            }

            $cols = array_map('trim', explode(',', $line));
            $name = $cols[0] ?? '';
            $email = $cols[1] ?? '';
            // A third `phone` column is accepted in the CSV for forward-compat
            // with the old importer, but the users table has no phone column
            // yet, so it is parsed and ignored rather than stored.

            if ($name === '' || $email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Row " . ($index + 1) . ": invalid name or email.";

                continue;
            }

            // Email is globally unique on the users table — dedupe on it.
            if (User::where('email', $email)->exists()) {
                $duplicates++;

                continue;
            }

            User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt(Str::random(24)),
                'role' => $role,
                'status' => 'active',
                'school_id' => Tenant::id(),
            ]);

            $imported++;
        }

        return response()->json([
            'imported' => $imported,
            'duplicates' => $duplicates,
            'errors' => $errors,
        ]);
    }
}
