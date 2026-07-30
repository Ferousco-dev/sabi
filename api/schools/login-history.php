<?php
// api/schools/login-history.php
// Frontend contract (app/lib/api/schools.ts):
//   getLoginHistory() -> GET { success, history: [{ id, user_name, ip_address,
//                                                    user_agent, login_at }] }
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
        "SELECT lh.id, u.name AS user_name, lh.ip_address, lh.user_agent, lh.login_at
         FROM login_history lh
         JOIN users u ON u.id = lh.user_id
         ORDER BY lh.login_at DESC, lh.id DESC
         LIMIT $perPage OFFSET $offset"
    );
    $stmt->execute();

    json_response(['success' => true, 'history' => $stmt->fetchAll()]);
}

fail(405, 'Method not allowed');
