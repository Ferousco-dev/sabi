<?php
// api/teacher/roster.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $class_id = $_GET['class_id'] ?? null;

    $sql = "SELECT u.id, u.name, u.email, s.name as section_name
            FROM users u
            LEFT JOIN enrollments e ON e.student_id = u.id
            LEFT JOIN sections s ON s.id = e.section_id
            WHERE u.role = 'student'";
    $params = [];

    if ($class_id) {
        $sql .= " AND e.class_id = ?";
        $params[] = $class_id;
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    json_response(['success' => true, 'students' => $stmt->fetchAll()]);
}
