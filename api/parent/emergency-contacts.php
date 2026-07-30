<?php
// api/parent/emergency-contacts.php
// Frontend contract (app/lib/api/parent.ts):
//   getEmergencyContacts() -> GET { success, contacts: [
//       { id, name, phone, relationship, is_primary }
//   ] }
//   addEmergencyContact({ name, phone, relationship, is_primary? })
//       -> POST { success, contact_id? }
//
// parent.ts sends no child id, so contacts are keyed to the authenticated
// parent's own user_id (emergency_contacts.user_id).
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

$user = authenticate(['parent']);
$db = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        "SELECT id, name, phone, relationship, is_primary
         FROM emergency_contacts
         WHERE user_id = ?
         ORDER BY is_primary DESC, id ASC"
    );
    $stmt->execute([$user['id']]);
    $contacts = $stmt->fetchAll();

    // Normalize is_primary to a boolean for the client.
    foreach ($contacts as &$c) {
        $c['is_primary'] = (bool) $c['is_primary'];
    }
    unset($c);

    json_response(['success' => true, 'contacts' => $contacts]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();

    if (empty($data['name']) || empty($data['phone']) || empty($data['relationship'])) {
        fail(400, 'Name, phone and relationship are required');
    }

    $is_primary = !empty($data['is_primary']) ? 1 : 0;

    $stmt = $db->prepare(
        "INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([$user['id'], $data['name'], $data['phone'], $data['relationship'], $is_primary]);

    json_response(['success' => true, 'contact_id' => (int) $db->lastInsertId()]);
}

fail(405, 'Method not allowed');
