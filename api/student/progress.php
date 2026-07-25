<?php
// api/student/progress.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['student', 'parent']);
$db = db();

$student_id = $user['id'];
if ($user['role'] === 'parent' && isset($_GET['student_id'])) {
    // Verify relationship
    $stmt = $db->prepare("SELECT id FROM parent_child WHERE parent_id = ? AND student_id = ?");
    $stmt->execute([$user['id'], $_GET['student_id']]);
    if (!$stmt->fetch()) json_response(['success' => false, 'error' => 'Unauthorized access to student data'], 403);
    $student_id = $_GET['student_id'];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT SUM(xp_earned) as total_xp, COUNT(CASE WHEN status='completed' THEN 1 END) as completed_lessons FROM student_progress WHERE student_id = ?");
    $stmt->execute([$student_id]);
    $stats = $stmt->fetch();

    json_response([
        'success' => true,
        'progress' => [
            'xp' => (int)($stats['total_xp'] ?? 0),
            'completed_lessons' => (int)($stats['completed_lessons'] ?? 0),
            'badges' => ['Scholar', 'Fast Learner'], // Mock badges for now
        ]
    ]);
}
