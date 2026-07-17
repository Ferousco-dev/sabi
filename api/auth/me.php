<?php
// public_html/api/auth/me.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('GET');

function public_user(array $row): array
{
    return [
        'id'    => (int) $row['id'],
        'name'  => $row['name'],
        'email' => $row['email'],
        'role'  => $row['role'],
    ];
}

$token = bearer_token();
if ($token === null) {
    fail(401, 'Missing bearer token.');
}

$claims = jwt_decode($token, $cfg['jwt_secret']);
if ($claims === null || !isset($claims['sub'], $claims['jti'])) {
    fail(401, 'Invalid or expired token.');
}

$rev = db()->prepare('SELECT 1 FROM revoked_tokens WHERE jti = :jti LIMIT 1');
$rev->execute([':jti' => $claims['jti']]);
if ($rev->fetch()) {
    fail(401, 'Token has been revoked.');
}

$stmt = db()->prepare('SELECT id, name, email, role FROM users WHERE id = :id LIMIT 1');
$stmt->execute([':id' => (int) $claims['sub']]);
$row = $stmt->fetch();
if (!$row) {
    fail(401, 'User no longer exists.');
}

json_out(200, ['success' => true, 'user' => public_user($row)]);
