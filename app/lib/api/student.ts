import { fetchJson, type FetchResult } from "../api";

// ── Laravel adapter helpers ─────────────────────────────────────────────────
// The Laravel API returns bare arrays (or a single model) on success and
// { message } on failure. The dashboard components still expect the old PHP
// shapes ({ success:true, <key>:[...] }), so we translate at this boundary.
//
// To preserve every function's exact RETURN TYPE, failures resolve to
// { ok:false, status, data:null } (FetchResult<T> already allows data:null) and
// components keep branching on `ok`. The { message } → { success:false, error }
// mapping isn't representable against the strict `success:true` return types, so
// null is the type-safe stand-in.

/** Await a raw Laravel fetch and, on 2xx, transform the body into the old shape. */
async function adapt<TRaw, TOut>(
  p: Promise<FetchResult<TRaw>>,
  transform: (raw: TRaw) => TOut,
): Promise<FetchResult<TOut>> {
  const res = await p;
  if (res.ok && res.data != null) {
    return { ok: true, status: res.status, data: transform(res.data) };
  }
  return { ok: false, status: res.status, data: null };
}

/** A gracefully-failing stub for functions with no Laravel equivalent. */
function stub<T>(): Promise<FetchResult<T>> {
  return Promise.resolve({ ok: false, status: 501, data: null });
}

// ── Raw Laravel row types (minimal, only fields we read) ─────────────────────

type LaravelLesson = { id: number; title: string; content?: string; subject_id?: number; teacher_id?: number; created_at?: string; updated_at?: string };
type LaravelAssignment = { id: number; title: string; description?: string; subject_id?: number; teacher_id?: number; due_date?: string };
type LaravelTimetableEntry = { id: number; day: string; start_time: string; end_time: string; room?: string; subject?: { name?: string } | null; teacher?: { name?: string } | null };
type LaravelAttendanceRecord = { date: string; status: string; client_uuid?: string | null };
type LaravelAssessmentConfig = { id: number; name: string; max_score?: number; term?: string | null };
type LaravelScoreGroup = { subject: string | null; scores: { assessment: string | null; score: number; max: number | null }[] };
type LaravelMessage = { id: number; sender_id: number; recipient_id: number; subject?: string | null; body: string; created_at?: string; updated_at?: string };
type LaravelStudentSetting = { notify_email: boolean; notify_sms: boolean; notify_push: boolean; high_contrast: boolean; large_text: boolean; reduce_motion: boolean };

// ── Student Content → GET /lessons ───────────────────────────────────────────

export type StudentContent = { id: number; course_id: number; teacher_id: number; title: string; content?: string; multimedia_url?: string; course_title?: string; teacher_name?: string; created_at: string; updated_at: string };
export type ContentResponse = { success: true; content: StudentContent[]; sync_timestamp: number };

export function getContent(): Promise<FetchResult<ContentResponse>> {
  return adapt<LaravelLesson[], ContentResponse>(
    fetchJson<LaravelLesson[]>("/lessons", { method: "GET" }),
    (rows) => ({
      success: true,
      content: rows.map((l) => ({
        id: l.id,
        course_id: l.subject_id ?? 0,
        teacher_id: l.teacher_id ?? 0,
        title: l.title,
        content: l.content,
        created_at: l.created_at ?? "",
        updated_at: l.updated_at ?? "",
      })),
      sync_timestamp: Date.now(),
    }),
  );
}

// STUB: Laravel has no single-lesson GET route (only GET /lessons collection).
export function getContentDetail(_id: number): Promise<FetchResult<{ success: true; content: StudentContent }>> {
  return stub();
}

// ── Student Assignments → GET /assignments, POST /submissions ────────────────

export type StudentAssignment = { id: number; lesson_id: number; teacher_id: number; title: string; description?: string; due_date?: string; course_title?: string; grade?: string; submitted_at?: string };
export type StudentAssignmentsResponse = { success: true; assignments: StudentAssignment[] };

export function getStudentAssignments(): Promise<FetchResult<StudentAssignmentsResponse>> {
  return adapt<LaravelAssignment[], StudentAssignmentsResponse>(
    fetchJson<LaravelAssignment[]>("/assignments", { method: "GET" }),
    (rows) => ({
      success: true,
      assignments: rows.map((a) => ({
        id: a.id,
        lesson_id: 0,
        teacher_id: a.teacher_id ?? 0,
        title: a.title,
        description: a.description,
        due_date: a.due_date,
      })),
    }),
  );
}

