"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { getTimetable, createTimetableEntry, type TimetableEntry } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  useEffect(() => {
    getTimetable().then((res) => {
      if (res.ok && res.data) setEntries(res.data.timetable);
    }).finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) return;
    const res = await createTimetableEntry({ subject: subject.trim(), day, start_time: startTime, end_time: endTime });
    if (res.ok) {
      setSubject("");
      const r = await getTimetable();
      if (r.ok && r.data) setEntries(r.data.timetable);
    }
  }

  if (loading) return <LoadingPage />;

  const byDay = DAYS.map((d) => ({ day: d, items: entries.filter((e) => e.day === d).sort((a, b) => a.start_time.localeCompare(b.start_time)) }));

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Timetable</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 28, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Day</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Start</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>End</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
          Add Entry
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {byDay.map(({ day: d, items }) => (
          <div key={d} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "var(--shadow-xs)" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</div>
            <div style={{ padding: "8px 10px", minHeight: 120 }}>
              {items.length === 0 && <p style={{ fontSize: 12, color: "var(--gray-300)", textAlign: "center", padding: "16px 0" }}>No classes</p>}
              {items.map((e) => (
                <div key={e.id} style={{ padding: "6px 8px", marginBottom: 4, borderRadius: 6, background: "var(--teal-50)", fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: "var(--teal)" }}>{e.subject}</div>
                  <div style={{ fontSize: 11, color: "var(--gray-500)" }}>{e.start_time.slice(0, 5)}–{e.end_time.slice(0, 5)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
