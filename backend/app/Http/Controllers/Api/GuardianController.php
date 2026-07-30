<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentChild;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GuardianController extends Controller
{
    /**
     * Admin links a parent to a child. Both must be users in THIS school
     * (tenancy check on input), with the expected roles. school_id is stamped
     * by the BelongsToSchool creating hook; the unique index keeps links
     * idempotent. Admin-only access is gated by route middleware (role:school_admin).
     */
    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $data = $request->validate([
            'parent_id' => [
                'required', 'integer',
                Rule::exists('users', 'id')->where('school_id', $schoolId)->where('role', 'parent'),
            ],
            'child_id' => [
                'required', 'integer',
                Rule::exists('users', 'id')->where('school_id', $schoolId)->where('role', 'student'),
            ],
        ]);

        $link = ParentChild::firstOrCreate([
            'parent_id' => $data['parent_id'],
            'child_id' => $data['child_id'],
        ]);

        return response()->json($link, $link->wasRecentlyCreated ? 201 : 200);
    }
}
