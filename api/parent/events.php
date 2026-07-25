<?php
// api/parent/events.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

authenticate(['parent', 'student', 'teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // School events / holidays
    $stmt = $db->prepare("SELECT id, title, date, description, 'holiday' as type FROM holidays WHERE school_id = 1 ORDER BY date ASC");
    $stmt->execute();
    json_response(['success' => true, 'events' => $stmt->fetchAll()]);
}
