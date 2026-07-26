"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ListOrdered } from "lucide-react";
import { getAcademicSessions, getTerms, createTerm, type AcademicSession, type Term } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };

export default function TermsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadSessions = () => getAcademicSessions().then((res) => {
    if (res.ok && res.data) {
      setSessions(res.data.sessions);
      const current = res.data.sessions.find((s) => s.is_current);
      if (current && !sessionId) setSessionId(current.id);
    }
  });

  const loadTerms = () => {
    if (!sessionId) return;
    getTerms(sessionId).then((res) => {
      if (res.ok && res.data) setTerms(res.data.terms);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadSessions(); }, []);
  useEffect(() => { if (sessionId) loadTerms(); else setLoading(false); }, [sessionId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId || !name.trim() || !startDate || !endDate) return;
    setSaving(true);
    await createTerm({ session_id: sessionId, name: name.trim(), start_date: startDate, end_date: endDate });
    setName(""); setStartDate(""); setEndDate("");
    loadTerms();
    setSaving(false);
  }

  if (loading) return <LoadingPage />;

  const valid = !!sessionId && !!name.trim() && !!startDate && !!endDate;

  return (
    <>
      <PageHeader
        title="Terms"
        subtitle="Define the terms that make up each academic session."
        actions={
          <select value={sessionId ?? ""} onChange={(e) => setSessionId(Number(e.target.value))} aria-label="Academic session"
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
            {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a term">
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 160px" }}>
              <label style={labelStyle}>Term name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. First Term" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>Start</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>End</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add term"}
            </button>
          </form>
        </Card>

        {terms.length === 0 ? (
          <Card><EmptyState Icon={ListOrdered} title="No terms" description="Define terms (like First Term, Second Term) for the selected session." /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {terms.map((t) => (
              <div key={t.id} className="stat-card" style={{ background: "var(--bg)", border: `1px solid ${t.is_current ? "var(--teal)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ListOrdered size={20} color="var(--teal)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", display: "flex", alignItems: "center", gap: 8 }}>
                    {t.name} {t.is_current ? <Badge tone="teal" dot>Current</Badge> : null}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{new Date(t.start_date).toLocaleDateString()} – {new Date(t.end_date).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
