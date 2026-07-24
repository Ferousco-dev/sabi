"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, Play } from "lucide-react";
import { getContentDetail, type StudentContent } from "@/app/lib/api/student";

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [content, setContent] = useState<StudentContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentDetail(Number(id)).then((res) => {
      if (res.ok && res.data) setContent(res.data.content);
      else router.push("/student/content");
    }).finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;
  if (!content) return null;

  return (
    <div style={{ maxWidth: 800 }}>
      <Link href="/student/content" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Content
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {content.multimedia_url ? <Play size={28} color="var(--teal)" /> : <FileText size={28} color="var(--teal)" />}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", marginBottom: 4 }}>{content.title}</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>{content.course_title} · {content.teacher_name}</p>
          <p style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 4 }}>Updated {new Date(content.updated_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)" }}>
        {content.multimedia_url && (
          <div style={{ marginBottom: 24, padding: 16, background: "var(--gray-50)", borderRadius: 8 }}>
            <a href={content.multimedia_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>
              <Play size={16} /> Watch Video
            </a>
          </div>
        )}
        {content.content && (
          <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--gray-700)", whiteSpace: "pre-wrap" }}>
            {content.content}
          </div>
        )}
        {!content.content && !content.multimedia_url && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No content available for this lesson yet.</p>}
      </div>
    </div>
  );
}