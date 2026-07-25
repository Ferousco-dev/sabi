<?php
// api/teacher/messages.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_response(['success' => true, 'threads' => []]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    json_response(['success' => true]);
}
