"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { getAssessmentConfigs, type AssessmentConfig } from "@/app/lib/api/schools";
import { getAssessmentScores, submitAssessmentScores } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function TeacherAssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentConfig[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAssessmentConfigs().then((res) => {
      if (res.ok && res.data) setAssessments(res.data.assessments);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSelect(id: number) {
    setSelected(id);
    const res = await getAssessmentScores(id, 0);
    if (res.ok && res.data) {
      const m: Record<number, string> = {};
      res.data.scores.forEach((s) => m[s.student_id] = s.score.toString());
      setScores(m);
    }
  }

  async function handleSubmit() {
    if (!selected) return;
    setSaving(true);
    const data = Object.entries(scores).map(([student_id, score]) => ({ student_id: Number(student_id), score: Number(score) }));
    await submitAssessmentScores({ assessment_id: selected, scores: data });
    setSaving(false);
  }

  if (loading) return <LoadingPage />;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Score Entry</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {assessments.map((a) => (
          <button key={a.id} onClick={() => handleSelect(a.id)}
            style={{ height: 38, padding: "0 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: `1.5px solid ${selected === a.id ? "var(--teal)" : "var(--border)"}`, background: selected === a.id ? "var(--teal-50)" : "#fff", color: selected === a.id ? "var(--teal)" : "var(--gray-600)", cursor: "pointer" }}>
            {a.name}
          </button>
        ))}
      </div>

      {selected && (
        <div>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 20 }}>
            {Object.keys(scores).length === 0 && (
              <EmptyState
                icon={ClipboardCheck}
                title="No students loaded"
                description="Select an assessment above to load students for score entry."
              />
            )}
            {Object.entries(scores).map(([studentId, score]) => (
              <div key={studentId} style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>Student #{studentId}</span>
                <input type="number" value={score} onChange={(e) => setScores((s) => ({ ...s, [studentId]: e.target.value }))}
                  style={{ width: 80, height: 34, padding: "0 10px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", textAlign: "center" }} />
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={saving}
            style={{ height: 42, padding: "0 20px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", opacity: saving ? 0.65 : 1 }}>
            {saving ? "Submitting…" : "Submit Scores"}
          </button>
        </div>
      )}
    </div>
  );
}
