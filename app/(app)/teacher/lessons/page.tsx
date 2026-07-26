"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, ArrowRight } from "lucide-react";
import { getLessons, type Lesson } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Button } from "@/app/components/ui/Button";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessons().then((res) => {
      if (res.ok && res.data) setLessons(res.data.lessons);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader
        title="Lessons"
        subtitle={`${lessons.length} lesson${lessons.length === 1 ? "" : "s"} published`}
        actions={<Button href="/teacher/lessons/new" icon={<Plus size={16} strokeWidth={2.2} aria-hidden="true" />}>New lesson</Button>}
      />

      {lessons.length === 0 ? (
        <Card>
          <EmptyState Icon={BookOpen} title="No lessons yet" description="Create your first lesson to get started with teaching." action={<Button href="/teacher/lessons/new">Create lesson</Button>} />
        </Card>
      ) : (
        <Card padded={false}>
          <ul style={{ listStyle: "none" }}>
            {lessons.map((l) => (
              <li key={l.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <Link href={`/teacher/lessons/${l.id}`} className="nav-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "15px 16px", textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <span aria-hidden="true" style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <BookOpen size={18} style={{ color: "var(--teal)" }} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{l.title}</p>
                      <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2 }}>{l.course_title ?? "General"} · {new Date(l.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} strokeWidth={2} style={{ color: "var(--gray-300)", flexShrink: 0 }} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
