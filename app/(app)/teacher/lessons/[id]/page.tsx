"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Trash2, BookOpen } from "lucide-react";
import { getLessonDetail } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

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

  if (loading) return <LoadingPage />;

  if (!lesson) return (
    <Card>
      <EmptyState
        Icon={BookOpen}
        title="Lesson not found"
        description="The lesson you are looking for does not exist or has been deleted."
      />
    </Card>
  );

  return (
    <div style={{ maxWidth: 860 }}>
      <Link href="/teacher/lessons" style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> Back to lessons
      </Link>

      <PageHeader
        title={lesson.title}
        actions={<Badge tone="teal">{lesson.course_title ?? "General"}</Badge>}
      />

      <Card title="Content" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, color: "var(--gray-700)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {lesson.content ?? "No content added."}
        </div>
        {lesson.multimedia_url && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Multimedia</label>
            <a href={lesson.multimedia_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>
              <Eye size={15} aria-hidden="true" /> View multimedia
            </a>
          </div>
        )}
      </Card>

      <div style={{ display: "flex", gap: 10 }}>
        <button style={saveBtn}>
          <Save size={16} aria-hidden="true" /> Save changes
        </button>
        <button style={deleteBtn}>
          <Trash2 size={16} aria-hidden="true" /> Delete
        </button>
      </div>
    </div>
  );
}

const backLink = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600,
  color: "var(--teal)", textDecoration: "none", marginBottom: 16,
} as const;

const saveBtn = {
  display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px",
  borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14,
  fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)",
} as const;

const deleteBtn = {
  display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px",
  borderRadius: "var(--radius-sm)", background: "#FEF3F2", color: "#B42318", fontSize: 14,
  fontWeight: 600, border: "1px solid #FECDCA", cursor: "pointer", fontFamily: "var(--font-sans)",
} as const;
