"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarCheck, XCircle, Clock, Percent } from "lucide-react";
import { getStudentAttendance, requestAttendanceCorrection } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type Record_ = { date: string; status: string; notes?: string };
const TONE: Record<string, "success" | "danger" | "warning" | "teal" | "neutral"> = { present: "success", absent: "danger", late: "warning", excused: "teal" };

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<Record_[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => {
    getStudentAttendance().then((res) => {
      if (res.ok && res.data) setRecords(res.data.records);
    }).finally(() => setLoading(false));
  }, []);

  async function handleRequest(date: string) {
    const reason = prompt("Please explain the reason for your correction request:");
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
  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <>
      <PageHeader title="My attendance" subtitle="Your daily attendance history." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Present" value={present} Icon={CalendarCheck} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Absent" value={absent} Icon={XCircle} /></div>
        <div className="dash-rise" style={{ animationDelay: "140ms" }}><StatCard label="Late" value={late} Icon={Clock} /></div>
        <div className="dash-rise" style={{ animationDelay: "210ms" }}><StatCard label="Attendance rate" value={rate} suffix="%" Icon={Percent} /></div>
      </div>

      <Card padded={false}>
        {records.length === 0 ? (
          <EmptyState Icon={CalendarCheck} title="No attendance records" description="Your daily attendance history appears here." />
        ) : (
          records.slice().reverse().map((r) => (
            <div key={r.date} style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>
                {new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <Badge tone={TONE[r.status] ?? "neutral"} dot>{r.status[0].toUpperCase() + r.status.slice(1)}</Badge>
                {r.notes && <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>{r.notes}</span>}
                <button onClick={() => handleRequest(r.date)} disabled={requesting === r.date}
                  style={{ height: 30, padding: "0 12px", borderRadius: "var(--radius-sm)", fontSize: 12.5, fontWeight: 600, border: "1px solid var(--border-strong)", background: "var(--bg-subtle)", color: "var(--text-muted)", cursor: requesting === r.date ? "default" : "pointer", fontFamily: "var(--font-sans)", opacity: requesting === r.date ? 0.6 : 1 }}>
                  Request correction
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </>
  );
}
