"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Edit, Trash2, DollarSign } from "lucide-react";
import { getCreatorCourses } from "@/app/lib/api/creator";

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

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;
  if (!course) return null;

  return (
    <div style={{ maxWidth: 800 }}>
      <Link href="/creator/courses" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>{course.title}</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>₦{course.price?.toLocaleString() ?? "0"} · {course.enrollment_count} enrollments</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/creator/courses/${id}/edit`} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            <Edit size={16} /> Edit
          </Link>
          <button style={{ height: 42, padding: "0 18px", borderRadius: 8, background: "#FEF3F2", color: "#B42318", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)", marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Description</div>
        <p style={{ fontSize: 15, color: "var(--gray-700)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{course.description ?? "No description provided."}</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontSize: 15, fontWeight: 600, color: "var(--gray-900)", display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={18} color="var(--teal)" /> Enrolled Students ({course.enrollment_count})
        </div>
        {course.enrollment_count === 0 ? (
          <p style={{ padding: 32, textAlign: "center", color: "var(--gray-400)" }}>No students enrolled yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "var(--gray-50)" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Email</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Enrolled</th>
              </tr></thead>
              <tbody>
                {Array.from({ length: course.enrollment_count }).map((_, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>Student #{i + 1}</td>
                    <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>student{i + 1}@school.edu.ng</td>
                    <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(course.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}