<?php
// public_html/api/schools/attendance.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['school_admin', 'teacher']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $date = $_GET['date'] ?? date('Y-m-d');

    $stmt = db()->prepare(
        'SELECT u.name, u.email, a.status, a.date
         FROM users u
         JOIN enrollments e ON u.id = e.student_id
         LEFT JOIN attendance a ON u.id = a.student_id AND a.date = :date
         WHERE e.school_id = :sid'
    );
    $stmt->execute([':sid' => $user['id'], ':date' => $date]);
    json_out(200, ['success' => true, 'date' => $date, 'attendance' => $stmt->fetchAll()]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();
    $studentId = (int) ($body['student_id'] ?? 0);
    $status    = (string) ($body['status'] ?? 'present');
    $date      = (string) ($body['date'] ?? date('Y-m-d'));

    if (!$studentId) fail(400, 'Student ID is required.');

    try {
        $stmt = db()->prepare(
            'INSERT INTO attendance (student_id, school_id, status, date)
             VALUES (:sid, :schid, :status, :date)
             ON DUPLICATE KEY UPDATE status = VALUES(status)'
        );
        $stmt->execute([
            ':sid'    => $studentId,
            ':schid'  => $user['id'],
            ':status' => $status,
            ':date'   => $date
        ]);
        json_out(200, ['success' => true]);
    } catch (PDOException $e) {
        fail(500, 'Could not record attendance.');
    }
} else {
    fail(405, 'Method not allowed');
}
