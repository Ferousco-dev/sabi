<?php
// public_html/api/auth/role.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

$token = bearer_token();
if ($token === null) {
    fail(401, 'Missing bearer token.');
}

$claims = jwt_decode($token, $cfg['jwt_secret']);
if ($claims === null || !isset($claims['sub'])) {
    fail(401, 'Invalid or expired token.');
}

$body = read_json_body();
$role = (string) ($body['role'] ?? '');
const ROLES = ['school_admin', 'teacher', 'student', 'parent', 'creator'];

if (!in_array($role, ROLES, true)) {
    fail(422, 'Invalid role.');
}

try {
    $stmt = db()->prepare('UPDATE users SET role = :role WHERE id = :id');
    $stmt->execute([
        ':role' => $role,
        ':id'   => (int) $claims['sub']
    ]);
} catch (PDOException $e) {
    fail(500, 'Could not update role.');
}

// Return the updated user
$stmt = db()->prepare('SELECT id, name, email, role FROM users WHERE id = :id LIMIT 1');
$stmt->execute([':id' => (int) $claims['sub']]);
$row = $stmt->fetch();

function public_user(array $row): array
{
    return [
        'id'    => (int) $row['id'],
        'name'  => $row['name'],
        'email' => $row['email'],
        'role'  => $row['role'],
    ];
}

json_out(200, ['success' => true, 'user' => public_user($row)]);
