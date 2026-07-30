import { fetchJson, type FetchResult } from "../api";

// ── School Profile ──────────────────────────────────────────────────────

export type SchoolProfile = {
  id: number; name: string; short_name: string; email: string; phone: string;
  address: string; city: string; state: string; country: string; logo_url: string;
  website: string; motto: string; founded_year: number; school_type: string;
  created_at: string; updated_at: string;
};
export function getSchoolProfile(): Promise<FetchResult<{ success: true; school: SchoolProfile }>> {
  return fetchJson("/schools/profile.php", { method: "GET" });
}
export function updateSchoolProfile(data: Partial<SchoolProfile>): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/profile.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Campuses ────────────────────────────────────────────────────────────

export type Campus = { id: number; name: string; address: string; city: string; state: string; phone: string; is_main: boolean };
export function getCampuses(): Promise<FetchResult<{ success: true; campuses: Campus[] }>> {
  return fetchJson("/schools/campuses.php", { method: "GET" });
}
export function createCampus(data: { name: string; address?: string; is_main?: boolean }): Promise<FetchResult<{ success: boolean; campus_id?: number }>> {
  return fetchJson("/schools/campuses.php", { method: "POST", body: JSON.stringify(data) });
}
export function deleteCampus(id: number): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/campuses.php", { method: "DELETE", body: JSON.stringify({ id }) });
}

// ── Academic Sessions ───────────────────────────────────────────────────

export type AcademicSession = { id: number; name: string; start_date: string; end_date: string; is_current: boolean; is_active: boolean };
export function getAcademicSessions(): Promise<FetchResult<{ success: true; sessions: AcademicSession[] }>> {
  return fetchJson("/schools/sessions.php", { method: "GET" });
}
export function createAcademicSession(data: { name: string; start_date: string; end_date: string }): Promise<FetchResult<{ success: boolean; session_id?: number }>> {
  return fetchJson("/schools/sessions.php", { method: "POST", body: JSON.stringify(data) });
}
export function setCurrentSession(id: number): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/sessions.php", { method: "POST", body: JSON.stringify({ id, action: "set_current" }) });
}

// ── Terms ───────────────────────────────────────────────────────────────

