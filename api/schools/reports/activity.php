<?php
// api/schools/reports/activity.php
// User activity report from login_history.
// Matches getUserActivityReport() -> report[] { user_name, role, login_count, last_active }
require_once __DIR__ . '/../../lib/auth_middleware.php';
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/response.php';

authenticate(['school_admin']);
$db = db();

$stmt = $db->query("
    SELECT u.name AS user_name,
           u.role AS role,
           COUNT(lh.id)      AS login_count,
           MAX(lh.login_at)  AS last_active
    FROM users u
    LEFT JOIN login_history lh ON lh.user_id = u.id
    GROUP BY u.id, u.name, u.role
    ORDER BY last_active IS NULL, last_active DESC
");

$rows = array_map(function ($r) {
    return [
        'user_name'   => $r['user_name'],
        'role'        => $r['role'],
        'login_count' => (int) $r['login_count'],
        'last_active' => $r['last_active'],
    ];
}, $stmt->fetchAll());

json_response(['success' => true, 'report' => $rows]);
