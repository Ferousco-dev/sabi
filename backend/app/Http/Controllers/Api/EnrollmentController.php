<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EnrollmentController extends Controller
{
    /**
     * List enrollments for the current school, optionally filtered by class
     * (e.g. /api/enrollments?class_id=5). Global scope rewrites the query to
     * WHERE school_id = <current school>.
     */
    public function index(Request $request)
    {
        $request->validate([
            'class_id' => ['nullable', 'integer'],
        ]);

        return Enrollment::query()
            ->with(['student', 'schoolClass'])
            ->when($request->query('class_id'), fn ($q, $id) => $q->where('school_class_id', $id))
            ->orderByDesc('enrolled_at')
            ->get();
    }

    /**
     * Enrol a student into a class. Write access is gated by the
     * `role:school_admin` middleware on the route.
     */
    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $data = $request->validate([
            // Both foreign keys must belong to THIS school — a caller cannot
            // enrol another school's student or into another school's class.
            'student_id' => [
                'required',
                Rule::exists('users', 'id')->where('school_id', $schoolId)->where('role', 'student'),
            ],
            'school_class_id' => [
                'required',
                Rule::exists('school_classes', 'id')->where('school_id', $schoolId),
            ],
            'section_id' => ['nullable', 'integer'],
        ]);

        // Prevent duplicate active enrollment of the same student in the same
        // class. Global scope keeps this tenant-safe.
        $exists = Enrollment::where('student_id', $data['student_id'])
            ->where('school_class_id', $data['school_class_id'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Student is already enrolled in this class.'], 409);
        }

        $enrollment = Enrollment::create([
            'student_id' => $data['student_id'],
            'school_class_id' => $data['school_class_id'],
            'section_id' => $data['section_id'] ?? null,
            'enrolled_at' => now(),
            // school_id stamped automatically by the trait's creating hook.
        ]);

        return response()->json($enrollment, 201);
    }
}
