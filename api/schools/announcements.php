<?php
// api/schools/announcements.php
// Admin announcements: list newest first + create.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("
        SELECT a.id, a.title, a.content, a.target_role, a.read_count,
               u.name AS created_by, a.created_at
        FROM announcements a
        LEFT JOIN users u ON u.id = a.creator_id
        WHERE a.school_id = 1
        ORDER BY a.created_at DESC
    ");
    $stmt->execute();
    json_response(['success' => true, 'announcements' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    if (empty($data['title']) || empty($data['content'])) fail(400, 'Title and content required');

    $target = $data['target_role'] ?? 'all';
    $allowed = ['teacher', 'student', 'parent', 'all'];
    if (!in_array($target, $allowed, true)) $target = 'all';

    $stmt = $db->prepare("
        INSERT INTO announcements (school_id, creator_id, title, content, target_role)
        VALUES (1, ?, ?, ?, ?)
    ");
    $stmt->execute([$user['id'], $data['title'], $data['content'], $target]);
    json_response(['success' => true, 'announcement_id' => $db->lastInsertId()]);
}

fail(405, 'Method not allowed');
