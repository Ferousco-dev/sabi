<?php
// api/creator/revenue.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['creator']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Simplified revenue calculation based on enrollments for creator's courses
    $stmt = $db->prepare("
        SELECT SUM(c.price) as total, COUNT(e.id) as sales, 'NGN' as currency
        FROM courses c
        JOIN enrollments e ON e.course_id = c.id
        WHERE c.creator_id = ?
    ");
    $stmt->execute([$user['id']]);
    $revenue = $stmt->fetch();

    json_response([
        'success' => true,
        'revenue' => [
            'total' => (float)($revenue['total'] ?? 0),
            'sales' => (int)($revenue['sales'] ?? 0),
            'currency' => $revenue['currency'] ?? 'NGN'
        ]
    ]);
}
