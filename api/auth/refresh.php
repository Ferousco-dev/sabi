<?php
// public_html/api/auth/refresh.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

// Note: This is a placeholder for a full refresh token flow.
// Currently, it just exchanges a valid, non-expired token for a fresh one.
$token = bearer_token();
if ($token === null) {
    fail(401, 'Missing bearer token.');
}

$claims = jwt_decode($token, $cfg['jwt_secret']);
if ($claims === null || !isset($claims['sub'], $claims['jti'])) {
    fail(401, 'Invalid or expired token.');
}

// Check if revoked
$rev = db()->prepare('SELECT 1 FROM revoked_tokens WHERE jti = :jti LIMIT 1');
$rev->execute([':jti' => $claims['jti']]);
if ($rev->fetch()) {
    fail(401, 'Token has been revoked.');
}

// Issue a new token
$newToken = jwt_encode(
    ['sub' => $claims['sub'], 'role' => $claims['role']],
    $cfg['jwt_secret'], $cfg['jwt_issuer'], $cfg['jwt_ttl']
);

json_out(200, ['success' => true, 'token' => $newToken]);
