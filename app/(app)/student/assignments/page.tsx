"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { getStudentAssignments, type StudentAssignment } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type Filter = "all" | "pending" | "submitted";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    getStudentAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const pending = assignments.filter((a) => !a.submitted_at).length;
  const shown = assignments.filter((a) =>
    filter === "all" ? true : filter === "submitted" ? !!a.submitted_at : !a.submitted_at,
  );

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: assignments.length },
    { key: "pending", label: "Pending", count: pending },
    { key: "submitted", label: "Submitted", count: assignments.length - pending },
  ];

  return (
    <>
      <PageHeader title="My assignments" subtitle="Track what's due and what you've turned in." />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const active = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)}
              style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {t.label} <span style={{ opacity: 0.75 }}>· {t.count}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <Card><EmptyState Icon={ClipboardList} title="Nothing here" description={filter === "all" ? "Your course assignments appear here once they're assigned." : `No ${filter} assignments.`} /></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {shown.map((a) => {
            const submitted = !!a.submitted_at;
            const overdue = a.due_date && new Date(a.due_date) < new Date() && !submitted;
            return (
              <div key={a.id} className="stat-card" style={{ background: "var(--bg)", border: `1px solid ${overdue ? "#FECDCA" : "var(--border)"}`, borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{a.title}</h3>
                  <Badge tone={submitted ? "success" : overdue ? "danger" : "warning"} dot>
                    {submitted ? `Graded: ${a.grade ?? "Pending"}` : overdue ? "Overdue" : "Pending"}
                  </Badge>
                </div>
                {a.description && <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 6, lineHeight: 1.5 }}>{a.description}</p>}
                <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>
                  {a.course_title} · Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : "no due date"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
