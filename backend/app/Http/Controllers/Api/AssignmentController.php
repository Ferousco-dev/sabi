<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    /**
     * Any authenticated user in the tenant sees the school's assignments.
     */
    public function index()
    {
        return Assignment::orderByDesc('id')->get();
    }

    /**
     * Teacher or admin creates an assignment. teacher_id is forced to the author.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Assignment::class);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'subject_id' => ['nullable', 'integer', 'exists:subjects,id'],
            'due_date' => ['nullable', 'date'],
        ]);

        $data['teacher_id'] = $request->user()->id;

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Assignment::create($data), 201);
    }
}
