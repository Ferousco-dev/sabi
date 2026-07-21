<?php
// public_html/api/student/content.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['student', 'teacher', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(200, ['success' => true, 'content' => [], 'offline_sync_supported' => true]);
} else {
    fail(405, 'Method not allowed');
}
