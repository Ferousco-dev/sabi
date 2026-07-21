<?php
// public_html/api/schools/timetable.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['school_admin', 'teacher', 'student', 'parent']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return school timetable
    $stmt = db()->prepare('SELECT * FROM timetable WHERE school_id = :sid ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), start_time');

    // If user is a student, we might need to find their school_id from enrollment
    $targetSchoolId = $user['id'];
    if ($user['role'] === 'student') {
        $sch = db()->prepare('SELECT school_id FROM enrollments WHERE student_id = :sid LIMIT 1');
        $sch->execute([':sid' => $user['id']]);
        $res = $sch->fetch();
        $targetSchoolId = $res['school_id'] ?? 0;
    }

    $stmt->execute([':sid' => $targetSchoolId]);
    json_out(200, ['success' => true, 'timetable' => $stmt->fetchAll()]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_role($user, ['school_admin']);
    $body = read_json_body();

    $subject   = trim((string) ($body['subject'] ?? ''));
    $day       = (string) ($body['day'] ?? '');
    $startTime = (string) ($body['start_time'] ?? '');
    $endTime   = (string) ($body['end_time'] ?? '');

    if (!$subject || !$day || !$startTime || !$endTime) {
        fail(400, 'All fields are required.');
    }

    try {
        $stmt = db()->prepare(
            'INSERT INTO timetable (school_id, subject, day, start_time, end_time)
             VALUES (:sid, :sub, :day, :start, :end)'
        );
        $stmt->execute([
            ':sid'   => $user['id'],
            ':sub'   => $subject,
            ':day'   => $day,
            ':start' => $startTime,
            ':end'   => $endTime
        ]);
        json_out(201, ['success' => true, 'entry_id' => db()->lastInsertId()]);
    } catch (PDOException $e) {
        fail(500, 'Could not create timetable entry.');
    }
} else {
    fail(405, 'Method not allowed');
}
