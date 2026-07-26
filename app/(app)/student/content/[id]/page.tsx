"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Play, BookOpen } from "lucide-react";
import { getContentDetail, type StudentContent } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const backLink = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 } as const;

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

  if (loading) return <LoadingPage />;

  if (!content) return (
    <Card>
      <EmptyState Icon={BookOpen} title="Content not found" description="The lesson content you are looking for does not exist or has been removed." />
    </Card>
  );

  return (
    <div style={{ maxWidth: 800 }}>
      <Link href="/student/content" style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.1} /> Back to content
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
        <div aria-hidden="true" style={{ width: 60, height: 60, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {content.multimedia_url ? <Play size={26} color="var(--teal)" /> : <FileText size={26} color="var(--teal)" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "clamp(21px, 2.4vw, 25px)", fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", marginBottom: 4 }}>{content.title}</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>{content.course_title} · {content.teacher_name}</p>
          <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 4 }}>Updated {new Date(content.updated_at).toLocaleDateString()}</p>
        </div>
      </div>

      <Card title="Lesson">
        {content.multimedia_url && (
          <div style={{ marginBottom: 20, padding: 16, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
            <a href={content.multimedia_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>
              <Play size={16} /> Watch video
            </a>
          </div>
        )}
        {content.content && (
          <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
            {content.content}
          </div>
        )}
        {!content.content && !content.multimedia_url && (
          <p style={{ color: "var(--text-subtle)", textAlign: "center", padding: 32 }}>No content available for this lesson yet.</p>
        )}
      </Card>
    </div>
  );
}
