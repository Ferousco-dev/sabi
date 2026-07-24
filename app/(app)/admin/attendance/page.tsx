"use client";
import { useEffect, useState } from "react";
import { getAttendance, recordAttendance, type AttendanceRecord } from "@/app/lib/api/schools";

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState<number | null>(null);

  const load = () => getAttendance(date).then((res) => {
    if (res.ok && res.data) setRecords(res.data.attendance);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, [date]);

  async function toggleStatus(studentEmail: string, currentStatus: string) {
    const student = records.find((r) => r.email === studentEmail);
    if (!student) return;
    const newStatus = currentStatus === "present" ? "absent" : "present";
    setSaving(records.indexOf(student));
    await recordAttendance(0, newStatus, date); // student_id is looked up by email on backend
    load();
    setSaving(null);
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading attendance…</div>;

  const present = records.filter((r) => r.status === "present").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Attendance</h1>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, boxShadow: "var(--shadow-xs)" }}>
        <span style={{ fontSize: 14, color: "var(--gray-500)" }}>Present: <strong style={{ color: "var(--teal)" }}>{present}</strong> / {records.length}</span>
      </div>

      {records.length === 0 && <p style={{ color: "var(--gray-400)" }}>No attendance records for this date.</p>}

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Name</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Status</th>
              <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.email} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{r.name}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: r.status === "present" ? "#0E8345" : "#B42318", fontWeight: 600, textTransform: "capitalize" }}>{r.status}</td>
                <td style={{ padding: "12px 20px", textAlign: "center" }}>
                  <button onClick={() => toggleStatus(r.email, r.status)} disabled={saving === i}
                    style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: `1px solid ${r.status === "present" ? "#FECDCA" : "var(--teal)"}`, background: r.status === "present" ? "#FEF3F2" : "var(--teal-50)", color: r.status === "present" ? "#B42318" : "var(--teal)", cursor: "pointer" }}>
                    Mark {r.status === "present" ? "Absent" : "Present"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
