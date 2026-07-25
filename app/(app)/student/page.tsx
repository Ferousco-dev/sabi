"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getContent, getStudentAssignments, getProgress, type StudentContent, type StudentAssignment, type ProgressData } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";

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

  const pendingAssignments = assignments.filter((a) => !a.submitted_at).length;
  const dueSoon = assignments.filter((a) => a.due_date && new Date(a.due_date) > new Date() && !a.submitted_at).length;

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ fontSize: 14, color: "var(--gray-500)" }}>Continue your learning journey</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { icon: BookOpen, label: "Lessons", value: content.length, color: "var(--teal)" },
          { icon: ClipboardList, label: "Pending Assignments", value: pendingAssignments, color: pendingAssignments > 0 ? "var(--gold)" : "#0E8345" },
          { icon: Trophy, label: "XP Earned", value: progress?.xp ?? 0, color: "var(--gold)" },
          { icon: Zap, label: "Completed", value: progress?.completed_lessons ?? 0, color: "var(--teal)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Recent Content</h2>
            <Link href="/student/content" style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>View all</Link>
          </div>
          <div>
            {content.length === 0 && <p style={{ padding: "20px", fontSize: 14, color: "var(--gray-400)", textAlign: "center" }}>No content yet.</p>}
            {content.slice(0, 5).map((c) => (
              <Link key={c.id} href={`/student/content/${c.id}`} style={{ textDecoration: "none" }}>
                <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{c.course_title} · {c.teacher_name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Assignments</h2>
            <Link href="/student/assignments" style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>View all</Link>
          </div>
          <div>
            {assignments.length === 0 && <p style={{ padding: "20px", fontSize: 14, color: "var(--gray-400)", textAlign: "center" }}>No assignments yet.</p>}
            {assignments.slice(0, 5).map((a) => (
              <div key={a.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{a.title}</div>
                  {a.submitted_at ? (
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#0E8345", background: "#ECFDF3", padding: "2px 8px", borderRadius: 999 }}>Submitted</span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", background: "rgba(170,133,46,0.1)", padding: "2px 8px", borderRadius: 999 }}>Pending</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 2 }}>{a.course_title} · Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
