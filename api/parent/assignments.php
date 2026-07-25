<?php
// api/parent/assignments.php
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
        SELECT a.*, l.title as lesson_title, s.content_url, s.grade, s.submitted_at
        FROM assignments a
        JOIN lessons l ON l.id = a.lesson_id
        LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
        ORDER BY a.due_date ASC
    ");
    $stmt->execute([$child_id]);
    json_response(['success' => true, 'assignments' => $stmt->fetchAll()]);
}
