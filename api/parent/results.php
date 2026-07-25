<?php
// api/parent/results.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['parent']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $child_id = $_GET['child_id'] ?? null;
    if (!$child_id) json_response(['success' => false, 'error' => 'Child ID required'], 400);

    // Verify ownership
    $stmt = $db->prepare("SELECT id FROM parent_child WHERE parent_id = ? AND student_id = ?");
    $stmt->execute([$user['id'], $child_id]);
    if (!$stmt->fetch()) json_response(['success' => false, 'error' => 'Unauthorized'], 403);

    $stmt = $db->prepare("
        SELECT r.*, s.name as subject, t.name as term, sess.name as session
        FROM results r
        JOIN subjects s ON s.id = r.subject_id
        JOIN assessment_configs ac ON ac.id = r.assessment_id
        JOIN terms t ON t.id = ac.term_id
        JOIN academic_sessions sess ON sess.id = ac.session_id
        WHERE r.student_id = ? AND r.status = 'published'
    ");
    $stmt->execute([$child_id]);
    json_response(['success' => true, 'results' => $stmt->fetchAll()]);
}
