<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * Any authenticated user in the tenant sees the school's lessons.
     * Tenancy is automatic via the global scope.
     */
    public function index()
    {
        return Lesson::orderByDesc('id')->get();
    }

    /**
     * Teacher or admin creates a lesson. teacher_id is forced to the author.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Lesson::class);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'subject_id' => ['nullable', 'integer', 'exists:subjects,id'],
        ]);

        $data['teacher_id'] = $request->user()->id;

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Lesson::create($data), 201);
    }
}
