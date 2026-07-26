"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { getAcademicSessions, createAcademicSession, setCurrentSession, type AcademicSession } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };

export default function SessionsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
    await createAcademicSession({ name: name.trim(), start_date: startDate, end_date: endDate });
    setName(""); setStartDate(""); setEndDate("");
    await load();
    setSaving(false);
  }

  async function handleSetCurrent(id: number) {
    await setCurrentSession(id);
    load();
  }

  if (loading) return <LoadingPage />;

  const valid = !!name.trim() && !!startDate && !!endDate;

  return (
    <>
      <PageHeader title="Academic sessions" subtitle="Set up the academic years that drive terms and enrollments." actions={<Badge tone="teal">{sessions.length} sessions</Badge>} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a session">
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 160px" }}>
              <label style={labelStyle}>Session name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 2024/2025" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add session"}
            </button>
          </form>
        </Card>

        {sessions.length === 0 ? (
          <Card><EmptyState Icon={CalendarDays} title="No sessions created" description="Define your academic sessions to start managing terms and enrollments." /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.map((s) => (
              <div key={s.id} className="stat-card" style={{ background: "var(--bg)", border: `1px solid ${s.is_current ? "var(--teal)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: s.is_current ? "var(--teal)" : "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CalendarDays size={20} color={s.is_current ? "#fff" : "var(--teal)"} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", display: "flex", alignItems: "center", gap: 8 }}>
                      {s.name} {s.is_current ? <Badge tone="teal" dot>Current</Badge> : null}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{new Date(s.start_date).toLocaleDateString()} – {new Date(s.end_date).toLocaleDateString()}</div>
                  </div>
                </div>
                {!s.is_current && (
                  <button onClick={() => handleSetCurrent(s.id)} style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: "1px solid var(--teal)", background: "var(--teal-50)", color: "var(--teal)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, fontFamily: "var(--font-sans)" }}>
                    <CheckCircle2 size={14} /> Set current
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
