"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardCheck, Check } from "lucide-react";
import { getAssessmentConfigs, type AssessmentConfig } from "@/app/lib/api/schools";
import { getAssessmentScores, submitAssessmentScores } from "@/app/lib/api/teacher";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function TeacherAssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentConfig[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAssessmentConfigs().then((res) => {
      if (res.ok && res.data) setAssessments(res.data.assessments);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSelect(id: number) {
    setSelected(id);
    setSaved(false);
    const res = await getAssessmentScores(id, 0);
    if (res.ok && res.data) {
      const m: Record<number, string> = {};
      res.data.scores.forEach((s) => (m[s.student_id] = s.score.toString()));
      setScores(m);
    } else setScores({});
  }

  async function handleSubmit() {
    if (!selected) return;
    setSaving(true);
    setSaved(false);
    const data = Object.entries(scores).map(([student_id, score]) => ({ student_id: Number(student_id), score: Number(score) }));
    await submitAssessmentScores({ assessment_id: selected, scores: data });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Score entry" subtitle="Record and update assessment scores for your students." />

      {assessments.length === 0 ? (
        <Card><EmptyState Icon={ClipboardCheck} title="No assessments configured" description="Assessments set up by your school appear here for score entry." /></Card>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {assessments.map((a) => {
              const active = selected === a.id;
              return (
                <button key={a.id} onClick={() => handleSelect(a.id)}
                  style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
                  {a.name}
                </button>
              );
            })}
          </div>

          {selected && (
            <Card padded={false}>
              {Object.keys(scores).length === 0 ? (
                <EmptyState Icon={ClipboardCheck} title="No students loaded" description="No score records exist for this assessment yet." />
              ) : (
                <>
                  <div style={{ maxHeight: 480, overflowY: "auto" }}>
                    {Object.entries(scores).map(([studentId, score]) => (
                      <div key={studentId} style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>Student #{studentId}</span>
                        <input type="number" min={0} value={score} onChange={(e) => setScores((s) => ({ ...s, [Number(studentId)]: e.target.value }))} aria-label={`Score for student ${studentId}`}
                          style={{ width: 84, height: 36, padding: "0 10px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", textAlign: "center", fontFamily: "var(--font-sans)" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 16, display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSubmit} disabled={saving}
                      style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: saved ? "#067647" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
                      {saving ? <LoadingSpinner size={15} color="#fff" /> : saved ? <Check size={16} strokeWidth={2.4} aria-hidden="true" /> : null}
                      {saving ? "Submitting…" : saved ? "Saved" : "Submit scores"}
                    </button>
                  </div>
                </>
              )}
            </Card>
          )}
        </>
      )}
    </>
  );
}
