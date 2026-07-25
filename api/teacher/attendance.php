<?php
// api/teacher/attendance.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $date = $_GET['date'] ?? date('Y-m-d');
    $stmt = $db->prepare("
        SELECT u.id as student_id, u.name as student_name, COALESCE(a.status, 'present') as status, a.notes
        FROM users u
        LEFT JOIN attendance a ON a.student_id = u.id AND a.date = ?
        WHERE u.role = 'student'
    ");
    $stmt->execute([$date]);
    json_response(['success' => true, 'date' => $date, 'records' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['date']) || !isset($data['records'])) json_response(['success' => false, 'error' => 'Date and records required'], 400);

    $db->beginTransaction();
    $stmt = $db->prepare("REPLACE INTO attendance (student_id, school_id, status, date, notes) VALUES (?, 1, ?, ?, ?)");
    foreach ($data['records'] as $rec) {
        $stmt->execute([$rec['student_id'], $rec['status'], $data['date'], $rec['notes'] ?? null]);
    }
    $db->commit();

    json_response(['success' => true, 'processed' => count($data['records'])]);
}
