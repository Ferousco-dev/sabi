<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\User;
use App\Support\Tenant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TransferController extends Controller
{
    /**
     * List students with their current class (their latest enrollment).
     * Scoped to the tenant EXPLICITLY for the User root; enrollments are
     * auto-scoped by the BelongsToSchool global scope. Write access to @store
     * is gated by the `role:school_admin` middleware on the route.
     */
    public function index()
    {
        $students = User::query()
            ->where('school_id', Tenant::id())
            ->where('role', 'student')
            ->orderBy('name')
            ->paginate(50); // never an unbounded list (NFR-6)

        // Attach each student's current class via their latest enrollment.
        $students->getCollection()->transform(function (User $student) {
            $current = Enrollment::with('schoolClass')
                ->where('student_id', $student->id)
                ->orderByDesc('enrolled_at')
                ->orderByDesc('id')
                ->first();

            $student->setAttribute('current_enrollment', $current);
            $student->setAttribute('current_class', $current?->schoolClass);

            return $student;
        });

        return $students;
    }

    /**
     * Promote (move to a new class) or repeat (keep the current class) a
     * student by updating their current enrollment. Both the student and the
     * target class must belong to THIS school.
     */
    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $data = $request->validate([
            'student_id' => [
                'required',
                Rule::exists('users', 'id')->where('school_id', $schoolId)->where('role', 'student'),
            ],
            'new_class_id' => [
                'required',
                Rule::exists('school_classes', 'id')->where('school_id', $schoolId),
            ],
            'action' => ['required', Rule::in(['promote', 'repeat'])],
        ]);

        // The student's current enrollment (latest). Global scope keeps this
        // lookup tenant-safe.
        $enrollment = Enrollment::where('student_id', $data['student_id'])
            ->orderByDesc('enrolled_at')
            ->orderByDesc('id')
            ->first();

        if (! $enrollment) {
            return response()->json(['message' => 'Student has no current enrollment.'], 404);
        }

        // Promote moves the student to the new class; repeat keeps them where
        // they are (the current class is retained).
        if ($data['action'] === 'promote') {
            $enrollment->update([
                'school_class_id' => $data['new_class_id'],
                'enrolled_at' => now(),
            ]);
        }

        return $enrollment->fresh();
    }
}
