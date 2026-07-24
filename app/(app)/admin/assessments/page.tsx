"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardCheck, Plus } from "lucide-react";
import { getAssessmentConfigs, createAssessmentConfig, getAcademicSessions, getTerms, type AssessmentConfig, type AcademicSession, type Term } from "@/app/lib/api/schools";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentConfig[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [weight, setWeight] = useState("10");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [termId, setTermId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getAssessmentConfigs(), getAcademicSessions(), getTerms()]).then(([a, s, t]) => {
      if (a.ok && a.data) setAssessments(a.data.assessments);
      if (s.ok && s.data) setSessions(s.data.sessions);
      if (t.ok && t.data) setTerms(t.data.terms);
    }).finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !sessionId || !termId) return;
    await createAssessmentConfig({
      name: name.trim(), max_score: Number(maxScore), weight: Number(weight),
      session_id: sessionId, term_id: termId,
    });
    setName(""); setMaxScore("100"); setWeight("10");
    const r = await getAssessmentConfigs();
    if (r.ok && r.data) setAssessments(r.data.assessments);
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Assessment Configuration</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mid-Term Test" style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 140 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Max Score</label>
          <input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 80 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Weight (%)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 80 }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {assessments.map((a) => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ClipboardCheck size={20} color="var(--teal)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{a.name}</div>
                <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Max: {a.max_score} · Weight: {a.weight}%</div>
              </div>
            </div>
          </div>
        ))}
        {assessments.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No assessment types configured.</p>}
      </div>
    </div>
  );
}

