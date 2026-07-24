"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Send } from "lucide-react";
import { getAssignmentDetail, gradeSubmission, type Submission } from "@/app/lib/api/teacher";

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<number | null>(null);

  useEffect(() => {
    getAssignmentDetail(Number(id)).then((res) => {
      if (res.ok && res.data) {
        setAssignment(res.data.assignment);
        setSubmissions(res.data.assignment.submissions ?? []);
      } else router.push("/teacher/assignments");
    }).finally(() => setLoading(false));
  }, [id, router]);

  async function handleGrade(submissionId: number, grade: string) {
    setGrading(submissionId);
    await gradeSubmission({ submission_id: submissionId, grade });
    setSubmissions(submissions.map((s) => s.id === submissionId ? { ...s, grade } : s));
    setGrading(null);
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;
  if (!assignment) return null;

  return (
    <div>
      <Link href="/teacher/assignments" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Assignments
      </Link>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>{assignment.title}</h1>
        <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{assignment.course_title ?? "General"} · Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}</p>
        {assignment.description && <p style={{ fontSize: 14, color: "var(--gray-600)", marginTop: 8 }}>{assignment.description}</p>}
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Student</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Submitted</th>
              <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Grade</th>
              <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && <tr><td colSpan={4} style={{ padding: 32, textAlign: "center", color: "var(--gray-400)" }}>No submissions yet.</td></tr>}
            {submissions.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{s.student_name}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: s.submitted_at ? "#0E8345" : "var(--gray-500)", fontWeight: 600 }}>
                  {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : "Not submitted"}
                </td>
                <td style={{ padding: "12px 20px", textAlign: "center" }}>
                  {s.grade ? <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>{s.grade}</span> : <span style={{ fontSize: 12, color: "var(--gray-400)" }}>—</span>}
                </td>
                <td style={{ padding: "12px 20px", textAlign: "center" }}>
                  {!s.submitted_at ? <span style={{ fontSize: 12, color: "var(--gray-400)" }}>Waiting</span> : (
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button onClick={() => handleGrade(s.id, prompt("Enter grade:") ?? "")} disabled={grading === s.id}
                        style={{ height: 32, padding: "0 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "none", background: s.grade ? "#ECFDF3" : "var(--teal-50)", color: s.grade ? "#0E8345" : "var(--teal)", cursor: "pointer" }}>
                        {s.grade ? "Update" : "Grade"}
                      </button>
                      {s.feedback && <button style={{ height: 32, padding: "0 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid var(--border)", background: "#fff", color: "var(--gray-500)", cursor: "pointer" }}>View Feedback</button>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}