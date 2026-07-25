<?php
// api/schools/sections.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $class_id = $_GET['class_id'] ?? null;
    if (!$class_id) json_response(['success' => false, 'error' => 'Class ID required'], 400);

    $stmt = $db->prepare("
        SELECT s.*,
        (SELECT COUNT(*) FROM enrollments e WHERE e.section_id = s.id) as student_count
        FROM sections s
        WHERE s.class_id = ?
    ");
    $stmt->execute([$class_id]);
    json_response(['success' => true, 'sections' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['class_id']) || empty($data['name'])) {
        json_response(['success' => false, 'error' => 'Class ID and section name required'], 400);
    }

    $stmt = $db->prepare("INSERT INTO sections (class_id, name) VALUES (?, ?)");
    $stmt->execute([$data['class_id'], $data['name']]);
    json_response(['success' => true, 'section_id' => $db->lastInsertId()]);
}
