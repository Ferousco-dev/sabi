<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimetableEntry;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        return TimetableEntry::with(['subject', 'teacher'])
            ->when($request->query('class_id'), fn ($q, $id) => $q->where('school_class_id', $id))
            ->orderBy('day')->orderBy('start_time')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_class_id' => ['required', Rule::exists('school_classes', 'id')->where('school_id', $request->user()->school_id)],
            'subject_id' => ['nullable', Rule::exists('subjects', 'id')->where('school_id', $request->user()->school_id)],
            'teacher_id' => ['nullable', Rule::exists('users', 'id')->where('school_id', $request->user()->school_id)],
            'day' => ['required', Rule::in(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'room' => ['nullable', 'string', 'max:50'],
        ]);

        return response()->json(TimetableEntry::create($data), 201);
    }

    /**
     * Delete a timetable entry. Admin only (route middleware). The findOrFail
     * lookup is auto-scoped to the current school by the BelongsToSchool global
     * scope, so another tenant's row 404s.
     */
    public function destroy(string $id)
    {
        $entry = TimetableEntry::findOrFail($id);

        $entry->delete();

        return response()->json(null, 204);
    }
}