export function submitAssignment(assignmentId: number, contentUrl: string): Promise<FetchResult<{ success: boolean; message?: string }>> {
  // Frontend passes a content URL → Laravel SubmissionController expects file_url.
  return adapt<{ id: number }, { success: boolean; message?: string }>(
    fetchJson<{ id: number }>("/submissions", {
      method: "POST",
      body: JSON.stringify({ assignment_id: assignmentId, file_url: contentUrl }),
    }),
    () => ({ success: true }),
  );
}

// STUB: Laravel has no single-assignment GET route.
export function getAssignmentDetail(_id: number): Promise<FetchResult<{ success: true; assignment: StudentAssignment & { attachments?: string[] } }>> {
  return stub();
}

// ── Progress ─────────────────────────────────────────────────────────────────
// STUB: Laravel has no XP/badges/streak progress endpoint.

export type ProgressData = { xp: number; completed_lessons: number; badges: string[]; streak?: number };
export type ProgressResponse = { success: true; progress: ProgressData };

export function getProgress(_studentId?: number): Promise<FetchResult<ProgressResponse>> {
  return stub();
}

export type SyncUpdate = { lesson_id: number; status: string; xp: number };
// STUB: Laravel has no offline progress-sync endpoint.
export function syncProgress(_updates: SyncUpdate[]): Promise<FetchResult<{ success: boolean; processed_updates?: number }>> {
  return stub();
}

// ── Timetable → GET /timetable ───────────────────────────────────────────────

export type StudentTimetableEntry = { id: number; subject: string; day: string; start_time: string; end_time: string; teacher_name?: string; room?: string };
export function getStudentTimetable(): Promise<FetchResult<{ success: true; timetable: StudentTimetableEntry[] }>> {
  return adapt<LaravelTimetableEntry[], { success: true; timetable: StudentTimetableEntry[] }>(
    fetchJson<LaravelTimetableEntry[]>("/timetable", { method: "GET" }),
    (rows) => ({
      success: true,
      timetable: rows.map((t) => ({
        id: t.id,
        subject: t.subject?.name ?? "",
        day: t.day,
        start_time: t.start_time,
        end_time: t.end_time,
        teacher_name: t.teacher?.name,
        room: t.room,
      })),
    }),
  );
}

// ── Attendance → GET /attendance ─────────────────────────────────────────────

export type StudentAttendanceRecord = { date: string; status: string; notes?: string };
export function getStudentAttendance(): Promise<FetchResult<{ success: true; records: StudentAttendanceRecord[] }>> {
  return adapt<LaravelAttendanceRecord[], { success: true; records: StudentAttendanceRecord[] }>(
    fetchJson<LaravelAttendanceRecord[]>("/attendance", { method: "GET" }),
    (rows) => ({
      success: true,
      records: rows.map((r) => ({ date: r.date, status: r.status })),
    }),
  );
}

// STUB: Laravel has no attendance-correction request endpoint.
export function requestAttendanceCorrection(_data: { date: string; reason: string }): Promise<FetchResult<{ success: boolean }>> {
  return stub();
}

// ── Assessments/Exams → GET /assessment-configs ──────────────────────────────

export type UpcomingAssessment = { id: number; title: string; subject: string; date: string; type: string; duration?: string };
export function getUpcomingAssessments(): Promise<FetchResult<{ success: true; assessments: UpcomingAssessment[] }>> {
  return adapt<LaravelAssessmentConfig[], { success: true; assessments: UpcomingAssessment[] }>(
    fetchJson<LaravelAssessmentConfig[]>("/assessment-configs", { method: "GET" }),
    (rows) => ({
      success: true,
      // AssessmentConfig has no subject/date; map name→title, term→type.
      assessments: rows.map((c) => ({
        id: c.id,
        title: c.name,
        subject: "",
        date: "",
        type: c.term ?? "",
      })),
    }),
  );
}

// ── Score History → GET /score-history ───────────────────────────────────────

