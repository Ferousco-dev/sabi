<?php
// api/parent/attendance.php
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

    $stmt = $db->prepare("SELECT date, status, notes FROM attendance WHERE student_id = ? ORDER BY date DESC");
    $stmt->execute([$child_id]);
    json_response(['success' => true, 'records' => $stmt->fetchAll()]);
}
