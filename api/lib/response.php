<?php
// public_html/api/lib/response.php
// JSON output + request-body helpers used by every endpoint.

function json_out(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/** Alias for json_out with default 200 status. */
function json_response(array $payload, int $status = 200): never
{
    json_out($status, $payload);
}

function fail(int $status, string $error): never
{
    json_out($status, ['success' => false, 'error' => $error]);
}

// Decode a JSON request body into an array. 400 on malformed JSON.
// Fallback to $_POST if JSON body is empty (to bypass some ModSecurity rules).
function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw !== '' && $raw !== false) {
        $data = json_decode($raw, true);
        if (is_array($data)) return $data;
    }

    // Fallback to standard POST data
    return $_POST;
}

// Only allow the given HTTP method (OPTIONS is handled earlier in cors.php).
function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        fail(405, "Method not allowed; use $method");
    }
}
