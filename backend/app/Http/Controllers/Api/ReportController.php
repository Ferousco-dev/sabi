<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Enrollment;
use App\Models\Result;
use App\Models\Submission;

/**
 * Read-only, tenant-scoped aggregate reports for school admins.
 *
 * Every query starts from a BelongsToSchool model, so the global 'school' scope
 * already injects `WHERE <table>.school_id = <current school>`. Joins ride on
 * foreign keys that live in the same school, so no manual school filtering is
 * needed — see the global-scope contract in BelongsToSchool.
 */
class ReportController extends Controller
{
    /**
     * GET /api/reports/performance
     * Average score + pass rate per subject. A result passes when
     * score / assessment_configs.max_score >= 0.5.
     */
    public function performance()
    {
        $rows = Result::query()
            ->join('subjects', 'results.subject_id', '=', 'subjects.id')
            ->join('assessment_configs', 'results.assessment_config_id', '=', 'assessment_configs.id')
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
     * GET /api/reports/attendance
     * Attendance rate per class: present / total.
     */
    public function attendance()
    {
        $rows = AttendanceRecord::query()
            ->join('school_classes', 'attendance_records.school_class_id', '=', 'school_classes.id')
            ->groupBy('school_classes.id', 'school_classes.name')
            ->selectRaw('school_classes.name as class')
            ->selectRaw('COUNT(*) as total_records')
            ->selectRaw("SUM(CASE WHEN attendance_records.status = 'present' THEN 1 ELSE 0 END) as present_count")
            ->selectRaw("ROUND(AVG(CASE WHEN attendance_records.status = 'present' THEN 1.0 ELSE 0.0 END), 4) as attendance_rate")
            ->orderBy('school_classes.name')
            ->get();

        return response()->json($rows);
    }

    /**
     * GET /api/reports/enrollment
     * Student counts per class.
     */
    public function enrollment()
    {
        $rows = Enrollment::query()
            ->join('school_classes', 'enrollments.school_class_id', '=', 'school_classes.id')
            ->groupBy('school_classes.id', 'school_classes.name')
            ->selectRaw('school_classes.name as class')
            ->selectRaw('COUNT(DISTINCT enrollments.student_id) as student_count')
            ->orderBy('school_classes.name')
            ->get();

        return response()->json($rows);
    }

    /**
     * GET /api/reports/activity
     * Best-effort recent-activity snapshot. There is no dedicated events/audit
     * table, so we aggregate row counts from the tables that do exist. `recent`
     * is a rolling 30-day window keyed on each table's created_at.
     */
    public function activity()
    {
        $since = now()->subDays(30);

        return response()->json([
            'totals' => [
                'results' => Result::query()->count(),
                'attendance_records' => AttendanceRecord::query()->count(),
                'submissions' => Submission::query()->count(),
            ],
            'recent_30_days' => [
                'results' => Result::query()->where('created_at', '>=', $since)->count(),
                'attendance_records' => AttendanceRecord::query()->where('created_at', '>=', $since)->count(),
                'submissions' => Submission::query()->where('created_at', '>=', $since)->count(),
            ],
            'note' => 'Best-effort: no dedicated activity/audit table exists. Counts are derived from results, attendance_records, and submissions in the current school only.',
        ]);
    }
}
