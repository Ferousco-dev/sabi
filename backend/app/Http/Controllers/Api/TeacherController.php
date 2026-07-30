<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Tenant;

class TeacherController extends Controller
{
    /**
     * List teachers in the current school. Scoped to the tenant EXPLICITLY
     * because User is the tenant root and intentionally has no global scope.
     */
    public function index()
    {
        return User::query()
            ->where('school_id', Tenant::id())
            ->where('role', 'teacher')
            ->orderBy('name')
            ->paginate(50); // never an unbounded list (NFR-6)
    }
}
