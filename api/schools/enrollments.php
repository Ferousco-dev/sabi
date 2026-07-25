<?php
// api/schools/enrollments.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $class_id = $_GET['class_id'] ?? null;
    $sql = "SELECT e.*, u.name as student_name, c.name as class_name, s.name as section_name, sess.name as session_name
            FROM enrollments e
            JOIN users u ON u.id = e.student_id
            JOIN classes c ON c.id = e.class_id
            LEFT JOIN sections s ON s.id = e.section_id
            JOIN academic_sessions sess ON sess.id = e.academic_session_id";
    $params = [];

    if ($class_id) {
        $sql .= " WHERE e.class_id = ?";
        $params[] = $class_id;
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    json_response(['success' => true, 'enrollments' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['student_id']) || empty($data['class_id']) || empty($data['academic_session_id'])) {
        json_response(['success' => false, 'error' => 'Missing required fields'], 400);
    }

    $stmt = $db->prepare("INSERT INTO enrollments (student_id, class_id, section_id, academic_session_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['student_id'], $data['class_id'], $data['section_id'] ?? null, $data['academic_session_id']]);
    json_response(['success' => true, 'enrollment_id' => $db->lastInsertId()]);
}
