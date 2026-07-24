"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getLessons, getAssignments, type Lesson, type Assignment } from "@/app/lib/api/teacher";

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

  const recentLessons = lessons.slice(0, 5);
  const recentAssignments = assignments.slice(0, 5);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading dashboard…</div>;

  const statCard = (icon: typeof BookOpen, label: string, value: number | string, href: string, color: string) => (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)", transition: "box-shadow 0.15s" }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow-xs)"}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </div>
          <ArrowRight size={16} style={{ color: "var(--gray-300)" }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
      </div>
    </Link>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
            Good day, {user?.name?.split(" ")[0]}
          </h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>Your teaching overview</p>
        </div>
        <Link href="/teacher/lessons/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          <Plus size={17} /> New Lesson
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {statCell(BookOpen, "Lessons", lessons.length, "/teacher/lessons")}
        {statCell(ClipboardList, "Assignments", assignments.length, "/teacher/assignments")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Recent Lessons</h2>
            <Link href="/teacher/lessons" style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>View all</Link>
          </div>
          <div>
            {recentLessons.length === 0 && <p style={{ padding: "20px", fontSize: 14, color: "var(--gray-400)", textAlign: "center" }}>No lessons yet. Create your first one.</p>}
            {recentLessons.map((l) => (
              <div key={l.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{l.title}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{l.course_title ?? "General"} · {new Date(l.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Recent Assignments</h2>
            <Link href="/teacher/assignments" style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>View all</Link>
          </div>
          <div>
            {recentAssignments.length === 0 && <p style={{ padding: "20px", fontSize: 14, color: "var(--gray-400)", textAlign: "center" }}>No assignments yet.</p>}
            {recentAssignments.map((a) => (
              <div key={a.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{a.submission_count} submissions</div>
                </div>
                <span style={{ fontSize: 12, color: a.due_date && new Date(a.due_date) < new Date() ? "#B42318" : "var(--gray-500)" }}>
                  {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function statCell(Icon: typeof BookOpen, label: string, value: number | string, href: string) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={20} color="var(--teal)" />
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
      </div>
    </Link>
  );
}
