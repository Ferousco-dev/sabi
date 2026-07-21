<?php
// public_html/api/parent/children.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['parent']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(200, ['success' => true, 'children' => []]);
} else {
    fail(405, 'Method not allowed');
}
