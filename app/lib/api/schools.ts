/**
 * School data client for the SabiHub Laravel API.
 *
 * These wrappers used to hit the old PHP endpoints (/schools/*.php). They now
 * call the Laravel routes (see backend/routes/api.php) and translate Laravel's
 * responses back into the old { success, ... } wrapper shapes at this boundary,
 * exactly like app/lib/auth.ts does with `toAuth`. Every exported function keeps
 * its original name, parameters and RETURN TYPE, so the React components that
 * import them do not change.
 *
 * Laravel list endpoints return either a bare array (most) or a paginated
 * object ({ data, total, ... } for /users, /students, /teachers, security logs);
 * create/store endpoints return the created model. Errors come back as
 * { message } (or 422 { message, errors }) and are mapped to { success:false,
 * error }. Functions with no Laravel route yet return a graceful 501.
 */

import { fetchJson, type FetchResult } from "../api";

// ── Adapter helpers ────────────────────────────────────────────────────────

/** A Laravel length-aware paginator payload. */
type Paginated<T> = { data: T[]; total?: number };

/** Created-model shape we care about from a store endpoint. */
type Created = { id: number };

/** Pull a user-safe error message out of a Laravel error body. */
function errMsg(res: FetchResult<unknown>): string {
  const body = res.data as { message?: string; error?: string } | null;
  return body?.message ?? body?.error ?? "Something went wrong.";
}

/** Build a failed FetchResult carrying the old { success:false, error } body,
 * cast to the caller's success-only return type (mirrors auth.ts). */
function fail<T>(status: number, message: string): FetchResult<T> {
  return { ok: false, status, data: { success: false, error: message } as unknown as T };
}

/** No Laravel route exists yet — return a graceful 501 the UI can branch on. */
function unavailable<T>(): FetchResult<T> {
  return fail<T>(501, "Not available yet");
}

/** Unwrap either a bare array or a paginated { data } payload into an array. */
function toArray<T>(data: Paginated<T> | T[] | null): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : (data.data ?? []);
}

// ── School Profile ──────────────────────────────────────────────────────
// No Laravel route — STUBBED.

export type SchoolProfile = {
  id: number; name: string; short_name: string; email: string; phone: string;
  address: string; city: string; state: string; country: string; logo_url: string;
  website: string; motto: string; founded_year: number; school_type: string;
  created_at: string; updated_at: string;
};
export async function getSchoolProfile(): Promise<FetchResult<{ success: true; school: SchoolProfile }>> {
  // GET /profile → the school object
  const res = await fetchJson<SchoolProfile>("/profile", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, school: res.data as SchoolProfile } };
  return fail(res.status, errMsg(res));
}
export async function updateSchoolProfile(data: Partial<SchoolProfile>): Promise<FetchResult<{ success: boolean }>> {
  // PUT /profile → updated model
  const res = await fetchJson<SchoolProfile>("/profile", { method: "PUT", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res));
}

// ── Campuses ────────────────────────────────────────────────────────────
// No Laravel route — STUBBED.

