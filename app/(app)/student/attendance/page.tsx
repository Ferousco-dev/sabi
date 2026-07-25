"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarCheck, XCircle, Clock } from "lucide-react";
import { getStudentAttendance, requestAttendanceCorrection } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

const STATUS_COLORS: Record<string, string> = { present: "#0E8345", absent: "#B42318", late: "var(--gold)", excused: "#4A6FA5" };
const STATUS_ICONS: Record<string, any> = { present: CalendarCheck, absent: XCircle, late: Clock };

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => {
    getStudentAttendance().then((res) => {
      if (res.ok && res.data) setRecords(res.data.records);
    }).finally(() => setLoading(false));
  }, []);

  async function handleRequest(date: string) {
    const reason = prompt("Please explain the reason for correction request:");
    if (!reason) return;
    setRequesting(date);
    await requestAttendanceCorrection({ date, reason });
    setRequesting(null);
    alert("Correction request submitted for review.");
  }

  if (loading) return <LoadingPage />;

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>My Attendance</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px", textAlign: "center", boxShadow: "var(--shadow-xs)" }}>
          <CalendarCheck size={20} color="#0E8345" style={{ margin: "0 auto 6px" }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)" }}>{present}</div>
          <div style={{ fontSize: 11, color: "var(--gray-500)" }}>Present</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px", textAlign: "center", boxShadow: "var(--shadow-xs)" }}>
          <XCircle size={20} color="#B42318" style={{ margin: "0 auto 6px" }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)" }}>{absent}</div>
          <div style={{ fontSize: 11, color: "var(--gray-500)" }}>Absent</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px", textAlign: "center", boxShadow: "var(--shadow-xs)" }}>
          <Clock size={20} color="var(--gold)" style={{ margin: "0 auto 6px" }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)" }}>{late}</div>
          <div style={{ fontSize: 11, color: "var(--gray-500)" }}>Late</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        {records.slice().reverse().map((r) => {
          const Icon = STATUS_ICONS[r.status] || CalendarCheck;
          return (
            <div key={r.date} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: "var(--gray-900)" }}>{new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon size={16} style={{ color: STATUS_COLORS[r.status] }} />
                <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 999, textTransform: "capitalize", background: r.status === "present" ? "#ECFDF3" : r.status === "absent" ? "#FEF3F2" : r.status === "late" ? "#FFFAEB" : "#EEF4FF", color: STATUS_COLORS[r.status] ?? "var(--gray-500)" }}>{r.status}</span>
                {r.notes && <span style={{ fontSize: 11, color: "var(--gray-400)" }}>{r.notes}</span>}
                <button onClick={() => handleRequest(r.date)} disabled={requesting === r.date} style={{ height: 28, padding: "0 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, border: "1px solid var(--border)", background: "var(--gray-50)", color: "var(--gray-600)", cursor: "pointer" }}>
                  Request Correction
                </button>
              </div>
            </div>
          );
        })}
        {records.length === 0 && (
          <EmptyState
            icon={CalendarCheck}
            title="No attendance records"
            description="Your daily attendance history will be shown here."
          />
        )}
      </div>
    </div>
  );
}