<?php
// public_html/api/lib/cors.php
// Emits CORS headers for allowed origins and short-circuits OPTIONS preflight.

function apply_cors(): void
{
    $cfg    = require __DIR__ . '/../config.php';
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $cfg['allowed_origins'], true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');                 // so caches don't mix origins
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');    // cache preflight for 1 day

    // Preflight: answer and stop before any app logic runs.
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
