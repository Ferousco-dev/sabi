"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarCheck, UserCheck, UserX, ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { getAttendance, recordAttendance, getAttendanceCorrections, approveAttendanceCorrection, type AttendanceRecord } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";
import { useConfirm } from "@/app/components/ui/confirm";

type Tab = "daily" | "corrections";

export default function AttendancePage() {
  const [tab, setTab] = useState<Tab>("daily");

  // Daily tab
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState<number | null>(null);

  // Corrections tab
  const [corrections, setCorrections] = useState<any[]>([]);
  const [correctionsLoaded, setCorrectionsLoaded] = useState(false);
  const [processing, setProcessing] = useState<number | null>(null);
  const confirm = useConfirm();

  const load = () => getAttendance(date).then((res) => {
    if (res.ok && res.data) setRecords(res.data.attendance);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCorrections = () => getAttendanceCorrections().then((res) => {
    if (res.ok && res.data) setCorrections(res.data.corrections);
  }).finally(() => setCorrectionsLoaded(true));

  useEffect(() => {
    if (tab === "corrections" && !correctionsLoaded) loadCorrections();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleStatus(studentEmail: string, currentStatus: string, i: number) {
    const newStatus = currentStatus === "present" ? "absent" : "present";
    setSaving(i);
    await recordAttendance(0, newStatus, date); // student_id looked up by email on backend
    await load();
    setSaving(null);
  }

  async function handleAction(id: number, approve: boolean) {
    if (!approve) {
      const ok = await confirm({
        title: "Reject this correction request?",
        message: "The student's attendance record will stay unchanged and their request will be marked rejected.",
        confirmLabel: "Reject",
        tone: "danger",
      });
      if (!ok) return;
    }
    setProcessing(id);
    await approveAttendanceCorrection(id, approve);
    loadCorrections();
    setProcessing(null);
  }

  if (loading) return <LoadingPage />;

  const present = records.filter((r) => r.status === "present").length;
  const total = records.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const tabs: { key: Tab; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "corrections", label: "Corrections" },
  ];

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle="Review and correct attendance by date."
        actions={tab === "daily" ? (
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Attendance date"
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)" }} />
        ) : undefined}
      />

      <div role="tablist" aria-label="Attendance view" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(({ key, label }) => {
          const active = tab === key;
          return (
            <button key={key} role="tab" aria-selected={active} onClick={() => setTab(key)}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {label}
            </button>
          );
        })}
      </div>

      {tab === "daily" ? (
        <>
          {/* no class field on record */}
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
      ) : (
        <div style={{ maxWidth: 760 }}>
          {!correctionsLoaded ? (
            <LoadingPage />
          ) : corrections.length === 0 ? (
            <Card>
              <EmptyState
                Icon={ClipboardList}
                title="No pending corrections"
                description="Requests for attendance corrections from students or teachers will appear here."
              />
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {corrections.map((c) => (
                <Card key={c.id}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(c.student_name)}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{c.student_name}</span>
                    </span>
                    <Badge tone={c.status === "pending" ? "warning" : c.status === "approved" ? "success" : "danger"} dot>
                      {c.status[0].toUpperCase() + c.status.slice(1)}
                    </Badge>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--text-muted)", marginBottom: 6 }}>
                    <Badge tone="neutral">{c.original_status}</Badge>
                    <span aria-hidden="true" style={{ color: "var(--text-subtle)" }}>→</span>
                    <Badge tone="teal">{c.new_status}</Badge>
                  </div>
                  {c.reason && <div style={{ fontSize: 13.5, color: "var(--text-subtle)", marginBottom: c.status === "pending" ? 14 : 0 }}>{c.reason}</div>}
                  {c.status === "pending" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleAction(c.id, true)} disabled={processing === c.id}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: "1px solid var(--teal)", background: "var(--teal-50)", color: "var(--teal)", cursor: processing === c.id ? "default" : "pointer", fontFamily: "var(--font-sans)", opacity: processing === c.id ? 0.6 : 1 }}>
                        <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" /> Approve
                      </button>
                      <button onClick={() => handleAction(c.id, false)} disabled={processing === c.id}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: "1px solid #FECDCA", background: "#FEF3F2", color: "#B42318", cursor: processing === c.id ? "default" : "pointer", fontFamily: "var(--font-sans)", opacity: processing === c.id ? 0.6 : 1 }}>
                        <XCircle size={14} strokeWidth={2} aria-hidden="true" /> Reject
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
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
