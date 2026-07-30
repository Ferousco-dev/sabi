<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\ParentChild;
use Illuminate\Http\Request;

class ChildAttendanceController extends Controller
{
    /**
     * Attendance for one of the authenticated parent's linked children. The
     * link is verified first (403 if the child is not theirs). Tenancy is
     * automatic via the BelongsToSchool global scope on ParentChild and
     * AttendanceRecord.
     */
    public function index(Request $request)
    {
        $data = $request->validate([
            'child_id' => ['required', 'integer'],
        ]);

        $isLinked = ParentChild::query()
            ->where('parent_id', $request->user()->id)
            ->where('child_id', $data['child_id'])
            ->exists();

        abort_unless($isLinked, 403, 'This is not your child.');

        return AttendanceRecord::query()
            ->where('student_id', $data['child_id'])
            ->orderByDesc('date')
            ->get();
    }
}
