<?php
// api/teacher/reports/performance.php
// Per-subject / per-class performance for the signed-in teacher's subjects.
// Matches getTeacherPerformanceReport() ->
//   report[] { subject, class_name, student_count, avg_score, pass_rate }
//
// The teacher's subjects/classes are derived from the timetable (no teacher_subjects
// join table). A result is attributed to a class via the student's enrollment. Pass =
// score / assessment max_score >= 0.5.
require_once __DIR__ . '/../../lib/auth_middleware.php';
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

$stmt = $db->prepare("
    SELECT sub.name AS subject,
           c.name   AS class_name,
           COUNT(DISTINCT r.student_id) AS student_count,
           ROUND(AVG(r.score), 2)       AS avg_score,
           ROUND(
               100 * SUM(CASE WHEN ac.max_score > 0 AND (r.score / ac.max_score) >= 0.5 THEN 1 ELSE 0 END)
               / NULLIF(COUNT(r.id), 0)
           , 2) AS pass_rate
    FROM results r
    JOIN subjects sub          ON sub.id = r.subject_id
    JOIN assessment_configs ac ON ac.id = r.assessment_id
    JOIN timetable tt          ON tt.subject_id = r.subject_id AND tt.teacher_id = ?
    LEFT JOIN enrollments e     ON e.student_id = r.student_id
    LEFT JOIN classes c         ON c.id = e.class_id
    GROUP BY sub.id, sub.name, c.id, c.name
    ORDER BY sub.name, c.name
");
$stmt->execute([$user['id']]);

$rows = array_map(function ($r) {
    return [
        'subject'       => $r['subject'],
        'class_name'    => $r['class_name'] ?? '',
        'student_count' => (int) $r['student_count'],
        'avg_score'     => (float) $r['avg_score'],
        'pass_rate'     => (float) $r['pass_rate'],
    ];
}, $stmt->fetchAll());

json_response(['success' => true, 'report' => $rows]);
