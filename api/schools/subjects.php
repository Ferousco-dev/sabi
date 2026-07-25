<?php
// api/schools/subjects.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("
        SELECT s.*, d.name as department_name,
        (SELECT COUNT(*) FROM timetable tt WHERE tt.subject_id = s.id) as class_count
        FROM subjects s
        LEFT JOIN departments d ON d.id = s.department_id
        WHERE s.school_id = 1
    ");
    $stmt->execute();
    json_response(['success' => true, 'subjects' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['name']) || empty($data['code'])) json_response(['success' => false, 'error' => 'Name and code required'], 400);

    $stmt = $db->prepare("INSERT INTO subjects (school_id, department_id, name, code) VALUES (1, ?, ?, ?)");
    $stmt->execute([$data['department_id'] ?? null, $data['name'], $data['code']]);
    json_response(['success' => true, 'subject_id' => $db->lastInsertId()]);
}
