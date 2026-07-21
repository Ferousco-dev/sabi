<?php
// public_html/api/teacher/lessons.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['teacher', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List lessons created by this teacher
    $stmt = db()->prepare(
        'SELECT l.*, c.title as course_title
         FROM lessons l
         JOIN courses c ON l.course_id = c.id
         WHERE l.teacher_id = :tid'
    );
    $stmt->execute([':tid' => $user['id']]);
    $lessons = $stmt->fetchAll();

    json_out(200, ['success' => true, 'lessons' => $lessons]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();
    $courseId = (int) ($body['course_id'] ?? 0);
    $title    = trim((string) ($body['title'] ?? ''));
    $content  = (string) ($body['content'] ?? '');
    $multimediaUrl = (string) ($body['multimedia_url'] ?? null);

    if (!$courseId || $title === '') {
        fail(400, 'Course ID and title are required.');
    }

    try {
        $stmt = db()->prepare(
            'INSERT INTO lessons (course_id, teacher_id, title, content, multimedia_url)
             VALUES (:cid, :tid, :title, :content, :murl)'
        );
        $stmt->execute([
            ':cid'   => $courseId,
            ':tid'   => $user['id'],
            ':title' => $title,
            ':content' => $content,
            ':murl'  => $multimediaUrl
        ]);
        json_out(201, ['success' => true, 'lesson_id' => db()->lastInsertId()]);
    } catch (PDOException $e) {
        fail(500, 'Could not create lesson.');
    }
} else {
    fail(405, 'Method not allowed');
}
