"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/app/components/ui/Input";
import { createLesson } from "@/app/lib/api/teacher";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

export default function NewLessonPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required.");
    setLoading(true);
    setError(null);
    const res = await createLesson({ course_id: courseId, title: title.trim(), content: content.trim() || undefined });
    setLoading(false);
    if (res.ok) router.push("/teacher/lessons");
    else setError(res.data && "error" in res.data ? (res.data as any).error : "Failed to create lesson.");
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/teacher/lessons" style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> Back to lessons
      </Link>

      <PageHeader title="New lesson" subtitle="Write a lesson to share with your students." />

      <Card title="Lesson details">
        {error && <div style={alertStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Photosynthesis - JSS2 Science" />
          <div>
            <label style={labelStyle}>Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} style={textareaStyle} placeholder="Write your lesson content here…" />
          </div>
          <button type="submit" disabled={loading} style={submitStyle(loading)}>
            {loading ? <LoadingSpinner size={18} color="#fff" /> : "Create lesson"}
          </button>
        </form>
      </Card>
    </div>
  );
}

const backLink = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600,
  color: "var(--teal)", textDecoration: "none", marginBottom: 16,
} as const;

const labelStyle = {
  fontSize: 12, fontWeight: 700, color: "var(--teal)", textTransform: "uppercase",
  letterSpacing: "0.04em", display: "block", marginBottom: 8,
} as const;

const textareaStyle = {
  width: "100%", padding: "13px 16px", fontSize: 16, border: "1.5px solid var(--border)",
  borderRadius: "var(--radius-sm)", background: "#fff", color: "var(--teal)", outline: "none",
  fontFamily: "var(--font-sans)", resize: "vertical", boxSizing: "border-box",
} as const;

const alertStyle = {
  padding: "9px 12px", borderRadius: "var(--radius-sm)", background: "#FEF3F2",
  border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16,
} as const;

const submitStyle = (loading: boolean) => ({
  height: 48, padding: "0 24px", borderRadius: "var(--radius-sm)", background: "var(--teal)",
  color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer",
  opacity: loading ? 0.65 : 1, alignSelf: "flex-start", display: "inline-flex", alignItems: "center",
  justifyContent: "center", fontFamily: "var(--font-sans)",
} as const);
