<?php
// api/student/timetable.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['student']);
$db = db();

// Get student's class and section
$stmt = $db->prepare("SELECT class_id, section_id FROM enrollments WHERE student_id = ? ORDER BY enrolled_at DESC LIMIT 1");
$stmt->execute([$user['id']]);
$enrollment = $stmt->fetch();

if (!$enrollment) {
    json_response(['success' => true, 'timetable' => []]);
}

$stmt = $db->prepare("
    SELECT t.*, u.name as teacher_name
    FROM timetable t
    LEFT JOIN users u ON u.id = t.teacher_id
    WHERE t.class_id = ? OR (t.class_id IS NULL AND t.school_id = 1)
");
$stmt->execute([$enrollment['class_id']]);

json_response(['success' => true, 'timetable' => $stmt->fetchAll()]);
