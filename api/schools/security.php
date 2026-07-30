<?php
// api/schools/security.php
// Admin security: settings + logged-in devices/sessions.
//
// Frontend contract (app/lib/api/schools.ts):
//   updateSecuritySettings({ two_factor_enabled?, password_policy?, session_timeout? })
//     -> POST { success }
// The UI also renders logged-in devices/sessions, so GET returns both the
// current settings and a recent-login list derived from `login_history`.
//
// GAP: there is no security-settings table in database_v2.sql, so settings are
// returned as defaults and POST updates are accepted as a no-op success. The
// intended table is drafted in api/_migrations/school_security_settings.sql.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

$defaults = [
    'two_factor_enabled' => false,
    'password_policy'    => 'standard',
    'session_timeout'    => 60,
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Recent logins across users (device/ip/time) — treated as active sessions.
    $stmt = $db->prepare(
        "SELECT lh.id, u.name AS user_name, lh.ip_address, lh.user_agent, lh.login_at
         FROM login_history lh
         JOIN users u ON u.id = lh.user_id
         ORDER BY lh.login_at DESC
         LIMIT 50"
    );
    $stmt->execute();
    $sessions = $stmt->fetchAll();

    json_response([
        'success'  => true,
        'settings' => $defaults,
        'sessions' => $sessions,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();

    // Revoke a session/device if the client sends a token id (jti).
    if (($data['action'] ?? null) === 'revoke_session' || isset($data['jti'])) {
        $jti = $data['jti'] ?? null;
        if ($jti) {
            // Insert a revocation record; expires_at is required, use a far value.
            $stmt = $db->prepare(
                "INSERT IGNORE INTO revoked_tokens (jti, user_id, expires_at)
                 VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))"
            );
            $stmt->execute([$jti, $user['id']]);
            json_response(['success' => true]);
        }
        // Best-effort: no jti available on the client to revoke a specific token.
        json_response(['success' => true, 'note' => 'No session token supplied; nothing revoked.']);
    }

    // Settings update — accepted as a no-op until school_security_settings exists.
    $allowed = ['two_factor_enabled', 'password_policy', 'session_timeout'];
    $received = array_intersect_key($data, array_flip($allowed));
    if (empty($received)) {
        fail(400, 'No settings supplied');
    }
    json_response(['success' => true]);
}

fail(405, 'Method not allowed');
