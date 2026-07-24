import { fetchJson, type FetchResult } from "../api";

export type Student = { id: number; name: string; email: string; enrolled_at: string };
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

export type AttendanceRecord = { name: string; email: string; status: string; date: string };
export type AttendanceResponse = { success: true; date: string; attendance: AttendanceRecord[] };

export function getAttendance(date?: string): Promise<FetchResult<AttendanceResponse>> {
  const params = date ? `?date=${date}` : "";
  return fetchJson<AttendanceResponse>(`/schools/attendance.php${params}`, { method: "GET" });
}

export function recordAttendance(studentId: number, status: string, date?: string): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/schools/attendance.php", {
    method: "POST",
    body: JSON.stringify({ student_id: studentId, status, date }),
  });
}

export type TimetableEntry = { id: number; school_id: number; subject: string; day: string; start_time: string; end_time: string };
export type TimetableResponse = { success: true; timetable: TimetableEntry[] };

export function getTimetable(): Promise<FetchResult<TimetableResponse>> {
  return fetchJson<TimetableResponse>("/schools/timetable.php", { method: "GET" });
}

export function createTimetableEntry(data: { subject: string; day: string; start_time: string; end_time: string }): Promise<FetchResult<{ success: boolean; entry_id?: number }>> {
  return fetchJson("/schools/timetable.php", { method: "POST", body: JSON.stringify(data) });
}
