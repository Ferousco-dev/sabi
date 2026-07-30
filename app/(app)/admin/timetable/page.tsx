"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { getTimetable, createTimetableEntry, deleteTimetableEntry, getClasses, getSubjects, type TimetableEntry, type ClassItem, type Subject } from "@/app/lib/api/schools";
import { useResource } from "@/app/lib/useResource";
import { useConfirm } from "@/app/components/ui/confirm";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)", width: "100%" } as const;

export default function TimetablePage() {
  const confirm = useConfirm();
  const { data, loading, refresh } = useResource("admin:timetable", async () => {
    const [t, c, s] = await Promise.all([getTimetable(), getClasses(), getSubjects()]);
    return {
      entries: t.ok && t.data ? t.data.timetable : ([] as TimetableEntry[]),
      classes: c.ok && c.data ? c.data.classes : ([] as ClassItem[]),
      subjects: s.ok && s.data ? s.data.subjects : ([] as Subject[]),
    };
  });
  const entries = data?.entries ?? [];
  const classes = data?.classes ?? [];
  const subjects = data?.subjects ?? [];

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!classId) return;
    setAdding(true);
    const res = await createTimetableEntry({
      class_id: Number(classId),
      subject_id: subjectId ? Number(subjectId) : undefined,
      day, start_time: startTime, end_time: endTime,
    });
    if (res.ok) {
      setSubjectId("");
      await refresh();
    }
    setAdding(false);
  }

  async function handleDelete(id: number) {
    const ok = await confirm({ title: "Remove this timetable slot?", message: "This will delete the slot from the schedule.", confirmLabel: "Remove", tone: "danger" });
    if (!ok) return;
    const res = await deleteTimetableEntry(id);
    if (res.ok) refresh();
  }

  if (loading) return <LoadingPage />;

  const byDay = DAYS.map((d) => ({ day: d, items: entries.filter((e) => e.day === d).sort((a, b) => a.start_time.localeCompare(b.start_time)) }));

  return (
    <>
      <PageHeader title="Timetable" subtitle="Plan the weekly class schedule." />

      <Card title="Add an entry" style={{ marginBottom: 24 }}>
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, alignItems: "flex-end" }}>
          <div>
            <label htmlFor="t-class" style={labelStyle}>Class *</label>
            <select id="t-class" value={classId} onChange={(e) => setClassId(e.target.value)} style={fieldStyle}>
              <option value="">Select class…</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="t-subject" style={labelStyle}>Subject</label>
            <select id="t-subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} style={fieldStyle}>
              <option value="">—</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
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
            <button type="submit" disabled={adding || !classId}
              style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding || !classId ? "not-allowed" : "pointer", opacity: adding || !classId ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", width: "100%", justifyContent: "center" }}>
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
                <div key={e.id} style={{ padding: "8px 10px", marginBottom: 6, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--teal)" }}>{e.subject}</div>
                    {e.class_name && <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 1 }}>{e.class_name}</div>}
                    <div style={{ fontSize: 11.5, color: "var(--text-subtle)", marginTop: 2 }}>{e.start_time.slice(0, 5)}–{e.end_time.slice(0, 5)}</div>
                  </div>
                  <button type="button" onClick={() => handleDelete(e.id)} aria-label={`Remove ${e.subject} slot`} title="Remove slot"
                    style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "none", background: "transparent", color: "var(--text-subtle)", cursor: "pointer" }}>
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
