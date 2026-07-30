<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    /**
     * List students in the current school. Scoped to the tenant EXPLICITLY
     * because User is the tenant root and intentionally has no global scope.
     */
    public function index()
    {
        return User::query()
            ->where('school_id', Tenant::id())
            ->where('role', 'student')
            ->orderBy('name')
            ->paginate(50); // never an unbounded list (NFR-6)
    }

    /**
     * Create a student in the current tenant. Write access is gated by the
     * `role:school_admin` middleware on the route.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            // Email is globally unique on the users table; a friendly 409 below
            // avoids leaking a raw DB constraint violation.
            'email' => ['required', 'email', 'max:255'],
        ]);

        if (User::where('email', $data['email'])->exists()) {
            return response()->json(['message' => 'A user with this email already exists.'], 409);
        }

        // Students are read-only at pilot: no shared default password. A random
        // secret is hashed so the account can never be logged into until (if ever)
        // a proper credential flow is added.
        $student = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt(Str::random(24)),
            'role' => 'student',
            'status' => 'active',
            'school_id' => Tenant::id(),
        ]);

        return response()->json($student, 201);
    }
}
