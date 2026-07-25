<?php
// api/parent/children.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['parent']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT u.id, u.name, u.email, pc.created_at as linked_at FROM users u JOIN parent_child pc ON pc.student_id = u.id WHERE pc.parent_id = ?");
    $stmt->execute([$user['id']]);
    json_response(['success' => true, 'children' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['email'])) json_response(['success' => false, 'error' => 'Child email required'], 400);

    $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND role = 'student'");
    $stmt->execute([$data['email']]);
    $child = $stmt->fetch();

    if (!$child) json_response(['success' => false, 'error' => 'Student not found'], 404);

    $stmt = $db->prepare("INSERT IGNORE INTO parent_child (parent_id, student_id) VALUES (?, ?)");
    $stmt->execute([$user['id'], $child['id']]);

    json_response(['success' => true]);
}
