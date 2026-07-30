<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    /**
     * Listing, optionally filtered by ?assignment_id.
     * A student sees ONLY their own submissions; teachers/admins see all
     * (within the tenant, which is automatic via the global scope).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Submission::query();

        if ($user->role === 'student') {
            $query->where('student_id', $user->id);
        }

        if ($request->filled('assignment_id')) {
            $query->where('assignment_id', $request->integer('assignment_id'));
        }

        return $query->orderByDesc('id')->get();
    }

    /**
     * A student submits their own work. student_id is forced to the current
     * user. Re-submitting to the same assignment UPDATES the existing row
     * (idempotent per the UNIQUE (school_id, assignment_id, student_id)).
     */
    public function store(Request $request)
    {
        $this->authorize('create', Submission::class);

        $data = $request->validate([
            'assignment_id' => ['required', 'integer', 'exists:assignments,id'],
            'content' => ['nullable', 'string'],
            'file_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $submission = Submission::updateOrCreate(
            [
                'assignment_id' => $data['assignment_id'],
                'student_id' => $request->user()->id,
            ],
            [
                'content' => $data['content'] ?? null,
                'file_url' => $data['file_url'] ?? null,
                'submitted_at' => now(),
            ],
        );

        // 201 on first submit, 200 when an existing submission was updated.
        return response()->json($submission, $submission->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Teacher or admin grades a submission (sets grade + feedback).
     */
    public function grade(Request $request, string $id)
    {
        $submission = Submission::findOrFail($id);
        $this->authorize('grade', $submission);

        $data = $request->validate([
            'grade' => ['required', 'string', 'max:10'],
            'feedback' => ['nullable', 'string'],
        ]);

        $submission->update($data);

        return $submission;
    }
}
