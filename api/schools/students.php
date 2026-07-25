<?php
// api/schools/students.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin', 'teacher']);
$db = db();

// Get school_id if admin
$school_id = null;
if ($user['role'] === 'school_admin') {
    $stmt = $db->prepare("SELECT id FROM school_profiles WHERE admin_id = ?");
    $stmt->execute([$user['id']]);
    $school = $stmt->fetch();
    $school_id = $school ? $school['id'] : null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("SELECT u.id, u.name, u.email, u.phone, u.created_at as enrolled_at FROM users u WHERE u.id = ? AND u.role = 'student'");
        $stmt->execute([$id]);
        $student = $stmt->fetch();
        if (!$student) json_response(['success' => false, 'error' => 'Student not found'], 404);
        json_response(['success' => true, 'student' => $student]);
    } else {
        // Simplified list for now
        $stmt = $db->prepare("SELECT id, name, email, created_at as enrolled_at FROM users WHERE role = 'student'");
        $stmt->execute();
        json_response(['success' => true, 'students' => $stmt->fetchAll()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? 'register';

    if ($action === 'register') {
        if (empty($data['name']) || empty($data['email'])) json_response(['success' => false, 'error' => 'Name and email required'], 400);

        // Check if exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) json_response(['success' => false, 'error' => 'Email already registered'], 409);

        $pass = password_hash('sabihub123', PASSWORD_DEFAULT); // Default password
        $stmt = $db->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'student')");
        $stmt->execute([$data['name'], $data['email'], $pass]);
        json_response(['success' => true, 'student_id' => $db->lastInsertId()]);
    }
}
