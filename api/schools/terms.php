<?php
// api/schools/terms.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $session_id = $_GET['session_id'] ?? null;
    if (!$session_id) json_response(['success' => false, 'error' => 'Session ID required'], 400);

    $stmt = $db->prepare("SELECT * FROM terms WHERE session_id = ? ORDER BY start_date ASC");
    $stmt->execute([$session_id]);
    json_response(['success' => true, 'terms' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("INSERT INTO terms (session_id, name, start_date, end_date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['session_id'], $data['name'], $data['start_date'], $data['end_date']]);
    json_response(['success' => true, 'term_id' => $db->lastInsertId()]);
}
