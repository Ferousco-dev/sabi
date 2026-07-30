<?php
// api/schools/notifications.php
// Admin notification-log viewer. Client (getNotificationLogs) expects a list only.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("
        SELECT n.id, n.user_id, u.name AS user_name, n.channel,
               n.title, n.status, n.sent_at, n.read_at
        FROM notification_logs n
        LEFT JOIN users u ON u.id = n.user_id
        ORDER BY n.sent_at DESC
    ");
    $stmt->execute();
    json_response(['success' => true, 'notifications' => $stmt->fetchAll()]);
}

fail(405, 'Method not allowed');
