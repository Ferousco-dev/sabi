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
