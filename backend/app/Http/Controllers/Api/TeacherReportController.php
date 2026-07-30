<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Enrollment;
use App\Models\Result;
use App\Models\Submission;
use App\Models\TimetableEntry;
use Illuminate\Http\Request;

/**
 * Read-only, tenant-scoped reports for the calling teacher (admins may read too).
 *
 * All source models use BelongsToSchool, so the global 'school' scope already
 * limits every query to the current school. On top of that we filter by the
 * authenticated teacher's id where the report is about "my" data.
 */
class TeacherReportController extends Controller
{
    /**
     * GET /api/teacher-reports/performance
     * Average score + pass rate for the subjects this teacher teaches. A teacher's
     * subjects are derived from their timetable_entries (teacher_id).
     */
    public function performance(Request $request)
    {
        $subjectIds = TimetableEntry::query()
            ->where('teacher_id', $request->user()->id)
            ->whereNotNull('subject_id')
            ->distinct()
            ->pluck('subject_id');

        $rows = Result::query()
            ->join('subjects', 'results.subject_id', '=', 'subjects.id')
            ->join('assessment_configs', 'results.assessment_config_id', '=', 'assessment_configs.id')
            ->whereIn('results.subject_id', $subjectIds)
            ->groupBy('subjects.id', 'subjects.name')
            ->selectRaw('subjects.name as subject')
            ->selectRaw('ROUND(AVG(results.score), 2) as average_score')
            ->selectRaw('ROUND(AVG(CASE WHEN assessment_configs.max_score > 0 AND (results.score * 1.0 / assessment_configs.max_score) >= 0.5 THEN 1.0 ELSE 0.0 END), 4) as pass_rate')
            ->selectRaw('COUNT(DISTINCT results.student_id) as student_count')
            ->orderBy('subjects.name')
            ->get();

        return response()->json($rows);
    }

    /**
     * GET /api/teacher-reports/completion
     * Assignment completion for this teacher's assignments: submissions received
     * vs students enrolled.
     *
     * LIMITATION: assignments carry no class/section link, so "enrolled" is the
     * total distinct enrolled students in the school — the best available
     * denominator. completion_rate is therefore school-wide, not per-class.
     */
    public function completion(Request $request)
    {
        // Global scope already limits enrollments to the current school.
        $enrolledCount = Enrollment::query()->distinct()->count('student_id');

        $rows = Assignment::query()
            ->where('assignments.teacher_id', $request->user()->id)
            ->leftJoin('submissions', 'submissions.assignment_id', '=', 'assignments.id')
            ->groupBy('assignments.id', 'assignments.title')
            ->selectRaw('assignments.id as assignment_id')
            ->selectRaw('assignments.title as title')
            ->selectRaw('COUNT(DISTINCT submissions.student_id) as submission_count')
            ->orderBy('assignments.id')
            ->get()
            ->map(function ($row) use ($enrolledCount) {
                $row->enrolled_count = $enrolledCount;
                $row->completion_rate = $enrolledCount > 0
                    ? round($row->submission_count / $enrolledCount, 4)
                    : 0;

                return $row;
            });

        return response()->json($rows);
    }
}
