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

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 13.5,
  fontWeight: 600,
  color: "var(--teal)",
  textDecoration: "none",
};
