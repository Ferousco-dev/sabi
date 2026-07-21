<?php
// public_html/api/parent/alerts.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['parent', 'school_admin', 'teacher', 'student', 'creator']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare('SELECT * FROM alerts WHERE user_id = :uid');
    $stmt->execute([':uid' => $user['id']]);
    $alerts = $stmt->fetch() ?: [
        'sms_enabled' => false,
        'email_enabled' => true,
        'phone_number' => null
    ];
    json_out(200, ['success' => true, 'alerts' => $alerts]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();
    $sms   = (bool) ($body['sms_enabled']   ?? false);
    $email = (bool) ($body['email_enabled'] ?? true);
    $phone = trim((string) ($body['phone_number'] ?? ''));

    try {
        $stmt = db()->prepare(
            'INSERT INTO alerts (user_id, sms_enabled, email_enabled, phone_number)
             VALUES (:uid, :sms, :email, :phone)
             ON DUPLICATE KEY UPDATE sms_enabled = VALUES(sms_enabled), email_enabled = VALUES(email_enabled), phone_number = VALUES(phone_number)'
        );
        $stmt->execute([
            ':uid'   => $user['id'],
            ':sms'   => $sms,
            ':email' => $email,
            ':phone' => $phone ?: null
        ]);
        json_out(200, ['success' => true]);
    } catch (PDOException $e) {
        fail(500, 'Could not update alert preferences.');
    }
} else {
    fail(405, 'Method not allowed');
}
