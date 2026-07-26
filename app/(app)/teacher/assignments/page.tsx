"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { getAssignments, type Assignment } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Button } from "@/app/components/ui/Button";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle={`${assignments.length} assignment${assignments.length === 1 ? "" : "s"} created`}
        actions={<Button href="/teacher/assignments/new" icon={<Plus size={16} strokeWidth={2.2} aria-hidden="true" />}>New assignment</Button>}
      />

      {assignments.length === 0 ? (
        <Card>
          <EmptyState Icon={ClipboardList} title="No assignments yet" description="Create your first assignment to start tracking student progress." action={<Button href="/teacher/assignments/new">Create assignment</Button>} />
        </Card>
      ) : (
        <Card padded={false}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
              <thead>
                <tr>{["Title", "Submissions", "Due date", "Created"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const overdue = a.due_date && new Date(a.due_date) < new Date();
                  return (
                    <tr key={a.id}>
                      <td style={tdStyle}>
                        <Link href={`/teacher/assignments/${a.id}`} style={{ fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>{a.title}</Link>
                      </td>
                      <td style={tdStyle}><Badge tone={(a.submission_count ?? 0) > 0 ? "teal" : "neutral"}>{a.submission_count ?? 0}</Badge></td>
                      <td style={tdStyle}>
                        {a.due_date ? <Badge tone={overdue ? "danger" : "neutral"} dot={!!overdue}>{new Date(a.due_date).toLocaleDateString()}</Badge> : "—"}
                      </td>
                      <td style={tdStyle}>{new Date(a.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textAlign: "left" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