export type Term = { id: number; session_id: number; name: string; start_date: string; end_date: string; is_current: boolean };
export function getTerms(sessionId?: number): Promise<FetchResult<{ success: true; terms: Term[] }>> {
  const params = sessionId ? `?session_id=${sessionId}` : "";
  return fetchJson(`/schools/terms.php${params}`, { method: "GET" });
}
export function createTerm(data: { session_id: number; name: string; start_date: string; end_date: string }): Promise<FetchResult<{ success: boolean; term_id?: number }>> {
  return fetchJson("/schools/terms.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Holidays ────────────────────────────────────────────────────────────

export type Holiday = { id: number; title: string; date: string; description?: string; is_recurring: boolean };
export function getHolidays(): Promise<FetchResult<{ success: true; holidays: Holiday[] }>> {
  return fetchJson("/schools/holidays.php", { method: "GET" });
}
export function createHoliday(data: { title: string; date: string; description?: string }): Promise<FetchResult<{ success: boolean; holiday_id?: number }>> {
  return fetchJson("/schools/holidays.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Classes ─────────────────────────────────────────────────────────────

export type ClassItem = { id: number; name: string; section_count: number; student_count: number; teacher_count: number };
export function getClasses(): Promise<FetchResult<{ success: true; classes: ClassItem[] }>> {
  return fetchJson("/schools/classes.php", { method: "GET" });
}
export function createClass(data: { name: string }): Promise<FetchResult<{ success: boolean; class_id?: number }>> {
  return fetchJson("/schools/classes.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Sections ────────────────────────────────────────────────────────────

export type Section = { id: number; class_id: number; name: string; student_count: number };
export function getSections(classId?: number): Promise<FetchResult<{ success: true; sections: Section[] }>> {
  const params = classId ? `?class_id=${classId}` : "";
  return fetchJson(`/schools/sections.php${params}`, { method: "GET" });
}
export function createSection(data: { class_id: number; name: string }): Promise<FetchResult<{ success: boolean; section_id?: number }>> {
  return fetchJson("/schools/sections.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Departments ─────────────────────────────────────────────────────────

export type Department = { id: number; name: string; head_teacher_name?: string; subject_count: number; teacher_count: number };
export function getDepartments(): Promise<FetchResult<{ success: true; departments: Department[] }>> {
  return fetchJson("/schools/departments.php", { method: "GET" });
}
export function createDepartment(data: { name: string; head_teacher_id?: number }): Promise<FetchResult<{ success: boolean; department_id?: number }>> {
  return fetchJson("/schools/departments.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Subjects ────────────────────────────────────────────────────────────

export type Subject = { id: number; name: string; code: string; department_id?: number; department_name?: string; class_count: number };
export function getSubjects(): Promise<FetchResult<{ success: true; subjects: Subject[] }>> {
  return fetchJson("/schools/subjects.php", { method: "GET" });
}
export function createSubject(data: { name: string; code: string; department_id?: number }): Promise<FetchResult<{ success: boolean; subject_id?: number }>> {
  return fetchJson("/schools/subjects.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Enrollments ─────────────────────────────────────────────────────────

export type Enrollment = { id: number; student_id: number; class_id: number; section_id?: number; academic_session_id: number; enrolled_at: string; student_name: string; class_name: string; section_name?: string; session_name: string };
export function getEnrollments(classId?: number): Promise<FetchResult<{ success: true; enrollments: Enrollment[] }>> {
  const params = classId ? `?class_id=${classId}` : "";
  return fetchJson(`/schools/enrollments.php${params}`, { method: "GET" });
}
export function createEnrollment(data: { student_id: number; class_id: number; section_id?: number; academic_session_id: number }): Promise<FetchResult<{ success: boolean; enrollment_id?: number }>> {
  return fetchJson("/schools/enrollments.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Students (existing + extended) ──────────────────────────────────────

export type Student = { id: number; name: string; email: string; phone?: string; enrolled_at: string; status?: string; class_name?: string; guardian_name?: string };
export type StudentsResponse = { success: true; school: string; students: Student[] };

export function getStudents(): Promise<FetchResult<StudentsResponse>> {
  return fetchJson<StudentsResponse>("/schools/students.php", { method: "GET" });
}

export function enrollStudent(studentId: number, courseId: number): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return fetchJson("/schools/students.php", {
    method: "POST",
    body: JSON.stringify({ student_id: studentId, course_id: courseId }),
  });
}

export function getStudentDetail(id: number): Promise<FetchResult<{ success: true; student: Student & { address?: string; date_of_birth?: string; gender?: string; guardian?: { name: string; email: string; phone: string; relationship: string } } }>> {
  return fetchJson(`/schools/students.php?id=${id}`, { method: "GET" });
}

export function registerStudent(data: { name: string; email: string; phone?: string; date_of_birth?: string; gender?: string; address?: string; class_id?: number }): Promise<FetchResult<{ success: boolean; student_id?: number }>> {
  return fetchJson("/schools/students.php", { method: "POST", body: JSON.stringify({ action: "register", ...data }) });
}

export function updateStudentStatus(studentId: number, status: string): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/students.php", { method: "POST", body: JSON.stringify({ action: "update_status", student_id: studentId, status }) });
}

export function transferStudent(studentId: number, newClassId: number, newSectionId?: number): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/students.php", { method: "POST", body: JSON.stringify({ action: "transfer", student_id: studentId, new_class_id: newClassId, new_section_id: newSectionId }) });
}

// ── Guardians ───────────────────────────────────────────────────────────

export type Guardian = { id: number; student_id: number; name: string; email: string; phone: string; relationship: string; is_primary: boolean };
export function getGuardians(studentId: number): Promise<FetchResult<{ success: true; guardians: Guardian[] }>> {
  return fetchJson(`/schools/guardians.php?student_id=${studentId}`, { method: "GET" });
}
export function addGuardian(data: { student_id: number; name: string; email: string; phone: string; relationship: string; is_primary?: boolean }): Promise<FetchResult<{ success: boolean; guardian_id?: number }>> {
  return fetchJson("/schools/guardians.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Documents / IDs ─────────────────────────────────────────────────────

export type StudentDocument = { id: number; student_id: number; document_type: string; file_url: string; uploaded_at: string; verified: boolean };
export function getStudentDocuments(studentId: number): Promise<FetchResult<{ success: true; documents: StudentDocument[] }>> {
  return fetchJson(`/schools/documents.php?student_id=${studentId}`, { method: "GET" });
}

// ── Teachers ────────────────────────────────────────────────────────────

export type Teacher = { id: number; name: string; email: string; phone?: string; department_name?: string; subject_count: number; class_count: number; status: string };
export function getTeachers(): Promise<FetchResult<{ success: true; teachers: Teacher[] }>> {
  return fetchJson("/schools/teachers.php", { method: "GET" });
}
export function createTeacher(data: { name: string; email: string; phone?: string }): Promise<FetchResult<{ success: boolean; teacher_id?: number; error?: string }>> {
  return fetchJson("/schools/teachers.php", { method: "POST", body: JSON.stringify({ action: "register", ...data }) });
}
export function getTeacherDetail(id: number): Promise<FetchResult<{ success: true; teacher: Teacher & { subjects: { id: number; name: string }[]; classes: { id: number; name: string }[] } }>> {
  return fetchJson(`/schools/teachers.php?id=${id}`, { method: "GET" });
}
export function assignTeacherSubject(data: { teacher_id: number; subject_id: number }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/teachers.php", { method: "POST", body: JSON.stringify({ action: "assign_subject", ...data }) });
}
export function assignTeacherClass(data: { teacher_id: number; class_id: number }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/teachers.php", { method: "POST", body: JSON.stringify({ action: "assign_class", ...data }) });
}

// ── User Management ─────────────────────────────────────────────────────

export type AppUser = { id: number; name: string; email: string; role: string; status: string; last_login?: string; created_at: string };
export function getUsers(): Promise<FetchResult<{ success: true; users: AppUser[] }>> {
  return fetchJson("/schools/users.php", { method: "GET" });
}
export function inviteUser(data: { name: string; email: string; role: string }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/users.php", { method: "POST", body: JSON.stringify({ action: "invite", ...data }) });
}
export function toggleUserStatus(userId: number, activate: boolean): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/users.php", { method: "POST", body: JSON.stringify({ action: activate ? "activate" : "deactivate", user_id: userId }) });
}
export type UserStatus = "active" | "inactive" | "graduated" | "expelled" | "transferred";
export function setUserStatus(userId: number, status: UserStatus): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/users.php", { method: "POST", body: JSON.stringify({ action: "set_status", user_id: userId, status }) });
}
export function updateUserRole(userId: number, role: string): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/users.php", { method: "POST", body: JSON.stringify({ action: "update_role", user_id: userId, role }) });
}

// ── Bulk Import ─────────────────────────────────────────────────────────

export function bulkImportStudents(data: { csv_data: string; class_id?: number }): Promise<FetchResult<{ success: boolean; imported: number; duplicates: number; errors: string[] }>> {
  return fetchJson("/schools/import-students.php", { method: "POST", body: JSON.stringify(data) });
}
export function bulkImportTeachers(data: { csv_data: string }): Promise<FetchResult<{ success: boolean; imported: number; duplicates: number; errors: string[] }>> {
  return fetchJson("/schools/import-teachers.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Attendance (existing + extended) ────────────────────────────────────

export type AttendanceRecord = { id?: number; name: string; email: string; status: string; date: string; marked_by?: string; notes?: string };
export type AttendanceResponse = { success: true; date: string; attendance: AttendanceRecord[] };

export function getAttendance(date?: string): Promise<FetchResult<AttendanceResponse>> {
  const params = date ? `?date=${date}` : "";
  return fetchJson<AttendanceResponse>(`/schools/attendance.php${params}`, { method: "GET" });
}

export function recordAttendance(studentId: number, status: string, date?: string, notes?: string): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/attendance.php", {
    method: "POST",
    body: JSON.stringify({ student_id: studentId, status, date, notes }),
  });
}

export function bulkRecordAttendance(data: { date: string; records: { student_id: number; status: string }[] }): Promise<FetchResult<{ success: boolean; processed: number }>> {
  return fetchJson("/schools/attendance.php", { method: "POST", body: JSON.stringify({ action: "bulk", ...data }) });
}

export type AttendanceCorrection = { id: number; student_name: string; original_status: string; new_status: string; reason: string; status: string; submitted_at: string };

export function submitAttendanceCorrection(attendanceId: number, newStatus: string, reason: string): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/attendance-corrections.php", { method: "POST", body: JSON.stringify({ attendance_id: attendanceId, new_status: newStatus, reason }) });
}

export function getAttendanceCorrections(): Promise<FetchResult<{ success: true; corrections: AttendanceCorrection[] }>> {
  return fetchJson("/schools/attendance-corrections.php", { method: "GET" });
}

export function approveAttendanceCorrection(id: number, approve: boolean): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/attendance-corrections.php", { method: "POST", body: JSON.stringify({ id, action: approve ? "approve" : "reject" }) });
}

// ── Timetable (extended) ────────────────────────────────────────────────

export type TimetableEntry = { id: number; school_id: number; subject: string; day: string; start_time: string; end_time: string; teacher_name?: string; class_name?: string; room?: string };
export type TimetableResponse = { success: true; timetable: TimetableEntry[] };

export function getTimetable(classId?: number): Promise<FetchResult<TimetableResponse>> {
  const params = classId ? `?class_id=${classId}` : "";
  return fetchJson<TimetableResponse>(`/schools/timetable.php${params}`, { method: "GET" });
}

export function createTimetableEntry(data: { subject: string; day: string; start_time: string; end_time: string; teacher_id?: number; class_id?: number; room?: string }): Promise<FetchResult<{ success: boolean; entry_id?: number }>> {
  return fetchJson("/schools/timetable.php", { method: "POST", body: JSON.stringify(data) });
}

export function deleteTimetableEntry(id: number): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/timetable.php", { method: "DELETE", body: JSON.stringify({ id }) });
}

// ── Assessments / Grading Config ────────────────────────────────────────

export type AssessmentConfig = { id: number; name: string; max_score: number; weight: number; session_id: number; term_id: number };
export function getAssessmentConfigs(): Promise<FetchResult<{ success: true; assessments: AssessmentConfig[] }>> {
  return fetchJson("/schools/assessments.php", { method: "GET" });
}
export function createAssessmentConfig(data: { name: string; max_score: number; weight: number; session_id: number; term_id: number }): Promise<FetchResult<{ success: boolean; assessment_id?: number }>> {
  return fetchJson("/schools/assessments.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Results ─────────────────────────────────────────────────────────────

export type Result = { id: number; student_id: number; student_name: string; subject: string; score: number; grade: string; status: string; submitted_at: string; reviewed_by?: string };
export function getResults(status?: string): Promise<FetchResult<{ success: true; results: Result[] }>> {
  const params = status ? `?status=${status}` : "";
  return fetchJson(`/schools/results.php${params}`, { method: "GET" });
}
export function reviewResult(id: number, action: "approve" | "reject", comment?: string): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/results.php", { method: "POST", body: JSON.stringify({ id, action, comment }) });
}
export function publishResults(): Promise<FetchResult<{ success: boolean; published_count?: number }>> {
  return fetchJson("/schools/results.php", { method: "POST", body: JSON.stringify({ action: "publish" }) });
}

// ── Announcements ───────────────────────────────────────────────────────

export type Announcement = { id: number; title: string; content: string; target_role?: string; target_class_id?: number; created_by: string; created_at: string; read_count: number };
export function getAnnouncements(): Promise<FetchResult<{ success: true; announcements: Announcement[] }>> {
  return fetchJson("/schools/announcements.php", { method: "GET" });
}
export function createAnnouncement(data: { title: string; content: string; target_role?: string; target_class_id?: number }): Promise<FetchResult<{ success: boolean; announcement_id?: number }>> {
  return fetchJson("/schools/announcements.php", { method: "POST", body: JSON.stringify(data) });
}

// ── Notifications ───────────────────────────────────────────────────────

export type NotificationLog = { id: number; user_id: number; user_name: string; channel: string; title: string; status: string; sent_at: string; read_at?: string };
export function getNotificationLogs(): Promise<FetchResult<{ success: true; notifications: NotificationLog[] }>> {
  return fetchJson("/schools/notifications.php", { method: "GET" });
}

// ── Reports ─────────────────────────────────────────────────────────────

export type EnrollmentReport = { class_name: string; section_name?: string; student_count: number; teacher_count: number };
export function getEnrollmentReport(): Promise<FetchResult<{ success: true; report: EnrollmentReport[] }>> {
  return fetchJson("/schools/reports/enrollment.php", { method: "GET" });
}
export function getAttendanceReport(from?: string, to?: string): Promise<FetchResult<{ success: true; report: { date: string; present: number; absent: number; late: number; total: number }[] }>> {
  const params = from && to ? `?from=${from}&to=${to}` : "";
  return fetchJson(`/schools/reports/attendance.php${params}`, { method: "GET" });
}
export function getPerformanceReport(): Promise<FetchResult<{ success: true; report: { subject: string; average_score: number; pass_rate: number; student_count: number }[] }>> {
  return fetchJson("/schools/reports/performance.php", { method: "GET" });
}
export function getTeacherWorkloadReport(): Promise<FetchResult<{ success: true; report: { teacher_name: string; subject_count: number; class_count: number; total_hours: number }[] }>> {
  return fetchJson("/schools/reports/workload.php", { method: "GET" });
}
export function getUserActivityReport(): Promise<FetchResult<{ success: true; report: { user_name: string; role: string; login_count: number; last_active: string }[] }>> {
  return fetchJson("/schools/reports/activity.php", { method: "GET" });
}

// ── Security / Audit ────────────────────────────────────────────────────

export type AuditLog = { id: number; user_name: string; action: string; resource: string; details?: string; ip_address: string; created_at: string };
export function getAuditLogs(): Promise<FetchResult<{ success: true; logs: AuditLog[] }>> {
  return fetchJson("/schools/audit-logs.php", { method: "GET" });
}
export function getLoginHistory(): Promise<FetchResult<{ success: true; history: { id: number; user_name: string; ip_address: string; user_agent: string; login_at: string }[] }>> {
  return fetchJson("/schools/login-history.php", { method: "GET" });
}
export function updateSecuritySettings(data: { two_factor_enabled?: boolean; password_policy?: string; session_timeout?: number }): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/security.php", { method: "POST", body: JSON.stringify(data) });
}
