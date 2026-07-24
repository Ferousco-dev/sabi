"use client";
import { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { getStudentTimetable, type StudentTimetableEntry } from "@/app/lib/api/student";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [entries, setEntries] = useState<StudentTimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentTimetable().then((res) => {
      if (res.ok && res.data) setEntries(res.data.timetable);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading timetable…</div>;

  const byDay = DAYS.map((d) => ({ day: d, items: entries.filter((e) => e.day === d).sort((a, b) => a.start_time.localeCompare(b.start_time)) }));

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>My Timetable</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {byDay.map(({ day: d, items }) => (
          <div key={d} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "var(--shadow-xs)" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</div>
            <div style={{ padding: "8px 10px", minHeight: 120 }}>
              {items.length === 0 && <p style={{ fontSize: 12, color: "var(--gray-300)", textAlign: "center", padding: "16px 0" }}>No classes</p>}
              {items.map((e) => (
                <div key={e.id} style={{ padding: "6px 8px", marginBottom: 4, borderRadius: 6, background: "var(--teal-50)", fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: "var(--teal)" }}>{e.subject}</div>
                  <div style={{ fontSize: 11, color: "var(--gray-500)", display: "flex", gap: 6, marginTop: 2 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Clock size={11} /> {e.start_time.slice(0, 5)}–{e.end_time.slice(0, 5)}</span>
                    {e.teacher_name && <span style={{ display: "flex", alignItems: "center", gap: 2 }}>{e.teacher_name}</span>}
                    {e.room && <span style={{ display: "flex", alignItems: "center", gap: 2 }}>📍 {e.room}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}