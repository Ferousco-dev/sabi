"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { createCourse } from "@/app/lib/api/creator";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required.");
    setLoading(true);
    setError(null);
    const res = await createCourse({
      title: title.trim(),
      description: description.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
    });
    setLoading(false);
    if (res.ok) router.push("/creator/courses");
    else setError(res.data && "error" in res.data ? (res.data as any).error : "Failed to create course.");
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/creator/courses" style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> Back to courses
      </Link>

      <PageHeader title="New course" subtitle="Publish a course for schools and students to enroll in." />

      <Card title="Course details">
        {error && <div style={alertStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Input label="Course title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mathematics for JSS3" />
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={textareaStyle} placeholder="What will students learn in this course?" />
          </div>
          <Input label="Price (₦)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          <button type="submit" disabled={loading} style={submitStyle(loading)}>
            {loading ? <LoadingSpinner size={18} color="#fff" /> : "Create course"}
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
