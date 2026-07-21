<?php
// public_html/api/student/progress.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['student', 'parent']);

$studentId = $user['id'];
if ($user['role'] === 'parent') {
    $sid = (int) ($_GET['student_id'] ?? 0);
    // Verify child link
    $chk = db()->prepare('SELECT 1 FROM parent_child WHERE parent_id = :pid AND student_id = :sid');
    $chk->execute([':pid' => $user['id'], ':sid' => $sid]);
    if (!$chk->fetch()) fail(403, 'Forbidden: you are not linked to this student.');
    $studentId = $sid;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Summarize XP and completed lessons
    $stmt = db()->prepare(
        'SELECT SUM(xp_earned) as total_xp, COUNT(*) as lessons_completed
         FROM student_progress
         WHERE student_id = :sid AND status = "completed"'
    );
    $stmt->execute([':sid' => $studentId]);
    $summary = $stmt->fetch();

    json_out(200, [
        'success' => true,
        'progress' => [
            'xp' => (int) ($summary['total_xp'] ?? 0),
            'completed_lessons' => (int) ($summary['lessons_completed'] ?? 0),
            'badges' => [] // Placeholder for Phase 2
        ]
    ]);
} else {
    fail(405, 'Method not allowed');
}
