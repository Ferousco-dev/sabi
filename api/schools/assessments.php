<?php
// api/schools/assessments.php
// Assessment configurations (e.g. First Test, Mid-term, Exam) per session/term.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin', 'teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("
        SELECT id, name, max_score, weight, session_id, term_id
        FROM assessment_configs
        WHERE school_id = 1
        ORDER BY id DESC
    ");
    $stmt->execute();
    json_response(['success' => true, 'assessments' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $name = trim($data['name'] ?? '');
    if ($name === '') fail(400, 'Assessment name is required');
    if (empty($data['session_id']) || empty($data['term_id'])) fail(400, 'Session and term are required');

    $stmt = $db->prepare("
        INSERT INTO assessment_configs (school_id, session_id, term_id, name, max_score, weight)
        VALUES (1, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        (int) $data['session_id'],
        (int) $data['term_id'],
        $name,
        (int) ($data['max_score'] ?? 100),
        (int) ($data['weight'] ?? 10),
    ]);
    json_response(['success' => true, 'assessment_id' => $db->lastInsertId()]);
}

fail(405, 'Method not allowed');
