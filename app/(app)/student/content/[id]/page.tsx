"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { getContent, type StudentContent } from "@/app/lib/api/student";
import { syncProgress } from "@/app/lib/api/student";

export default function ContentViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<StudentContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    getContent().then((res) => {
      if (res.ok && res.data) {
        const found = res.data.content.find((c) => c.id === Number(id));
        setItem(found ?? null);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  async function markComplete() {
    if (!id) return;
    await syncProgress([{ lesson_id: Number(id), status: "completed", xp: 50 }]);
    setMarked(true);
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;

  if (!item) return <div style={{ color: "var(--gray-400)" }}>Content not found.</div>;

  return (
    <div style={{ maxWidth: 800 }}>
      <Link href="/student/content" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to content
      </Link>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "32px", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
          <span style={{ width: 44, height: 44, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={22} color="var(--teal)" />
          </span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", marginBottom: 4 }}>{item.title}</h1>
            <p style={{ fontSize: 14, color: "var(--gray-500)" }}>
              {item.course_title} · {item.teacher_name} · {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ fontSize: 16, lineHeight: 1.8, color: "var(--gray-700)", whiteSpace: "pre-wrap", marginBottom: 32 }}>
          {item.content || "No content body for this lesson yet."}
        </div>

        {item.multimedia_url && (
          <div style={{ marginBottom: 24 }}>
            <a href={item.multimedia_url} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal-50)", color: "var(--teal)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              View attached resource
            </a>
          </div>
        )}

        <button onClick={markComplete} disabled={marked}
          style={{ height: 46, padding: "0 24px", borderRadius: 8, background: marked ? "#0E8345" : "var(--gold)", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: marked ? "default" : "pointer", opacity: marked ? 0.8 : 1 }}>
          {marked ? "✓ Completed" : "Mark as Complete (+50 XP)"}
        </button>
      </div>
    </div>
  );
}
