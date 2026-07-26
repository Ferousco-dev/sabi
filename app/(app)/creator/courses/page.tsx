"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Users, ArrowRight } from "lucide-react";
import { getCreatorCourses, type Course } from "@/app/lib/api/creator";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Button } from "@/app/components/ui/Button";

export const dynamic = "force-dynamic";

export default function CreatorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreatorCourses().then((res) => {
      if (res.ok && res.data) setCourses(res.data.courses);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader
        title="My courses"
        subtitle={`${courses.length} course${courses.length === 1 ? "" : "s"} published`}
        actions={<Button href="/creator/courses/new" icon={<Plus size={16} strokeWidth={2.2} aria-hidden="true" />}>New course</Button>}
      />

      {courses.length === 0 ? (
        <Card>
          <EmptyState Icon={BookOpen} title="No courses yet" description="Create your first course to start reaching schools and students." action={<Button href="/creator/courses/new">Create course</Button>} />
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {courses.map((c) => (
            <Link key={c.id} href={`/creator/courses/${c.id}`} className="stat-card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-xs)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <span aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={20} style={{ color: "var(--teal)" }} />
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>₦{c.price?.toLocaleString() ?? "0"}</span>
              </div>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em", marginBottom: 4 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5, flex: 1 }}>{c.description ?? "No description"}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--text-subtle)" }}><Users size={14} aria-hidden="true" /> {c.enrollment_count} enrolled</span>
                <ArrowRight size={16} strokeWidth={2} style={{ color: "var(--gray-300)" }} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
