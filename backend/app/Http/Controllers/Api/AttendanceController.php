<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    /**
     * Tenant-scoped list, optionally narrowed by ?class_id and ?date.
     * The global scope already pins this to the current school.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'class_id' => ['sometimes', 'integer'],
            'date' => ['sometimes', 'date'],
        ]);

        $rows = AttendanceRecord::query()
            ->with('student:id,name,email')
            ->when($filters['class_id'] ?? null, fn ($q, $id) => $q->where('school_class_id', $id))
            ->when($filters['date'] ?? null, fn ($q, $date) => $q->whereDate('date', $date))
            ->orderBy('student_id')
            ->get();

        // Shape for the dashboard: keep student_id (needed to pre-fill the mark
        // sheet) alongside the display name/email.
        return $rows->map(fn (AttendanceRecord $r) => [
            'id' => $r->id,
            'student_id' => $r->student_id,
            'class_id' => $r->school_class_id,
            'name' => $r->student?->name ?? 'Unknown',
            'email' => $r->student?->email ?? '',
            'status' => $r->status,
            'date' => $r->date,
        ]);
    }

    /**
     * Record attendance for a class on a date.
     *
     * Offline-idempotent (ADR-0004): each record is UPSERTed on
     * (student_id, date), so replaying the exact same offline batch updates the
     * existing rows instead of inserting duplicates — the unique index
     * (school_id, student_id, date) is the dedupe key. Conflict policy is
     * last-write-wins per record.
     */
    public function store(Request $request)
    {
        // Write access (school_admin or teacher) is gated by route middleware.
        $schoolId = $request->user()->school_id;

        $data = $request->validate([
            'class_id' => [
                'required', 'integer',
                Rule::exists('school_classes', 'id')->where('school_id', $schoolId),
            ],
            'date' => ['required', 'date'],
            'records' => ['required', 'array', 'min:1'],
            'records.*.student_id' => [
                'required', 'integer',
                // Student must belong to THIS school (tenancy check on input).
                Rule::exists('users', 'id')->where('school_id', $schoolId),
            ],
            'records.*.status' => ['required', Rule::in(['present', 'absent', 'late', 'excused'])],
            'records.*.client_uuid' => ['nullable', 'string', 'max:64'],
        ]);

        $saved = DB::transaction(function () use ($data, $request) {
            $out = [];

            foreach ($data['records'] as $record) {
                // updateOrCreate keyed on (student_id, date) — replays land on the
                // same row. school_id is stamped by the BelongsToSchool creating
                // hook on insert, and the global scope pins the lookup to the tenant.
                $out[] = AttendanceRecord::updateOrCreate(
                    [
                        'student_id' => $record['student_id'],
                        'date' => $data['date'],
                    ],
                    [
                        'school_class_id' => $data['class_id'],
                        'status' => $record['status'],
                        'client_uuid' => $record['client_uuid'] ?? null,
                        'recorded_by' => $request->user()->id,
                    ],
                );
            }

            return $out;
        });

        return response()->json($saved, 201);
    }
}
