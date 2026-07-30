import { fetchJson, type FetchResult } from "../api";

/**
 * Parent-portal API client, retargeted from the legacy PHP endpoints to the
 * Laravel API. Every exported function keeps its original name, params and
 * RETURN TYPE; only the URL path and a response transform change.
 *
 * Adapter conventions (mirroring app/lib/auth.ts):
 *   - Laravel list endpoints return a bare array (or a paginated { data:[...] }).
 *     We wrap them into the old { success:true, <key>:[...] } shape.
 *   - Laravel errors ({ message } / { error }) become { success:false, error }.
 *   - Endpoints with no Laravel equivalent are STUBBED (typed) and reported.
 */

// ── Adapter helpers ─────────────────────────────────────────────────────────

/** Pull a bare array or a paginated { data:[] } payload into a plain array. */
function asArray<T>(d: unknown): T[] {
  if (Array.isArray(d)) return d as T[];
  const inner = (d as { data?: unknown })?.data;
  return Array.isArray(inner) ? (inner as T[]) : [];
}

/** Extract a human message from a Laravel error body. */
function errMessage(d: unknown): string {
  const m = (d as { message?: unknown; error?: unknown })?.message ?? (d as { error?: unknown })?.error;
  return typeof m === "string" ? m : "Request failed. Please try again.";
}

/** Build an error FetchResult carrying the old { success:false, error } shape. */
function fail<T>(status: number, error: string): FetchResult<T> {
  return { ok: false, status, data: { success: false, error } as unknown as T };
}

/** Build a 501 stub for endpoints the Laravel API does not (yet) expose. */
function stub<T>(error: string): FetchResult<T> {
  return { ok: false, status: 501, data: { success: false, error } as unknown as T };
}

// ── Children ────────────────────────────────────────────────────────────────

export type Child = { id: number; name: string; email: string; linked_at: string };
export type ChildrenResponse = { success: true; children: Child[] };

export async function getChildren(): Promise<FetchResult<ChildrenResponse>> {
  const res = await fetchJson<unknown>("/children", { method: "GET" });
  if (!res.ok) return fail<ChildrenResponse>(res.status, errMessage(res.data));
  const children: Child[] = asArray<{ id: number; name: string; email: string; linked_at?: string }>(res.data).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    linked_at: u.linked_at ?? "",
  }));
  return { ok: true, status: res.status, data: { success: true, children } };
}

/**
 * STUB. The UI lets a parent self-link by child email, but Laravel's
 * POST /parent-links is admin-only and takes parent_id + child_id. There is no
 * parent-facing link endpoint, so this cannot map cleanly.
 */
export function linkChild(_email: string): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return Promise.resolve(stub<{ success: boolean; message?: string }>("Linking is managed by your school admin"));
}

/** STUB. No parent-facing unlink route exists in the Laravel API. */
export function unlinkChild(_childId: number): Promise<FetchResult<{ success: boolean }>> {
  return Promise.resolve(stub<{ success: boolean }>("Unlinking is managed by your school admin"));
}

/** STUB. No single-child detail route exists (GET /children is list-only). */
export function getChildDetail(_childId: number): Promise<FetchResult<{ success: true; child: Child & { class_name?: string; school_name?: string } }>> {
  return Promise.resolve(stub<{ success: true; child: Child & { class_name?: string; school_name?: string } }>("Child details are not available yet."));
}

// ── Alerts / Notifications ────────────────────────────────────────────────────

export type AlertPreferences = { sms_enabled: boolean; email_enabled: boolean; phone_number: string | null };
export type AlertsResponse = { success: true; alerts: AlertPreferences };

/** STUB. The Laravel API has no alert-preferences route. */
export function getAlertPreferences(): Promise<FetchResult<AlertsResponse>> {
  return Promise.resolve(stub<AlertsResponse>("Alert preferences are not available yet."));
}

/** STUB. The Laravel API has no alert-preferences route. */
export function updateAlertPreferences(_data: Partial<AlertPreferences>): Promise<FetchResult<{ success: boolean }>> {
  return Promise.resolve(stub<{ success: boolean }>("Alert preferences are not available yet."));
}

export async function getParentNotifications(): Promise<FetchResult<{ success: true; notifications: { id: number; title: string; message: string; type: string; read: boolean; created_at: string }[] }>> {
  const res = await fetchJson<unknown>("/notifications", { method: "GET" });
  if (!res.ok) return fail(res.status, errMessage(res.data));
  const notifications = asArray<{ id: number; title: string; body?: string | null; type?: string | null; read_at?: string | null; created_at?: string | null }>(res.data).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.body ?? "",
    type: n.type ?? "",
    read: n.read_at != null,
    created_at: n.created_at ?? "",
  }));
  return { ok: true, status: res.status, data: { success: true, notifications } };
}

// ── Attendance ────────────────────────────────────────────────────────────────

export async function getChildAttendance(childId: number): Promise<FetchResult<{ success: true; records: { date: string; status: string; notes?: string }[] }>> {
  const res = await fetchJson<unknown>(`/child-attendance?child_id=${childId}`, { method: "GET" });
  if (!res.ok) return fail(res.status, errMessage(res.data));
  const records = asArray<{ date: string; status: string }>(res.data).map((r) => ({
    date: r.date,
    status: r.status,
  }));
  return { ok: true, status: res.status, data: { success: true, records } };
}

