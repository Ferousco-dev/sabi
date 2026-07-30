<?php
// api/schools/guardians.php
// A student's guardians / emergency contacts (stored in emergency_contacts,
// keyed by the student's user_id). Email is not stored on the table, so it is
// returned empty for compatibility with the client shape.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $studentId = $_GET['student_id'] ?? null;
    if (!$studentId) fail(400, 'student_id is required');
    $stmt = $db->prepare("
        SELECT id, user_id AS student_id, name, '' AS email, phone, relationship, is_primary
        FROM emergency_contacts
        WHERE user_id = ?
        ORDER BY is_primary DESC, name ASC
    ");
    $stmt->execute([$studentId]);
    json_response(['success' => true, 'guardians' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $studentId = $data['student_id'] ?? null;
    $name = trim($data['name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $relationship = trim($data['relationship'] ?? '');
    if (!$studentId || $name === '' || $phone === '' || $relationship === '') {
        fail(400, 'student_id, name, phone and relationship are required');
    }
    $isPrimary = !empty($data['is_primary']) ? 1 : 0;

    // Only one primary contact per student.
    if ($isPrimary) {
        $db->prepare("UPDATE emergency_contacts SET is_primary = 0 WHERE user_id = ?")->execute([$studentId]);
    }
    $stmt = $db->prepare("INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$studentId, $name, $phone, $relationship, $isPrimary]);
    json_response(['success' => true, 'guardian_id' => $db->lastInsertId()]);
}

fail(405, 'Method not allowed');
