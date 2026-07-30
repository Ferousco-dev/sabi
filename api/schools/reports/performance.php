<?php
// api/schools/reports/performance.php
// Performance report: aggregate published/approved results by subject.
// Matches getPerformanceReport() -> report[] { subject, average_score, pass_rate, student_count }
require_once __DIR__ . '/../../lib/auth_middleware.php';
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/response.php';

authenticate(['school_admin']);
$db = db();

// Pass = score / assessment max_score >= 0.5
$stmt = $db->query("
    SELECT sub.name AS subject,
           ROUND(AVG(r.score), 2) AS average_score,
           ROUND(
               100 * SUM(CASE WHEN ac.max_score > 0 AND (r.score / ac.max_score) >= 0.5 THEN 1 ELSE 0 END)
               / NULLIF(COUNT(r.id), 0)
           , 2) AS pass_rate,
           COUNT(DISTINCT r.student_id) AS student_count
    FROM results r
    JOIN subjects sub          ON sub.id = r.subject_id
    JOIN assessment_configs ac ON ac.id = r.assessment_id
    WHERE sub.school_id = 1
    GROUP BY sub.id, sub.name
    ORDER BY sub.name
");

$rows = array_map(function ($r) {
    return [
        'subject'       => $r['subject'],
        'average_score' => (float) $r['average_score'],
        'pass_rate'     => (float) $r['pass_rate'],
        'student_count' => (int) $r['student_count'],
    ];
}, $stmt->fetchAll());

json_response(['success' => true, 'report' => $rows]);
