"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import { getAssignments, type Assignment } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function GradingPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const toGrade = assignments.reduce((n, a) => n + (a.submission_count ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Grading"
        subtitle="Pick an assignment to review and grade submissions."
        actions={toGrade > 0 ? <Badge tone="teal">{toGrade} submissions</Badge> : undefined}
      />

      {assignments.length === 0 ? (
        <Card><EmptyState Icon={ClipboardCheck} title="No assignments to grade" description="Assignments you create for your classes appear here for grading." /></Card>
      ) : (
        <Card padded={false}>
          <ul style={{ listStyle: "none" }}>
            {assignments.map((a) => {
              const count = a.submission_count ?? 0;
              return (
                <li key={a.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <Link href={`/teacher/assignments/${a.id}`} className="nav-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "15px 16px", textDecoration: "none" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</p>
                      <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2 }}>
                        Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : "no due date"}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      <Badge tone={count > 0 ? "warning" : "neutral"}>{count} to grade</Badge>
                      <ArrowRight size={16} strokeWidth={2} style={{ color: "var(--gray-300)" }} aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}
