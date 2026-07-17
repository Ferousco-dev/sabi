<?php
// public_html/api/config.php
// Returns secrets. Never echoes anything. Access blocked by .htaccess.

return [
    'db' => [
        'host'    => 'localhost',
        'name'    => 'cpaneluser_sabihub',       // prefixed DB name
        'user'    => 'cpaneluser_sabihub_app',   // prefixed DB user
        'pass'    => 'CHANGE_ME_strong_db_password',
        'charset' => 'utf8mb4',
    ],

    // 256-bit random secret. Generate once and keep it stable.
    'jwt_secret'   => 'CHANGE_ME_64_hex_chars_from_random_bytes_32',
    'jwt_issuer'   => 'sabihub-api',
    'jwt_ttl'      => 60 * 60 * 24 * 7,          // 7 days, in seconds

    // Exact frontend origin(s) allowed by CORS
    'allowed_origins' => [
        'https://sabihub.ng',
        'https://www.sabihub.ng',
        'http://localhost:3000',                 // Next.js dev server
    ],
];
