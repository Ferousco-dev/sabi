<?php
// public_html/api/teacher/assignments.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['teacher', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List assignments and submission counts
    $stmt = db()->prepare(
        'SELECT a.*, COUNT(s.id) as submission_count
         FROM assignments a
         LEFT JOIN submissions s ON a.id = s.assignment_id
         WHERE a.teacher_id = :tid
         GROUP BY a.id'
    );
    $stmt->execute([':tid' => $user['id']]);
    json_out(200, ['success' => true, 'assignments' => $stmt->fetchAll()]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();
    $lessonId = (int) ($body['lesson_id'] ?? 0);
    $title    = trim((string) ($body['title'] ?? ''));
    $desc     = (string) ($body['description'] ?? '');
    $dueDate  = (string) ($body['due_date'] ?? null);

    if (!$lessonId || !$title) {
        fail(400, 'Lesson ID and title are required.');
    }

    try {
        $stmt = db()->prepare(
            'INSERT INTO assignments (lesson_id, teacher_id, title, description, due_date)
             VALUES (:lid, :tid, :title, :desc, :due)'
        );
        $stmt->execute([
            ':lid'   => $lessonId,
            ':tid'   => $user['id'],
            ':title' => $title,
            ':desc'  => $desc,
            ':due'   => $dueDate
        ]);
        json_out(201, ['success' => true, 'assignment_id' => db()->lastInsertId()]);
    } catch (PDOException $e) {
        fail(500, 'Could not create assignment.');
    }
} else {
    fail(405, 'Method not allowed');
}
