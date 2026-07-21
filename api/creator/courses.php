<?php
// public_html/api/creator/courses.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['creator', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List all courses (with enrollment counts)
    $stmt = db()->prepare(
        'SELECT c.*, COUNT(e.id) as enrollment_count
         FROM courses c
         LEFT JOIN enrollments e ON c.id = e.course_id
         WHERE c.creator_id = :cid
         GROUP BY c.id'
    );
    $stmt->execute([':cid' => $user['id']]);
    $courses = $stmt->fetchAll();

    json_out(200, ['success' => true, 'courses' => $courses]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();
    $title = trim((string) ($body['title'] ?? ''));
    $desc  = (string) ($body['description'] ?? '');
    $price = (float) ($body['price'] ?? 0.00);

    if ($title === '') {
        fail(400, 'Course title is required.');
    }

    try {
        $stmt = db()->prepare(
            'INSERT INTO courses (creator_id, title, description, price)
             VALUES (:cid, :title, :desc, :price)'
        );
        $stmt->execute([
            ':cid'   => $user['id'],
            ':title' => $title,
            ':desc'  => $desc,
            ':price' => $price
        ]);
        json_out(201, ['success' => true, 'course_id' => db()->lastInsertId()]);
    } catch (PDOException $e) {
        fail(500, 'Could not create course.');
    }
} else {
    fail(405, 'Method not allowed');
}
