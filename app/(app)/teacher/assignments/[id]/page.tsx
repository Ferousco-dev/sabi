"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { getAssignmentDetail, gradeSubmission, type Submission } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

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

  if (loading) return <LoadingPage />;
  if (!assignment) return null;

  const dueLabel = assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date";

  return (
    <div style={{ maxWidth: 900 }}>
      <Link href="/teacher/assignments" style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> Back to assignments
      </Link>

      <PageHeader
        title={assignment.title}
        subtitle={`${assignment.course_title ?? "General"} · Due ${dueLabel}`}
      />

      {assignment.description && (
        <Card title="Instructions" style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14.5, color: "var(--gray-700)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{assignment.description}</p>
        </Card>
      )}

      <Card title={`Submissions (${submissions.length})`} padded={false}>
        {submissions.length === 0 ? (
          <EmptyState Icon={ClipboardList} title="No submissions" description="Students haven't submitted this assignment yet." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Student</th>
                  <th style={th}>Submitted</th>
                  <th style={{ ...th, textAlign: "center" }}>Grade</th>
                  <th style={{ ...th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ ...td, fontWeight: 600, color: "var(--gray-900)" }}>{s.student_name}</td>
                    <td style={td}>
                      {s.submitted_at
                        ? <Badge tone="success" dot>{new Date(s.submitted_at).toLocaleDateString()}</Badge>
                        : <Badge tone="neutral">Not submitted</Badge>}
                    </td>
                    <td style={{ ...td, textAlign: "center" }}>
                      {s.grade
                        ? <span style={{ fontSize: 14, fontWeight: 700, color: "var(--teal)" }}>{s.grade}</span>
                        : <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>—</span>}
                    </td>
                    <td style={{ ...td, textAlign: "center" }}>
                      {!s.submitted_at ? (
                        <span style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>Waiting</span>
                      ) : (
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button onClick={() => handleGrade(s.id, prompt("Enter grade:") ?? "")} disabled={grading === s.id}
                            style={{ height: 32, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, border: "none", background: s.grade ? "#ECFDF3" : "var(--teal-50)", color: s.grade ? "#067647" : "var(--teal)", cursor: grading === s.id ? "not-allowed" : "pointer", opacity: grading === s.id ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
                            {s.grade ? "Update" : "Grade"}
                          </button>
                          {s.feedback && (
                            <button style={{ height: 32, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, border: "1px solid var(--border-strong)", background: "var(--bg)", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                              View feedback
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

const backLink = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600,
  color: "var(--teal)", textDecoration: "none", marginBottom: 16,
} as const;

const th = {
  textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600,
  color: "var(--text-subtle)", textTransform: "uppercase", background: "var(--bg-subtle)",
} as const;

const td = { padding: "12px 20px", fontSize: 14, color: "var(--text-muted)" } as const;
