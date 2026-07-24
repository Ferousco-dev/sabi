"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, XCircle, Clock } from "lucide-react";
import { getChildAttendance } from "@/app/lib/api/parent";

const STATUS_COLORS: Record<string, string> = { present: "#0E8345", absent: "#B42318", late: "var(--gold)", excused: "#4A6FA5" };

export default function ChildAttendancePage() {
  const { id } = useParams<{ id: string }>();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChildAttendance(Number(id)).then((res) => {
      if (res.ok && res.data) setRecords(res.data.records);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading attendance…</div>;

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href={`/parent/children/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Profile
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Attendance History</h1>

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
        {records.slice().reverse().map((r, i) => (
          <div key={i} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: "var(--gray-900)" }}>{new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 999, textTransform: "capitalize", background: r.status === "present" ? "#ECFDF3" : r.status === "absent" ? "#FEF3F2" : r.status === "late" ? "#FFFAEB" : "#EEF4FF", color: STATUS_COLORS[r.status] ?? "var(--gray-500)" }}>{r.status}</span>
          </div>
        ))}
        {records.length === 0 && <p style={{ padding: 32, textAlign: "center", color: "var(--gray-400)" }}>No attendance records yet.</p>}
      </div>
    </div>
  );
}
