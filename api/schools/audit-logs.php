<?php
// api/schools/audit-logs.php
// Frontend contract (app/lib/api/schools.ts):
//   getAuditLogs() -> GET { success, logs: [{ id, user_name, action, resource,
//                                              details?, ip_address, created_at }] }
// Newest first. Supports optional ?page & ?per_page pagination if passed.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $perPage = isset($_GET['per_page']) ? max(1, min(200, (int) $_GET['per_page'])) : 100;
    $page    = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
    $offset  = ($page - 1) * $perPage;

    $stmt = $db->prepare(
        "SELECT al.id, u.name AS user_name, al.action, al.resource,
                al.details, al.ip_address, al.created_at
         FROM audit_logs al
         JOIN users u ON u.id = al.user_id
         ORDER BY al.created_at DESC, al.id DESC
         LIMIT $perPage OFFSET $offset"
    );
    $stmt->execute();

    json_response(['success' => true, 'logs' => $stmt->fetchAll()]);
}

fail(405, 'Method not allowed');
