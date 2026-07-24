import { fetchJson, type FetchResult } from "../api";

export type StudentContent = { id: number; course_id: number; teacher_id: number; title: string; content?: string; multimedia_url?: string; course_title?: string; teacher_name?: string; created_at: string; updated_at: string };
export type ContentResponse = { success: true; content: StudentContent[]; sync_timestamp: number };

export function getContent(): Promise<FetchResult<ContentResponse>> {
  return fetchJson<ContentResponse>("/student/content.php", { method: "GET" });
}

export type StudentAssignment = { id: number; lesson_id: number; teacher_id: number; title: string; description?: string; due_date?: string; course_title?: string; grade?: string; submitted_at?: string };
export type StudentAssignmentsResponse = { success: true; assignments: StudentAssignment[] };

export function getStudentAssignments(): Promise<FetchResult<StudentAssignmentsResponse>> {
  return fetchJson<StudentAssignmentsResponse>("/student/assignments.php", { method: "GET" });
}

export function submitAssignment(assignmentId: number, contentUrl: string): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return fetchJson("/student/assignments.php", {
    method: "POST",
    body: JSON.stringify({ assignment_id: assignmentId, content_url: contentUrl }),
  });
}

export type ProgressData = { xp: number; completed_lessons: number; badges: string[] };
export type ProgressResponse = { success: true; progress: ProgressData };

export function getProgress(studentId?: number): Promise<FetchResult<ProgressResponse>> {
  const params = studentId ? `?student_id=${studentId}` : "";
  return fetchJson<ProgressResponse>(`/student/progress.php${params}`, { method: "GET" });
}

export type SyncUpdate = { lesson_id: number; status: string; xp: number };
export function syncProgress(updates: SyncUpdate[]): Promise<FetchResult<{ success: boolean; processed_updates?: number }>> {
  return fetchJson("/student/sync.php", {
    method: "POST",
    body: JSON.stringify({ updates }),
  });
}
