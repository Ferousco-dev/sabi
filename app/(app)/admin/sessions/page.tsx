"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarDays, Plus, CheckCircle2 } from "lucide-react";
import { getAcademicSessions, createAcademicSession, setCurrentSession, type AcademicSession } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = () => getAcademicSessions().then((res) => {
    if (res.ok && res.data) setSessions(res.data.sessions);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;
    await createAcademicSession({ name: name.trim(), start_date: startDate, end_date: endDate });
    setName(""); setStartDate(""); setEndDate("");
    load();
  }

  async function handleSetCurrent(id: number) {
    await setCurrentSession(id);
    load();
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Academic Sessions</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Session Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 2024/2025" style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 160 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Session
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sessions.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: `1px solid ${s.is_current ? "var(--teal)" : "var(--border)"}`, borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: s.is_current ? "var(--teal)" : "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarDays size={20} color={s.is_current ? "#fff" : "var(--teal)"} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{s.name} {s.is_current ? <span style={{ fontSize: 11, color: "var(--teal)", fontWeight: 600 }}>· Current</span> : null}</div>
                <div style={{ fontSize: 13, color: "var(--gray-500)" }}>{new Date(s.start_date).toLocaleDateString()} – {new Date(s.end_date).toLocaleDateString()}</div>
              </div>
            </div>
            {!s.is_current && (
              <button onClick={() => handleSetCurrent(s.id)} style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid var(--teal)", background: "var(--teal-50)", color: "var(--teal)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle2 size={14} /> Set Current
              </button>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <EmptyState
            icon={CalendarDays}
            title="No sessions created"
            description="Define your academic sessions to start managing terms and enrollments."
          />
        )}
      </div>
    </div>
  );
}

