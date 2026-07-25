<?php
// api/schools/timetable.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin', 'teacher', 'student']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT * FROM timetable");
    $stmt->execute();
    json_response(['success' => true, 'timetable' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    authenticate(['school_admin']);
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("INSERT INTO timetable (school_id, subject, day, start_time, end_time) VALUES (1, ?, ?, ?, ?)");
    $stmt->execute([$data['subject'], $data['day'], $data['start_time'], $data['end_time']]);
    json_response(['success' => true, 'entry_id' => $db->lastInsertId()]);
}
