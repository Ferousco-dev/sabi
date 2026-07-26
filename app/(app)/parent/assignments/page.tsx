"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import { getChildren, getChildAssignments, type Child } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type ChildAssignment = { id: number; title: string; subject: string; due_date: string; submitted: boolean; grade?: string; description?: string; submitted_at?: string };

export default function ParentAssignmentsPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [assignments, setAssignments] = useState<ChildAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  useEffect(() => {
    getChildren().then((res) => {
      if (res.ok && res.data) {
        setChildren(res.data.children);
        if (res.data.children.length > 0) setSelectedChild(res.data.children[0].id);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedChild == null) return;
    setLoadingList(true);
    getChildAssignments(selectedChild).then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments as ChildAssignment[]);
      else setAssignments([]);
    }).finally(() => setLoadingList(false));
  }, [selectedChild]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Assignments" subtitle="Track your children's assignments and grades." />

      {children.length === 0 ? (
        <Card><EmptyState Icon={FileText} title="No children linked" description="Link a child to view their assignments." /></Card>
      ) : (
        <>
          {children.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {children.map((c) => {
                const active = selectedChild === c.id;
                return (
                  <button key={c.id} onClick={() => setSelectedChild(c.id)}
                    style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
                    {c.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          )}

          {loadingList ? (
            <LoadingPage />
          ) : assignments.length === 0 ? (
            <Card><EmptyState Icon={FileText} title="No assignments" description="This child has no current assignments." /></Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {assignments.map((a) => {
                const submitted = !!a.submitted_at || a.submitted;
                const overdue = a.due_date && new Date(a.due_date) < new Date() && !submitted;
                return (
                  <div key={a.id} className="stat-card" style={{ background: "var(--bg)", border: `1px solid ${overdue ? "#FECDCA" : "var(--border)"}`, borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{a.title}</h3>
                      <Badge tone={submitted ? "success" : overdue ? "danger" : "warning"} dot>
                        {submitted ? `Grade: ${a.grade ?? "Pending"}` : overdue ? "Overdue" : "Pending"}
                      </Badge>
                    </div>
                    {a.description && <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 6, lineHeight: 1.5 }}>{a.description}</p>}
                    <div style={{ fontSize: 12.5, color: "var(--text-subtle)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      <span>{a.subject} · Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : "no due date"}</span>
                      {submitted
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#067647", fontWeight: 600 }}><CheckCircle2 size={13} aria-hidden="true" /> Submitted</span>
                        : <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Clock size={13} aria-hidden="true" /> Pending</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
