<?php
// public_html/api/teacher/lessons.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['teacher', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(200, ['success' => true, 'lessons' => []]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    json_out(201, ['success' => true, 'message' => 'Lesson creation logic pending phase 2.']);
} else {
    fail(405, 'Method not allowed');
}
