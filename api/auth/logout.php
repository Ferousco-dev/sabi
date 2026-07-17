<?php
// public_html/api/auth/logout.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

$token  = bearer_token();
$claims = $token ? jwt_decode($token, $cfg['jwt_secret']) : null;

// Valid token → add its jti to the revocation list (ignore duplicates).
if ($claims !== null && isset($claims['jti'], $claims['exp'])) {
    $stmt = db()->prepare(
        'INSERT IGNORE INTO revoked_tokens (jti, user_id, expires_at)
         VALUES (:jti, :uid, FROM_UNIXTIME(:exp))'
    );
    $stmt->execute([
        ':jti' => $claims['jti'],
        ':uid' => isset($claims['sub']) ? (int) $claims['sub'] : null,
        ':exp' => (int) $claims['exp'],
    ]);
}

// Always succeed — the frontend also deletes its localStorage copy.
json_out(200, ['success' => true]);
