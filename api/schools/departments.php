<?php
// api/schools/departments.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("
        SELECT d.*, u.name as head_teacher_name,
        (SELECT COUNT(*) FROM subjects s WHERE s.department_id = d.id) as subject_count,
        (SELECT COUNT(*) FROM users u2 WHERE u2.role = 'teacher') as teacher_count
        FROM departments d
        LEFT JOIN users u ON u.id = d.head_teacher_id
        WHERE d.school_id = 1
    ");
    $stmt->execute();
    json_response(['success' => true, 'departments' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['name'])) json_response(['success' => false, 'error' => 'Name required'], 400);

    $stmt = $db->prepare("INSERT INTO departments (school_id, name, head_teacher_id) VALUES (1, ?, ?)");
    $stmt->execute([$data['name'], $data['head_teacher_id'] ?? null]);
    json_response(['success' => true, 'department_id' => $db->lastInsertId()]);
}
