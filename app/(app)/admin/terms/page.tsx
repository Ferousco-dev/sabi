"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ListOrdered, Plus } from "lucide-react";
import { getAcademicSessions, getTerms, createTerm, type AcademicSession, type Term } from "@/app/lib/api/schools";

export default function TermsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
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
    await createTerm({ session_id: sessionId, name: name.trim(), start_date: startDate, end_date: endDate });
    setName(""); setStartDate(""); setEndDate("");
    loadTerms();
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading terms…</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Terms</h1>
        <select value={sessionId ?? ""} onChange={(e) => setSessionId(Number(e.target.value))}
          style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
          {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Term Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. First Term" style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 160 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Start</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>End</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Term
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {terms.map((t) => (
          <div key={t.id} style={{ background: "#fff", border: `1px solid ${t.is_current ? "var(--teal)" : "var(--border)"}`, borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ListOrdered size={20} color="var(--teal)" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{t.name} {t.is_current ? <span style={{ fontSize: 11, color: "var(--teal)", fontWeight: 600 }}>· Current</span> : null}</div>
              <div style={{ fontSize: 13, color: "var(--gray-500)" }}>{new Date(t.start_date).toLocaleDateString()} – {new Date(t.end_date).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {terms.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No terms for this session.</p>}
      </div>
    </div>
  );
}

