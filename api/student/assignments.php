<?php
// public_html/api/student/assignments.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['student']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List all assignments for courses this student is enrolled in
    $stmt = db()->prepare(
        'SELECT a.*, c.title as course_title, s.grade, s.submitted_at
         FROM assignments a
         JOIN lessons l ON a.lesson_id = l.id
         JOIN courses c ON l.course_id = c.id
         JOIN enrollments e ON c.id = e.course_id
         LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = :sid
         WHERE e.student_id = :sid'
    );
    $stmt->execute([':sid' => $user['id']]);
    json_out(200, ['success' => true, 'assignments' => $stmt->fetchAll()]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Submit an assignment
    $body = read_json_body();
    $assignmentId = (int) ($body['assignment_id'] ?? 0);
    $contentUrl   = trim((string) ($body['content_url'] ?? ''));

    if (!$assignmentId || !$contentUrl) {
        fail(400, 'Assignment ID and content URL are required.');
    }

    try {
        $stmt = db()->prepare(
            'INSERT INTO submissions (assignment_id, student_id, content_url)
             VALUES (:aid, :sid, :url)
             ON DUPLICATE KEY UPDATE content_url = VALUES(content_url), submitted_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([
            ':aid' => $assignmentId,
            ':sid' => $user['id'],
            ':url' => $contentUrl
        ]);
        json_out(200, ['success' => true, 'message' => 'Assignment submitted successfully.']);
    } catch (PDOException $e) {
        fail(500, 'Could not submit assignment.');
    }
} else {
    fail(405, 'Method not allowed');
}
