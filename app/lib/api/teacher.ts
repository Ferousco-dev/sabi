import { fetchJson, type FetchResult } from "../api";

// ── Laravel response adapters ──────────────────────────────────────────────
// The Laravel API returns bare arrays (or paginated { data: [...] }) for lists,
// the created model for writes, and { message } on error. The teacher UI still
// expects the old PHP { success, <key> } / { success:false, error } shapes, so
// we translate at this boundary — components don't change.

/** Laravel list bodies are either a bare array or paginated `{ data: [...] }`. */
function listOf<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: T[] }).data;
  }
  return [];
}

/** Read the primary key from a created-model body. */
function idOf(body: unknown): number | undefined {
  if (body && typeof body === "object" && typeof (body as { id?: unknown }).id === "number") {
    return (body as { id: number }).id;
  }
  return undefined;
}

/** A typed 501 stub for features with no Laravel route yet. */
function stub<T>(): Promise<FetchResult<T>> {
  return Promise.resolve({
    ok: false,
    status: 501,
    data: { success: false, error: "Not available yet" } as unknown as T,
  });
}

// ── Lessons ─────────────────────────────────────────────────────────────

export type Lesson = { id: number; course_id: number; teacher_id: number; title: string; content?: string; multimedia_url?: string; course_title?: string; created_at: string; updated_at: string };
export type LessonsResponse = { success: true; lessons: Lesson[] };

// GET /lessons → bare array of lessons (tenant-scoped by the global scope).
export async function getLessons(): Promise<FetchResult<LessonsResponse>> {
  const res = await fetchJson<unknown>("/lessons", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, lessons: listOf<Lesson>(res.data) } };
  return { ok: false, status: res.status, data: null };
}

// POST /lessons → created lesson (201). Laravel validates title/content/subject_id.
export async function createLesson(data: { course_id: number; title: string; content?: string; multimedia_url?: string }): Promise<FetchResult<{ success: boolean; lesson_id?: number }>> {
  const res = await fetchJson<unknown>("/lessons", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, lesson_id: idOf(res.data) } };
  return { ok: false, status: res.status, data: { success: false } };
}

// STUB: Laravel exposes no GET /lessons/{id} single-lesson route.
export function getLessonDetail(_id: number): Promise<FetchResult<{ success: true; lesson: Lesson }>> {
  return stub<{ success: true; lesson: Lesson }>();
}

// ── Assignments ─────────────────────────────────────────────────────────

export type Assignment = { id: number; lesson_id: number; teacher_id: number; title: string; description?: string; due_date?: string; submission_count: number; created_at: string };
export type AssignmentsResponse = { success: true; assignments: Assignment[] };

// GET /assignments → bare array.
export async function getAssignments(): Promise<FetchResult<AssignmentsResponse>> {
  const res = await fetchJson<unknown>("/assignments", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, assignments: listOf<Assignment>(res.data) } };
  return { ok: false, status: res.status, data: null };
}

// POST /assignments → created assignment (201).
export async function createAssignment(data: { lesson_id: number; title: string; description?: string; due_date?: string }): Promise<FetchResult<{ success: boolean; assignment_id?: number }>> {
  const res = await fetchJson<unknown>("/assignments", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, assignment_id: idOf(res.data) } };
  return { ok: false, status: res.status, data: { success: false } };
}

// STUB: Laravel exposes no GET /assignments/{id} single-assignment route.
export function getAssignmentDetail(_id: number): Promise<FetchResult<{ success: true; assignment: Assignment & { submissions: Submission[] } }>> {
  return stub<{ success: true; assignment: Assignment & { submissions: Submission[] } }>();
}

// ── Grading ─────────────────────────────────────────────────────────────

export type Submission = { id: number; assignment_id: number; student_id: number; content_url?: string; grade?: string; feedback?: string; submitted_at: string; student_name: string };
export type SubmissionsResponse = { success: true; submissions: Submission[] };

// GET /submissions?assignment_id= → bare array (filtered in-controller).
export async function getSubmissions(assignmentId: number): Promise<FetchResult<SubmissionsResponse>> {
  const res = await fetchJson<unknown>(`/submissions?assignment_id=${assignmentId}`, { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, submissions: listOf<Submission>(res.data) } };
  return { ok: false, status: res.status, data: null };
}

