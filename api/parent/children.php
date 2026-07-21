<?php
// public_html/api/parent/children.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['parent', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List all children linked to this parent
    $stmt = db()->prepare(
        'SELECT u.id, u.name, u.email, pc.created_at as linked_at
         FROM users u
         JOIN parent_child pc ON u.id = pc.student_id
         WHERE pc.parent_id = :pid'
    );
    $stmt->execute([':pid' => $user['id']]);
    $children = $stmt->fetchAll();

    json_out(200, ['success' => true, 'children' => $children]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Link a child to this parent (e.g. via student email)
    $body = read_json_body();
    $email = mb_strtolower(trim((string) ($body['email'] ?? '')));

    if ($email === '') {
        fail(400, "Student email is required to link a child.");
    }

    $stmt = db()->prepare('SELECT id, role FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $student = $stmt->fetch();

    if (!$student || $student['role'] !== 'student') {
        fail(404, "Student account with this email not found.");
    }

    try {
        $stmt = db()->prepare(
            'INSERT INTO parent_child (parent_id, student_id)
             VALUES (:pid, :sid)'
        );
        $stmt->execute([
            ':pid' => $user['id'],
            ':sid' => $student['id']
        ]);
        json_out(201, ['success' => true, 'message' => 'Child linked successfully.']);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            fail(409, 'This child is already linked to your account.');
        }
        fail(500, 'Could not link child.');
    }
} else {
    fail(405, 'Method not allowed');
}
