"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarCheck, UserCheck, UserX } from "lucide-react";
import { getAttendance, recordAttendance, type AttendanceRecord } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState<number | null>(null);

  const load = () => getAttendance(date).then((res) => {
    if (res.ok && res.data) setRecords(res.data.attendance);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleStatus(studentEmail: string, currentStatus: string, i: number) {
    const newStatus = currentStatus === "present" ? "absent" : "present";
    setSaving(i);
    await recordAttendance(0, newStatus, date); // student_id looked up by email on backend
    await load();
    setSaving(null);
  }

  if (loading) return <LoadingPage />;

  const present = records.filter((r) => r.status === "present").length;
  const total = records.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle="Review and correct attendance by date."
        actions={
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Attendance date"
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)" }} />
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Present" value={present} Icon={UserCheck} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Total students" value={total} Icon={CalendarCheck} /></div>
        <div className="dash-rise" style={{ animationDelay: "140ms" }}><StatCard label="Attendance rate" value={rate} suffix="%" Icon={UserCheck} /></div>
      </div>

      <Card padded={false}>
        {records.length === 0 ? (
          <EmptyState Icon={CalendarCheck} title="No records for this date" description="Pick another date, or attendance has not been taken yet." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
              <thead>
                <tr>{["Student", "Status", ""].map((h, i) => <th key={i} style={{ ...thStyle, textAlign: i === 2 ? "right" : "left" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const isPresent = r.status === "present";
                  return (
                    <tr key={r.email}>
                      <td style={tdStyle}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                          <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(r.name)}</span>
                          <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{r.name}</span>
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <Badge tone={isPresent ? "success" : r.status === "late" ? "warning" : "danger"} dot>
                          {r.status[0].toUpperCase() + r.status.slice(1)}
                        </Badge>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <button onClick={() => toggleStatus(r.email, r.status, i)} disabled={saving === i}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 12px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: `1px solid ${isPresent ? "#FECDCA" : "var(--teal)"}`, background: isPresent ? "#FEF3F2" : "var(--teal-50)", color: isPresent ? "#B42318" : "var(--teal)", cursor: saving === i ? "default" : "pointer", fontFamily: "var(--font-sans)", opacity: saving === i ? 0.6 : 1 }}>
                          {saving === i ? <LoadingSpinner size={13} /> : isPresent ? <UserX size={14} strokeWidth={2} aria-hidden="true" /> : <UserCheck size={14} strokeWidth={2} aria-hidden="true" />}
                          Mark {isPresent ? "absent" : "present"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
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
