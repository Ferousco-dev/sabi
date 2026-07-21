<?php
// public_html/api/healthcheck.php
// Use this to verify your live deployment.

require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/db.php';

$report = [
    'status' => 'ok',
    'php_version' => PHP_VERSION,
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    'database' => 'disconnected',
    'timestamp' => date('Y-m-d H:i:s T')
];

try {
    $pdo = db();
    $report['database'] = 'connected';
    $stmt = $pdo->query('SELECT 1');
    $report['db_check'] = 'query_success';
} catch (Exception $e) {
    $report['status'] = 'error';
    $report['error'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($report, JSON_PRETTY_PRINT);
