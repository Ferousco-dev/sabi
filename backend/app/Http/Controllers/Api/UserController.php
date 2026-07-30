<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Tenant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * List users in the current school, optionally filtered by role
     * (e.g. /api/users?role=teacher). Scoped to the tenant EXPLICITLY because
     * User is the tenant root and intentionally has no global scope.
     */
    public function index(Request $request)
    {
        $request->validate([
            'role' => ['nullable', Rule::in(['school_admin', 'teacher', 'student', 'parent', 'creator'])],
        ]);

        return User::query()
            ->where('school_id', Tenant::id())
            ->when($request->query('role'), fn ($q, $role) => $q->where('role', $role))
            ->orderBy('name')
            ->paginate(50); // never an unbounded list (NFR-6)
    }
}
