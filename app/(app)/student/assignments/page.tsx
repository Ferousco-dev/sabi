"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { getStudentAssignments, type StudentAssignment } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>My Assignments</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>{assignments.length} total</p>

      {assignments.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          description="Your course assignments will appear here once they are assigned."
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {assignments.map((a) => {
          const submitted = !!a.submitted_at;
          const overdue = a.due_date && new Date(a.due_date) < new Date() && !submitted;
          return (
            <div key={a.id} style={{ background: "#fff", border: `1px solid ${overdue ? "#FECDCA" : "var(--border)"}`, borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</h3>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: submitted ? "#ECFDF3" : overdue ? "#FEF3F2" : "rgba(170,133,46,0.1)", color: submitted ? "#0E8345" : overdue ? "#B42318" : "var(--gold)" }}>
                  {submitted ? `Graded: ${a.grade ?? "Pending"}` : overdue ? "Overdue" : "Pending"}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 4 }}>{a.description}</p>
              <div style={{ fontSize: 12, color: "var(--gray-400)" }}>
                {a.course_title} · Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
