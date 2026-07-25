<?php
// api/schools/reports/enrollment.php
require_once __DIR__ . '/../../lib/auth_middleware.php';
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../lib/response.php';

authenticate(['school_admin']);
$db = db();

$stmt = $db->query("
    SELECT c.name as class_name, s.name as section_name,
    COUNT(e.id) as student_count,
    (SELECT COUNT(*) FROM timetable tt WHERE tt.class_id = c.id) as teacher_count
    FROM classes c
    LEFT JOIN sections s ON s.class_id = c.id
    LEFT JOIN enrollments e ON e.class_id = c.id AND (e.section_id = s.id OR s.id IS NULL)
    GROUP BY c.id, s.id
");

json_response(['success' => true, 'report' => $stmt->fetchAll()]);
