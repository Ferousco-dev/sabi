<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    public function index()
    {
        return Subject::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            // Uniqueness is scoped to this school — another school may reuse the code.
            'code' => [
                'required', 'string', 'max:20',
                Rule::unique('subjects', 'code')->where('school_id', $request->user()->school_id),
            ],
        ]);

        return response()->json(Subject::create($data), 201);
    }
}
