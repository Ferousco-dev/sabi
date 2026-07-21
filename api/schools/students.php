<?php
// public_html/api/schools/students.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all students enrolled in this school
    $stmt = db()->prepare(
        'SELECT u.id, u.name, u.email, e.enrolled_at
         FROM users u
         JOIN enrollments e ON u.id = e.student_id
         WHERE e.school_id = :school_id
         GROUP BY u.id'
    );
    $stmt->execute([':school_id' => $user['id']]);
    $students = $stmt->fetchAll();

    json_out(200, [
        'success' => true,
        'school' => $user['name'],
        'students' => $students
    ]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Enroll an existing student into the school for a specific course
    $body = read_json_body();
    $studentId = (int) ($body['student_id'] ?? 0);
    $courseId  = (int) ($body['course_id']  ?? 0);

    if (!$studentId || !$courseId) {
        fail(400, 'Student ID and Course ID are required.');
    }

    try {
        $stmt = db()->prepare(
            'INSERT INTO enrollments (student_id, school_id, course_id)
             VALUES (:sid, :schid, :cid)'
        );
        $stmt->execute([
            ':sid'   => $studentId,
            ':schid' => $user['id'],
            ':cid'   => $courseId
        ]);
        json_out(201, ['success' => true, 'message' => 'Student enrolled successfully.']);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            fail(409, 'Student is already enrolled in this course.');
        }
        fail(500, 'Could not enroll student.');
    }
} else {
    fail(405, 'Method not allowed');
}
