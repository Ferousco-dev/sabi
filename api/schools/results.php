<?php
// api/schools/results.php
// Admin review queue for teacher-submitted results: list, approve/reject, publish.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = $_GET['status'] ?? null;
    $sql = "
        SELECT r.id, r.student_id, u.name AS student_name, sub.name AS subject,
               r.score, r.grade, r.status, r.submitted_at, rev.name AS reviewed_by
        FROM results r
        JOIN users u        ON u.id = r.student_id
        JOIN subjects sub   ON sub.id = r.subject_id
        LEFT JOIN users rev ON rev.id = r.reviewed_by
    ";
    $params = [];
    if ($status) { $sql .= " WHERE r.status = ?"; $params[] = $status; }
    $sql .= " ORDER BY r.submitted_at DESC";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    json_response(['success' => true, 'results' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $action = $data['action'] ?? '';

    if ($action === 'publish') {
        $stmt = $db->prepare("UPDATE results SET status = 'published' WHERE status = 'approved'");
        $stmt->execute();
        json_response(['success' => true, 'published_count' => $stmt->rowCount()]);
    }

    if ($action === 'approve' || $action === 'reject') {
        $id = $data['id'] ?? null;
        if (!$id) fail(400, 'Result id required');
        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        $stmt = $db->prepare("UPDATE results SET status = ?, teacher_comment = COALESCE(?, teacher_comment), reviewed_by = ? WHERE id = ?");
        $stmt->execute([$newStatus, $data['comment'] ?? null, $user['id'], $id]);
        json_response(['success' => true]);
    }

    fail(400, 'Unknown action');
}

fail(405, 'Method not allowed');
