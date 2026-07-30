<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceCorrection;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AttendanceCorrectionController extends Controller
{
    /**
     * Admin/teacher review queue. Tenant-scoped by the global scope; newest
     * first. Shapes each row for the dashboard: the requesting student's name,
     * the current (original) status of the disputed day, and the requested one.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'status' => ['sometimes', Rule::in(['pending', 'approved', 'rejected'])],
        ]);

        $rows = AttendanceCorrection::query()
            ->with(['student:id,name', 'record:id,status'])
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->get();

        return $rows->map(fn (AttendanceCorrection $c) => [
            'id' => $c->id,
            'student_name' => $c->student?->name ?? 'Unknown',
            'date' => $c->date,
            'original_status' => $c->record?->status ?? 'unrecorded',
            'new_status' => $c->requested_status,
            'reason' => $c->reason,
            'status' => $c->status,
            'submitted_at' => $c->created_at,
        ]);
    }

    /**
     * A student flags one of their own attendance days for correction.
     * student_id is always the authenticated user — a student cannot file on
     * behalf of anyone else.
     */
    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $data = $request->validate([
            'attendance_record_id' => [
                'nullable', 'integer',
                Rule::exists('attendance_records', 'id')->where('school_id', $schoolId),
            ],
            'date' => ['required', 'date'],
            'requested_status' => ['required', Rule::in(['present', 'absent', 'late', 'excused'])],
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $correction = AttendanceCorrection::create([
            'attendance_record_id' => $data['attendance_record_id'] ?? null,
            'student_id' => $request->user()->id,
            'date' => $data['date'],
            'requested_status' => $data['requested_status'],
            'reason' => $data['reason'],
            'status' => 'pending',
        ]);

        return response()->json(['success' => true, 'id' => $correction->id], 201);
    }

    /** Approve: apply the requested status to the day's record, then close. */
    public function approve(Request $request, int $id)
    {
        return $this->review($request, $id, true);
    }

    /** Reject: close without changing attendance. */
    public function reject(Request $request, int $id)
    {
        return $this->review($request, $id, false);
    }

    private function review(Request $request, int $id, bool $approve)
    {
        // Global scope pins this to the tenant; findOrFail 404s cross-tenant ids.
        $correction = AttendanceCorrection::findOrFail($id);

        if ($correction->status !== 'pending') {
            return response()->json(['success' => false, 'error' => 'Already reviewed.'], 422);
        }

        DB::transaction(function () use ($correction, $request, $approve) {
            if ($approve) {
                // Update the linked record, or the day's record if one exists.
                $record = $correction->record
                    ?? AttendanceRecord::where('student_id', $correction->student_id)
                        ->whereDate('date', $correction->date)
                        ->first();

                if ($record) {
                    $record->update([
                        'status' => $correction->requested_status,
                        'recorded_by' => $request->user()->id,
                    ]);
                }
            }

            $correction->update([
                'status' => $approve ? 'approved' : 'rejected',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);
        });

        return response()->json(['success' => true]);
    }
}
