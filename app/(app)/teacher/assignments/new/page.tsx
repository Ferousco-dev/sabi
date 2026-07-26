"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { createAssignment } from "@/app/lib/api/teacher";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

export default function NewAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessonId, setLessonId] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required.");
    setLoading(true);
    setError(null);
    const res = await createAssignment({
      lesson_id: lessonId,
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
    });
    setLoading(false);
    if (res.ok) router.push("/teacher/assignments");
    else setError(res.data && "error" in res.data ? (res.data as any).error : "Failed to create assignment.");
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/teacher/assignments" style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> Back to assignments
      </Link>

      <PageHeader title="New assignment" subtitle="Set work for your students and track their submissions." />

      <Card title="Assignment details">
        {error && <div style={alertStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Photosynthesis Worksheet" />
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={textareaStyle} placeholder="Instructions for students…" />
          </div>
          <Input label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button type="submit" disabled={loading} style={submitStyle(loading)}>
            {loading ? <LoadingSpinner size={18} color="#fff" /> : "Create assignment"}
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
