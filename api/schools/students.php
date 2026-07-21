<?php
// public_html/api/schools/students.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return list of students (placeholder for phase 1)
    json_out(200, ['success' => true, 'students' => []]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new student (placeholder)
    json_out(201, ['success' => true, 'message' => 'Student enrollment logic pending phase 2.']);
} else {
    fail(405, 'Method not allowed');
}
