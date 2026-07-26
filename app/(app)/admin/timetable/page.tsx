"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { getTimetable, createTimetableEntry, type TimetableEntry } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)", width: "100%" } as const;

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getTimetable().then((res) => {
      if (res.ok && res.data) setEntries(res.data.timetable);
    }).finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) return;
    setAdding(true);
    const res = await createTimetableEntry({ subject: subject.trim(), day, start_time: startTime, end_time: endTime });
    if (res.ok) {
      setSubject("");
      const r = await getTimetable();
      if (r.ok && r.data) setEntries(r.data.timetable);
    }
    setAdding(false);
  }

  if (loading) return <LoadingPage />;

  const byDay = DAYS.map((d) => ({ day: d, items: entries.filter((e) => e.day === d).sort((a, b) => a.start_time.localeCompare(b.start_time)) }));

  return (
    <>
      <PageHeader title="Timetable" subtitle="Plan the weekly class schedule." />

      <Card title="Add an entry" style={{ marginBottom: 24 }}>
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, alignItems: "flex-end" }}>
          <div>
            <label htmlFor="t-subject" style={labelStyle}>Subject</label>
            <input id="t-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="t-day" style={labelStyle}>Day</label>
            <select id="t-day" value={day} onChange={(e) => setDay(e.target.value)} style={fieldStyle}>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="t-start" style={labelStyle}>Start</label>
            <input id="t-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="t-end" style={labelStyle}>End</label>
            <input id="t-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <button type="submit" disabled={adding || !subject.trim()}
              style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding || !subject.trim() ? "not-allowed" : "pointer", opacity: adding || !subject.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", width: "100%", justifyContent: "center" }}>
              {adding ? <LoadingSpinner size={15} color="#fff" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />} Add
            </button>
          </div>
        </form>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        {byDay.map(({ day: d, items }) => (
          <div key={d} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
              <CalendarClock size={14} aria-hidden="true" /> {d}
            </div>
            <div style={{ padding: 10, minHeight: 120 }}>
              {items.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-subtle)", textAlign: "center", padding: "20px 0" }}>No classes</p>}
              {items.map((e) => (
                <div key={e.id} style={{ padding: "8px 10px", marginBottom: 6, borderRadius: "var(--radius-sm)", background: "var(--teal-50)" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--teal)" }}>{e.subject}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-subtle)", marginTop: 2 }}>{e.start_time.slice(0, 5)}–{e.end_time.slice(0, 5)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
