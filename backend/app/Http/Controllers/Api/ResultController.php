<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    /**
     * Role-aware listing. Tenancy is already automatic via the global scope.
     * - school_admin sees every result in the school.
     * - a student sees ONLY their own published results.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Result::query();

        if ($user->role === 'student') {
            $query->where('student_id', $user->id)
                ->where('status', 'published');
        }

        return $query->orderByDesc('id')->get();
    }

    /**
     * Teacher or admin submits a score. Lands as 'pending' for admin review.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Result::class);

        $data = $request->validate([
            'student_id' => ['required', 'integer', 'exists:users,id'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'assessment_config_id' => ['required', 'integer', 'exists:assessment_configs,id'],
            'score' => ['required', 'numeric', 'min:0'],
            'grade' => ['nullable', 'string', 'max:10'],
        ]);

        $data['status'] = 'pending';
        $data['submitted_by'] = $request->user()->id;

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Result::create($data), 201);
    }

    /**
     * Admin approves a pending result.
     */
    public function approve(Request $request, string $id)
    {
        $result = Result::findOrFail($id);
        $this->authorize('approve', $result);

        $result->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
        ]);

        return $result;
    }

    /**
     * Admin publishes a result (visible to the student).
     */
    public function publish(Request $request, string $id)
    {
        $result = Result::findOrFail($id);
        $this->authorize('publish', $result);

        $result->update([
            'status' => 'published',
            'reviewed_by' => $request->user()->id,
        ]);

        return $result;
    }
}
