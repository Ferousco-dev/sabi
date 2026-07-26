"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { FileUp, Clock } from "lucide-react";
import { getStudentAssignments, submitAssignment, type StudentAssignment } from "@/app/lib/api/student";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function StudentSubmissionsPage() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    getStudentAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  async function handleUpload(assignmentId: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(assignmentId);
    const res = await submitAssignment(assignmentId, `uploads/${file.name}`);
    if (res.ok) {
      setAssignments((prev) => prev.map((a) => a.id === assignmentId ? { ...a, submitted_at: new Date().toISOString() } : a));
    }
    setUploading(null);
    e.target.value = "";
  }

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="My submissions" subtitle="Submit your work and track what's turned in." />

      {assignments.length === 0 ? (
        <Card><EmptyState Icon={Clock} title="No assignments yet" description="Your assignments and submission options appear here." /></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assignments.map((a) => {
            const submitted = !!a.submitted_at;
            const overdue = a.due_date && new Date(a.due_date) < new Date() && !submitted;
            const busy = uploading === a.id;
            return (
              <div key={a.id} className="stat-card" style={{ background: "var(--bg)", border: `1px solid ${overdue ? "#FECDCA" : "var(--border)"}`, borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{a.title}</h3>
                  <Badge tone={submitted ? "success" : overdue ? "danger" : "warning"} dot>
                    {submitted ? `Submitted${a.grade ? " · " + a.grade : ""}` : overdue ? "Overdue" : "Pending"}
                  </Badge>
                </div>
                {a.description && <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>{a.description}</p>}
                <div style={{ fontSize: 12.5, color: "var(--text-subtle)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <span>{a.course_title} · Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : "no due date"}</span>
                  {!submitted && (
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", borderRadius: "var(--radius-sm)", fontSize: 12.5, fontWeight: 600, border: "1px solid var(--teal)", background: "var(--teal-50)", color: "var(--teal)", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
                      <input type="file" onChange={(e) => handleUpload(a.id, e)} disabled={busy} style={{ display: "none" }} />
                      {busy ? <LoadingSpinner size={12} /> : <FileUp size={13} aria-hidden="true" />} {busy ? "Uploading…" : "Submit file"}
                    </label>
                  )}
                  {submitted && a.submitted_at && <span style={{ fontSize: 12, color: "#067647", fontWeight: 600 }}>Submitted {new Date(a.submitted_at).toLocaleDateString()}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
