<?php
// api/student/attendance-correction.php
// Frontend contract (app/lib/api/student.ts):
//   requestAttendanceCorrection({ date, reason }) -> POST { success }
//
// Inserts into `attendance_corrections`, which references an attendance row by
// attendance_id. The client only sends { date, reason }, so we resolve the
// authenticated student's attendance record for that date (school_id = 1
// convention) and attach the correction to it.
//
// GAP: attendance_corrections.new_status is a NOT NULL ENUM but the client does
// not supply a desired status. We default new_status to 'present' (the common
// "I was actually here" dispute). Adjust once the UI collects a target status.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['student']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();

    $date   = $data['date'] ?? null;
    $reason = $data['reason'] ?? null;
    if (empty($date) || empty($reason)) {
        fail(400, 'Date and reason are required');
    }

    // Find this student's attendance row for the given date.
    $stmt = $db->prepare(
        "SELECT id FROM attendance
         WHERE student_id = ? AND date = ? AND school_id = 1
         LIMIT 1"
    );
    $stmt->execute([$user['id'], $date]);
    $attendance = $stmt->fetch();

    if (!$attendance) {
        fail(404, 'No attendance record found for that date');
    }

    $new_status = $data['new_status'] ?? 'present';
    $allowed = ['present', 'absent', 'late', 'excused'];
    if (!in_array($new_status, $allowed, true)) {
        $new_status = 'present';
    }

    $stmt = $db->prepare(
        "INSERT INTO attendance_corrections (attendance_id, new_status, reason)
         VALUES (?, ?, ?)"
    );
    $stmt->execute([$attendance['id'], $new_status, $reason]);

    json_response(['success' => true]);
}

fail(405, 'Method not allowed');
