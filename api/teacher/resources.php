<?php
// api/teacher/resources.php
// Teaching resource links for the signed-in teacher.
// GET  -> getResources()   -> resources[] { id, teacher_id, title, url, type, topic, created_at }
// POST { title, url, type, topic? } -> createResource() -> { success, resource_id }
//
// REQUIRES MIGRATION: the `resources` table does not exist in database_v2.sql.
// Intended DDL is in api/_migrations/resources.sql — run it before this endpoint works.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("
        SELECT id, teacher_id, title, url, type, topic, created_at
        FROM resources
        WHERE teacher_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$user['id']]);
    json_response(['success' => true, 'resources' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    if (empty($data['title']) || empty($data['url']) || empty($data['type'])) {
        fail(400, 'title, url and type required');
    }

    $stmt = $db->prepare("
        INSERT INTO resources (teacher_id, title, url, type, topic)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $user['id'],
        $data['title'],
        $data['url'],
        $data['type'],
        $data['topic'] ?? null,
    ]);

    json_response(['success' => true, 'resource_id' => (int) $db->lastInsertId()]);
}

fail(405, 'Method not allowed');
