<?php
// public_html/api/auth/signup.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

const ROLES = ['school_admin', 'teacher', 'student', 'parent', 'creator'];

function public_user(array $row): array
{
    return [
        'id'    => (int) $row['id'],
        'name'  => $row['name'],
        'email' => $row['email'],
        'role'  => $row['role'],
    ];
}

$body = read_json_body();

$name     = trim((string) ($body['name']     ?? ''));
$email    = trim((string) ($body['email']    ?? ''));
$password = (string)       ($body['password'] ?? '');
$role     = (string)       ($body['role']     ?? '');

// --- Validation (422) ----------------------------------------------------
if ($name === '' || mb_strlen($name) > 120) {
    fail(422, 'Name is required (max 120 characters).');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    fail(422, 'A valid email address is required.');
}
if (strlen($password) < 8) {
    fail(422, 'Password must be at least 8 characters.');
}
// Role might be optional at signup per app/lib/auth.ts, but let's stick to contract
if ($role && !in_array($role, ROLES, true)) {
    fail(422, 'Invalid role.');
}

$email = mb_strtolower($email);
$hash  = password_hash($password, PASSWORD_BCRYPT);

// --- Insert (409 on duplicate email) -------------------------------------
try {
    $stmt = db()->prepare(
        'INSERT INTO users (name, email, password_hash, role)
         VALUES (:name, :email, :hash, :role)'
    );
    $stmt->execute([
        ':name'  => $name,
        ':email' => $email,
        ':hash'  => $hash,
        ':role'  => $role ?: 'student', // Default if not provided
    ]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        fail(409, 'An account with this email already exists.');
    }
    fail(500, 'Could not create account.');
}

$id  = (int) db()->lastInsertId();
$row = ['id' => $id, 'name' => $name, 'email' => $email, 'role' => $role ?: 'student'];

// --- Issue token ---------------------------------------------------------
$token = jwt_encode(
    ['sub' => $id, 'role' => $row['role']],
    $cfg['jwt_secret'], $cfg['jwt_issuer'], $cfg['jwt_ttl']
);

json_out(201, ['success' => true, 'token' => $token, 'user' => public_user($row)]);
