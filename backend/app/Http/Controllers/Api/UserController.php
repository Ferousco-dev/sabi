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

    /**
     * Change a user's lifecycle status. Admin only (route middleware).
     * Tenant-scoped EXPLICITLY: the target must belong to the caller's school,
     * else 404 — we never confirm the existence of another tenant's user.
     */
    public function setStatus(Request $request, string $id)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'graduated', 'expelled', 'transferred'])],
        ]);

        $user = User::where('id', $id)
            ->where('school_id', Tenant::id())
            ->firstOrFail();

        $user->update(['status' => $data['status']]);

        return $user;
    }

    /**
     * Change a user's role. Admin only (route middleware). Tenant-scoped
     * EXPLICITLY: the target must belong to the caller's school, else 404.
     */
    public function updateRole(Request $request, string $id)
    {
        $data = $request->validate([
            'role' => ['required', Rule::in(['school_admin', 'teacher', 'student', 'parent', 'creator'])],
        ]);

        $user = User::where('id', $id)
            ->where('school_id', Tenant::id())
            ->firstOrFail();

        $user->update(['role' => $data['role']]);

        return $user;
    }
}
