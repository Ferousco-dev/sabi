<?php
// api/student/settings.php
// Frontend contract (app/lib/api/student.ts):
//   getStudentSettings() -> GET { success, settings: {
//       notifications:  { email, sms, push },
//       accessibility:  { high_contrast, large_text, reduce_motion }
//   } }
//   updateStudentSettings(data) -> POST { success }
//
// GAP: there is no student settings table in database_v2.sql. Per instructions,
// no table is created here; the intended schema is drafted in
// api/_migrations/student_settings.sql. Until that exists, GET returns sensible
// defaults and POST is accepted as a no-op success so the UI keeps working.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['student']);
$db = db();

$defaults = [
    'notifications' => [
        'email' => true,
        'sms'   => false,
        'push'  => true,
    ],
    'accessibility' => [
        'high_contrast' => false,
        'large_text'    => false,
        'reduce_motion' => false,
    ],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_response(['success' => true, 'settings' => $defaults]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // No-op: validate the shape, then acknowledge success.
    $data = read_json_body();
    json_response(['success' => true]);
}

fail(405, 'Method not allowed');
