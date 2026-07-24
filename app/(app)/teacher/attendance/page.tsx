"use client";
import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { getTeacherAttendance, recordTeacherAttendance } from "@/app/lib/api/teacher";
import { getClassRoster, type ClassRosterStudent } from "@/app/lib/api/teacher";

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<ClassRosterStudent[]>([]);
  const [records, setRecords] = useState<Record<number, string>>({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getClassRoster(), getTeacherAttendance(date)]).then(([r, a]) => {
      if (r.ok && r.data) {
        setStudents(r.data.students);
        const init: Record<number, string> = {};
        r.data.students.forEach((s) => init[s.id] = "present");
        if (a.ok && a.data) {
          a.data.records.forEach((rec) => init[rec.student_id] = rec.status);
        }
        setRecords(init);
      }
    }).finally(() => setLoading(false));
  }, [date]);

  async function handleSave() {
    setSaving(true);
    const data = Object.entries(records).map(([student_id, status]) => ({ student_id: Number(student_id), status }));
    await recordTeacherAttendance({ date, records: data });
    setSaving(false);
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Attendance</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
          <button onClick={handleSave} disabled={saving} style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            {saving ? "Saving…" : "Save Attendance"}
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "var(--gray-50)" }}>
            <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Student</th>
            <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Status</th>
          </tr></thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{s.name}</td>
                <td style={{ padding: "12px 20px" }}>
                  <select value={records[s.id] ?? "present"} onChange={(e) => setRecords((r) => ({ ...r, [s.id]: e.target.value }))}
                    style={{ height: 34, padding: "0 10px", fontSize: 13, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
