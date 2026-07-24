"use client";
import { useEffect, useState } from "react";
import { CalendarCheck, XCircle, Clock } from "lucide-react";
import { getStudentAttendance, requestAttendanceCorrection, type StudentAttendanceRecord } from "@/app/lib/api/student";

const STATUS_COLORS: Record<string, string> = { present: "#0E8345", absent: "#B42318", late: "var(--gold)", excused: "#4A6FA5" };

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<StudentAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentAttendance().then((res) => {
      if (res.ok && res.data) setRecords(res.data.records);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading attendance…</div>;

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Attendance History</h1>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--gray-500)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CalendarCheck size={13} color="#0E8345" /> {present} Present</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><XCircle size={13} color="#B42318" /> {absent} Absent</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} color="var(--gold)" /> {late} Late</span>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        {records.slice().reverse().map((r, i) => (
          <div key={i} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: "var(--gray-900)" }}>{new Date(r.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 999, textTransform: "capitalize", background: r.status === "present" ? "#ECFDF3" : r.status === "absent" ? "#FEF3F2" : r.status === "late" ? "#FFFAEB" : "#EEF4FF", color: STATUS_COLORS[r.status] ?? "var(--gray-500)" }}>{r.status}</span>
          </div>
        ))}
        {records.length === 0 && <p style={{ padding: 32, textAlign: "center", color: "var(--gray-400)" }}>No attendance records yet.</p>}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#fff", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 8 }}>Request Attendance Correction</div>
        <form onSubmit={(e) => { e.preventDefault(); }} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Date</label>
            <input type="date" style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Reason</label>
            <input placeholder="e.g. Medical appointment" style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
          </div>
          <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Submit Request</button>
        </form>
      </div>
    </div>
  );
}