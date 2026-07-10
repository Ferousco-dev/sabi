/**
 * Auth client for the SabiHub PHP API.
 *
 * Thin wrappers around the /auth/*.php endpoints from the shared API contract,
 * plus localStorage token helpers. All functions return the raw
 * FetchResult<...> so the calling UI can branch on `ok`/`status` and read a
 * typed body (including the { success:false, error } shape on failure).
 */

import { fetchJson, TOKEN_KEY, API_BASE, type FetchResult } from "./api";

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

/** Failure body returned across every endpoint. */
export type AuthError = {
  success: false;
  error: string;
};

export type AuthResponse = AuthSuccess | AuthError;
export type MeResponse = { success: true; user: User } | AuthError;
export type LogoutResponse = { success: true } | AuthError;

// ── Token helpers ────────────────────────────────────────────────────────

/** Read the stored JWT (SSR-safe). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Persist the JWT for subsequent authenticated requests. */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode), nothing we can do; fail silently.
  }
}

/** Remove the stored JWT (used on logout). */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* no-op */
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
