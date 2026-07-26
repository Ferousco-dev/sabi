"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardCheck, Plus } from "lucide-react";
import { getAssessmentConfigs, createAssessmentConfig, getAcademicSessions, getTerms, type AssessmentConfig, type AcademicSession, type Term } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)", width: "100%" } as const;

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
  const [adding, setAdding] = useState(false);

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
    setAdding(true);
    await createAssessmentConfig({
      name: name.trim(), max_score: Number(maxScore), weight: Number(weight),
      session_id: sessionId, term_id: termId,
    });
    setName(""); setMaxScore("100"); setWeight("10");
    const r = await getAssessmentConfigs();
    if (r.ok && r.data) setAssessments(r.data.assessments);
    setAdding(false);
  }

  if (loading) return <LoadingPage />;

  const canSubmit = !!name.trim() && !!sessionId && !!termId;

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader title="Assessment configuration" subtitle="Define assessment types like tests, exams, and quizzes." actions={<Badge tone="teal">{assessments.length} configured</Badge>} />

      <Card title="Add an assessment" style={{ marginBottom: 20 }}>
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, alignItems: "flex-end" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="a-name" style={labelStyle}>Name</label>
            <input id="a-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mid-Term Test" style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="a-max" style={labelStyle}>Max score</label>
            <input id="a-max" type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="a-weight" style={labelStyle}>Weight (%)</label>
            <input id="a-weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="a-session" style={labelStyle}>Session</label>
            <select id="a-session" value={sessionId ?? ""} onChange={(e) => setSessionId(e.target.value ? Number(e.target.value) : null)} style={fieldStyle}>
              <option value="">Select…</option>
              {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="a-term" style={labelStyle}>Term</label>
            <select id="a-term" value={termId ?? ""} onChange={(e) => setTermId(e.target.value ? Number(e.target.value) : null)} style={fieldStyle}>
              <option value="">Select…</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" disabled={adding || !canSubmit}
              style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding || !canSubmit ? "not-allowed" : "pointer", opacity: adding || !canSubmit ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
              {adding ? <LoadingSpinner size={15} color="#fff" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />} Add assessment
            </button>
          </div>
        </form>
      </Card>

      {assessments.length === 0 ? (
        <Card><EmptyState Icon={ClipboardCheck} title="No assessments configured" description="Define assessment types like Mid-Term Tests, Exams, or Quizzes above." /></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assessments.map((a) => (
            <div key={a.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                <span aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ClipboardCheck size={20} style={{ color: "var(--teal)" }} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{a.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>Max: {a.max_score} · Weight: {a.weight}%</div>
                </div>
              </div>
              <Badge tone="neutral">{a.weight}%</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
