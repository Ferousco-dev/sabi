<?php
// api/student/attendance.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['student']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT date, status, notes FROM attendance WHERE student_id = ? ORDER BY date DESC");
    $stmt->execute([$user['id']]);
    json_response(['success' => true, 'records' => $stmt->fetchAll()]);
}
