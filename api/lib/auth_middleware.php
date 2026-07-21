<?php
// public_html/api/lib/auth_middleware.php

/**
 * Ensures the request has a valid Bearer token and returns the user row.
 * Fails with 401 if token is missing, invalid, or revoked.
 */
function require_auth(): array
{
    require_once __DIR__ . '/jwt.php';
    require_once __DIR__ . '/../db.php';
    require_once __DIR__ . '/response.php';

    $cfg = require __DIR__ . '/../config.php';

    $token = bearer_token();
    if ($token === null) {
        fail(401, 'Missing bearer token.');
    }

    $claims = jwt_decode($token, $cfg['jwt_secret']);
    if ($claims === null || !isset($claims['sub'], $claims['jti'])) {
        fail(401, 'Invalid or expired token.');
    }

    // Check revocation
    $rev = db()->prepare('SELECT 1 FROM revoked_tokens WHERE jti = :jti LIMIT 1');
    $rev->execute([':jti' => $claims['jti']]);
    if ($rev->fetch()) {
        fail(401, 'Token has been revoked.');
    }

    // Load user
    $stmt = db()->prepare('SELECT id, name, email, role FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => (int) $claims['sub']]);
    $user = $stmt->fetch();

    if (!$user) {
        fail(401, 'User no longer exists.');
    }

    return $user;
}

/**
 * Ensures the authenticated user has one of the required roles.
 */
function require_role(array $user, array $allowedRoles): void
{
    if (!in_array($user['role'], $allowedRoles, true)) {
        fail(403, 'Forbidden: insufficient permissions.');
    }
}
