<?php
// public_html/api/lib/cors.php
// Emits CORS headers for allowed origins and short-circuits OPTIONS preflight.

function apply_cors(): void
{
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');

    // Preflight: answer and stop before any app logic runs.
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
