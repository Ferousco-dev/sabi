# SabiHub Backend Implementation Guide

**Audience:** the PHP developer building the SabiHub API.
**Stack:** PHP 8.x + MySQL/MariaDB on cPanel shared hosting.
**Client:** the SabiHub Next.js frontend, calling this API over `fetch` with JSON.

This guide is the implementation companion to the **shared API contract**. The contract
is the single source of truth for request/response shapes — this document shows you how
to build a PHP backend that satisfies it exactly, on typical cPanel shared hosting, with
**no Composer dependency required**.

> **Contract note.** The frontend signup form currently collects `firstName` + `lastName`
> and a short role key (`school`, `teacher`, …). The API contract normalises this to a
> single `name` field and the full role enum (`school_admin`, `teacher`, …). Build the
> backend to the contract below; the frontend team joins the name fields and maps the role
> before calling the API. **Do not build to the current form fields.**

---

## Table of contents

1. [Overview & architecture](#1-overview--architecture)
2. [cPanel setup](#2-cpanel-setup)
3. [API folder / file structure](#3-api-folder--file-structure)
4. [Database schema](#4-database-schema)
5. [Endpoint implementations](#5-endpoint-implementations)
6. [Security & compliance (incl. NDPR)](#6-security--compliance)
7. [CORS](#7-cors)
8. [Environment / config](#8-environment--config)
9. [Testing with curl](#9-testing-with-curl)
10. [Roadmap — next endpoints](#10-roadmap--next-endpoints)

---

## 1. Overview & architecture

SabiHub is a two-tier system: a **Next.js frontend** (the marketing site + auth pages +
future dashboards) and a **stateless PHP/MySQL JSON API**. They communicate only over
HTTPS with JSON payloads. Authentication is a **JWT bearer token** — the API issues a
signed token on login/signup, the frontend stores it in `localStorage` under
`sabihub_token`, and sends it back on every protected request as
`Authorization: Bearer <token>`.

Because JWTs are self-contained, the API needs no server-side session storage to *verify*
a request — it just validates the signature and expiry. The one place we keep server
state is a small `revoked_tokens` table so that **logout** can actually invalidate a token
before it naturally expires.

### Request flow

```
 ┌──────────────────────┐         HTTPS / JSON          ┌───────────────────────────┐
 │   Next.js frontend   │  ───────────────────────────▶ │   PHP API (public_html/api)│
 │  (browser, fetch)    │   Authorization: Bearer <jwt> │                            │
 │                      │ ◀─────────────────────────── │   1. cors.php  (headers)   │
 │  localStorage:       │        JSON + status code     │   2. parse + validate      │
 │   "sabihub_token"    │                               │   3. jwt.php verify/issue  │
 └──────────────────────┘                               │   4. db.php  (PDO)         │
                                                         │        │                   │
                                                         │        ▼                   │
                                                         │   ┌──────────────┐         │
                                                         │   │  MySQL /      │         │
                                                         │   │  MariaDB      │         │
                                                         │   │  users, …     │         │
                                                         │   └──────────────┘         │
                                                         └───────────────────────────┘
```

A typical protected request (`GET /api/auth/me.php`):

```
Browser                       PHP                              MySQL
   │  GET me.php + Bearer jwt   │                                │
   │ ─────────────────────────▶ │  cors headers                  │
   │                            │  extract + verify jwt (HS256)  │
   │                            │  check jti not in revoked list │──▶ SELECT revoked_tokens
   │                            │  load user by id (sub claim)   │──▶ SELECT users
   │  200 {success,user}        │                                │
   │ ◀───────────────────────── │                                │
```

---

## 2. cPanel setup

### 2.1 Where the files live

Put the API under your web root in its own folder:

```
public_html/
├── api/                     ← the PHP API (this guide)
│   ├── config.php           ← secrets (DB creds, JWT secret) — protected by .htaccess
│   ├── db.php
│   ├── .htaccess
│   ├── lib/
│   └── auth/
└── (the Next.js app is deployed separately — see §8)
```

If your Next.js app is hosted on the same cPanel domain, the API sits at
`https://yourdomain.com/api/...`. If the frontend is on Vercel/Netlify and the API on
cPanel, the API is at `https://api.yourdomain.com/...` (a subdomain whose document root is
`public_html/api`). Either way the frontend points `NEXT_PUBLIC_API_URL` at the base — see §8.

> **Keeping secrets out of the webroot.** True "outside webroot" isn't always possible on
> shared hosting, so we use two defences: (a) `config.php` returns an array rather than
> emitting output, so even if served raw it prints nothing; and (b) the `.htaccess` in §2.5
> **denies direct HTTP access** to `config.php`. If your plan lets you write above
> `public_html` (e.g. `/home/cpaneluser/sabihub_secrets/config.php`), put it there and
> `require` it by absolute path — that is strictly better.

### 2.2 Create the MySQL database + user (cPanel → "MySQL Databases")

1. **Create database** — name it e.g. `sabihub`. cPanel stores it as `cpaneluser_sabihub`.
2. **Create user** — e.g. `sabihub_app` with a strong generated password. cPanel stores it
   as `cpaneluser_sabihub_app`.
3. **Add user to database** and grant **ALL PRIVILEGES** (this app needs
   SELECT/INSERT/UPDATE/DELETE; ALL is fine for a dedicated app user).
4. Note the three exact values — the **prefixed** DB name, the **prefixed** user name, and
   the password. These go into `config.php`. The host is almost always `localhost` on
   cPanel.

### 2.3 Import the schema via phpMyAdmin

1. cPanel → **phpMyAdmin** → select `cpaneluser_sabihub` in the left sidebar.
2. **Import** tab → choose `docs/database.sql` (from this repo) → **Go**.
3. Confirm the `users`, `revoked_tokens`, and `login_attempts` tables appear.

### 2.4 Set the PHP version

cPanel → **Select PHP Version** (or "MultiPHP Manager") → choose **PHP 8.1+**. Ensure these
extensions are enabled (they usually are by default): `pdo_mysql`, `openssl`, `mbstring`,
`json`, `hash`, `filter`. No Composer packages are required.

### 2.5 Sample `.htaccess`

Place this at `public_html/api/.htaccess`. It forces HTTPS, blocks direct access to
`config.php` and anything under `lib/`, and enables "pretty" routing so the frontend can
call `/api/auth/login` **or** `/api/auth/login.php` (the contract uses the `.php` form;
pretty routing is a convenience/future-proofing).

```apacheconf
# public_html/api/.htaccess

RewriteEngine On

# --- Force HTTPS ---------------------------------------------------------
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# --- Block direct access to secrets & internal libs ----------------------
<FilesMatch "^config\.php$">
    Require all denied
</FilesMatch>
RewriteRule ^lib/ - [F,L]

# --- Pretty routing: /auth/login -> /auth/login.php ----------------------
# Only rewrites when the .php file exists and the pretty path has no extension.
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.php -f
RewriteRule ^(.+)$ $1.php [L]

# --- Never list directories ----------------------------------------------
Options -Indexes
```

> The frontend contract calls the **`.php`** URLs directly, so pretty routing is optional.
> Keep it — it costs nothing and lets you drop the extension later without a frontend change.

---

## 3. API folder / file structure

```
public_html/api/
├── config.php            # returns an array of secrets (DB creds, JWT secret, allowed origin)
├── db.php                # builds a single shared PDO connection
├── .htaccess             # from §2.5
├── lib/
│   ├── cors.php          # sends CORS headers + handles OPTIONS preflight
│   ├── response.php      # json_out(), read_json_body() helpers
│   └── jwt.php           # dependency-free HS256 encode/decode
└── auth/
    ├── signup.php        # POST  — create account, return token+user
    ├── login.php         # POST  — verify creds, return token+user
    ├── logout.php        # POST  — revoke current token (Bearer)
    └── me.php            # GET   — return current user (Bearer)
```

Each endpoint file is small: it includes the four shared files, does its one job, and exits.
The shared files below are written once and reused everywhere.

### 3.1 `config.php`

```php
<?php
// public_html/api/config.php
// Returns secrets. Never echoes anything. Access blocked by .htaccess.
// Replace every placeholder with the real cPanel values from §2.2.

return [
    'db' => [
        'host'    => 'localhost',
        'name'    => 'cpaneluser_sabihub',       // prefixed DB name
        'user'    => 'cpaneluser_sabihub_app',   // prefixed DB user
        'pass'    => 'CHANGE_ME_strong_db_password',
        'charset' => 'utf8mb4',
    ],

    // 256-bit random secret. Generate once and keep it stable — rotating it
    // invalidates every issued token. Generate with:
    //   php -r "echo bin2hex(random_bytes(32));"
    'jwt_secret'   => 'CHANGE_ME_64_hex_chars_from_random_bytes_32',
    'jwt_issuer'   => 'sabihub-api',
    'jwt_ttl'      => 60 * 60 * 24 * 7,          // 7 days, in seconds

    // Exact frontend origin(s) allowed by CORS (scheme + host + optional port,
    // NO trailing slash). Add every origin the app is served from.
    'allowed_origins' => [
        'https://sabihub.ng',
        'https://www.sabihub.ng',
        'http://localhost:3000',                 // Next.js dev server
    ],
];
```

### 3.2 `db.php`

```php
<?php
// public_html/api/db.php
// One PDO connection, reused. Prepared statements are emulated OFF so MySQL
// does real server-side prepares (stronger against SQL injection edge cases).

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $cfg = require __DIR__ . '/config.php';
    $d   = $cfg['db'];
    $dsn = "mysql:host={$d['host']};dbname={$d['name']};charset={$d['charset']}";

    try {
        $pdo = new PDO($dsn, $d['user'], $d['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        // Never leak DB internals to the client.
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Database unavailable']);
        exit;
    }

    return $pdo;
}
```

### 3.3 `lib/response.php`

```php
<?php
// public_html/api/lib/response.php
// JSON output + request-body helpers used by every endpoint.

function json_out(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $error): never
{
    json_out($status, ['success' => false, 'error' => $error]);
}

// Decode a JSON request body into an array. 400 on malformed JSON.
function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail(400, 'Invalid JSON body');
    }
    return $data;
}

// Only allow the given HTTP method (OPTIONS is handled earlier in cors.php).
function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        fail(405, "Method not allowed; use $method");
    }
}
```

### 3.4 `lib/jwt.php` — dependency-free HS256

This is a small, self-contained HS256 implementation using `hash_hmac` and base64url. It
needs **no Composer package**, which matters on locked-down shared hosting. See §5.6 for the
`firebase/php-jwt` alternative if you *can* run Composer.

```php
<?php
// public_html/api/lib/jwt.php
// Minimal JWT (HS256) encode/decode. No external dependencies.

function base64url_encode(string $bin): string
{
    return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}

function base64url_decode(string $txt): string
{
    return base64_decode(strtr($txt, '-_', '+/')) ?: '';
}

// Create a signed JWT. $claims is merged with iss/iat/exp/jti.
function jwt_encode(array $claims, string $secret, string $issuer, int $ttlSeconds): string
{
    $now    = time();
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];

    $payload = array_merge($claims, [
        'iss' => $issuer,
        'iat' => $now,
        'exp' => $now + $ttlSeconds,
        'jti' => bin2hex(random_bytes(16)),   // unique id, used for revocation
    ]);

    $segments = [
        base64url_encode(json_encode($header,  JSON_UNESCAPED_SLASHES)),
        base64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES)),
    ];
    $signingInput = implode('.', $segments);
    $signature    = hash_hmac('sha256', $signingInput, $secret, true);
    $segments[]   = base64url_encode($signature);

    return implode('.', $segments);
}

// Verify signature + expiry. Returns the claims array, or null if invalid.
function jwt_decode(string $jwt, string $secret): ?array
{
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return null;
    }
    [$h64, $p64, $s64] = $parts;

    $header = json_decode(base64url_decode($h64), true);
    if (!is_array($header) || ($header['alg'] ?? '') !== 'HS256') {
        return null;                           // reject "alg: none" and RS256 confusion
    }

    $expected = hash_hmac('sha256', "$h64.$p64", $secret, true);
    $given    = base64url_decode($s64);
    if (!hash_equals($expected, $given)) {     // constant-time compare
        return null;
    }

    $payload = json_decode(base64url_decode($p64), true);
    if (!is_array($payload)) {
        return null;
    }
    if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
        return null;                           // expired
    }

    return $payload;
}

// Pull the raw token from the Authorization: Bearer <token> header.
function bearer_token(): ?string
{
    $hdr = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']   // some Apache setups
        ?? '';

    if (preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) {
        return $m[1];
    }
    return null;
}
```

> **Apache gotcha:** on some cPanel/Apache configs the `Authorization` header is stripped
> before PHP sees it. If `bearer_token()` returns `null` despite a valid header, add this to
> the API `.htaccess`:
> ```apacheconf
> SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
> # or, for CGI/FastCGI:
> RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
> ```

### 3.5 `lib/cors.php`

Full details in §7. It runs first in every endpoint.

```php
<?php
// public_html/api/lib/cors.php
// Emits CORS headers for allowed origins and short-circuits OPTIONS preflight.

function apply_cors(): void
{
    $cfg    = require __DIR__ . '/../config.php';
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $cfg['allowed_origins'], true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');                 // so caches don't mix origins
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');    // cache preflight for 1 day

    // Preflight: answer and stop before any app logic runs.
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
```

---

## 4. Database schema

The full, import-ready schema is in [`docs/database.sql`](./database.sql). Import it as
described in §2.3. Summary:

- **`users`** — one row per account.
  `id` (PK), `name`, `email` (**UNIQUE**), `password_hash` (bcrypt), `role`
  (`ENUM('school_admin','teacher','student','parent','creator')`), `created_at`,
  `updated_at`. Indexes: unique on `email`, secondary on `role`.
- **`revoked_tokens`** — supports real logout. Stores the token's `jti` (UNIQUE) and its
  `expires_at`, so `me.php`/`logout.php` can reject a revoked token and a cron can prune
  expired rows. *Drop this table if you decide logout is client-side only — see §5.4.*
- **`login_attempts`** (optional) — backing store for the rate-limiting suggestion in §6.

The `role` ENUM values are the **exact** strings from the API contract. The frontend UI
labels (Schools/Teachers/Students/Parents/Creators) map to these values; the API only ever
sends and receives the enum values.

---

## 5. Endpoint implementations

Every endpoint follows the same skeleton:

```php
require __DIR__ . '/../lib/cors.php';     apply_cors();      // CORS + OPTIONS
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');                    // or 'GET'
// ... endpoint logic ...
```

A shared helper keeps the user shape identical across responses:

```php
// Shape a users row into the public user object the contract returns.
// NOTE: password_hash is never included.
function public_user(array $row): array
{
    return [
        'id'    => (int) $row['id'],
        'name'  => $row['name'],
        'email' => $row['email'],
        'role'  => $row['role'],
    ];
}
```

### 5.1 `POST /auth/signup.php`

**Request:** `{ name, email, password, role }`
**201:** `{ success:true, token, user:{id,name,email,role} }`
**409** email exists · **422** validation.

```php
<?php
// public_html/api/auth/signup.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

const ROLES = ['school_admin', 'teacher', 'student', 'parent', 'creator'];

$body = read_json_body();

$name     = trim((string) ($body['name']     ?? ''));
$email    = trim((string) ($body['email']    ?? ''));
$password = (string)       ($body['password'] ?? '');
$role     = (string)       ($body['role']     ?? '');

// --- Validation (422) ----------------------------------------------------
if ($name === '' || mb_strlen($name) > 120) {
    fail(422, 'Name is required (max 120 characters).');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    fail(422, 'A valid email address is required.');
}
if (strlen($password) < 8) {
    fail(422, 'Password must be at least 8 characters.');
}
if (!in_array($role, ROLES, true)) {
    fail(422, 'Invalid role.');
}

$email = mb_strtolower($email);               // normalise so uniqueness is case-insensitive
$hash  = password_hash($password, PASSWORD_BCRYPT);

// --- Insert (409 on duplicate email) -------------------------------------
try {
    $stmt = db()->prepare(
        'INSERT INTO users (name, email, password_hash, role)
         VALUES (:name, :email, :hash, :role)'
    );
    $stmt->execute([
        ':name'  => $name,
        ':email' => $email,
        ':hash'  => $hash,
        ':role'  => $role,
    ]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {          // integrity constraint = duplicate email
        fail(409, 'An account with this email already exists.');
    }
    fail(500, 'Could not create account.');
}

$id  = (int) db()->lastInsertId();
$row = ['id' => $id, 'name' => $name, 'email' => $email, 'role' => $role];

// --- Issue token ---------------------------------------------------------
$token = jwt_encode(
    ['sub' => $id, 'role' => $role],
    $cfg['jwt_secret'], $cfg['jwt_issuer'], $cfg['jwt_ttl']
);

json_out(201, ['success' => true, 'token' => $token, 'user' => public_user($row)]);
```

### 5.2 `POST /auth/login.php`

**Request:** `{ email, password }`
**200:** `{ success:true, token, user }`
**401:** `{ success:false, error:"Invalid email or password" }`

Note the **identical** error message and 401 for both "no such email" and "wrong password"
— never reveal which one failed (user-enumeration defence). `password_verify` still runs on
a dummy hash when the user is missing, to keep timing uniform.

```php
<?php
// public_html/api/auth/login.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

$body     = read_json_body();
$email    = mb_strtolower(trim((string) ($body['email'] ?? '')));
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
    fail(401, 'Invalid email or password');
}

$stmt = db()->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$row = $stmt->fetch();

// Dummy hash keeps response time similar whether or not the email exists.
$hash = $row['password_hash']
    ?? '$2y$10$usesomesillystringforsalttokeepthetimingconstant.'; // any valid bcrypt hash

if (!$row || !password_verify($password, $hash)) {
    fail(401, 'Invalid email or password');
}

// Opportunistically upgrade the stored hash if PHP's default cost has changed.
if (password_needs_rehash($row['password_hash'], PASSWORD_BCRYPT)) {
    $up = db()->prepare('UPDATE users SET password_hash = :h WHERE id = :id');
    $up->execute([':h' => password_hash($password, PASSWORD_BCRYPT), ':id' => $row['id']]);
}

$token = jwt_encode(
    ['sub' => (int) $row['id'], 'role' => $row['role']],
    $cfg['jwt_secret'], $cfg['jwt_issuer'], $cfg['jwt_ttl']
);

json_out(200, ['success' => true, 'token' => $token, 'user' => public_user($row)]);
```

### 5.3 `GET /auth/me.php`

Header `Authorization: Bearer <token>`.
**200:** `{ success:true, user }` · **401** on missing/invalid/revoked token.

```php
<?php
// public_html/api/auth/me.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('GET');

$token = bearer_token();
if ($token === null) {
    fail(401, 'Missing bearer token.');
}

$claims = jwt_decode($token, $cfg['jwt_secret']);
if ($claims === null || !isset($claims['sub'], $claims['jti'])) {
    fail(401, 'Invalid or expired token.');
}

// Reject tokens that were revoked by logout.
$rev = db()->prepare('SELECT 1 FROM revoked_tokens WHERE jti = :jti LIMIT 1');
$rev->execute([':jti' => $claims['jti']]);
if ($rev->fetch()) {
    fail(401, 'Token has been revoked.');
}

$stmt = db()->prepare('SELECT id, name, email, role FROM users WHERE id = :id LIMIT 1');
$stmt->execute([':id' => (int) $claims['sub']]);
$row = $stmt->fetch();
if (!$row) {
    fail(401, 'User no longer exists.');       // account deleted (e.g. NDPR erasure)
}

json_out(200, ['success' => true, 'user' => public_user($row)]);
```

### 5.4 `POST /auth/logout.php`

Header `Authorization: Bearer <token>`. Records the token's `jti` in `revoked_tokens` so it
can no longer be used, then returns `{ success:true }`. It is **idempotent** — logging out
with an already-revoked or already-expired token still returns success (the goal state is
"this token is dead," which it is).

```php
<?php
// public_html/api/auth/logout.php
require __DIR__ . '/../lib/cors.php';     apply_cors();
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/jwt.php';
require __DIR__ . '/../db.php';
$cfg = require __DIR__ . '/../config.php';
require_method('POST');

$token  = bearer_token();
$claims = $token ? jwt_decode($token, $cfg['jwt_secret']) : null;

// Valid token → add its jti to the revocation list (ignore duplicates).
if ($claims !== null && isset($claims['jti'], $claims['exp'])) {
    $stmt = db()->prepare(
        'INSERT IGNORE INTO revoked_tokens (jti, user_id, expires_at)
         VALUES (:jti, :uid, FROM_UNIXTIME(:exp))'
    );
    $stmt->execute([
        ':jti' => $claims['jti'],
        ':uid' => isset($claims['sub']) ? (int) $claims['sub'] : null,
        ':exp' => (int) $claims['exp'],
    ]);
}

// Always succeed — the frontend also deletes its localStorage copy.
json_out(200, ['success' => true]);
```

> **Simpler alternative (no revocation table).** If you don't need instant invalidation, you
> can skip `revoked_tokens` entirely: `logout.php` just returns `{success:true}` and the
> frontend deletes `sabihub_token`. The token then remains technically valid until `exp`.
> This is a common, acceptable trade-off for short-lived tokens — but for a product handling
> **minors' data**, real revocation (as shown above) is the safer default. Keep the table.

### 5.5 Wiring the frontend to these responses

The frontend already stores the token under `localStorage["sabihub_token"]` and sends it as
`Authorization: Bearer <token>`. Your job is only to match the JSON shapes and status codes
above. The frontend distinguishes cases by HTTP status (`409` → "email taken", `422` →
show `error`, `401` → "invalid credentials") plus the `error` string.

### 5.6 Composer alternative: `firebase/php-jwt`

If your host allows Composer, you can replace `lib/jwt.php` with the well-audited
`firebase/php-jwt`:

```bash
cd public_html/api && composer require firebase/php-jwt
```

```php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require __DIR__ . '/vendor/autoload.php';

// encode
$token = JWT::encode($payload, $cfg['jwt_secret'], 'HS256');
// decode (throws on invalid/expired)
$claims = (array) JWT::decode($token, new Key($cfg['jwt_secret'], 'HS256'));
```

Keep the **same claims** (`sub`, `role`, `iss`, `iat`, `exp`, `jti`) so the rest of the code
and the `revoked_tokens` logic are unchanged. The bundled `lib/jwt.php` exists so you are
**not blocked** on hosts without Composer.

---

## 6. Security & compliance

### 6.1 Passwords
- Hash with **`password_hash($pw, PASSWORD_BCRYPT)`** (bcrypt). Never store or log plaintext.
- Verify with **`password_verify()`**; re-hash on login via `password_needs_rehash()` (§5.2).
- Enforce a minimum length server-side (≥ 8) regardless of client validation.

### 6.2 SQL injection
- **Every** query uses PDO **prepared statements** with bound parameters (as shown). Never
  interpolate user input into SQL. `PDO::ATTR_EMULATE_PREPARES => false` (in `db.php`) makes
  MySQL prepare server-side.

### 6.3 Input validation & sanitization
- Validate type, length, and format on the server: `filter_var(FILTER_VALIDATE_EMAIL)`,
  length caps, and a strict `in_array($role, ROLES, true)` allow-list for the enum.
- Normalise email to lowercase before storing/looking up (matches the UNIQUE index).
- Output is JSON via `json_encode`, so there is no HTML-injection surface in the API itself.

### 6.4 Transport
- **Force HTTPS** (the `.htaccess` redirect in §2.5). Tokens and passwords must never travel
  over plain HTTP. Consider an HSTS header once you're confident HTTPS is stable:
  `Strict-Transport-Security: max-age=31536000; includeSubDomains`.

### 6.5 Rate limiting (suggestion)
Shared hosting has no built-in throttling. A lightweight approach using `login_attempts`
(schema in `database.sql`): before verifying credentials in `login.php`/`signup.php`, count
recent attempts from the caller's IP and reject with **429** past a threshold.

```php
// Simple IP throttle: max 10 attempts / 15 min.
$ip  = inet_pton($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$cnt = db()->prepare(
    'SELECT COUNT(*) FROM login_attempts
     WHERE ip = :ip AND attempted_at > (UTC_TIMESTAMP() - INTERVAL 15 MINUTE)'
);
$cnt->execute([':ip' => $ip]);
if ((int) $cnt->fetchColumn() >= 10) {
    fail(429, 'Too many attempts. Please try again later.');
}
db()->prepare('INSERT INTO login_attempts (ip, email) VALUES (:ip, :email)')
    ->execute([':ip' => $ip, ':email' => $email]);
```
For stronger protection, also enable cPanel's **ModSecurity** and consider Cloudflare in
front of the domain.

### 6.6 JWT expiry & refresh
- Tokens expire after `jwt_ttl` (default **7 days**, §3.1). Shorter is safer.
- No refresh-token flow is in the contract yet. When you add one, issue a short-lived access
  token (~15 min) plus a long-lived, **rotating** refresh token stored server-side, and add a
  `POST /auth/refresh.php`. Until then, the client re-authenticates when the 7-day token
  expires (a `401` from `me.php` tells the frontend to send the user back to login).
- The `revoked_tokens` table already lets you invalidate a token before `exp` (logout,
  password change, or NDPR erasure — see below).

### 6.7 NDPR compliance (Nigeria Data Protection Regulation)

SabiHub handles **students' data, including minors'**, so NDPR (and the NDPA 2023) applies.
Bake these in from day one:

- **Lawful basis & consent.** Collect only with a clear basis. For users under 18, obtain
  **verifiable parental/guardian consent** — in practice, minors are enrolled/consented by a
  School (`school_admin`) or `parent` account rather than self-registering. Record consent
  (who consented, when, for what) alongside the account.
- **Data minimisation.** Only store what the feature needs. The `users` table deliberately
  holds just name, email, hashed password, and role — no phone, address, or DOB until a
  feature genuinely requires it. Add fields lazily, not "just in case."
- **Purpose limitation & transparency.** Publish a Privacy Policy (the signup page already
  links to one) stating what you collect, why, retention periods, and third parties.
- **Retention.** Define a retention period and delete/anonymise data past it. The cron in
  `database.sql` already prunes expired tokens and attempt logs. Apply the same discipline to
  future PII tables.
- **Right to erasure.** Provide an account-deletion path. Suggested endpoint:
  **`POST /auth/delete-account.php`** (authenticated) that deletes the `users` row
  (`ON DELETE CASCADE` clears `revoked_tokens`) and immediately revokes the caller's current
  token. After deletion, `me.php` returns 401 ("User no longer exists"), which the frontend
  treats as logged-out. Log the erasure event (without the erased PII) for your own audit.
- **Data subject rights.** Plan for access/portability (export a user's data as JSON) and
  rectification (edit profile) endpoints.
- **DPO / accountability.** Designate a **Data Protection Officer** contact and keep a record
  of processing activities. Report breaches to NITDA within the required window.
- **Security of processing.** HTTPS, bcrypt, prepared statements, least-privilege DB user,
  and secrets kept out of source control all contribute to the NDPR "security of processing"
  obligation.

> This section is engineering guidance, not legal advice — have SabiHub's DPO/legal review
> the final privacy posture before the Phase-1 pilot.

---

## 7. CORS

The Next.js app calls this API from a different origin (Vercel/Netlify, or a different
subdomain), so the API must send CORS headers, and the browser will send an **OPTIONS
preflight** before `POST` requests that carry `Content-Type: application/json` and/or an
`Authorization` header.

`lib/cors.php` (§3.5) handles both. The rules that must match the contract:

- **`Access-Control-Allow-Origin`** — echo back the request's `Origin` **only if it is in the
  `allowed_origins` allow-list**. Do **not** hardcode `*` — wildcard origin is incompatible
  with sending `Authorization` and is a needless exposure.
- **`Access-Control-Allow-Methods: GET, POST, OPTIONS`** — the only methods the API uses.
- **`Access-Control-Allow-Headers: Content-Type, Authorization`** — the headers the frontend
  sends.
- **Preflight:** respond to `OPTIONS` with **204** and the headers above, then stop — no body,
  no app logic. `apply_cors()` does this.
- Add **`Vary: Origin`** (done) so shared caches don't serve one origin's CORS headers to
  another.

Because auth is a bearer token in a header (not a cookie), you do **not** need
`Access-Control-Allow-Credentials`. Keep it off.

---

## 8. Environment / config

### 8.1 Backend secrets — `config.php` (§3.1)
`config.php` holds the JWT secret, DB credentials, and the CORS allow-list. It is
`require`d by every endpoint, never committed with real values (commit a
`config.example.php` instead), and blocked from HTTP access by `.htaccess`.

### 8.2 Frontend — `NEXT_PUBLIC_API_URL`
The frontend reads the API base from `NEXT_PUBLIC_API_URL`, defaulting to `/api`. Set it in
the frontend's environment:

```bash
# Frontend .env.local (or Vercel/Netlify env settings)

# Same domain as the site (API under /api on the same host):
NEXT_PUBLIC_API_URL=/api

# API on a separate host/subdomain:
NEXT_PUBLIC_API_URL=https://api.sabihub.ng
```

The frontend then builds request URLs as, e.g.,
`${process.env.NEXT_PUBLIC_API_URL}/auth/login.php`. Whatever host you pick **must** be in
`allowed_origins` in `config.php` (§3.1), and vice-versa — the two lists have to agree or the
browser will block the response.

### 8.3 Keeping the two in sync
| Concern            | Backend (`config.php`)          | Frontend (env)                    |
|--------------------|---------------------------------|-----------------------------------|
| API base URL       | served from `public_html/api`   | `NEXT_PUBLIC_API_URL`             |
| Allowed origin     | `allowed_origins[]`             | the site's own deployed origin    |
| Token storage      | issues JWT (`sub`,`role`,`jti`) | `localStorage["sabihub_token"]`   |
| Auth header        | reads `Authorization: Bearer`   | sends `Authorization: Bearer`     |

---

## 9. Testing with curl

Replace `https://api.sabihub.ng` with your base URL. On the same-domain setup that's
`https://sabihub.ng/api`.

**Signup (201):**
```bash
curl -i -X POST https://api.sabihub.ng/auth/signup.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Chidi Okonkwo","email":"chidi@school.edu.ng","password":"passw0rd123","role":"school_admin"}'
```

**Signup duplicate (409):** run the same command again → `{"success":false,"error":"An account with this email already exists."}`

**Login (200) — capture the token into a shell variable:**
```bash
TOKEN=$(curl -s -X POST https://api.sabihub.ng/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"chidi@school.edu.ng","password":"passw0rd123"}' \
  | php -r 'echo json_decode(file_get_contents("php://stdin"),true)["token"] ?? "";')
echo "$TOKEN"
```

**Login wrong password (401):**
```bash
curl -i -X POST https://api.sabihub.ng/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"chidi@school.edu.ng","password":"wrong"}'
# -> {"success":false,"error":"Invalid email or password"}
```

**Me (200):**
```bash
curl -i https://api.sabihub.ng/auth/me.php \
  -H "Authorization: Bearer $TOKEN"
```

**Logout (200):**
```bash
curl -i -X POST https://api.sabihub.ng/auth/logout.php \
  -H "Authorization: Bearer $TOKEN"
```

**Me after logout (401 — token revoked):**
```bash
curl -i https://api.sabihub.ng/auth/me.php \
  -H "Authorization: Bearer $TOKEN"
# -> 401 {"success":false,"error":"Token has been revoked."}
```

**CORS preflight (204):**
```bash
curl -i -X OPTIONS https://api.sabihub.ng/auth/login.php \
  -H "Origin: https://sabihub.ng" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"
# -> 204 with Access-Control-Allow-* headers
```

---

## 10. Roadmap — next endpoints

Auth is the foundation. The product has **five personas** (from the marketing site), each
getting a dashboard. Build these behind the same JWT auth, checking `role` from the token's
claims (and later a proper authorization layer). Suggested groupings:

**Cross-cutting (build next):**
- `POST /auth/refresh.php` — refresh-token rotation (see §6.6).
- `POST /auth/delete-account.php` — NDPR right-to-erasure (see §6.7).
- `GET /auth/me.php` extensions — profile edit (`PATCH`), password change (revoke old tokens).

**Schools (`school_admin`):**
- `GET/POST /schools/students.php` — digital enrollment & profiles.
- `GET/POST /schools/timetable.php` — WAEC/NECO timetable builder.
- `GET /schools/attendance.php`, `GET /schools/analytics.php` — attendance & analytics.
- *(Phase 2)* `/schools/fees.php` — fee management.

**Teachers (`teacher`):**
- `GET/POST /teacher/lessons.php` — multimedia lesson builder (WAEC-aligned templates).
- `GET/POST /teacher/assignments.php` — assignment & rubric creator.
- *(Phase 2)* `/teacher/grading.php` — AI-assisted grading.

**Students (`student`):**
- `GET /student/content.php` — offline content & quizzes (design for sync/CRDT payloads).
- `POST /student/sync.php` — CRDT sync on reconnect.
- `GET /student/progress.php` — XP points, badges, personalised paths.

**Parents (`parent`):**
- `GET /parent/children.php` — multi-child switcher.
- `GET /parent/grades.php`, `GET /parent/attendance.php` — dashboards.
- `POST /parent/alerts.php` — SMS alert preferences (MTN, Airtel, Glo).

**Creators (`creator`):**
- `GET/POST /creator/courses.php` — publish courses.
- `GET /creator/revenue.php` — earnings dashboard.

As these grow, factor the shared endpoint skeleton (§5) into a small router/middleware
(`require_auth()` returning the current user, `require_role('school_admin')`, etc.) so each
new endpoint stays a few lines. Every table that holds PII must respect the NDPR rules in
§6.7.
