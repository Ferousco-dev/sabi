"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import { getLessonDetail } from "@/app/lib/api/teacher";

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessonDetail(Number(id)).then((res) => {
      if (res.ok && res.data) setLesson(res.data.lesson);
      else router.push("/teacher/lessons");
    }).finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading lesson…</div>;
  if (!lesson) return null;

  return (
    <div style={{ maxWidth: 800 }}>
      <Link href="/teacher/lessons" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Lessons
      </Link>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 24 }}>{lesson.title}</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Course</label>
          <p style={{ fontSize: 15, color: "var(--gray-900)" }}>{lesson.course_title ?? "General"}</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Content</label>
          <div style={{ fontSize: 15, color: "var(--gray-700)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{lesson.content ?? "No content added."}</div>
        </div>

        {lesson.multimedia_url && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Multimedia</label>
            <a href={lesson.multimedia_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>
              <Eye size={14} /> View Multimedia
            </a>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
            <Save size={16} /> Save Changes
          </button>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "#FEF3F2", color: "#B42318", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}