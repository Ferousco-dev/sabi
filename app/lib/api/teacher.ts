import { fetchJson, type FetchResult } from "../api";

export type Lesson = { id: number; course_id: number; teacher_id: number; title: string; content?: string; multimedia_url?: string; course_title?: string; created_at: string; updated_at: string };
export type LessonsResponse = { success: true; lessons: Lesson[] };

export function getLessons(): Promise<FetchResult<LessonsResponse>> {
  return fetchJson<LessonsResponse>("/teacher/lessons.php", { method: "GET" });
}

export function createLesson(data: { course_id: number; title: string; content?: string; multimedia_url?: string }): Promise<FetchResult<{ success: boolean; lesson_id?: number }>> {
  return fetchJson("/teacher/lessons.php", { method: "POST", body: JSON.stringify(data) });
}

export type Assignment = { id: number; lesson_id: number; teacher_id: number; title: string; description?: string; due_date?: string; submission_count: number; created_at: string };
export type AssignmentsResponse = { success: true; assignments: Assignment[] };

export function getAssignments(): Promise<FetchResult<AssignmentsResponse>> {
  return fetchJson<AssignmentsResponse>("/teacher/assignments.php", { method: "GET" });
}

export function createAssignment(data: { lesson_id: number; title: string; description?: string; due_date?: string }): Promise<FetchResult<{ success: boolean; assignment_id?: number }>> {
  return fetchJson("/teacher/assignments.php", { method: "POST", body: JSON.stringify(data) });
}

export type Submission = { id: number; assignment_id: number; student_id: number; content_url?: string; grade?: string; feedback?: string; submitted_at: string; student_name: string };
export type SubmissionsResponse = { success: true; submissions: Submission[] };

export function getSubmissions(assignmentId: number): Promise<FetchResult<SubmissionsResponse>> {
  return fetchJson<SubmissionsResponse>(`/teacher/grading.php?assignment_id=${assignmentId}`, { method: "GET" });
}

export function gradeSubmission(data: { submission_id: number; grade: string; feedback?: string }): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return fetchJson("/teacher/grading.php", { method: "POST", body: JSON.stringify(data) });
}
