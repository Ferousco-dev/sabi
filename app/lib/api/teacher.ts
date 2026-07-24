import { fetchJson, type FetchResult } from "../api";

// ── Lessons ─────────────────────────────────────────────────────────────

export type Lesson = { id: number; course_id: number; teacher_id: number; title: string; content?: string; multimedia_url?: string; course_title?: string; created_at: string; updated_at: string };
export type LessonsResponse = { success: true; lessons: Lesson[] };

export function getLessons(): Promise<FetchResult<LessonsResponse>> {
  return fetchJson<LessonsResponse>("/teacher/lessons.php", { method: "GET" });
}

export function createLesson(data: { course_id: number; title: string; content?: string; multimedia_url?: string }): Promise<FetchResult<{ success: boolean; lesson_id?: number }>> {
  return fetchJson("/teacher/lessons.php", { method: "POST", body: JSON.stringify(data) });
}

export function getLessonDetail(id: number): Promise<FetchResult<{ success: true; lesson: Lesson }>> {
  return fetchJson(`/teacher/lessons.php?id=${id}`, { method: "GET" });
}

// ── Assignments ─────────────────────────────────────────────────────────

export type Assignment = { id: number; lesson_id: number; teacher_id: number; title: string; description?: string; due_date?: string; submission_count: number; created_at: string };
export type AssignmentsResponse = { success: true; assignments: Assignment[] };

export function getAssignments(): Promise<FetchResult<AssignmentsResponse>> {
  return fetchJson<AssignmentsResponse>("/teacher/assignments.php", { method: "GET" });
}

export function createAssignment(data: { lesson_id: number; title: string; description?: string; due_date?: string }): Promise<FetchResult<{ success: boolean; assignment_id?: number }>> {
  return fetchJson("/teacher/assignments.php", { method: "POST", body: JSON.stringify(data) });
}

export function getAssignmentDetail(id: number): Promise<FetchResult<{ success: true; assignment: Assignment & { submissions: Submission[] } }>> {
  return fetchJson(`/teacher/assignments.php?id=${id}`, { method: "GET" });
}

// ── Grading ─────────────────────────────────────────────────────────────

export type Submission = { id: number; assignment_id: number; student_id: number; content_url?: string; grade?: string; feedback?: string; submitted_at: string; student_name: string };
export type SubmissionsResponse = { success: true; submissions: Submission[] };

export function getSubmissions(assignmentId: number): Promise<FetchResult<SubmissionsResponse>> {
  return fetchJson<SubmissionsResponse>(`/teacher/grading.php?assignment_id=${assignmentId}`, { method: "GET" });
}

export function gradeSubmission(data: { submission_id: number; grade: string; feedback?: string }): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return fetchJson("/teacher/grading.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Class Roster ────────────────────────────────────────────────────────

export type ClassRosterStudent = { id: number; name: string; email: string; section_name?: string; guardian_name?: string };
export function getClassRoster(classId?: number): Promise<FetchResult<{ success: true; students: ClassRosterStudent[] }>> {
  const params = classId ? `?class_id=${classId}` : "";
  return fetchJson(`/teacher/roster.php${params}`, { method: "GET" });
}

// ── Attendance ──────────────────────────────────────────────────────────

export function recordTeacherAttendance(data: { date: string; records: { student_id: number; status: string; notes?: string }[] }): Promise<FetchResult<{ success: boolean; processed: number }>> {
  return fetchJson("/teacher/attendance.php", { method: "POST", body: JSON.stringify(data) });
}

export function getTeacherAttendance(date?: string): Promise<FetchResult<{ success: true; date: string; records: { student_id: number; student_name: string; status: string; notes?: string }[] }>> {
  const params = date ? `?date=${date}` : "";
  return fetchJson(`/teacher/attendance.php${params}`, { method: "GET" });
}

// ── Assessments (teacher score entry) ───────────────────────────────────

export type AssessmentScore = { student_id: number; student_name: string; score: number; max_score: number };
export function getAssessmentScores(assessmentId: number, classId: number): Promise<FetchResult<{ success: true; scores: AssessmentScore[] }>> {
  return fetchJson(`/teacher/assessments.php?assessment_id=${assessmentId}&class_id=${classId}`, { method: "GET" });
}

export function submitAssessmentScores(data: { assessment_id: number; scores: { student_id: number; score: number }[] }): Promise<FetchResult<{ success: boolean; processed: number }>> {
  return fetchJson("/teacher/assessments.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Resources ───────────────────────────────────────────────────────────

export type Resource = { id: number; teacher_id: number; title: string; url: string; type: string; topic?: string; created_at: string };
export function getResources(): Promise<FetchResult<{ success: true; resources: Resource[] }>> {
  return fetchJson("/teacher/resources.php", { method: "GET" });
}

export function createResource(data: { title: string; url: string; type: string; topic?: string }): Promise<FetchResult<{ success: boolean; resource_id?: number }>> {
  return fetchJson("/teacher/resources.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Messaging ───────────────────────────────────────────────────────────

export type MessageThread = { id: number; participant_name: string; last_message: string; unread_count: number; updated_at: string };
export function getTeacherMessages(): Promise<FetchResult<{ success: true; threads: MessageThread[] }>> {
  return fetchJson("/teacher/messages.php", { method: "GET" });
}

export function sendTeacherMessage(data: { recipient_id: number; subject: string; message: string }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/teacher/messages.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Reports ─────────────────────────────────────────────────────────────

export type TeacherPerformanceReport = { subject: string; class_name: string; student_count: number; avg_score: number; pass_rate: number };
export function getTeacherPerformanceReport(): Promise<FetchResult<{ success: true; report: TeacherPerformanceReport[] }>> {
  return fetchJson("/teacher/reports/performance.php", { method: "GET" });
}

export type AttendanceTrend = { date: string; present: number; absent: number; late: number };
export function getTeacherAttendanceTrends(from?: string, to?: string): Promise<FetchResult<{ success: true; trends: AttendanceTrend[] }>> {
  const params = from && to ? `?from=${from}&to=${to}` : "";
  return fetchJson(`/teacher/reports/attendance-trends.php${params}`, { method: "GET" });
}

export function getCompletionRates(): Promise<FetchResult<{ success: true; rates: { subject: string; completion_rate: number; total: number }[] }>> {
  return fetchJson("/teacher/reports/completion.php", { method: "GET" });
}
