"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Plus, ArrowRight, FileCheck2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getLessons, getAssignments, type Lesson, type Assignment } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { AreaChart, type AreaPoint } from "@/app/components/dashboard/AreaChart";
import { BarChart, type Bar } from "@/app/components/dashboard/BarChart";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Button } from "@/app/components/ui/Button";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLessons(), getAssignments()]).then(([l, a]) => {
      if (l.ok && l.data) setLessons(l.data.lessons);
      if (a.ok && a.data) setAssignments(a.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const recentLessons = lessons.slice(0, 5);
  const recentAssignments = assignments.slice(0, 5);
  const submissions = assignments.reduce((sum, a) => sum + (a.submission_count ?? 0), 0);
  const overdue = assignments.filter((a) => a.due_date && new Date(a.due_date) < new Date()).length;
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const lessonTrend = lessonsPerWeek(lessons, 6);
  const topAssignments: Bar[] = (() => {
    const ranked = [...assignments]
      .filter((a) => (a.submission_count ?? 0) > 0)
      .sort((a, b) => (b.submission_count ?? 0) - (a.submission_count ?? 0))
      .slice(0, 6);
    const max = Math.max(...ranked.map((a) => a.submission_count ?? 0), 1);
    return ranked.map((a) => ({ label: shortLabel(a.title), value: a.submission_count ?? 0, max }));
  })();

  return (
    <>
      <PageHeader
        title={`Good day, ${firstName}`}
        subtitle="Your teaching overview"
        actions={
          <Button href="/teacher/lessons/new" icon={<Plus size={16} strokeWidth={2.2} aria-hidden="true" />}>
            New lesson
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        {[
          { key: "lessons", label: "Lessons", value: lessons.length, Icon: BookOpen },
          { key: "assignments", label: "Assignments", value: assignments.length, Icon: ClipboardList },
          { key: "submissions", label: "Submissions", value: submissions, Icon: FileCheck2 },
          { key: "overdue", label: "Overdue", value: overdue, Icon: AlertTriangle },
        ].map((s, i) => (
          <div key={s.key} className="dash-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <StatCard label={s.label} value={s.value} Icon={s.Icon} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "stretch", marginBottom: 20 }}>
        <div style={{ flex: "1.4 1 420px", minWidth: 0 }}>
          <Card title="Lessons published" style={{ height: "100%" }}>
            <AreaChart data={lessonTrend} caption="Lessons you published per week over the last 6 weeks." />
          </Card>
        </div>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card title="Most-submitted assignments" style={{ height: "100%" }}>
            {topAssignments.length === 0 ? (
              <EmptyState Icon={FileCheck2} title="No submissions yet" description="Submission counts appear here as students turn work in." />
            ) : (
              <BarChart bars={topAssignments} caption="Assignments ranked by number of student submissions." />
            )}
          </Card>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card
            title="Recent lessons"
            padded={false}
            action={<Link href="/teacher/lessons" style={linkStyle}>View all <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>}
          >
            {recentLessons.length === 0 ? (
              <EmptyState Icon={BookOpen} title="No lessons yet" description="Create your first lesson to get started." />
            ) : (
              <ul style={{ listStyle: "none" }}>
                {recentLessons.map((l) => (
                  <li key={l.id} style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{l.title}</p>
                    <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2 }}>
                      {l.course_title ?? "General"} · {new Date(l.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card
            title="Recent assignments"
            padded={false}
            action={<Link href="/teacher/assignments" style={linkStyle}>View all <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>}
          >
            {recentAssignments.length === 0 ? (
              <EmptyState Icon={ClipboardList} title="No assignments yet" description="Assignments you create will show here." />
            ) : (
              <ul style={{ listStyle: "none" }}>
                {recentAssignments.map((a) => {
                  const isOverdue = a.due_date && new Date(a.due_date) < new Date();
                  return (
                    <li key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</p>
                        <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2 }}>{a.submission_count ?? 0} submissions</p>
                      </div>
                      <Badge tone={isOverdue ? "danger" : "neutral"}>
                        {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

/** Bucket lessons into the last `weeks` week-windows by created_at. */
function lessonsPerWeek(lessons: Lesson[], weeks: number): AreaPoint[] {
  const now = new Date();
  const week = 7 * 24 * 60 * 60 * 1000;
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const end = new Date(now.getTime() - (weeks - 1 - i) * week);
    return { end, value: 0, label: `${end.getDate()}/${end.getMonth() + 1}` };
  });
  for (const l of lessons) {
    if (!l.created_at) continue;
    const t = new Date(l.created_at).getTime();
    const idx = Math.floor((now.getTime() - t) / week);
    if (idx >= 0 && idx < weeks) buckets[weeks - 1 - idx].value += 1;
  }
  return buckets.map((b) => ({ label: b.label, value: b.value }));
}

function shortLabel(s: string): string {
  return s.length > 14 ? s.slice(0, 13) + "…" : s;
}

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 13.5,
  fontWeight: 600,
  color: "var(--teal)",
  textDecoration: "none",
};
