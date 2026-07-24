"use client";
import { useEffect, useState } from "react";
import { FileUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { getStudentAssignments, submitAssignment } from "@/app/lib/api/student";

export default function StudentSubmissionsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    getStudentAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  async function handleUpload(assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(assignmentId);
    // In real app, upload file to storage first, get URL, then submit
    const res = await submitAssignment(Number(assignmentId), `uploads/${file.name}`);
    if (res.ok) {
      setAssignments((prev) => prev.map((a) => a.id === Number(assignmentId) ? { ...a, submitted_at: new Date().toISOString() } : a));
    }
    setUploading(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading submissions…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>My Submissions</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>{assignments.length} total</p>

      {assignments.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <Clock size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
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
                    {submitted ? `Submitted ${a.grade ? "· " + a.grade : ""}` : overdue ? "Overdue" : "Pending"}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 4 }}>{a.description}</p>
                <div style={{ fontSize: 12, color: "var(--gray-400)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span>{a.course_title} · Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}</span>
                  {!submitted && (
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <input type="file" ref={(el) => (fileInput.current = el)} onChange={(e) => handleUpload(a.id.toString(), e)} style={{ display: "none" }} />
                      <button type="button" onClick={() => fileInput.current?.click()} disabled={uploading === a.id} style={{ height: 32, padding: "0 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid var(--teal)", background: "var(--teal-50)", color: "var(--teal)", cursor: "pointer" }}>
                        <FileUp size={13} /> {uploading === a.id ? "Uploading…" : "Submit File"}
                      </button>
                    </label>
                  )}
                  {submitted && a.submitted_at && <span style={{ fontSize: 11, color: "#0E8345" }}>Submitted {new Date(a.submitted_at).toLocaleDateString()}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}