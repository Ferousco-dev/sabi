"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { getStudentTimetable, type StudentTimetableEntry } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [entries, setEntries] = useState<StudentTimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentTimetable().then((res) => {
      if (res.ok && res.data) setEntries(res.data.timetable);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const byDay = DAYS.map((d) => ({ day: d, items: entries.filter((e) => e.day === d).sort((a, b) => a.start_time.localeCompare(b.start_time)) }));

  return (
    <>
      <PageHeader title="My timetable" subtitle="Your weekly class schedule." />

      {entries.length === 0 ? (
        <Card><EmptyState Icon={CalendarDays} title="No timetable yet" description="Your class schedule appears here once your school publishes it." /></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {byDay.map(({ day: d, items }) => (
            <div key={d} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
              <div style={{ padding: "11px 14px", borderBottom: "1px solid var(--border)", fontSize: 12.5, fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em", background: "var(--teal-50)" }}>{d}</div>
              <div style={{ padding: 10, minHeight: 120, display: "flex", flexDirection: "column", gap: 6 }}>
                {items.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-subtle)", textAlign: "center", padding: "20px 0" }}>No classes</p>}
                {items.map((e) => (
                  <div key={e.id} className="stat-card" style={{ padding: "9px 10px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, color: "var(--gray-900)", fontSize: 13 }}>{e.subject}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-subtle)", display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={11} aria-hidden="true" /> {e.start_time.slice(0, 5)}–{e.end_time.slice(0, 5)}</span>
                      {e.teacher_name && <span>{e.teacher_name}</span>}
                      {e.room && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><MapPin size={11} aria-hidden="true" /> {e.room}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
