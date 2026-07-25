"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { getAssignments, type Assignment } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

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
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Assignments</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{assignments.length} total</p>
        </div>
        <Link href="/teacher/assignments/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          <Plus size={17} /> New Assignment
        </Link>
      </div>

      {assignments.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          description="Create your first assignment to start tracking student progress."
        />
      )}

      {assignments.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Title</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Submissions</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Due Date</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <Link href={`/teacher/assignments/${a.id}`} style={{ fontSize: 14, fontWeight: 500, color: "var(--teal)", textDecoration: "none" }}>{a.title}</Link>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{a.submission_count}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: a.due_date && new Date(a.due_date) < new Date() ? "#B42318" : "var(--gray-500)" }}>
                    {a.due_date ? new Date(a.due_date).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
