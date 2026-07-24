import { fetchJson, type FetchResult } from "../api";

// ── Children ────────────────────────────────────────────────────────────

export type Child = { id: number; name: string; email: string; linked_at: string };
export type ChildrenResponse = { success: true; children: Child[] };

export function getChildren(): Promise<FetchResult<ChildrenResponse>> {
  return fetchJson<ChildrenResponse>("/parent/children.php", { method: "GET" });
}

export function linkChild(email: string): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return fetchJson("/parent/children.php", { method: "POST", body: JSON.stringify({ email }) });
}

export function unlinkChild(childId: number): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/parent/children.php", { method: "POST", body: JSON.stringify({ action: "unlink", child_id: childId }) });
}

export function getChildDetail(childId: number): Promise<FetchResult<{ success: true; child: Child & { class_name?: string; school_name?: string } }>> {
  return fetchJson(`/parent/children.php?id=${childId}`, { method: "GET" });
}

// ── Alerts / Notifications ──────────────────────────────────────────────

export type AlertPreferences = { sms_enabled: boolean; email_enabled: boolean; phone_number: string | null };
export type AlertsResponse = { success: true; alerts: AlertPreferences };

export function getAlertPreferences(): Promise<FetchResult<AlertsResponse>> {
  return fetchJson<AlertsResponse>("/parent/alerts.php", { method: "GET" });
}

export function updateAlertPreferences(data: Partial<AlertPreferences>): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/parent/alerts.php", { method: "POST", body: JSON.stringify(data) });
}

export function getParentNotifications(): Promise<FetchResult<{ success: true; notifications: { id: number; title: string; message: string; type: string; read: boolean; created_at: string }[] }>> {
  return fetchJson("/parent/notifications.php", { method: "GET" });
}

// ── Attendance ──────────────────────────────────────────────────────────

export function getChildAttendance(childId: number): Promise<FetchResult<{ success: true; records: { date: string; status: string; notes?: string }[] }>> {
  return fetchJson(`/parent/attendance.php?child_id=${childId}`, { method: "GET" });
}

// ── Grades / Results ────────────────────────────────────────────────────

export function getChildResults(childId: number): Promise<FetchResult<{ success: true; results: { subject: string; score: number; grade: string; term: string; session: string }[] }>> {
  return fetchJson(`/parent/results.php?child_id=${childId}`, { method: "GET" });
}

export function getChildReportCard(childId: number, termId: number): Promise<FetchResult<{ success: true; report_card: { pdf_url: string } }>> {
  return fetchJson(`/parent/report-card.php?child_id=${childId}&term_id=${termId}`, { method: "GET" });
}

// ── Assignments ─────────────────────────────────────────────────────────

export function getChildAssignments(childId: number): Promise<FetchResult<{ success: true; assignments: { id: number; title: string; subject: string; due_date: string; submitted: boolean; grade?: string; feedback?: string }[] }>> {
  return fetchJson(`/parent/assignments.php?child_id=${childId}`, { method: "GET" });
}

// ── Child Grades ──────────────────────────────────────────────────────────

export type ChildGrade = { id: number; subject: string; term: string; session: string; score: number; grade: string; report_card_url?: string };
export function getChildGrades(childId: number): Promise<FetchResult<{ success: true; grades: ChildGrade[] }>> {
  return fetchJson(`/parent/grades.php?child_id=${childId}`, { method: "GET" });
}

// ── Events / Calendar ───────────────────────────────────────────────────

export function getSchoolEvents(): Promise<FetchResult<{ success: true; events: { id: number; title: string; date: string; description?: string; type: string }[] }>> {
  return fetchJson("/parent/events.php", { method: "GET" });
}

// ── Emergency Contacts ──────────────────────────────────────────────────

export type EmergencyContact = { id: number; name: string; phone: string; relationship: string; is_primary: boolean };
export function getEmergencyContacts(): Promise<FetchResult<{ success: true; contacts: EmergencyContact[] }>> {
  return fetchJson("/parent/emergency-contacts.php", { method: "GET" });
}
export function addEmergencyContact(data: { name: string; phone: string; relationship: string; is_primary?: boolean }): Promise<FetchResult<{ success: boolean; contact_id?: number }>> {
  return fetchJson("/parent/emergency-contacts.php", { method: "POST", body: JSON.stringify(data) });
}

export function getReportCard(childId: number, gradeId: number): Promise<FetchResult<{ success: true; pdf_url: string }>> {
  return fetchJson(`/parent/report-card.php?child_id=${childId}&grade_id=${gradeId}`, { method: "GET" });
}
