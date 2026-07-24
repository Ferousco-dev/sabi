"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { createAssignment } from "@/app/lib/api/teacher";

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
      <Link href="/teacher/assignments" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to assignments
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 24 }}>New Assignment</h1>

      {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Photosynthesis Worksheet" />
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
            style={{ width: "100%", padding: "13px 16px", fontSize: 16, border: "1.5px solid var(--border)", borderRadius: 8, background: "#fff", color: "var(--teal)", outline: "none", fontFamily: "var(--font-sans)", resize: "vertical" }} />
        </div>
        <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit" disabled={loading}
          style={{ height: 48, padding: "0 24px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1, alignSelf: "flex-start" }}>
          {loading ? "Creating…" : "Create Assignment"}
        </button>
      </form>
    </div>
  );
}
