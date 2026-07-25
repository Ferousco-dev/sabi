<?php
// api/student/content.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['student']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("SELECT l.*, c.title as course_title, u.name as teacher_name FROM lessons l JOIN courses c ON c.id = l.course_id JOIN users u ON u.id = l.teacher_id WHERE l.id = ?");
        $stmt->execute([$id]);
        $content = $stmt->fetch();
        if (!$content) json_response(['success' => false, 'error' => 'Content not found'], 404);
        json_response(['success' => true, 'content' => $content]);
    } else {
        // List lessons from all courses this student is enrolled in
        $stmt = $db->prepare("
            SELECT l.*, c.title as course_title, u.name as teacher_name
            FROM lessons l
            JOIN courses c ON c.id = l.course_id
            JOIN users u ON u.id = l.teacher_id
            JOIN enrollments e ON e.course_id = c.id
            WHERE e.student_id = ?
        ");
        $stmt->execute([$user['id']]);
        json_response(['success' => true, 'content' => $stmt->fetchAll()]);
    }
}
