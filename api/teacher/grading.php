<?php
// public_html/api/teacher/grading.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/auth_middleware.php';

$user = require_auth();
require_role($user, ['teacher', 'school_admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List all submissions for a specific assignment
    $assignmentId = (int) ($_GET['assignment_id'] ?? 0);
    if (!$assignmentId) fail(400, 'Assignment ID is required.');

    $stmt = db()->prepare(
        'SELECT s.*, u.name as student_name
         FROM submissions s
         JOIN users u ON s.student_id = u.id
         WHERE s.assignment_id = :aid'
    );
    $stmt->execute([':aid' => $assignmentId]);
    json_out(200, ['success' => true, 'submissions' => $stmt->fetchAll()]);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Grade a submission
    $body = read_json_body();
    $submissionId = (int) ($body['submission_id'] ?? 0);
    $grade        = trim((string) ($body['grade'] ?? ''));
    $feedback     = trim((string) ($body['feedback'] ?? ''));

    if (!$submissionId || $grade === '') {
        fail(400, 'Submission ID and grade are required.');
    }

    try {
        $stmt = db()->prepare(
            'UPDATE submissions SET grade = :grade, feedback = :feedback
             WHERE id = :sid'
        );
        $stmt->execute([
            ':grade'    => $grade,
            ':feedback' => $feedback,
            ':sid'      => $submissionId
        ]);
        json_out(200, ['success' => true, 'message' => 'Submission graded successfully.']);
    } catch (PDOException $e) {
        fail(500, 'Could not grade submission.');
    }
} else {
    fail(405, 'Method not allowed');
}
