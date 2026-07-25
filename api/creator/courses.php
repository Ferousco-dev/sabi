<?php
// api/creator/courses.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['creator']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT c.*, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrollment_count FROM courses c WHERE c.creator_id = ?");
    $stmt->execute([$user['id']]);
    json_response(['success' => true, 'courses' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['title'])) json_response(['success' => false, 'error' => 'Title required'], 400);

    $stmt = $db->prepare("INSERT INTO courses (creator_id, title, description, price) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user['id'], $data['title'], $data['description'] ?? null, $data['price'] ?? 0]);
    json_response(['success' => true, 'course_id' => $db->lastInsertId()]);
}
