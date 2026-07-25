<?php
// api/schools/classes.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

try {
    $user = authenticate(['school_admin']);
    $db = db();

    // Get school_id
    $stmt = $db->prepare("SELECT id FROM school_profiles WHERE admin_id = ?");
    $stmt->execute([$user['id']]);
    $school = $stmt->fetch();
    if (!$school) json_response(['success' => false, 'error' => 'School profile not found'], 404);
    $school_id = $school['id'];

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->prepare("
            SELECT c.*,
            (SELECT COUNT(*) FROM sections s WHERE s.class_id = c.id) as section_count,
            (SELECT COUNT(*) FROM enrollments e WHERE e.class_id = c.id) as student_count
            FROM classes c
            WHERE c.school_id = ?
        ");
        $stmt->execute([$school_id]);
        json_response(['success' => true, 'classes' => $stmt->fetchAll()]);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) json_response(['success' => false, 'error' => 'Class name required'], 400);

        $stmt = $db->prepare("INSERT INTO classes (school_id, name) VALUES (?, ?)");
        $stmt->execute([$school_id, $data['name']]);
        json_response(['success' => true, 'class_id' => $db->lastInsertId()]);
    }
} catch (Exception $e) {
    json_response(['success' => false, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
}
