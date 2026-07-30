<?php
// api/student/score-history.php
// Frontend contract (app/lib/api/student.ts):
//   getScoreHistory() -> GET { success, history: [
//     { subject, scores: [{ date, score, max, grade, term }] }
//   ] }
// Grouped by subject for the authenticated student. Joins results +
// assessment_configs + subjects + terms. Only finalized (approved/published)
// results are shown to the student.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['student']);
$db = db();

$student_id = $user['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        "SELECT s.name AS subject,
                r.submitted_at AS date,
                r.score        AS score,
                ac.max_score   AS max,
                r.grade        AS grade,
                t.name         AS term
         FROM results r
         JOIN assessment_configs ac ON ac.id = r.assessment_id
         JOIN subjects s            ON s.id = r.subject_id
         JOIN terms t               ON t.id = ac.term_id
         WHERE r.student_id = ?
           AND r.status IN ('approved', 'published')
         ORDER BY s.name ASC, r.submitted_at ASC"
    );
    $stmt->execute([$student_id]);
    $rows = $stmt->fetchAll();

    // Group by subject.
    $bySubject = [];
    foreach ($rows as $row) {
        $subject = $row['subject'];
        if (!isset($bySubject[$subject])) {
            $bySubject[$subject] = ['subject' => $subject, 'scores' => []];
        }
        $bySubject[$subject]['scores'][] = [
            'date'  => $row['date'],
            'score' => (float) $row['score'],
            'max'   => (int) $row['max'],
            'grade' => $row['grade'],
            'term'  => $row['term'],
        ];
    }

    json_response(['success' => true, 'history' => array_values($bySubject)]);
}

fail(405, 'Method not allowed');