export function getScoreHistory(): Promise<FetchResult<{ success: true; history: { subject: string; scores: { date: string; score: number; max: number; grade: string; term: string }[] }[] }>> {
  return adapt<LaravelScoreGroup[], { success: true; history: { subject: string; scores: { date: string; score: number; max: number; grade: string; term: string }[] }[] }>(
    fetchJson<LaravelScoreGroup[]>("/score-history", { method: "GET" }),
    (groups) => ({
      success: true,
      // Laravel scores are { assessment, score, max }. The old shape wants
      // { date, score, max, grade, term }; assessment name maps to `term`,
      // date/grade are unavailable server-side (left empty).
      history: groups.map((g) => ({
        subject: g.subject ?? "",
        scores: g.scores.map((s) => ({
          date: "",
          score: s.score,
          max: s.max ?? 0,
          grade: "",
          term: s.assessment ?? "",
        })),
      })),
    }),
  );
}

// ── Messaging → GET /messages, POST /messages ────────────────────────────────

export type MessageThread = { id: number; participant_name: string; participant_role: string; last_message: string; unread_count: number; updated_at: string };
export function getStudentMessages(): Promise<FetchResult<{ success: true; threads: MessageThread[] }>> {
  return adapt<LaravelMessage[], { success: true; threads: MessageThread[] }>(
    fetchJson<LaravelMessage[]>("/messages", { method: "GET" }),
    (rows) => ({
      success: true,
      // Laravel returns flat messages, not aggregated threads. We surface one
      // "thread" per message; participant name/role and unread state aren't in
      // the message payload, so they're left empty/zero.
      threads: rows.map((m) => ({
        id: m.id,
        participant_name: "",
        participant_role: "",
        last_message: m.body,
        unread_count: 0,
        updated_at: m.updated_at ?? m.created_at ?? "",
      })),
    }),
  );
}

export function sendStudentMessage(data: { recipient_id: number; subject: string; message: string }): Promise<FetchResult<{ success: boolean }>> {
  // Frontend field `message` maps to Laravel's `body`.
  return adapt<{ id: number }, { success: boolean }>(
    fetchJson<{ id: number }>("/messages", {
      method: "POST",
      body: JSON.stringify({ recipient_id: data.recipient_id, subject: data.subject, body: data.message }),
    }),
    () => ({ success: true }),
  );
}

// ── Settings → GET/PUT /settings ─────────────────────────────────────────────

function mapSettings(s: LaravelStudentSetting) {
  return {
    notifications: { email: s.notify_email, sms: s.notify_sms, push: s.notify_push },
    accessibility: { high_contrast: s.high_contrast, large_text: s.large_text, reduce_motion: s.reduce_motion },
  };
}

export function getStudentSettings(): Promise<FetchResult<{ success: true; settings: { notifications: { email: boolean; sms: boolean; push: boolean }; accessibility: { high_contrast: boolean; large_text: boolean; reduce_motion: boolean } } }>> {
  return adapt<LaravelStudentSetting, { success: true; settings: ReturnType<typeof mapSettings> }>(
    fetchJson<LaravelStudentSetting>("/settings", { method: "GET" }),
    (s) => ({ success: true, settings: mapSettings(s) }),
  );
}

export function updateStudentSettings(data: { notifications?: { email?: boolean; sms?: boolean; push?: boolean }; accessibility?: { high_contrast?: boolean; large_text?: boolean; reduce_motion?: boolean } }): Promise<FetchResult<{ success: boolean }>> {
  // Reconcile nested notifications/accessibility → Laravel's flat notify_* / *
  // boolean fields. Only defined keys are sent (PUT validates each as sometimes).
  const payload: Record<string, boolean> = {};
  if (data.notifications) {
    if (data.notifications.email !== undefined) payload.notify_email = data.notifications.email;
    if (data.notifications.sms !== undefined) payload.notify_sms = data.notifications.sms;
    if (data.notifications.push !== undefined) payload.notify_push = data.notifications.push;
  }
  if (data.accessibility) {
    if (data.accessibility.high_contrast !== undefined) payload.high_contrast = data.accessibility.high_contrast;
    if (data.accessibility.large_text !== undefined) payload.large_text = data.accessibility.large_text;
    if (data.accessibility.reduce_motion !== undefined) payload.reduce_motion = data.accessibility.reduce_motion;
  }
  return adapt<LaravelStudentSetting, { success: boolean }>(
    fetchJson<LaravelStudentSetting>("/settings", { method: "PUT", body: JSON.stringify(payload) }),
    () => ({ success: true }),
  );
}
