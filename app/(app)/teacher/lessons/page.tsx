"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { getLessons, type Lesson } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

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
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Lessons</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{lessons.length} total</p>
        </div>
        <Link href="/teacher/lessons/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          <Plus size={17} /> New Lesson
        </Link>
      </div>

      {lessons.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No lessons yet"
          description="Create your first lesson to get started with teaching."
          action={{
            label: "Create Lesson",
            onClick: () => window.location.href = "/teacher/lessons/new",
          }}
        />
      )}

      {lessons.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {lessons.map((l) => (
            <div key={l.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4 }}>{l.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--gray-500)" }}>
                    {l.course_title ?? "General"} · Created {new Date(l.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