// ── Grades / Results ──────────────────────────────────────────────────────────

export async function getChildResults(childId: number): Promise<FetchResult<{ success: true; results: { subject: string; score: number; grade: string; term: string; session: string }[] }>> {
  const res = await fetchJson<unknown>(`/child-results?child_id=${childId}`, { method: "GET" });
  if (!res.ok) return fail(res.status, errMessage(res.data));
  // Laravel Result rows carry subject_id/score/grade/status only — no joined
  // subject name, term or session — so those are best-effort.
  const results = asArray<{ subject_id?: number; subject?: string; score: number | string; grade?: string | null; term?: string; session?: string }>(res.data).map((r) => ({
    subject: r.subject ?? (r.subject_id != null ? String(r.subject_id) : ""),
    score: Number(r.score),
    grade: r.grade ?? "",
    term: r.term ?? "",
    session: r.session ?? "",
  }));
  return { ok: true, status: res.status, data: { success: true, results } };
}

/** STUB. No report-card route exists in the Laravel API. */
export function getChildReportCard(_childId: number, _termId: number): Promise<FetchResult<{ success: true; report_card: { pdf_url: string } }>> {
  return Promise.resolve(stub<{ success: true; report_card: { pdf_url: string } }>("Report cards are not available yet."));
}

// ── Assignments ────────────────────────────────────────────────────────────────

/**
 * STUB. GET /assignments exists but is not a parent/per-child endpoint (no
 * child_id filter, not gated on the parent→child link), so there is no faithful
 * parent-facing mapping.
 */
export function getChildAssignments(_childId: number): Promise<FetchResult<{ success: true; assignments: { id: number; title: string; subject: string; due_date: string; submitted: boolean; grade?: string; feedback?: string }[] }>> {
  return Promise.resolve(stub<{ success: true; assignments: { id: number; title: string; subject: string; due_date: string; submitted: boolean; grade?: string; feedback?: string }[] }>("Child assignments are not available yet."));
}

// ── Child Grades ──────────────────────────────────────────────────────────────

export type ChildGrade = { id: number; subject: string; term: string; session: string; score: number; grade: string; report_card_url?: string };

/** STUB. No dedicated child-grades route (results are served via getChildResults). */
export function getChildGrades(_childId: number): Promise<FetchResult<{ success: true; grades: ChildGrade[] }>> {
  return Promise.resolve(stub<{ success: true; grades: ChildGrade[] }>("Child grades are not available yet."));
}

// ── Events / Calendar ─────────────────────────────────────────────────────────

export async function getSchoolEvents(): Promise<FetchResult<{ success: true; events: { id: number; title: string; date: string; description?: string; type: string }[] }>> {
  // Mapped to GET /holidays — the only school-calendar source in the Laravel API.
  const res = await fetchJson<unknown>("/holidays", { method: "GET" });
  if (!res.ok) return fail(res.status, errMessage(res.data));
  const events = asArray<{ id: number; title: string; date: string; description?: string | null }>(res.data).map((h) => ({
    id: h.id,
    title: h.title,
    date: h.date,
    description: h.description ?? undefined,
    type: "holiday",
  }));
  return { ok: true, status: res.status, data: { success: true, events } };
}

// ── Emergency Contacts ─────────────────────────────────────────────────────────

export type EmergencyContact = { id: number; name: string; phone: string; relationship: string; is_primary: boolean };

export async function getEmergencyContacts(): Promise<FetchResult<{ success: true; contacts: EmergencyContact[] }>> {
  // NOTE: Laravel's GET /emergency-contacts requires ?student_id, but the
  // original signature carries no child id, so none is sent (server will 422 →
  // surfaced as an error). See the report for this param mismatch.
  const res = await fetchJson<unknown>("/emergency-contacts", { method: "GET" });
  if (!res.ok) return fail(res.status, errMessage(res.data));
  const contacts = asArray<EmergencyContact>(res.data).map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    relationship: c.relationship,
    is_primary: Boolean(c.is_primary),
  }));
  return { ok: true, status: res.status, data: { success: true, contacts } };
}

export async function addEmergencyContact(data: { name: string; phone: string; relationship: string; is_primary?: boolean }): Promise<FetchResult<{ success: boolean; contact_id?: number }>> {
  // NOTE: Laravel's POST /emergency-contacts also requires student_id, which the
  // original signature does not provide; the created row is returned bare.
  const res = await fetchJson<{ id?: number }>("/emergency-contacts", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) return fail(res.status, errMessage(res.data));
  return { ok: true, status: res.status, data: { success: true, contact_id: res.data?.id } };
}

/** STUB. No report-card route exists in the Laravel API. */
export function getReportCard(_childId: number, _gradeId: number): Promise<FetchResult<{ success: true; pdf_url: string }>> {
  return Promise.resolve(stub<{ success: true; pdf_url: string }>("Report cards are not available yet."));
}
