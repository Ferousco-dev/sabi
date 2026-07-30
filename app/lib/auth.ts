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

// ── Laravel response adapters ──────────────────────────────────────────────
// The Laravel API returns { token, user } on success and { message } / { errors }
// on failure. The UI still expects the old { success, token, user } / { success:
// false, error } shapes, so we translate at this boundary — pages don't change.

type LaravelAuth = { token?: string; user?: User; message?: string; error?: string };

function toAuth(res: FetchResult<LaravelAuth>): FetchResult<AuthResponse> {
  if (res.ok && res.data?.token && res.data.user) {
    return { ok: true, status: res.status, data: { success: true, token: res.data.token, user: res.data.user } };
  }
  return { ok: false, status: res.status, data: { success: false, error: res.data?.message ?? res.data?.error ?? "Something went wrong." } };
}

/** POST /signup → 201 { token, user }. Creates a school + admin (or a creator). */
export async function signup(input: {
  name: string;
  email: string;
  password: string;
  role?: Role;
  school_name?: string;
}): Promise<FetchResult<AuthResponse>> {
  return toAuth(await fetchJson<LaravelAuth>("/signup", { method: "POST", body: JSON.stringify(input) }));
}

/**
 * Role is set at signup (owner) or by invitation in the Laravel model, so there
 * is no self-serve role change. This is a no-op that returns the current user,
 * kept so the onboarding page continues to work.
 */
export async function updateRole(_role: Role): Promise<FetchResult<MeResponse>> {
  return getMe();
}

/** POST /login → 200 { token, user }. */
export async function login(input: {
  email: string;
  password: string;
}): Promise<FetchResult<AuthResponse>> {
  return toAuth(await fetchJson<LaravelAuth>("/login", { method: "POST", body: JSON.stringify(input) }));
}

/** POST /logout (Bearer token). Also clears the local token. */
export async function logout(): Promise<FetchResult<LogoutResponse>> {
  const res = await fetchJson<{ message?: string }>("/logout", { method: "POST" });
  clearToken();
  return { ok: res.ok, status: res.status, data: { success: true } };
}

/** GET /me (Bearer token) → a bare user object; wrapped for the UI. */
export async function getMe(): Promise<FetchResult<MeResponse>> {
  const res = await fetchJson<User>("/me", { method: "GET" });
  if (res.ok && res.data) {
    return { ok: true, status: res.status, data: { success: true, user: res.data } };
  }
  return { ok: false, status: res.status, data: { success: false, error: "Not authenticated." } };
}
