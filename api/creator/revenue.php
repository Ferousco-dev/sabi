<?php
// public_html/api/creator/revenue.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['creator', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Calculate total revenue from course enrollments
    $stmt = db()->prepare(
        'SELECT SUM(c.price) as total_revenue, COUNT(e.id) as total_sales
         FROM courses c
         JOIN enrollments e ON c.id = e.course_id
         WHERE c.creator_id = :cid'
    );
    $stmt->execute([':cid' => $user['id']]);
    $revenue = $stmt->fetch();

    json_out(200, [
        'success' => true,
        'revenue' => [
            'total' => (float) ($revenue['total_revenue'] ?? 0.00),
            'sales' => (int) ($revenue['total_sales'] ?? 0),
            'currency' => 'NGN'
        ]
    ]);
} else {
    fail(405, 'Method not allowed');
}
