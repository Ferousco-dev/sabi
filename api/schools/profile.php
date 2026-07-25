<?php
// api/schools/profile.php
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['school_admin']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT * FROM school_profiles WHERE admin_id = ?");
    $stmt->execute([$user['id']]);
    $school = $stmt->fetch();

    if (!$school) {
        // Create an empty profile if not exists
        $stmt = $db->prepare("INSERT INTO school_profiles (admin_id, name) VALUES (?, ?)");
        $stmt->execute([$user['id'], $user['name'] . "'s School"]);

        $stmt = $db->prepare("SELECT * FROM school_profiles WHERE admin_id = ?");
        $stmt->execute([$user['id']]);
        $school = $stmt->fetch();
    }

    json_response(['success' => true, 'school' => $school]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $allowed = ['name', 'short_name', 'email', 'phone', 'address', 'city', 'state', 'country', 'motto', 'founded_year', 'school_type'];
    $updates = [];
    $params = [];

    foreach ($allowed as $field) {
        if (isset($data[$field])) {
            $updates[] = "`$field` = ?";
            $params[] = $data[$field];
        }
    }

    if (empty($updates)) {
        json_response(['success' => false, 'error' => 'No fields to update'], 400);
    }

    $params[] = $user['id'];
    $sql = "UPDATE school_profiles SET " . implode(', ', $updates) . " WHERE admin_id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    json_response(['success' => true]);
}
