<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmergencyContact;
use App\Models\ParentChild;
use Illuminate\Http\Request;

class EmergencyContactController extends Controller
{
    /**
     * List the emergency contacts of a given student (?student_id), which must
     * be one of the authenticated parent's linked children. Tenancy is
     * automatic via the BelongsToSchool global scope.
     */
    public function index(Request $request)
    {
        $studentId = $this->linkedStudentId($request);

        return EmergencyContact::query()
            ->where('user_id', $studentId)
            ->orderByDesc('is_primary')
            ->orderBy('name')
            ->get();
    }

    /**
     * Add an emergency contact for a linked child. school_id is stamped by the
     * BelongsToSchool creating hook.
     */
    public function store(Request $request)
    {
        $studentId = $this->linkedStudentId($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'relationship' => ['required', 'string', 'max:64'],
            'is_primary' => ['sometimes', 'boolean'],
        ]);

        $data['user_id'] = $studentId;

        return response()->json(EmergencyContact::create($data), 201);
    }

    /**
     * Resolve and verify ?student_id belongs to the authenticated parent
     * (403 otherwise). Cross-tenant students fail the link check because
     * ParentChild is tenant-scoped.
     */
    private function linkedStudentId(Request $request): int
    {
        $data = $request->validate([
            'student_id' => ['required', 'integer'],
        ]);

        $isLinked = ParentChild::query()
            ->where('parent_id', $request->user()->id)
            ->where('child_id', $data['student_id'])
            ->exists();

        abort_unless($isLinked, 403, 'This is not your child.');

        return (int) $data['student_id'];
    }
}
