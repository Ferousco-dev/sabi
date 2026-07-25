<?php
// api/schools/campuses.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT * FROM campuses WHERE school_id = 1");
    $stmt->execute();
    json_response(['success' => true, 'campuses' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['name'])) json_response(['success' => false, 'error' => 'Name required'], 400);

    $stmt = $db->prepare("INSERT INTO campuses (school_id, name, address, is_main) VALUES (1, ?, ?, ?)");
    $stmt->execute([$data['name'], $data['address'] ?? null, $data['is_main'] ?? 0]);
    json_response(['success' => true, 'campus_id' => $db->lastInsertId()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['id'])) json_response(['success' => false, 'error' => 'ID required'], 400);

    $stmt = $db->prepare("DELETE FROM campuses WHERE id = ? AND school_id = 1");
    $stmt->execute([$data['id']]);
    json_response(['success' => true]);
}
