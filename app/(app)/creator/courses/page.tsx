"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { getCreatorCourses, type Course } from "@/app/lib/api/creator";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default function CreatorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreatorCourses().then((res) => {
      if (res.ok && res.data) setCourses(res.data.courses);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>My Courses</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{courses.length} courses</p>
        </div>
        <Link href="/creator/courses/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          <Plus size={17} /> New Course
        </Link>
      </div>

      {courses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create your first course to start reaching schools and students."
          action={{
            label: "Create Course",
            onClick: () => window.location.href = "/creator/courses/new",
          }}
        />
      )}

      {courses.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {courses.map((c) => (
            <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--gray-500)" }}>{c.description ?? "No description"} · {c.enrollment_count} enrollments</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>₦{c.price?.toLocaleString() ?? "0"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
