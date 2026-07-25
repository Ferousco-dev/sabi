<?php
// api/teacher/grading.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['teacher']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $assignment_id = $_GET['assignment_id'] ?? null;
    if (!$assignment_id) json_response(['success' => false, 'error' => 'Assignment ID required'], 400);

    $stmt = $db->prepare("SELECT s.*, u.name as student_name FROM submissions s JOIN users u ON u.id = s.student_id WHERE s.assignment_id = ?");
    $stmt->execute([$assignment_id]);
    json_response(['success' => true, 'submissions' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['submission_id']) || !isset($data['grade'])) json_response(['success' => false, 'error' => 'Submission ID and grade required'], 400);

    $stmt = $db->prepare("UPDATE submissions SET grade = ?, feedback = ? WHERE id = ?");
    $stmt->execute([$data['grade'], $data['feedback'] ?? null, $data['submission_id']]);

    json_response(['success' => true, 'message' => 'Grade updated']);
}
