<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnnouncementController extends Controller
{
    /**
     * List announcements for the current tenant. Tenancy is automatic via the
     * global scope. Non-admins only see announcements aimed at everyone ('all')
     * or at their own role; admins see all of them.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Announcement::query();

        if ($user->role !== 'school_admin') {
            $query->whereIn('target_role', ['all', $user->role]);
        }

        return $query->orderByDesc('id')->get();
    }

    /**
     * Admin publishes an announcement. Write access is gated by the
     * `role:school_admin` middleware on the route.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string'],
            'target_role' => ['required', Rule::in(['all', 'teacher', 'student', 'parent'])],
        ]);

        $data['created_by'] = $request->user()->id;

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Announcement::create($data), 201);
    }
}