export type Campus = { id: number; name: string; address: string; city: string; state: string; phone: string; is_main: boolean };
export async function getCampuses(): Promise<FetchResult<{ success: true; campuses: Campus[] }>> {
  // GET /campuses → bare array
  const res = await fetchJson<Campus[]>("/campuses", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, campuses: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createCampus(data: { name: string; address?: string; is_main?: boolean }): Promise<FetchResult<{ success: boolean; campus_id?: number }>> {
  // POST /campuses → created model
  const res = await fetchJson<Created>("/campuses", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, campus_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}
export async function deleteCampus(id: number): Promise<FetchResult<{ success: boolean }>> {
  // DELETE /campuses/{id}
  const res = await fetchJson<unknown>(`/campuses/${id}`, { method: "DELETE" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}

// ── Academic Sessions ───────────────────────────────────────────────────

export type AcademicSession = { id: number; name: string; start_date: string; end_date: string; is_current: boolean; is_active: boolean };
export async function getAcademicSessions(): Promise<FetchResult<{ success: true; sessions: AcademicSession[] }>> {
  // GET /sessions → bare array
  const res = await fetchJson<AcademicSession[]>("/sessions", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, sessions: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createAcademicSession(data: { name: string; start_date: string; end_date: string }): Promise<FetchResult<{ success: boolean; session_id?: number }>> {
  // POST /sessions → created model
  const res = await fetchJson<Created>("/sessions", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, session_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}
export async function setCurrentSession(id: number): Promise<FetchResult<{ success: boolean }>> {
  // POST /sessions/{id}/set-current → updated model
  const res = await fetchJson<Created>(`/sessions/${id}/set-current`, { method: "POST" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res));
}

// ── Terms ───────────────────────────────────────────────────────────────

export type Term = { id: number; session_id: number; name: string; start_date: string; end_date: string; is_current: boolean };
export async function getTerms(sessionId?: number): Promise<FetchResult<{ success: true; terms: Term[] }>> {
  // GET /terms?session_id= → bare array
  const params = sessionId ? `?session_id=${sessionId}` : "";
  const res = await fetchJson<Term[]>(`/terms${params}`, { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, terms: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createTerm(data: { session_id: number; name: string; start_date: string; end_date: string }): Promise<FetchResult<{ success: boolean; term_id?: number }>> {
  // POST /terms → created model (Laravel expects academic_session_id)
  const body = { academic_session_id: data.session_id, name: data.name, start_date: data.start_date, end_date: data.end_date };
  const res = await fetchJson<Created>("/terms", { method: "POST", body: JSON.stringify(body) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, term_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Holidays ────────────────────────────────────────────────────────────

export type Holiday = { id: number; title: string; date: string; description?: string; is_recurring: boolean };
export async function getHolidays(): Promise<FetchResult<{ success: true; holidays: Holiday[] }>> {
  // GET /holidays → bare array
  const res = await fetchJson<Holiday[]>("/holidays", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, holidays: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createHoliday(data: { title: string; date: string; description?: string }): Promise<FetchResult<{ success: boolean; holiday_id?: number }>> {
  // POST /holidays → created model
  const res = await fetchJson<Created>("/holidays", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, holiday_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Classes ─────────────────────────────────────────────────────────────

export type ClassItem = { id: number; name: string; section_count: number; student_count: number; teacher_count: number };
export async function getClasses(): Promise<FetchResult<{ success: true; classes: ClassItem[] }>> {
  // GET /classes → bare array
  const res = await fetchJson<ClassItem[]>("/classes", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, classes: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createClass(data: { name: string }): Promise<FetchResult<{ success: boolean; class_id?: number }>> {
  // POST /classes → created model
  const res = await fetchJson<Created>("/classes", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, class_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Sections ────────────────────────────────────────────────────────────
// No Laravel route — STUBBED.

export type Section = { id: number; class_id: number; name: string; student_count: number };
export async function getSections(classId?: number): Promise<FetchResult<{ success: true; sections: Section[] }>> {
  // GET /sections?class_id= → bare array
  const params = classId ? `?class_id=${classId}` : "";
  const res = await fetchJson<Section[]>(`/sections${params}`, { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, sections: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createSection(data: { class_id: number; name: string }): Promise<FetchResult<{ success: boolean; section_id?: number }>> {
  // POST /sections → created model
  const res = await fetchJson<Created>("/sections", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, section_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Departments ─────────────────────────────────────────────────────────
// No Laravel route — STUBBED.

export type Department = { id: number; name: string; head_teacher_name?: string; subject_count: number; teacher_count: number };
export async function getDepartments(): Promise<FetchResult<{ success: true; departments: Department[] }>> {
  // GET /departments → bare array
  const res = await fetchJson<Department[]>("/departments", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, departments: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createDepartment(data: { name: string; head_teacher_id?: number }): Promise<FetchResult<{ success: boolean; department_id?: number }>> {
  // POST /departments → created model
  const res = await fetchJson<Created>("/departments", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, department_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Subjects ────────────────────────────────────────────────────────────

export type Subject = { id: number; name: string; code: string; department_id?: number; department_name?: string; class_count: number };
export async function getSubjects(): Promise<FetchResult<{ success: true; subjects: Subject[] }>> {
  // GET /subjects → bare array
  const res = await fetchJson<Subject[]>("/subjects", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, subjects: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createSubject(data: { name: string; code: string; department_id?: number }): Promise<FetchResult<{ success: boolean; subject_id?: number }>> {
  // POST /subjects → created model
  const res = await fetchJson<Created>("/subjects", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, subject_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Enrollments ─────────────────────────────────────────────────────────

export type Enrollment = { id: number; student_id: number; class_id: number; section_id?: number; academic_session_id: number; enrolled_at: string; student_name: string; class_name: string; section_name?: string; session_name: string };
export async function getEnrollments(classId?: number): Promise<FetchResult<{ success: true; enrollments: Enrollment[] }>> {
  // GET /enrollments?class_id= → bare array
  const params = classId ? `?class_id=${classId}` : "";
  const res = await fetchJson<Enrollment[]>(`/enrollments${params}`, { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, enrollments: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createEnrollment(data: { student_id: number; class_id: number; section_id?: number; academic_session_id: number }): Promise<FetchResult<{ success: boolean; enrollment_id?: number }>> {
  // POST /enrollments → created model (Laravel expects school_class_id)
  const body = { student_id: data.student_id, school_class_id: data.class_id, section_id: data.section_id };
  const res = await fetchJson<Created>("/enrollments", { method: "POST", body: JSON.stringify(body) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, enrollment_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Students (existing + extended) ──────────────────────────────────────

export type Student = { id: number; name: string; email: string; phone?: string; enrolled_at: string; status?: string; class_name?: string; guardian_name?: string };
export type StudentsResponse = { success: true; school: string; students: Student[] };

export async function getStudents(): Promise<FetchResult<StudentsResponse>> {
  // GET /students → paginated { data: [...] }
  const res = await fetchJson<Paginated<Student>>("/students", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, school: "", students: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}

export async function enrollStudent(_studentId: number, _courseId: number): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return unavailable(); // no Laravel route (course enrollment differs from class /enrollments)
}

export async function getStudentDetail(_id: number): Promise<FetchResult<{ success: true; student: Student & { address?: string; date_of_birth?: string; gender?: string; guardian?: { name: string; email: string; phone: string; relationship: string } } }>> {
  return unavailable(); // no Laravel route (no per-id student endpoint)
}

export async function registerStudent(data: { name: string; email: string; phone?: string; date_of_birth?: string; gender?: string; address?: string; class_id?: number }): Promise<FetchResult<{ success: boolean; student_id?: number }>> {
  // POST /students → created model (Laravel validates name + email only)
  const res = await fetchJson<Created>("/students", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, student_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

export async function updateStudentStatus(studentId: number, status: string): Promise<FetchResult<{ success: boolean }>> {
  // POST /users/{studentId}/status
  const res = await fetchJson<unknown>(`/users/${studentId}/status`, { method: "POST", body: JSON.stringify({ status }) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}

export async function transferStudent(studentId: number, newClassId: number, _newSectionId?: number): Promise<FetchResult<{ success: boolean }>> {
  // POST /transfers → promote/transfer a student to a new class
  const body = { student_id: studentId, new_class_id: newClassId, action: "promote" };
  const res = await fetchJson<unknown>("/transfers", { method: "POST", body: JSON.stringify(body) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}

// ── Guardians ───────────────────────────────────────────────────────────
// No compatible Laravel route — STUBBED. (POST /parent-links links an EXISTING
// parent user to a child by ids; it does not create a guardian record, and
// there is no GET.)

export type Guardian = { id: number; student_id: number; name: string; email: string; phone: string; relationship: string; is_primary: boolean };
export async function getGuardians(_studentId: number): Promise<FetchResult<{ success: true; guardians: Guardian[] }>> {
  return unavailable(); // no Laravel route
}
export async function addGuardian(_data: { student_id: number; name: string; email: string; phone: string; relationship: string; is_primary?: boolean }): Promise<FetchResult<{ success: boolean; guardian_id?: number }>> {
  return unavailable(); // no compatible Laravel route
}

// ── Documents / IDs ─────────────────────────────────────────────────────
// No Laravel route — STUBBED.

export type StudentDocument = { id: number; student_id: number; document_type: string; file_url: string; uploaded_at: string; verified: boolean };
export async function getStudentDocuments(_studentId: number): Promise<FetchResult<{ success: true; documents: StudentDocument[] }>> {
  return unavailable(); // no Laravel route
}

// ── Teachers ────────────────────────────────────────────────────────────

export type Teacher = { id: number; name: string; email: string; phone?: string; department_name?: string; subject_count: number; class_count: number; status: string };
export async function getTeachers(): Promise<FetchResult<{ success: true; teachers: Teacher[] }>> {
  // GET /teachers → paginated { data: [...] }
  const res = await fetchJson<Paginated<Teacher>>("/teachers", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, teachers: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createTeacher(_data: { name: string; email: string; phone?: string }): Promise<FetchResult<{ success: boolean; teacher_id?: number; error?: string }>> {
  return unavailable(); // no Laravel route (teachers join via /invitations, not a teacher store)
}
export async function getTeacherDetail(_id: number): Promise<FetchResult<{ success: true; teacher: Teacher & { subjects: { id: number; name: string }[]; classes: { id: number; name: string }[] } }>> {
  return unavailable(); // no Laravel route
}
export async function assignTeacherSubject(_data: { teacher_id: number; subject_id: number }): Promise<FetchResult<{ success: boolean }>> {
  return unavailable(); // no Laravel route
}
export async function assignTeacherClass(_data: { teacher_id: number; class_id: number }): Promise<FetchResult<{ success: boolean }>> {
  return unavailable(); // no Laravel route
}

// ── User Management ─────────────────────────────────────────────────────

export type AppUser = { id: number; name: string; email: string; role: string; status: string; last_login?: string; created_at: string };
export async function getUsers(): Promise<FetchResult<{ success: true; users: AppUser[] }>> {
  // GET /users → paginated { data: [...] }
  const res = await fetchJson<Paginated<AppUser>>("/users", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, users: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function inviteUser(data: { name: string; email: string; role: string }): Promise<FetchResult<{ success: boolean }>> {
  // POST /invitations → { invitation, accept_url, token }
  const res = await fetchJson<{ token?: string }>("/invitations", { method: "POST", body: JSON.stringify({ email: data.email, role: data.role }) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res));
}
export async function toggleUserStatus(userId: number, activate: boolean): Promise<FetchResult<{ success: boolean }>> {
  // POST /users/{userId}/status
  const res = await fetchJson<unknown>(`/users/${userId}/status`, { method: "POST", body: JSON.stringify({ status: activate ? "active" : "inactive" }) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}
export type UserStatus = "active" | "inactive" | "graduated" | "expelled" | "transferred";
export async function setUserStatus(userId: number, status: UserStatus): Promise<FetchResult<{ success: boolean }>> {
  // POST /users/{userId}/status
  const res = await fetchJson<unknown>(`/users/${userId}/status`, { method: "POST", body: JSON.stringify({ status }) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}
export async function updateUserRole(userId: number, role: string): Promise<FetchResult<{ success: boolean }>> {
  // POST /users/{userId}/role
  const res = await fetchJson<unknown>(`/users/${userId}/role`, { method: "POST", body: JSON.stringify({ role }) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}

// ── Bulk Import ─────────────────────────────────────────────────────────
// No Laravel route — STUBBED.

type ImportResult = { imported?: number; duplicates?: number; errors?: string[] };
export async function bulkImportStudents(data: { csv_data: string; class_id?: number }): Promise<FetchResult<{ success: boolean; imported: number; duplicates: number; errors: string[] }>> {
  // POST /import/students → { imported, duplicates, errors }
  const res = await fetchJson<ImportResult>("/import/students", { method: "POST", body: JSON.stringify({ csv_data: data.csv_data }) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, imported: res.data?.imported ?? 0, duplicates: res.data?.duplicates ?? 0, errors: res.data?.errors ?? [] } };
  return fail(res.status, errMsg(res));
}
export async function bulkImportTeachers(data: { csv_data: string }): Promise<FetchResult<{ success: boolean; imported: number; duplicates: number; errors: string[] }>> {
  // POST /import/teachers → { imported, duplicates, errors }
  const res = await fetchJson<ImportResult>("/import/teachers", { method: "POST", body: JSON.stringify({ csv_data: data.csv_data }) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, imported: res.data?.imported ?? 0, duplicates: res.data?.duplicates ?? 0, errors: res.data?.errors ?? [] } };
  return fail(res.status, errMsg(res));
}

// ── Attendance (existing + extended) ────────────────────────────────────

export type AttendanceRecord = { id?: number; name: string; email: string; status: string; date: string; marked_by?: string; notes?: string };
export type AttendanceResponse = { success: true; date: string; attendance: AttendanceRecord[] };

export async function getAttendance(date?: string): Promise<FetchResult<AttendanceResponse>> {
  // GET /attendance?date= → bare array
  const params = date ? `?date=${date}` : "";
  const res = await fetchJson<AttendanceRecord[]>(`/attendance${params}`, { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, date: date ?? "", attendance: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}

export async function recordAttendance(_studentId: number, _status: string, _date?: string, _notes?: string): Promise<FetchResult<{ success: boolean }>> {
  return unavailable(); // no compatible route: POST /attendance is class-batch (requires class_id), not single-record
}

export async function bulkRecordAttendance(data: { date: string; records: { student_id: number; status: string }[] }): Promise<FetchResult<{ success: boolean; processed: number }>> {
  // POST /attendance → class-batch upsert. NOTE: Laravel also requires class_id,
  // which the old signature does not supply (see report).
  const res = await fetchJson<unknown[]>("/attendance", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, processed: Array.isArray(res.data) ? res.data.length : 0 } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}

export type AttendanceCorrection = { id: number; student_name: string; original_status: string; new_status: string; reason: string; status: string; submitted_at: string };

export async function submitAttendanceCorrection(_attendanceId: number, _newStatus: string, _reason: string): Promise<FetchResult<{ success: boolean }>> {
  return unavailable(); // no Laravel route
}

export async function getAttendanceCorrections(): Promise<FetchResult<{ success: true; corrections: AttendanceCorrection[] }>> {
  return unavailable(); // no Laravel route
}

export async function approveAttendanceCorrection(_id: number, _approve: boolean): Promise<FetchResult<{ success: boolean }>> {
  return unavailable(); // no Laravel route
}

// ── Timetable (extended) ────────────────────────────────────────────────

export type TimetableEntry = { id: number; school_id: number; subject: string; day: string; start_time: string; end_time: string; teacher_name?: string; class_name?: string; room?: string };
export type TimetableResponse = { success: true; timetable: TimetableEntry[] };

export async function getTimetable(classId?: number): Promise<FetchResult<TimetableResponse>> {
  // GET /timetable?class_id= → bare array
  const params = classId ? `?class_id=${classId}` : "";
  const res = await fetchJson<TimetableEntry[]>(`/timetable${params}`, { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, timetable: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}

export async function createTimetableEntry(data: { class_id: number; subject_id?: number; day: string; start_time: string; end_time: string; teacher_id?: number; room?: string }): Promise<FetchResult<{ success: boolean; entry_id?: number }>> {
  // POST /timetable → created model (Laravel requires school_class_id, optional subject_id)
  const body = { school_class_id: data.class_id, subject_id: data.subject_id, teacher_id: data.teacher_id, day: data.day, start_time: data.start_time, end_time: data.end_time, room: data.room };
  const res = await fetchJson<Created>("/timetable", { method: "POST", body: JSON.stringify(body) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, entry_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

export async function deleteTimetableEntry(id: number): Promise<FetchResult<{ success: boolean }>> {
  // DELETE /timetable/{id}
  const res = await fetchJson<unknown>(`/timetable/${id}`, { method: "DELETE" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}

// ── Assessments / Grading Config ────────────────────────────────────────

export type AssessmentConfig = { id: number; name: string; max_score: number; weight: number; session_id: number; term_id: number };
export async function getAssessmentConfigs(): Promise<FetchResult<{ success: true; assessments: AssessmentConfig[] }>> {
  // GET /assessment-configs → bare array
  const res = await fetchJson<AssessmentConfig[]>("/assessment-configs", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, assessments: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createAssessmentConfig(data: { name: string; max_score: number; weight: number; session_id: number; term_id: number }): Promise<FetchResult<{ success: boolean; assessment_id?: number }>> {
  // POST /assessment-configs → created model
  const res = await fetchJson<Created>("/assessment-configs", { method: "POST", body: JSON.stringify(data) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, assessment_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Results ─────────────────────────────────────────────────────────────

export type Result = { id: number; student_id: number; student_name: string; subject: string; score: number; grade: string; status: string; submitted_at: string; reviewed_by?: string };
export async function getResults(status?: string): Promise<FetchResult<{ success: true; results: Result[] }>> {
  // GET /results → bare array (filtered client-side to preserve the old ?status= contract)
  const res = await fetchJson<Result[]>("/results", { method: "GET" });
  if (res.ok) {
    const all = toArray(res.data);
    const results = status ? all.filter((r) => r.status === status) : all;
    return { ok: true, status: res.status, data: { success: true, results } };
  }
  return fail(res.status, errMsg(res));
}
export async function reviewResult(id: number, action: "approve" | "reject", _comment?: string): Promise<FetchResult<{ success: boolean }>> {
  // POST /results/{id}/approve or POST /results/{id}/reject
  const path = action === "approve" ? `/results/${id}/approve` : `/results/${id}/reject`;
  const res = await fetchJson<Created>(path, { method: "POST" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true } };
  return fail(res.status, errMsg(res));
}
export async function publishResults(): Promise<FetchResult<{ success: boolean; published_count?: number }>> {
  // POST /results/publish-all → { published: n }
  const res = await fetchJson<{ published?: number }>("/results/publish-all", { method: "POST" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, published_count: res.data?.published ?? 0 } };
  return fail(res.status, errMsg(res));
}

// ── Announcements ───────────────────────────────────────────────────────

export type Announcement = { id: number; title: string; content: string; target_role?: string; target_class_id?: number; created_by: string; created_at: string; read_count: number };
export async function getAnnouncements(): Promise<FetchResult<{ success: true; announcements: Announcement[] }>> {
  // GET /announcements → bare array
  const res = await fetchJson<Announcement[]>("/announcements", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, announcements: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function createAnnouncement(data: { title: string; content: string; target_role?: string; target_class_id?: number }): Promise<FetchResult<{ success: boolean; announcement_id?: number }>> {
  // POST /announcements → created model (Laravel expects `body` + a required target_role)
  const body = { title: data.title, body: data.content, target_role: data.target_role ?? "all" };
  const res = await fetchJson<Created>("/announcements", { method: "POST", body: JSON.stringify(body) });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, announcement_id: res.data?.id } };
  return fail(res.status, errMsg(res));
}

// ── Notifications ───────────────────────────────────────────────────────

export type NotificationLog = { id: number; user_id: number; user_name: string; channel: string; title: string; status: string; sent_at: string; read_at?: string };
export async function getNotificationLogs(): Promise<FetchResult<{ success: true; notifications: NotificationLog[] }>> {
  // GET /notifications → bare array (current user's own notifications)
  const res = await fetchJson<NotificationLog[]>("/notifications", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, notifications: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}

// ── Reports ─────────────────────────────────────────────────────────────

export type EnrollmentReport = { class_name: string; section_name?: string; student_count: number; teacher_count: number };
export async function getEnrollmentReport(): Promise<FetchResult<{ success: true; report: EnrollmentReport[] }>> {
  // GET /reports/enrollment → bare array of aggregate rows
  const res = await fetchJson<EnrollmentReport[]>("/reports/enrollment", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, report: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function getAttendanceReport(from?: string, to?: string): Promise<FetchResult<{ success: true; report: { date: string; present: number; absent: number; late: number; total: number }[] }>> {
  // GET /reports/attendance → bare array of aggregate rows
  const params = from && to ? `?from=${from}&to=${to}` : "";
  const res = await fetchJson<{ date: string; present: number; absent: number; late: number; total: number }[]>(`/reports/attendance${params}`, { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, report: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function getPerformanceReport(): Promise<FetchResult<{ success: true; report: { subject: string; average_score: number; pass_rate: number; student_count: number }[] }>> {
  // GET /reports/performance → bare array of aggregate rows
  const res = await fetchJson<{ subject: string; average_score: number; pass_rate: number; student_count: number }[]>("/reports/performance", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, report: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function getTeacherWorkloadReport(): Promise<FetchResult<{ success: true; report: { teacher_name: string; subject_count: number; class_count: number; total_hours: number }[] }>> {
  return unavailable(); // no Laravel route (no /reports/workload)
}
export async function getUserActivityReport(): Promise<FetchResult<{ success: true; report: { user_name: string; role: string; login_count: number; last_active: string }[] }>> {
  // GET /reports/activity EXISTS but returns aggregate totals, NOT the per-user
  // rows this shape expects — see report. We call it but cannot fill the rows.
  const res = await fetchJson<unknown>("/reports/activity", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, report: [] } };
  return fail(res.status, errMsg(res as FetchResult<{ message?: string }>));
}

// ── Security / Audit ────────────────────────────────────────────────────

export type AuditLog = { id: number; user_name: string; action: string; resource: string; details?: string; ip_address: string; created_at: string };
export async function getAuditLogs(): Promise<FetchResult<{ success: true; logs: AuditLog[] }>> {
  // GET /security/audit-logs → paginated { data: [...] }
  const res = await fetchJson<Paginated<AuditLog>>("/security/audit-logs", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, logs: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function getLoginHistory(): Promise<FetchResult<{ success: true; history: { id: number; user_name: string; ip_address: string; user_agent: string; login_at: string }[] }>> {
  // GET /security/login-history → paginated { data: [...] }
  const res = await fetchJson<Paginated<{ id: number; user_name: string; ip_address: string; user_agent: string; login_at: string }>>("/security/login-history", { method: "GET" });
  if (res.ok) return { ok: true, status: res.status, data: { success: true, history: toArray(res.data) } };
  return fail(res.status, errMsg(res));
}
export async function updateSecuritySettings(_data: { two_factor_enabled?: boolean; password_policy?: string; session_timeout?: number }): Promise<FetchResult<{ success: boolean }>> {
  return unavailable(); // no Laravel route
}
