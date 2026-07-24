import { fetchJson, type FetchResult } from "../api";

// ── Student Content ────────────────────────────────────────────────────

export type StudentContent = { id: number; course_id: number; teacher_id: number; title: string; content?: string; multimedia_url?: string; course_title?: string; teacher_name?: string; created_at: string; updated_at: string };
export type ContentResponse = { success: true; content: StudentContent[]; sync_timestamp: number };

export function getContent(): Promise<FetchResult<ContentResponse>> {
  return fetchJson<ContentResponse>("/student/content.php", { method: "GET" });
}

export function getContentDetail(id: number): Promise<FetchResult<{ success: true; content: StudentContent }>> {
  return fetchJson(`/student/content.php?id=${id}`, { method: "GET" });
}

// ── Student Assignments ────────────────────────────────────────────────

export type StudentAssignment = { id: number; lesson_id: number; teacher_id: number; title: string; description?: string; due_date?: string; course_title?: string; grade?: string; submitted_at?: string };
export type StudentAssignmentsResponse = { success: true; assignments: StudentAssignment[] };

export function getStudentAssignments(): Promise<FetchResult<StudentAssignmentsResponse>> {
  return fetchJson<StudentAssignmentsResponse>("/student/assignments.php", { method: "GET" });
}

export function submitAssignment(assignmentId: number, contentUrl: string): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return fetchJson("/student/assignments.php", { method: "POST", body: JSON.stringify({ assignment_id: assignmentId, content_url: contentUrl }) });
}

export function getAssignmentDetail(id: number): Promise<FetchResult<{ success: true; assignment: StudentAssignment & { attachments?: string[] } }>> {
  return fetchJson(`/student/assignments.php?id=${id}`, { method: "GET" });
}

// ── Progress ───────────────────────────────────────────────────────────

export type ProgressData = { xp: number; completed_lessons: number; badges: string[]; streak?: number };
export type ProgressResponse = { success: true; progress: ProgressData };

export function getProgress(studentId?: number): Promise<FetchResult<ProgressResponse>> {
  const params = studentId ? `?student_id=${studentId}` : "";
  return fetchJson<ProgressResponse>(`/student/progress.php${params}`, { method: "GET" });
}

export type SyncUpdate = { lesson_id: number; status: string; xp: number };
export function syncProgress(updates: SyncUpdate[]): Promise<FetchResult<{ success: boolean; processed_updates?: number }>> {
  return fetchJson("/student/sync.php", { method: "POST", body: JSON.stringify({ updates }) });
}

// ── Timetable ──────────────────────────────────────────────────────────

export type StudentTimetableEntry = { id: number; subject: string; day: string; start_time: string; end_time: string; teacher_name?: string; room?: string };
export function getStudentTimetable(): Promise<FetchResult<{ success: true; timetable: StudentTimetableEntry[] }>> {
  return fetchJson("/student/timetable.php", { method: "GET" });
}

// ── Attendance ─────────────────────────────────────────────────────────

export type StudentAttendanceRecord = { date: string; status: string; notes?: string };
export function getStudentAttendance(): Promise<FetchResult<{ success: true; records: StudentAttendanceRecord[] }>> {
  return fetchJson("/student/attendance.php", { method: "GET" });
}

export function requestAttendanceCorrection(data: { date: string; reason: string }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/student/attendance-correction.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Assessments/Exams ──────────────────────────────────────────────────

export type UpcomingAssessment = { id: number; title: string; subject: string; date: string; type: string; duration?: string };
export function getUpcomingAssessments(): Promise<FetchResult<{ success: true; assessments: UpcomingAssessment[] }>> {
  return fetchJson("/student/assessments.php", { method: "GET" });
}

// ── Score History ──────────────────────────────────────────────────────

export function getScoreHistory(): Promise<FetchResult<{ success: true; history: { subject: string; scores: { date: string; score: number; max: number; grade: string; term: string }[] }[] }>> {
  return fetchJson("/student/score-history.php", { method: "GET" });
}

// ── Messaging ──────────────────────────────────────────────────────────

export type MessageThread = { id: number; participant_name: string; participant_role: string; last_message: string; unread_count: number; updated_at: string };
export function getStudentMessages(): Promise<FetchResult<{ success: true; threads: MessageThread[] }>> {
  return fetchJson("/student/messages.php", { method: "GET" });
}

export function sendStudentMessage(data: { recipient_id: number; subject: string; message: string }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/student/messages.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Settings ───────────────────────────────────────────────────────────

export function getStudentSettings(): Promise<FetchResult<{ success: true; settings: { notifications: { email: boolean; sms: boolean; push: boolean }; accessibility: { high_contrast: boolean; large_text: boolean; reduce_motion: boolean } } }>> {
  return fetchJson("/student/settings.php", { method: "GET" });
}

export function updateStudentSettings(data: { notifications?: { email?: boolean; sms?: boolean; push?: boolean }; accessibility?: { high_contrast?: boolean; large_text?: boolean; reduce_motion?: boolean } }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/student/settings.php", { method: "POST", body: JSON.stringify(data) });
}