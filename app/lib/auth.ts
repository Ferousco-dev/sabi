/**
 * Auth client for the SabiHub PHP API.
 *
 * Thin wrappers around the /auth/*.php endpoints from the shared API contract,
 * plus localStorage token helpers. All functions return the raw
 * FetchResult<...> so the calling UI can branch on `ok`/`status` and read a
 * typed body (including the { success:false, error } shape on failure).
 */

import { fetchJson, TOKEN_KEY, API_BASE, readCookie, writeCookie, deleteCookie, type FetchResult } from "./api";

/**
 * URL that starts the Google OAuth flow. The backend (/auth/google.php) redirects
 * the user to Google, then handles the callback and returns them to the app with
 * a token. The frontend just needs to send the user here.
 */
export function googleAuthUrl(): string {
  return `${API_BASE.replace(/\/$/, "")}/auth/google.php`;
}

/** Role enum, exact strings the backend stores. */
export type Role =
  | "school_admin"
  | "teacher"
  | "student"
  | "parent"
  | "creator";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

/** Success body shared by signup + login. */
export type AuthSuccess = {
  success: true;
  token: string;
  user: User;
};

/**
 * Turn a raw API status/error into a friendly, user-safe message. Internal
 * details (e.g. "Database unavailable") are never shown; the user sees a calm,
 * actionable line instead.
 */
export function friendlyAuthError(status: number, backendError?: string): string {
  if (status === 0) return "Couldn't reach the server. Check your connection and try again.";
  if (status === 401) return "Invalid email or password.";
  if (status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again in a moment.";
  if ((status === 409 || status === 422) && backendError) return backendError;
  return backendError && backendError.length < 120 ? backendError : "Something went wrong. Please try again.";
}

/** Failure body returned across every endpoint. */
export type AuthError = {
  success: false;
  error: string;
};

export type AuthResponse = AuthSuccess | AuthError;
export type MeResponse = { success: true; user: User } | AuthError;
export type LogoutResponse = { success: true } | AuthError;

// ── Token helpers ────────────────────────────────────────────────────────

/** Read the stored JWT from the session cookie (SSR-safe). Falls back to a
 * legacy localStorage token so already-signed-in users keep their session. */
export function getToken(): string | null {
  const cookie = readCookie(TOKEN_KEY);
  if (cookie) return cookie;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Persist the JWT in the session cookie for subsequent authenticated requests. */
export function setToken(token: string): void {
  writeCookie(TOKEN_KEY, token);
  // Clear any legacy localStorage copy so the cookie is the single source.
  if (typeof window !== "undefined") {
    try { window.localStorage.removeItem(TOKEN_KEY); } catch { /* no-op */ }
  }
}

/** Remove the stored JWT (used on logout). */
export function clearToken(): void {
  deleteCookie(TOKEN_KEY);
  if (typeof window !== "undefined") {
    try { window.localStorage.removeItem(TOKEN_KEY); } catch { /* no-op */ }
  }
}

// ── Endpoint calls ───────────────────────────────────────────────────────

/** POST /auth/signup.php → 201 { success, token, user }. */
export function signup(input: {
  name: string;
  email: string;
  password: string;
  /** Optional at signup — collected in onboarding after the account exists. */
  role?: Role;
}): Promise<FetchResult<AuthResponse>> {
  return fetchJson<AuthResponse>("/auth/signup.php", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** POST /auth/role.php (Bearer token) — set the account role during onboarding. */
export function updateRole(role: Role): Promise<FetchResult<MeResponse>> {
  return fetchJson<MeResponse>("/auth/role.php", {
    method: "POST",
    body: JSON.stringify({ role }),
  });
}

/** POST /auth/login.php → 200 { success, token, user }. */
export function login(input: {
  email: string;
  password: string;
}): Promise<FetchResult<AuthResponse>> {
  return fetchJson<AuthResponse>("/auth/login.php", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** POST /auth/logout.php (Bearer token) → 200 { success }. Also clears local token. */
export async function logout(): Promise<FetchResult<LogoutResponse>> {
  const res = await fetchJson<LogoutResponse>("/auth/logout.php", {
    method: "POST",
  });
  clearToken();
  return res;
}

/** GET /auth/me.php (Bearer token) → 200 { success, user }. */
export function getMe(): Promise<FetchResult<MeResponse>> {
  return fetchJson<MeResponse>("/auth/me.php", { method: "GET" });
}
