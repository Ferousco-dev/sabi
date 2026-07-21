<?php
// public_html/api/student/sync.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['student']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Receive array of progress updates for sync
    $body = read_json_body();
    $updates = (array) ($body['updates'] ?? []);

    $processed = 0;
    foreach ($updates as $update) {
        $lessonId = (int) ($update['lesson_id'] ?? 0);
        $status   = (string) ($update['status'] ?? 'started');
        $xp       = (int) ($update['xp'] ?? 0);

        if (!$lessonId) continue;

        $stmt = db()->prepare(
            'INSERT INTO student_progress (student_id, lesson_id, status, xp_earned)
             VALUES (:sid, :lid, :status, :xp)
             ON DUPLICATE KEY UPDATE status = VALUES(status), xp_earned = xp_earned + VALUES(xp_earned)'
        );
        $stmt->execute([
            ':sid'    => $user['id'],
            ':lid'    => $lessonId,
            ':status' => $status,
            ':xp'     => $xp
        ]);
        $processed++;
    }

    json_out(200, ['success' => true, 'processed_updates' => $processed]);
} else {
    fail(405, 'Method not allowed');
}
