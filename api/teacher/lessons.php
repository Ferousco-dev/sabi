<?php
// api/teacher/lessons.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("SELECT l.*, c.title as course_title FROM lessons l JOIN courses c ON c.id = l.course_id WHERE l.id = ?");
        $stmt->execute([$id]);
        $lesson = $stmt->fetch();
        if (!$lesson) json_response(['success' => false, 'error' => 'Lesson not found'], 404);
        json_response(['success' => true, 'lesson' => $lesson]);
    } else {
        $stmt = $db->prepare("SELECT l.*, c.title as course_title FROM lessons l JOIN courses c ON c.id = l.course_id WHERE l.teacher_id = ?");
        $stmt->execute([$user['id']]);
        json_response(['success' => true, 'lessons' => $stmt->fetchAll()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['title']) || empty($data['course_id'])) json_response(['success' => false, 'error' => 'Title and Course ID required'], 400);

    $stmt = $db->prepare("INSERT INTO lessons (course_id, teacher_id, title, content, multimedia_url) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$data['course_id'], $user['id'], $data['title'], $data['content'] ?? null, $data['multimedia_url'] ?? null]);
    json_response(['success' => true, 'lesson_id' => $db->lastInsertId()]);
}
