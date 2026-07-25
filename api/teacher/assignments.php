<?php
// api/teacher/assignments.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("SELECT a.*, l.title as lesson_title FROM assignments a JOIN lessons l ON l.id = a.lesson_id WHERE a.id = ?");
        $stmt->execute([$id]);
        $assignment = $stmt->fetch();
        if (!$assignment) json_response(['success' => false, 'error' => 'Assignment not found'], 404);

        $stmt = $db->prepare("SELECT s.*, u.name as student_name FROM submissions s JOIN users u ON u.id = s.student_id WHERE s.assignment_id = ?");
        $stmt->execute([$id]);
        $assignment['submissions'] = $stmt->fetchAll();

        json_response(['success' => true, 'assignment' => $assignment]);
    } else {
        $stmt = $db->prepare("SELECT a.*, (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) as submission_count FROM assignments a WHERE a.teacher_id = ?");
        $stmt->execute([$user['id']]);
        json_response(['success' => true, 'assignments' => $stmt->fetchAll()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['title']) || empty($data['lesson_id'])) json_response(['success' => false, 'error' => 'Title and Lesson ID required'], 400);

    $stmt = $db->prepare("INSERT INTO assignments (lesson_id, teacher_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$data['lesson_id'], $user['id'], $data['title'], $data['description'] ?? null, $data['due_date'] ?? null]);
    json_response(['success' => true, 'assignment_id' => $db->lastInsertId()]);
}
