<?php
// api/schools/teachers.php
// List / view / create teachers (users with role = 'teacher').
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("SELECT id, name, email, phone, status, created_at FROM users WHERE id = ? AND role = 'teacher'");
        $stmt->execute([$id]);
        $t = $stmt->fetch();
        if (!$t) fail(404, 'Teacher not found');
        // Assignment join tables do not exist yet; return empty collections.
        $t['department_name'] = null;
        $t['subject_count'] = 0;
        $t['class_count'] = 0;
        $t['subjects'] = [];
        $t['classes'] = [];
        json_response(['success' => true, 'teacher' => $t]);
    }

    $stmt = $db->query("SELECT id, name, email, phone, status, created_at FROM users WHERE role = 'teacher' ORDER BY name ASC");
    $teachers = array_map(function ($t) {
        $t['department_name'] = null;
        $t['subject_count'] = 0;
        $t['class_count'] = 0;
        return $t;
    }, $stmt->fetchAll());
    json_response(['success' => true, 'teachers' => $teachers]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $action = $data['action'] ?? 'register';

    if ($action === 'register') {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        if ($name === '' || $email === '') fail(400, 'Name and email are required');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Enter a valid email address');

        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) fail(409, 'A user with this email already exists');

        $pass = password_hash('sabihub123', PASSWORD_DEFAULT); // default; teacher resets on first login
        $stmt = $db->prepare("INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, 'teacher', ?)");
        $stmt->execute([$name, $email, $pass, trim($data['phone'] ?? '') ?: null]);
        json_response(['success' => true, 'teacher_id' => $db->lastInsertId()]);
    }

    // Assignment features need join tables that don't exist yet.
    if ($action === 'assign_subject' || $action === 'assign_class') {
        fail(501, 'Subject and class assignment is coming soon');
    }

    fail(400, 'Unknown action');
}

fail(405, 'Method not allowed');
