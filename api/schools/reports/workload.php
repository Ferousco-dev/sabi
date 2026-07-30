<?php
// api/schools/reports/workload.php
// Teacher workload report derived from the timetable.
// Matches getTeacherWorkloadReport() -> report[] { teacher_name, subject_count, class_count, total_hours }
//
// LIMITATION: no teacher_subjects / teacher_classes join tables exist. subject_count,
// class_count and total_hours are derived entirely from `timetable` rows. Teachers with
// no timetable entries return zeroed counts. total_hours is the summed lesson duration
// across all scheduled periods (not multiplied by weeks).
require_once __DIR__ . '/../../lib/auth_middleware.php';
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/response.php';

authenticate(['school_admin']);
$db = db();

$stmt = $db->query("
    SELECT u.name AS teacher_name,
           COUNT(DISTINCT tt.subject_id) AS subject_count,
           COUNT(DISTINCT tt.class_id)   AS class_count,
           COALESCE(ROUND(SUM(TIME_TO_SEC(TIMEDIFF(tt.end_time, tt.start_time))) / 3600, 2), 0) AS total_hours
    FROM users u
    LEFT JOIN timetable tt ON tt.teacher_id = u.id
    WHERE u.role = 'teacher'
    GROUP BY u.id, u.name
    ORDER BY u.name
");

$rows = array_map(function ($r) {
    return [
        'teacher_name'  => $r['teacher_name'],
        'subject_count' => (int) $r['subject_count'],
        'class_count'   => (int) $r['class_count'],
        'total_hours'   => (float) $r['total_hours'],
    ];
}, $stmt->fetchAll());

json_response(['success' => true, 'report' => $rows]);
