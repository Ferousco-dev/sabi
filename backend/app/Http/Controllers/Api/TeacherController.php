<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimetableEntry;
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

    /**
     * Teacher detail with the subjects and classes they actually teach, derived
     * from their timetable entries (the source of truth for who teaches what).
     */
    public function show(int $id)
    {
        $teacher = User::where('school_id', Tenant::id())
            ->where('role', 'teacher')
            ->findOrFail($id);

        // TimetableEntry is tenant-scoped by its global scope.
        $entries = TimetableEntry::where('teacher_id', $id)
            ->with(['subject:id,name', 'schoolClass:id,name'])
            ->get();

        $subjects = $entries->pluck('subject')->filter()->unique('id')
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name])->values();
        $classes = $entries->pluck('schoolClass')->filter()->unique('id')
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->values();

        return [
            'id' => $teacher->id,
            'name' => $teacher->name,
            'email' => $teacher->email,
            'phone' => $teacher->phone,
            'status' => $teacher->status,
            'subjects' => $subjects,
            'classes' => $classes,
            'subject_count' => $subjects->count(),
            'class_count' => $classes->count(),
        ];
    }
}
