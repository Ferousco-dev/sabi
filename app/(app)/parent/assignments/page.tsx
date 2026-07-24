"use client";
import { useEffect, useState } from "react";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { getChildren, getChildAssignments } from "@/app/lib/api/parent";

export default function ParentAssignmentsPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  useEffect(() => {
    getChildren().then((res) => {
      if (res.ok && res.data) setChildren(res.data.children);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedChild) {
      getChildAssignments(selectedChild).then((res) => {
        if (res.ok && res.data) setAssignments(res.data.assignments);
      });
    }
  }, [selectedChild]);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;

  if (!selectedChild && children.length > 0) {
    setSelectedChild(children[0].id);
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading assignments…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Assignments</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>{assignments.length} total</p>

      {assignments.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <FileText size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>No assignments yet.</p>
        </div>
      ) : (
<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assignments.map((a) => {
            const submitted = !!a.submitted_at;
            const overdue = a.due_date && new Date(a.due_date) < new Date() && !submitted;
            return (
              <div key={a.id} style={{ background: "#fff", border: `1px solid ${overdue ? "#FECDCA" : "var(--border)"}`, borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</h3>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: submitted ? "#ECFDF3" : overdue ? "#FEF3F2" : "rgba(170,133,46,0.1)", color: submitted ? "#0E8345" : overdue ? "#B42318" : "var(--gold)" }}>
                    {submitted ? `Grade: ${a.grade ?? "Pending"}` : overdue ? "Overdue" : "Pending"}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 4 }}>{a.description}</p>
                <div style={{ fontSize: 12, color: "var(--gray-400)", display: "flex", gap: 12 }}>
                  <span>{a.subject} · Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}</span>
                  {submitted ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={13} color="#0E8345" /> Submitted</span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Clock size={13} color="var(--gray-400)" /> Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}