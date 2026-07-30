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

    public function update(Request $request, int $id)
    {
        // findOrFail is tenant-scoped by the global scope.
        $subject = Subject::findOrFail($id);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            // Uniqueness is scoped to this school and ignores the current row.
            'code' => [
                'required', 'string', 'max:20',
                Rule::unique('subjects', 'code')
                    ->where('school_id', $request->user()->school_id)
                    ->ignore($id),
            ],
        ]);

        $subject->update($data);

        return $subject;
    }

    public function destroy(int $id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json(null, 204);
    }
}