// POST /submissions/{id}/grade → updated submission model.
export async function gradeSubmission(data: { submission_id: number; grade: string; feedback?: string }): Promise<FetchResult<{ success: boolean; message?: string }>> {
  const res = await fetchJson<unknown>(`/submissions/${data.submission_id}/grade`, {
    method: "POST",
    body: JSON.stringify({ grade: data.grade, feedback: data.feedback }),
  });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, message: "Graded" } };
  return { ok: false, status: res.status, data: { success: false } };
}

// ── Class Roster ────────────────────────────────────────────────────────

export type ClassRosterStudent = { id: number; name: string; email: string; section_name?: string; guardian_name?: string };

// GET /students → paginated { data: [...] } of the tenant's students. classId is
// preserved for the signature but Laravel /students has no class filter, so it is
// ignored server-side.
export async function getClassRoster(_classId?: number): Promise<FetchResult<{ success: true; students: ClassRosterStudent[] }>> {
  const res = await fetchJson<unknown>("/students", { method: "GET" });
  if (res.ok) {
    const students = listOf<{ id: number; name: string; email: string }>(res.data).map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
    }));
    return { ok: true, status: res.status, data: { success: true, students } };
  }
  return { ok: false, status: res.status, data: null };
}

// ── Attendance ──────────────────────────────────────────────────────────

// POST /attendance → array of saved records (201). NOTE: Laravel requires a
// `class_id`, which is not in this function's signature; the request is sent
// without it (last param preserved as-is), so the call needs the caller to add
// class scoping before it will pass server validation. See report.
export async function recordTeacherAttendance(data: { class_id: number; date: string; records: { student_id: number; status: string; notes?: string }[] }): Promise<FetchResult<{ success: boolean; processed: number }>> {
  const res = await fetchJson<unknown>("/attendance", {
    method: "POST",
    body: JSON.stringify({
      class_id: data.class_id,
      date: data.date,
      records: data.records.map((r) => ({ student_id: r.student_id, status: r.status })),
    }),
  });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, processed: listOf(res.data).length } };
  return { ok: false, status: res.status, data: { success: false, processed: 0 } };
}

// GET /attendance?date= → bare array of AttendanceRecord models. The model has no
// joined student_name, so it is returned empty; likewise there is no `notes` column.
export async function getTeacherAttendance(date?: string): Promise<FetchResult<{ success: true; date: string; records: { student_id: number; student_name: string; status: string; notes?: string }[] }>> {
  const params = date ? `?date=${date}` : "";
  const res = await fetchJson<unknown>(`/attendance${params}`, { method: "GET" });
  if (res.ok) {
    const records = listOf<{ student_id: number; status: string }>(res.data).map((r) => ({
      student_id: r.student_id,
      student_name: "",
      status: r.status,
    }));
    return { ok: true, status: res.status, data: { success: true, date: date ?? "", records } };
  }
  return { ok: false, status: res.status, data: null };
}

// ── Assessments (teacher score entry) ───────────────────────────────────

export type AssessmentScore = { student_id: number; student_name: string; score: number; max_score: number };

// STUB: the Laravel results flow (GET /results) has no per-assessment/per-class
// score view carrying student_name + max_score, so this can't map cleanly.
export function getAssessmentScores(_assessmentId: number, _classId: number): Promise<FetchResult<{ success: true; scores: AssessmentScore[] }>> {
  return stub<{ success: true; scores: AssessmentScore[] }>();
}

// STUB: Laravel POST /results stores ONE result and requires student_id +
// subject_id + assessment_config_id + score. This batch shape (no subject_id)
// can't map cleanly.
export function submitAssessmentScores(_data: { assessment_id: number; scores: { student_id: number; score: number }[] }): Promise<FetchResult<{ success: boolean; processed: number }>> {
  return stub<{ success: boolean; processed: number }>();
}

// ── Resources ───────────────────────────────────────────────────────────

