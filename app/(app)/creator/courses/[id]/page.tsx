"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Edit, Trash2, DollarSign, BookOpen } from "lucide-react";
import { getCreatorCourses } from "@/app/lib/api/creator";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreatorCourses().then((res) => {
      if (res.ok && res.data) {
        const c = res.data.courses.find((c: any) => c.id === Number(id));
        if (c) setCourse(c);
        else router.push("/creator/courses");
      }
    }).finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <LoadingPage />;
  if (!course) return (
    <Card>
      <EmptyState
        Icon={BookOpen}
        title="Course not found"
        description="The course you are looking for does not exist or has been removed."
      />
    </Card>
  );

  return (
    <div style={{ maxWidth: 860 }}>
      <Link href="/creator/courses" style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> Back to courses
      </Link>

      <PageHeader
        title={course.title}
        subtitle="Course overview and enrolled students."
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Link href={`/creator/courses/${id}/edit`} style={editBtn}>
              <Edit size={16} aria-hidden="true" /> Edit
            </Link>
            <button style={deleteBtn}>
              <Trash2 size={16} aria-hidden="true" /> Delete
            </button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <StatCard label="Price" value={course.price ?? 0} Icon={DollarSign} />
        <StatCard label="Enrollments" value={course.enrollment_count} Icon={Users} />
      </div>

      <Card title="Description" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 15, color: "var(--gray-700)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {course.description ?? "No description provided."}
        </p>
      </Card>

      <Card title={`Enrolled students (${course.enrollment_count})`} padded={false}>
        {course.enrollment_count === 0 ? (
          <EmptyState Icon={Users} title="No students yet" description="Students who enroll in this course will appear here." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Enrolled</th>
              </tr></thead>
              <tbody>
                {Array.from({ length: course.enrollment_count }).map((_, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ ...td, fontWeight: 600, color: "var(--gray-900)" }}>Student #{i + 1}</td>
                    <td style={td}>student{i + 1}@school.edu.ng</td>
                    <td style={td}>{new Date(course.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

const backLink = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600,
  color: "var(--teal)", textDecoration: "none", marginBottom: 16,
} as const;

const editBtn = {
  display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 16px",
  borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14,
  fontWeight: 600, textDecoration: "none",
} as const;

const deleteBtn = {
  display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 16px",
  borderRadius: "var(--radius-sm)", background: "#FEF3F2", color: "#B42318", fontSize: 14,
  fontWeight: 600, border: "1px solid #FECDCA", cursor: "pointer",
} as const;

const th = {
  textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600,
  color: "var(--text-subtle)", textTransform: "uppercase", background: "var(--bg-subtle)",
} as const;

const td = { padding: "12px 20px", fontSize: 14, color: "var(--text-muted)" } as const;
