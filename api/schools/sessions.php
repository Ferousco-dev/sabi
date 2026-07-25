<?php
// api/schools/sessions.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

$stmt = $db->prepare("SELECT id FROM school_profiles WHERE admin_id = ?");
$stmt->execute([$user['id']]);
$school = $stmt->fetch();
$school_id = $school['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT * FROM academic_sessions WHERE school_id = ? ORDER BY start_date DESC");
    $stmt->execute([$school_id]);
    json_response(['success' => true, 'sessions' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? 'create';

    if ($action === 'set_current') {
        $db->beginTransaction();
        $db->prepare("UPDATE academic_sessions SET is_current = 0 WHERE school_id = ?")->execute([$school_id]);
        $db->prepare("UPDATE academic_sessions SET is_current = 1 WHERE id = ?")->execute([$data['id']]);
        $db->commit();
        json_response(['success' => true]);
    } else {
        $stmt = $db->prepare("INSERT INTO academic_sessions (school_id, name, start_date, end_date) VALUES (?, ?, ?, ?)");
        $stmt->execute([$school_id, $data['name'], $data['start_date'], $data['end_date']]);
        json_response(['success' => true, 'session_id' => $db->lastInsertId()]);
    }
}
