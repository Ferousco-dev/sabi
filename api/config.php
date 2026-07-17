<?php
// public_html/api/config.php
// Returns secrets. Never echoes anything. Access blocked by .htaccess.

return [
    'db' => [
        'host'    => 'localhost',
        'name'    => 'sabihub',
        'user'    => 'root',
        'pass'    => '',
        'charset' => 'utf8mb4',
    ],

    // 256-bit random secret. Generate once and keep it stable.
    'jwt_secret'   => '663d11615fa641e4be15f0394d692996871f72b79be74018b3b1bdf5ea51314c',
    'jwt_issuer'   => 'sabihub-api',
    'jwt_ttl'      => 60 * 60 * 24 * 7,          // 7 days, in seconds

    // Exact frontend origin(s) allowed by CORS
    'allowed_origins' => [
        'https://sabihub.ng',
        'https://www.sabihub.ng',
        'http://localhost:3000',                 // Next.js dev server
    ],
];
