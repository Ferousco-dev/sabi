<?php
// api/healthcheck.php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $db = db();
    $stmt = $db->query("SELECT 1");
    echo json_encode([
        'success' => true,
        'status' => 'ok',
        'database' => 'connected',
        'php_version' => PHP_VERSION,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
