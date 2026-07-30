<?php
// api/teacher/reports/completion.php
// Assignment completion rates for the signed-in teacher.
// Matches getCompletionRates() -> rates[] { subject, completion_rate, total }
//
// LIMITATION: assignments/lessons carry no subject_id, so the `subject` label is the
// lesson title. `total` is the number of submissions for the teacher's assignments under
// that lesson; completion_rate is the percentage of those submissions that have been
// graded (grade IS NOT NULL). Lessons with no submissions are omitted.
require_once __DIR__ . '/../../lib/auth_middleware.php';
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

$stmt = $db->prepare("
    SELECT l.title AS subject,
           COUNT(s.id) AS total,
           ROUND(
               100 * SUM(CASE WHEN s.grade IS NOT NULL THEN 1 ELSE 0 END)
               / NULLIF(COUNT(s.id), 0)
           , 2) AS completion_rate
    FROM assignments a
    JOIN lessons l          ON l.id = a.lesson_id
    LEFT JOIN submissions s ON s.assignment_id = a.id
    WHERE a.teacher_id = ?
    GROUP BY l.id, l.title
    HAVING total > 0
    ORDER BY l.title
");
$stmt->execute([$user['id']]);

$rows = array_map(function ($r) {
    return [
        'subject'         => $r['subject'],
        'completion_rate' => (float) $r['completion_rate'],
        'total'           => (int) $r['total'],
    ];
}, $stmt->fetchAll());

json_response(['success' => true, 'rates' => $rows]);
