"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { getChildAssignments } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const backLink = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 } as const;

export default function ChildAssignmentsPage() {
  const { id } = useParams<{ id: string }>();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChildAssignments(Number(id)).then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 720 }}>
      <Link href={`/parent/children/${id}`} style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.1} /> Back to profile
      </Link>
      <PageHeader title="Assignments" subtitle={`${assignments.length} total.`} />

      {assignments.length === 0 ? (
        <Card>
          <EmptyState Icon={ClipboardList} title="No assignments" description="This child has no assignments assigned yet." />
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assignments.map((a, i) => {
            const submitted = !!a.submitted_at;
            const overdue = a.due_date && new Date(a.due_date) < new Date() && !submitted;
            return (
              <Card key={i} style={overdue ? { borderColor: "#FECDCA" } : undefined}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{a.title}</h3>
                  <Badge tone={submitted ? "success" : overdue ? "danger" : "warning"} dot>
                    {submitted ? "Submitted" : overdue ? "Overdue" : "Pending"}
                  </Badge>
                </div>
                {a.description && <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.6 }}>{a.description}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-subtle)" }}>
                  {a.course_title && <span>{a.course_title}</span>}
                  {a.course_title && <span aria-hidden="true">·</span>}
                  <span>Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}</span>
                  {submitted && <Badge tone="success">Submitted {new Date(a.submitted_at).toLocaleDateString()}</Badge>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
