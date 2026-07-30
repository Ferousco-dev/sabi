<?php
// api/teacher/assessments.php
// Teacher score entry against an assessment config.
// GET  ?assessment_id=&class_id=[&subject_id=]  ->
//        getAssessmentScores() -> scores[] { student_id, student_name, score, max_score }
// POST { assessment_id, scores:[{student_id, score}] [, subject_id] } ->
//        submitAssessmentScores() -> { success, processed }
//
// LIMITATION: the `results` unique key is (assessment_id, student_id, subject_id) but the
// frontend contract sends neither a subject_id on POST nor on GET. subject_id is accepted
// here as an extra query/body field. POST requires it (the column is NOT NULL and part of
// the upsert key); GET filters by it when supplied. The frontend should be extended to
// pass subject_id.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $assessment_id = $_GET['assessment_id'] ?? null;
    $class_id      = $_GET['class_id'] ?? null;
    $subject_id    = $_GET['subject_id'] ?? null;
    if (!$assessment_id || !$class_id) fail(400, 'assessment_id and class_id required');

    $sql = "
        SELECT u.id AS student_id,
               u.name AS student_name,
               r.score AS score,
               ac.max_score AS max_score
        FROM enrollments e
        JOIN users u              ON u.id = e.student_id AND u.role = 'student'
        JOIN assessment_configs ac ON ac.id = ?
        LEFT JOIN results r        ON r.student_id = u.id
                                   AND r.assessment_id = ?
    ";
    $params = [$assessment_id, $assessment_id];
    if ($subject_id) { $sql .= " AND r.subject_id = ?"; $params[] = $subject_id; }
    $sql .= " WHERE e.class_id = ? GROUP BY u.id, u.name, r.score, ac.max_score ORDER BY u.name";
    $params[] = $class_id;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $rows = array_map(function ($r) {
        return [
            'student_id'   => (int) $r['student_id'],
            'student_name' => $r['student_name'],
            'score'        => $r['score'] !== null ? (float) $r['score'] : 0,
            'max_score'    => (int) $r['max_score'],
        ];
    }, $stmt->fetchAll());

    json_response(['success' => true, 'scores' => $rows]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $assessment_id = $data['assessment_id'] ?? null;
    $subject_id    = $data['subject_id'] ?? ($_GET['subject_id'] ?? null);
    $scores        = $data['scores'] ?? [];

    if (!$assessment_id) fail(400, 'assessment_id required');
    if (!$subject_id)    fail(400, 'subject_id required (results unique key is assessment_id+student_id+subject_id)');
    if (!is_array($scores) || count($scores) === 0) fail(400, 'scores array required');

    $stmt = $db->prepare("
        INSERT INTO results (assessment_id, student_id, subject_id, score, status)
        VALUES (?, ?, ?, ?, 'pending')
        ON DUPLICATE KEY UPDATE score = VALUES(score)
    ");

    $processed = 0;
    $db->beginTransaction();
    try {
        foreach ($scores as $s) {
            if (!isset($s['student_id']) || !isset($s['score'])) continue;
            $stmt->execute([$assessment_id, $s['student_id'], $subject_id, $s['score']]);
            $processed++;
        }
        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        fail(500, 'Failed to save scores');
    }

    json_response(['success' => true, 'processed' => $processed]);
}

fail(405, 'Method not allowed');
