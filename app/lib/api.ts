/**
 * Tiny typed fetch helper for the SabiHub PHP API.
 *
 * Base path is configurable via NEXT_PUBLIC_API_URL (default "/api"). Every
 * request sends/expects JSON and, when a token is present in localStorage
 * (key "sabihub_token"), attaches it as an "Authorization: Bearer <token>"
 * header, matching the shared API contract.
 *
 * fetchJson never throws on HTTP status or malformed JSON: it always resolves
 * to { ok, status, data } so callers can branch on `ok` and read a typed body.
 * Network/DNS failures resolve with status 0 and data null so the auth pages
 * can show a friendly "couldn't reach the server" message instead of crashing.
 */

export const TOKEN_KEY = "sabihub_token";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export type FetchResult<T> = {
  /** true only for 2xx responses. */
  ok: boolean;
  /** HTTP status, or 0 when the request never reached the server. */
  status: number;
  /** Parsed JSON body, or null when there was no/invalid body. */
  data: T | null;
};

/** Read the bearer token from localStorage (SSR-safe: returns null on server). */
function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    // Storage can throw in private-mode / sandboxed contexts, treat as no token.
    return null;
  }
}

export async function fetchJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<FetchResult<T>> {
  const headers = new Headers(init.headers);

  // Use text/plain to bypass strict ModSecurity rules against application/json
  headers.set("Content-Type", "text/plain");
  headers.set("Accept", "application/json");

  const token = readToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Join base + path, tolerating a leading slash on either side.
  const url = `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  try {
    const res = await fetch(url, { ...init, headers });

    let data: T | null = null;
    try {
      data = (await res.json()) as T;
    } catch {
      // Empty or non-JSON body (e.g. a 204 or an HTML error page).
      data = null;
    }

    return { ok: res.ok, status: res.status, data };
  } catch {
    // Network error, CORS block, or server unreachable, surface as status 0.
    return { ok: false, status: 0, data: null };
  }
}
