"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardCheck, Check } from "lucide-react";
import { getTeacherAttendance, recordTeacherAttendance, getClassRoster, type ClassRosterStudent } from "@/app/lib/api/teacher";
import { getClasses, type ClassItem } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";

const STATUSES = ["present", "absent", "late", "excused"] as const;
const TONE: Record<string, "success" | "danger" | "warning" | "teal"> = { present: "success", absent: "danger", late: "warning", excused: "teal" };

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<ClassRosterStudent[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classId, setClassId] = useState("");
  const [records, setRecords] = useState<Record<number, string>>({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getClasses().then((c) => { if (c.ok && c.data) setClasses(c.data.classes); });
  }, []);

  useEffect(() => {
    Promise.all([getClassRoster(), getTeacherAttendance(date)]).then(([r, a]) => {
      if (r.ok && r.data) {
        setStudents(r.data.students);
        const init: Record<number, string> = {};
        r.data.students.forEach((s) => (init[s.id] = "present"));
        if (a.ok && a.data) a.data.records.forEach((rec) => (init[rec.student_id] = rec.status));
        setRecords(init);
      }
    }).finally(() => setLoading(false));
  }, [date]);

  async function handleSave() {
    if (!classId) return;
    setSaving(true);
    setSaved(false);
    const data = Object.entries(records).map(([student_id, status]) => ({ student_id: Number(student_id), status }));
    await recordTeacherAttendance({ class_id: Number(classId), date, records: data });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <LoadingPage />;

  const presentCount = Object.values(records).filter((s) => s === "present").length;

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle="Mark today's roll for your class."
        actions={
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} aria-label="Class"
              style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" }}>
              <option value="">Select class…</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Attendance date"
              style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)" }} />
            <button onClick={handleSave} disabled={saving || students.length === 0 || !classId}
              style={{ height: 40, padding: "0 16px", borderRadius: "var(--radius-sm)", background: saved ? "#067647" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving || students.length === 0 || !classId ? "not-allowed" : "pointer", opacity: saving || students.length === 0 || !classId ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={15} color="#fff" /> : saved ? <Check size={16} strokeWidth={2.4} aria-hidden="true" /> : null}
              {saving ? "Saving…" : saved ? "Saved" : "Save attendance"}
            </button>
          </div>
        }
      />

      <Card padded={false}>
        {students.length === 0 ? (
          <EmptyState Icon={ClipboardCheck} title="No students to mark" description="Your class roster appears here once students are enrolled." />
        ) : (
          <>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Badge tone="success" dot>{presentCount} present</Badge>
              <Badge tone="neutral">{students.length - presentCount} not present</Badge>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr>{["Student", "Status"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const cur = records[s.id] ?? "present";
                    return (
                      <tr key={s.id}>
                        <td style={tdStyle}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                            <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(s.name)}</span>
                            <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{s.name}</span>
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div role="group" aria-label={`Status for ${s.name}`} style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
                            {STATUSES.map((st) => {
                              const active = cur === st;
                              const t = TONE[st];
                              return (
                                <button key={st} onClick={() => setRecords((r) => ({ ...r, [s.id]: st }))}
                                  style={{ height: 30, padding: "0 11px", borderRadius: "var(--radius-full)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", textTransform: "capitalize", border: `1px solid ${active ? "transparent" : "var(--border-strong)"}`, background: active ? `var(--${t === "teal" ? "teal-50" : "bg-subtle"})` : "var(--bg)", color: active ? tone(t) : "var(--text-subtle)", boxShadow: active ? "inset 0 0 0 1px currentColor" : "none" }}>
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

function tone(t: "success" | "danger" | "warning" | "teal"): string {
  return t === "success" ? "#067647" : t === "danger" ? "#B42318" : t === "warning" ? "#B54708" : "var(--teal)";
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textAlign: "left" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
