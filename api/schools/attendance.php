<?php
// api/schools/attendance.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin', 'teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $date = $_GET['date'] ?? date('Y-m-d');
    $stmt = $db->prepare("
        SELECT u.name, u.email, COALESCE(a.status, 'absent') as status, ? as date
        FROM users u
        LEFT JOIN attendance a ON a.student_id = u.id AND a.date = ?
        WHERE u.role = 'student'
    ");
    $stmt->execute([$date, $date]);
    json_response(['success' => true, 'date' => $date, 'attendance' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    // Student ID check or email lookup could go here
    $stmt = $db->prepare("REPLACE INTO attendance (student_id, school_id, status, date) VALUES (?, 1, ?, ?)");
    $stmt->execute([$data['student_id'], $data['status'], $data['date'] ?? date('Y-m-d')]);
    json_response(['success' => true]);
}
