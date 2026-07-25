"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Trophy, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getContent, getStudentAssignments, getProgress, type StudentContent, type StudentAssignment, type ProgressData } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [content, setContent] = useState<StudentContent[]>([]);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getContent(), getStudentAssignments(), getProgress()]).then(([c, a, p]) => {
      if (c.ok && c.data) setContent(c.data.content);
      if (a.ok && a.data) setAssignments(a.data.assignments);
      if (p.ok && p.data) setProgress(p.data.progress);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const pendingAssignments = assignments.filter((a) => !a.submitted_at).length;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader title={`Welcome, ${firstName}`} subtitle="Continue your learning journey" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        {[
          { key: "lessons", label: "Lessons", value: content.length, Icon: BookOpen },
          { key: "pending", label: "Pending assignments", value: pendingAssignments, Icon: ClipboardList },
          { key: "xp", label: "XP earned", value: progress?.xp ?? 0, Icon: Trophy },
          { key: "completed", label: "Completed", value: progress?.completed_lessons ?? 0, Icon: Zap },
        ].map((s, i) => (
          <div key={s.key} className="dash-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <StatCard label={s.label} value={s.value} Icon={s.Icon} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card
            title="Recent content"
            padded={false}
            action={<Link href="/student/content" style={linkStyle}>View all <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>}
          >
            {content.length === 0 ? (
              <EmptyState Icon={BookOpen} title="No content yet" description="Your lessons and materials will appear here." />
            ) : (
              <ul style={{ listStyle: "none" }}>
                {content.slice(0, 5).map((c) => (
                  <li key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <Link href={`/student/content/${c.id}`} className="nav-item" style={{ display: "block", padding: "13px 16px", textDecoration: "none" }}>
                      <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{c.title}</p>
                      <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2 }}>{c.course_title} · {c.teacher_name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card
            title="Assignments"
            padded={false}
            action={<Link href="/student/assignments" style={linkStyle}>View all <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>}
          >
            {assignments.length === 0 ? (
              <EmptyState Icon={ClipboardList} title="No assignments yet" description="Assignments from your teachers will show here." />
            ) : (
              <ul style={{ listStyle: "none" }}>
                {assignments.slice(0, 5).map((a) => (
                  <li key={a.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</p>
                      <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2 }}>
                        {a.course_title} · Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : "n/a"}
                      </p>
                    </div>
                    <Badge tone={a.submitted_at ? "success" : "warning"} dot>
                      {a.submitted_at ? "Submitted" : "Pending"}
                    </Badge>
                  </li>
                ))}
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
