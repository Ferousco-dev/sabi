<?php
// api/schools/import-teachers.php
// Bulk-create teachers from pasted CSV rows: name,email[,phone]
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';

authenticate(['school_admin']);
require_method('POST');
$db = db();

$data = read_json_body();
$csv = trim($data['csv_data'] ?? '');
if ($csv === '') fail(400, 'No CSV data provided');

$imported = 0;
$duplicates = 0;
$errors = [];
$default = password_hash('sabihub123', PASSWORD_DEFAULT);

$find = $db->prepare("SELECT id FROM users WHERE email = ?");
$insert = $db->prepare("INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, 'teacher', ?)");

$lines = preg_split('/\r\n|\r|\n/', $csv);
foreach ($lines as $i => $line) {
    $line = trim($line);
    if ($line === '') continue;
    $cols = array_map('trim', explode(',', $line));
    $name = $cols[0] ?? '';
    $email = $cols[1] ?? '';
    $phone = $cols[2] ?? '';
    $rowNo = $i + 1;

    if ($name === '' || $email === '') { $errors[] = "Row $rowNo: name and email required"; continue; }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = "Row $rowNo: invalid email '$email'"; continue; }

    $find->execute([$email]);
    if ($find->fetch()) { $duplicates++; continue; }

    try {
        $insert->execute([$name, $email, $default, $phone !== '' ? $phone : null]);
        $imported++;
    } catch (Throwable $e) {
        $errors[] = "Row $rowNo: could not import '$email'";
    }
}

json_response(['success' => true, 'imported' => $imported, 'duplicates' => $duplicates, 'errors' => $errors]);