export type Resource = { id: number; teacher_id: number; title: string; url: string; type: string; topic?: string; created_at: string };

// STUB: no Laravel teacher-resources route exists.
export function getResources(): Promise<FetchResult<{ success: true; resources: Resource[] }>> {
  return stub<{ success: true; resources: Resource[] }>();
}

// STUB: no Laravel teacher-resources route exists.
export function createResource(_data: { title: string; url: string; type: string; topic?: string }): Promise<FetchResult<{ success: boolean; resource_id?: number }>> {
  return stub<{ success: boolean; resource_id?: number }>();
}

// ── Messaging ───────────────────────────────────────────────────────────

export type MessageThread = { id: number; participant_name: string; last_message: string; unread_count: number; updated_at: string };

// GET /messages → bare array of Message models (not threads). Best-effort map:
// participant_name is unavailable and unread_count is not tracked server-side.
export async function getTeacherMessages(): Promise<FetchResult<{ success: true; threads: MessageThread[] }>> {
  const res = await fetchJson<unknown>("/messages", { method: "GET" });
  if (res.ok) {
    const threads = listOf<{ id: number; body?: string; created_at?: string }>(res.data).map((m) => ({
      id: m.id,
      participant_name: "",
      last_message: m.body ?? "",
      unread_count: 0,
      updated_at: m.created_at ?? "",
    }));
    return { ok: true, status: res.status, data: { success: true, threads } };
  }
  return { ok: false, status: res.status, data: null };
}

// POST /messages → created message. Laravel expects `body`, so `message` is remapped.
export async function sendTeacherMessage(data: { recipient_id: number; subject: string; message: string }): Promise<FetchResult<{ success: boolean }>> {
  const res = await fetchJson<unknown>("/messages", {
    method: "POST",
    body: JSON.stringify({ recipient_id: data.recipient_id, subject: data.subject, body: data.message }),
  });
  return { ok: res.ok, status: res.status, data: { success: res.ok } };
}

// ── Reports ─────────────────────────────────────────────────────────────

export type TeacherPerformanceReport = { subject: string; class_name: string; student_count: number; avg_score: number; pass_rate: number };

// GET /teacher-reports/performance → rows { subject, average_score, pass_rate,
// student_count }. class_name is not part of the report (school-wide per subject).
export async function getTeacherPerformanceReport(): Promise<FetchResult<{ success: true; report: TeacherPerformanceReport[] }>> {
  const res = await fetchJson<unknown>("/teacher-reports/performance", { method: "GET" });
  if (res.ok) {
    const report = listOf<{ subject: string; average_score: number; pass_rate: number; student_count: number }>(res.data).map((r) => ({
      subject: r.subject,
      class_name: "",
      student_count: r.student_count,
      avg_score: r.average_score,
      pass_rate: r.pass_rate,
    }));
    return { ok: true, status: res.status, data: { success: true, report } };
  }
  return { ok: false, status: res.status, data: null };
}

export type AttendanceTrend = { date: string; present: number; absent: number; late: number };

// STUB: no Laravel teacher attendance-trends route exists.
export function getTeacherAttendanceTrends(_from?: string, _to?: string): Promise<FetchResult<{ success: true; trends: AttendanceTrend[] }>> {
  return stub<{ success: true; trends: AttendanceTrend[] }>();
}

// GET /teacher-reports/completion → rows { assignment_id, title, submission_count,
// enrolled_count, completion_rate }. Reshaped to the old { subject, completion_rate,
// total } — subject is the assignment title, total is the enrolled denominator.
export async function getCompletionRates(): Promise<FetchResult<{ success: true; rates: { subject: string; completion_rate: number; total: number }[] }>> {
  const res = await fetchJson<unknown>("/teacher-reports/completion", { method: "GET" });
  if (res.ok) {
    const rates = listOf<{ title: string; completion_rate: number; enrolled_count: number }>(res.data).map((r) => ({
      subject: r.title,
      completion_rate: r.completion_rate,
      total: r.enrolled_count,
    }));
    return { ok: true, status: res.status, data: { success: true, rates } };
  }
  return { ok: false, status: res.status, data: null };
}
