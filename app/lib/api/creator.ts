import { fetchJson, type FetchResult } from "../api";

export type Course = { id: number; creator_id: number; title: string; description?: string; price: number; enrollment_count: number; created_at: string; updated_at: string };
export type CoursesResponse = { success: true; courses: Course[] };

// ── Laravel response adapters ──────────────────────────────────────────────
// The Laravel API returns bare models/arrays on success and { message } on
// failure. The UI still expects the old { success, ... } / { success:false,
// error } shapes, so we translate at this boundary — components don't change.

/** Laravel Course model as returned by the API (superset of the UI Course). */
type LaravelCourse = {
  id: number;
  creator_id: number;
  title: string;
  description?: string;
  price: number | string;
  enrollment_count?: number;
  is_published?: boolean;
  created_at: string;
  updated_at: string;
};

/** Normalise a Laravel course model to the UI Course shape. price arrives as a
 * numeric string from Laravel's decimal cast; enrollment_count may be absent. */
function toCourse(c: LaravelCourse): Course {
  return {
    id: c.id,
    creator_id: c.creator_id,
    title: c.title,
    description: c.description,
    price: typeof c.price === "string" ? Number(c.price) : c.price,
    enrollment_count: c.enrollment_count ?? 0,
    created_at: c.created_at,
    updated_at: c.updated_at,
  };
}

/** Pull a user-safe error string out of a Laravel failure body. */
function errorOf(data: { message?: string } | null): string {
  return data?.message ?? "Something went wrong.";
}

/** GET /courses → bare array of the creator's own courses. */
export async function getCreatorCourses(): Promise<FetchResult<CoursesResponse>> {
  const res = await fetchJson<LaravelCourse[]>("/courses", { method: "GET" });
  if (res.ok && Array.isArray(res.data)) {
    return { ok: true, status: res.status, data: { success: true, courses: res.data.map(toCourse) } };
  }
  return { ok: false, status: res.status, data: { success: true, courses: [] } };
}

/** POST /courses (role:creator) → 201 with the created model. Mapped to the old
 * { success, course_id } shape the create flow expects. */
export async function createCourse(data: { title: string; description?: string; price?: number }): Promise<FetchResult<{ success: boolean; course_id?: number }>> {
  const res = await fetchJson<LaravelCourse & { message?: string }>("/courses", { method: "POST", body: JSON.stringify(data) });
  if (res.ok && res.data?.id) {
    return { ok: true, status: res.status, data: { success: true, course_id: res.data.id } };
  }
  return { ok: false, status: res.status, data: { success: false } };
}

export type RevenueData = { total: number; sales: number; currency: string };
export type RevenueResponse = { success: true; revenue: RevenueData };

/**
 * GET /courses/revenue → best-effort catalogue aggregates.
 *
 * SHAPE RECONCILIATION (lossy): the Laravel endpoint has no sales/enrollment
 * table yet, so it returns { total_courses, published_courses, total_list_price,
 * note } — catalogue aggregates, NOT actual earnings. We map:
 *   - revenue.total    ← total_list_price  (summed LIST price, not earned money)
 *   - revenue.sales    ← total_courses     (course count, NOT number of sales)
 *   - revenue.currency ← "NGN"             (backend returns no currency; assumed)
 * published_courses and note are dropped. Treat these numbers as provisional.
 */
type LaravelRevenue = {
  total_courses?: number;
  published_courses?: number;
  total_list_price?: number;
  note?: string;
  message?: string;
};

export async function getRevenue(): Promise<FetchResult<RevenueResponse>> {
  const res = await fetchJson<LaravelRevenue>("/courses/revenue", { method: "GET" });
  if (res.ok && res.data) {
    return {
      ok: true,
      status: res.status,
      data: {
        success: true,
        revenue: {
          total: res.data.total_list_price ?? 0,
          sales: res.data.total_courses ?? 0,
          currency: "NGN",
        },
      },
    };
  }
  return { ok: false, status: res.status, data: { success: true, revenue: { total: 0, sales: 0, currency: "NGN" } } };
}
