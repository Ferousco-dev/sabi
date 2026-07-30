<?php
// api/schools/transfers.php
// Student promotion/transfer: list students with their current class, and
// move a student into a new class (promote to next level or repeat) by
// updating/inserting their enrollment for the current academic session.
//
// GET  -> { success, students: [{ id, name, email, class_name, class_id }] }
// POST { action:'transfer', student_id, new_class_id, new_section_id? } -> { success }
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Latest enrollment per student gives their current class/section.
    $stmt = $db->prepare("
        SELECT u.id, u.name, u.email,
               c.id   AS class_id,
               c.name AS class_name
        FROM users u
        LEFT JOIN enrollments e ON e.id = (
            SELECT e2.id FROM enrollments e2
            WHERE e2.student_id = u.id
            ORDER BY e2.enrolled_at DESC, e2.id DESC
            LIMIT 1
        )
        LEFT JOIN classes c ON c.id = e.class_id
        WHERE u.role = 'student'
        ORDER BY u.name ASC
    ");
    $stmt->execute();
    json_response(['success' => true, 'students' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $action = $data['action'] ?? 'transfer';

    if ($action !== 'transfer') fail(400, 'Unknown action');

    $studentId = $data['student_id'] ?? null;
    $newClassId = $data['new_class_id'] ?? null;
    $newSectionId = $data['new_section_id'] ?? null;
    if (!$studentId || !$newClassId) fail(400, 'student_id and new_class_id required');

    // Resolve the current academic session for the school.
    $sess = $db->prepare("SELECT id FROM academic_sessions WHERE school_id = 1 AND is_current = 1 LIMIT 1");
    $sess->execute();
    $session = $sess->fetch();
    if (!$session) fail(409, 'No current academic session set');
    $sessionId = $session['id'];

    // Update the student's enrollment for the current session if it exists,
    // otherwise create a new enrollment row.
    $find = $db->prepare("SELECT id FROM enrollments WHERE student_id = ? AND academic_session_id = ? LIMIT 1");
    $find->execute([$studentId, $sessionId]);
    $existing = $find->fetch();

    if ($existing) {
        $stmt = $db->prepare("UPDATE enrollments SET class_id = ?, section_id = ? WHERE id = ?");
        $stmt->execute([$newClassId, $newSectionId, $existing['id']]);
    } else {
        $stmt = $db->prepare("
            INSERT INTO enrollments (student_id, class_id, section_id, academic_session_id)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$studentId, $newClassId, $newSectionId, $sessionId]);
    }

    json_response(['success' => true]);
}

fail(405, 'Method not allowed');
