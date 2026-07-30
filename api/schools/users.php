<?php
// api/schools/users.php
// User management: list users, invite, change role, and set lifecycle status
// (active / inactive / graduated / expelled / transferred / suspended).
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

const ALLOWED_STATUSES = ['active', 'inactive', 'suspended', 'graduated', 'expelled', 'transferred'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->query("
        SELECT id, name, email, role, status, created_at,
               (SELECT MAX(lh.created_at) FROM login_history lh WHERE lh.user_id = users.id) AS last_login
        FROM users
        ORDER BY created_at DESC
    ");
    json_response(['success' => true, 'users' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $action = $data['action'] ?? '';

    if ($action === 'invite') {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $role = $data['role'] ?? '';
        if ($name === '' || $email === '') fail(400, 'Name and email are required');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Enter a valid email address');
        if (!in_array($role, ['school_admin', 'teacher', 'student', 'parent', 'creator'], true)) fail(400, 'Invalid role');

        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) fail(409, 'A user with this email already exists');

        $pass = password_hash('sabihub123', PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $pass, $role]);
        json_response(['success' => true, 'user_id' => $db->lastInsertId()]);
    }

    $userId = $data['user_id'] ?? null;

    if ($action === 'activate' || $action === 'deactivate') {
        if (!$userId) fail(400, 'user_id required');
        $stmt = $db->prepare("UPDATE users SET status = ? WHERE id = ?");
        $stmt->execute([$action === 'activate' ? 'active' : 'inactive', $userId]);
        json_response(['success' => true]);
    }

    if ($action === 'set_status') {
        if (!$userId) fail(400, 'user_id required');
        $status = $data['status'] ?? '';
        if (!in_array($status, ALLOWED_STATUSES, true)) fail(400, 'Invalid status');
        $stmt = $db->prepare("UPDATE users SET status = ? WHERE id = ?");
        $stmt->execute([$status, $userId]);
        json_response(['success' => true]);
    }

    if ($action === 'update_role') {
        if (!$userId) fail(400, 'user_id required');
        $role = $data['role'] ?? '';
        if (!in_array($role, ['school_admin', 'teacher', 'student', 'parent', 'creator'], true)) fail(400, 'Invalid role');
        $stmt = $db->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$role, $userId]);
        json_response(['success' => true]);
    }

    fail(400, 'Unknown action');
}

fail(405, 'Method not allowed');
