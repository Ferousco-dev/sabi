<?php
// api/parent/notifications.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['parent']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT * FROM notification_logs WHERE user_id = ? ORDER BY sent_at DESC");
    $stmt->execute([$user['id']]);
    json_response(['success' => true, 'notifications' => $stmt->fetchAll()]);
}
