"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSubmissions, gradeSubmission, type Submission } from "@/app/lib/api/teacher";

export default function GradeAssignmentPage() {
  const { id } = useParams<{ id: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<Record<number, { grade: string; feedback: string }>>({});

  useEffect(() => {
    if (id) getSubmissions(Number(id)).then((res) => {
      if (res.ok && res.data) setSubmissions(res.data.submissions);
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleGrade(submissionId: number) {
    const data = grading[submissionId];
    if (!data?.grade) return;
    await gradeSubmission({ submission_id: submissionId, grade: data.grade, feedback: data.feedback || undefined });
    setSubmissions((prev) => prev.map((s) => s.id === submissionId ? { ...s, grade: data.grade, feedback: data.feedback } : s));
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading submissions…</div>;

  return (
    <div>
      <Link href="/teacher/assignments" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to assignments
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Grade Submissions</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 24 }}>{submissions.length} submissions</p>

      {submissions.length === 0 && <p style={{ color: "var(--gray-400)" }}>No submissions yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {submissions.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{s.student_name}</div>
                <div style={{ fontSize: 12, color: "var(--gray-400)" }}>Submitted {new Date(s.submitted_at).toLocaleString()}</div>
              </div>
              {s.grade && <span style={{ fontSize: 13, fontWeight: 700, color: "var(--teal)", background: "var(--teal-50)", padding: "4px 12px", borderRadius: 999 }}>{s.grade}</span>}
            </div>

            {s.content_url && (
              <div style={{ fontSize: 13, marginBottom: 12 }}>
                <span style={{ color: "var(--gray-500)" }}>Submission: </span>
                <a href={s.content_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>View file</a>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Grade</label>
                <input value={grading[s.id]?.grade ?? ""} onChange={(e) => setGrading((g) => ({ ...g, [s.id]: { grade: e.target.value, feedback: grading[s.id]?.feedback ?? "" } }))}
                  placeholder="e.g. A, B, 85%"
                  style={{ width: 100, height: 38, padding: "0 10px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Feedback</label>
                <input value={grading[s.id]?.feedback ?? ""} onChange={(e) => setGrading((g) => ({ ...g, [s.id]: { grade: grading[s.id]?.grade ?? "", feedback: e.target.value } }))}
                  placeholder="Optional feedback"
                  style={{ width: "100%", height: 38, padding: "0 10px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
              </div>
              <button onClick={() => handleGrade(s.id)}
                style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                Save Grade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
