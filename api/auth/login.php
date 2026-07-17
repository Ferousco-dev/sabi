<?php
// public_html/api/auth/login.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

function public_user(array $row): array
{
    return [
        'id'    => (int) $row['id'],
        'name'  => $row['name'],
        'email' => $row['email'],
        'role'  => $row['role'],
    ];
}

$body     = read_json_body();
$email    = mb_strtolower(trim((string) ($body['email'] ?? '')));
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
    fail(401, 'Invalid email or password');
}

$stmt = db()->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$row = $stmt->fetch();

$hash = $row['password_hash']
    ?? '$2y$10$usesomesillystringforsalttokeepthetimingconstant.';

if (!$row || !password_verify($password, $hash)) {
    fail(401, 'Invalid email or password');
}

if (password_needs_rehash($row['password_hash'], PASSWORD_BCRYPT)) {
    $up = db()->prepare('UPDATE users SET password_hash = :h WHERE id = :id');
    $up->execute([':h' => password_hash($password, PASSWORD_BCRYPT), ':id' => $row['id']]);
}

$token = jwt_encode(
    ['sub' => (int) $row['id'], 'role' => $row['role']],
    $cfg['jwt_secret'], $cfg['jwt_issuer'], $cfg['jwt_ttl']
);

json_out(200, ['success' => true, 'token' => $token, 'user' => public_user($row)]);
