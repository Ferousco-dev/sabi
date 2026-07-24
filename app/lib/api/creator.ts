import { fetchJson, type FetchResult } from "../api";

export type Course = { id: number; creator_id: number; title: string; description?: string; price: number; enrollment_count: number; created_at: string; updated_at: string };
export type CoursesResponse = { success: true; courses: Course[] };

export function getCreatorCourses(): Promise<FetchResult<CoursesResponse>> {
  return fetchJson<CoursesResponse>("/creator/courses.php", { method: "GET" });
}

export function createCourse(data: { title: string; description?: string; price?: number }): Promise<FetchResult<{ success: boolean; course_id?: number }>> {
  return fetchJson("/creator/courses.php", { method: "POST", body: JSON.stringify(data) });
}

export type RevenueData = { total: number; sales: number; currency: string };
export type RevenueResponse = { success: true; revenue: RevenueData };

export function getRevenue(): Promise<FetchResult<RevenueResponse>> {
  return fetchJson<RevenueResponse>("/creator/revenue.php", { method: "GET" });
}
