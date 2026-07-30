<?php
// api/schools/holidays.php
// Academic-calendar holidays: list + create.
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // `is_recurring` is not a column in the schema; surfaced as a constant to
    // satisfy the frontend Holiday type.
    $stmt = $db->prepare("
        SELECT id, title, date, description, 0 AS is_recurring
        FROM holidays
        WHERE school_id = 1
        ORDER BY date ASC
    ");
    $stmt->execute();
    json_response(['success' => true, 'holidays' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    if (empty($data['title']) || empty($data['date'])) fail(400, 'Title and date required');

    $stmt = $db->prepare("
        INSERT INTO holidays (school_id, title, date, description)
        VALUES (1, ?, ?, ?)
    ");
    $stmt->execute([$data['title'], $data['date'], $data['description'] ?? null]);
    json_response(['success' => true, 'holiday_id' => $db->lastInsertId()]);
}

fail(405, 'Method not allowed');
