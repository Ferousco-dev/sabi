<?php
// public_html/api/auth/delete-account.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

$token = bearer_token();
if ($token === null) {
    fail(401, 'Missing bearer token.');
}

$claims = jwt_decode($token, $cfg['jwt_secret']);
if ($claims === null || !isset($claims['sub'], $claims['jti'])) {
    fail(401, 'Invalid or expired token.');
}

// 1. Revoke the token immediately
try {
    $stmt = db()->prepare(
        'INSERT IGNORE INTO revoked_tokens (jti, user_id, expires_at)
         VALUES (:jti, :uid, FROM_UNIXTIME(:exp))'
    );
    $stmt->execute([
        ':jti' => $claims['jti'],
        ':uid' => (int) $claims['sub'],
        ':exp' => (int) $claims['exp'],
    ]);
} catch (PDOException $e) {
    // Continue even if revocation fails; deletion is the priority
}

// 2. Delete the user (revoked_tokens rows for this user will CASCADE delete)
try {
    $stmt = db()->prepare('DELETE FROM users WHERE id = :id');
    $stmt->execute([':id' => (int) $claims['sub']]);

    if ($stmt->rowCount() === 0) {
        fail(404, 'User not found.');
    }
} catch (PDOException $e) {
    fail(500, 'Could not delete account.');
}

json_out(200, ['success' => true, 'message' => 'Account deleted successfully.']);
