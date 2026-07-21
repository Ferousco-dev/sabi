<?php
// public_html/api/student/content.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['student', 'parent', 'teacher', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all lessons for courses this student is enrolled in
    $stmt = db()->prepare(
        'SELECT l.*, c.title as course_title, u.name as teacher_name
         FROM lessons l
         JOIN courses c ON l.course_id = c.id
         JOIN enrollments e ON c.id = e.course_id
         JOIN users u ON l.teacher_id = u.id
         WHERE e.student_id = :sid'
    );
    $stmt->execute([':sid' => $user['id']]);
    $content = $stmt->fetchAll();

    json_out(200, [
        'success' => true,
        'content' => $content,
        'sync_timestamp' => time()
    ]);
} else {
    fail(405, 'Method not allowed');
}
