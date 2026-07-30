"use client";

export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, UserCheck, ClipboardList, CheckCircle2, XCircle, Save } from "lucide-react";
import {
  getClasses, getEnrollments, getAttendance, bulkRecordAttendance,
  getAttendanceCorrections, approveAttendanceCorrection,
  type ClassItem, type AttendanceCorrection,
} from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";
import { useConfirm } from "@/app/components/ui/confirm";

type Tab = "daily" | "corrections";
type Status = "present" | "absent" | "late" | "excused";
type RosterEntry = { student_id: number; name: string };

const STATUSES: { key: Status; label: string; on: string; onBg: string }[] = [
  { key: "present", label: "Present", on: "#067647", onBg: "#ECFDF3" },
  { key: "late", label: "Late", on: "#B54708", onBg: "#FFFAEB" },
  { key: "absent", label: "Absent", on: "#B42318", onBg: "#FEF3F2" },
  { key: "excused", label: "Excused", on: "var(--teal)", onBg: "var(--teal-50)" },
];

export default function AttendancePage() {
  const [tab, setTab] = useState<Tab>("daily");
  const confirm = useConfirm();

  // ── Daily mark sheet ──────────────────────────────────────────────────────
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classId, setClassId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [draft, setDraft] = useState<Record<number, Status>>({});
  const [loading, setLoading] = useState(true);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Corrections ───────────────────────────────────────────────────────────
  const [corrections, setCorrections] = useState<AttendanceCorrection[]>([]);
  const [correctionsLoaded, setCorrectionsLoaded] = useState(false);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    getClasses().then((res) => {
      if (res.ok && res.data) {
        setClasses(res.data.classes);
        if (res.data.classes.length) setClassId(res.data.classes[0].id);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Load the roster + any already-recorded statuses whenever class or date changes.
  useEffect(() => {
    if (!classId) { setRoster([]); setDraft({}); return; }
    setLoadingSheet(true);
    setSaved(false);
    Promise.all([getEnrollments(classId), getAttendance(date, classId)]).then(([enr, att]) => {
      const students: RosterEntry[] = enr.ok && enr.data
        ? enr.data.enrollments.map((e) => ({ student_id: e.student_id, name: e.student_name }))
        : [];
      const existing: Record<number, Status> = {};
      if (att.ok && att.data) {
        for (const r of att.data.attendance) if (r.student_id) existing[r.student_id] = r.status as Status;
      }
      setRoster(students);
      setDraft(Object.fromEntries(students.map((s) => [s.student_id, existing[s.student_id] ?? "present"])));
    }).finally(() => setLoadingSheet(false));
  }, [classId, date]);

  const loadCorrections = () => getAttendanceCorrections().then((res) => {
    if (res.ok && res.data) setCorrections(res.data.corrections);
  }).finally(() => setCorrectionsLoaded(true));

  useEffect(() => {
    if (tab === "corrections" && !correctionsLoaded) loadCorrections();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = (studentId: number, status: Status) => {
    setDraft((d) => ({ ...d, [studentId]: status }));
    setSaved(false);
  };

  async function handleSave() {
    if (!classId || roster.length === 0) return;
    setSaving(true);
    const records = roster.map((s) => ({ student_id: s.student_id, status: draft[s.student_id] ?? "present" }));
    const res = await bulkRecordAttendance({ class_id: classId, date, records });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
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
    await loadCorrections();
    setProcessing(null);
  }

  const counts = useMemo(() => {
    const c = { present: 0, late: 0, absent: 0, excused: 0 };
    for (const s of roster) c[draft[s.student_id] ?? "present"]++;
    return c;
  }, [roster, draft]);
  const total = roster.length;
  const rate = total > 0 ? Math.round(((counts.present + counts.late) / total) * 100) : 0;
  const pendingCount = corrections.filter((c) => c.status === "pending").length;

  if (loading) return <LoadingPage />;

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "daily", label: "Daily register" },
    { key: "corrections", label: "Corrections", badge: pendingCount || undefined },
  ];

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle="Take the daily register per class, and review correction requests."
        actions={tab === "daily" ? (
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Attendance date"
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)" }} />
        ) : undefined}
      />

      <div role="tablist" aria-label="Attendance view" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(({ key, label, badge }) => {
          const active = tab === key;
          return (
            <button key={key} role="tab" aria-selected={active} onClick={() => setTab(key)}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {label}
              {badge ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 5px", borderRadius: "var(--radius-full)", background: active ? "rgba(255,255,255,0.25)" : "var(--gold)", color: active ? "#fff" : "#3d2c00", fontSize: 11, fontWeight: 700 }}>{badge}</span> : null}
            </button>
          );
        })}
      </div>

      {tab === "daily" ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 20 }}>
            <label htmlFor="att-class" style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-900)" }}>Class</label>
            <select id="att-class" value={classId ?? ""} onChange={(e) => setClassId(Number(e.target.value) || null)}
              style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", fontFamily: "var(--font-sans)", color: "var(--text)", minWidth: 200 }}>
              {classes.length === 0 && <option value="">No classes yet</option>}
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {classes.length === 0 ? (
            <Card><EmptyState Icon={CalendarCheck} title="No classes yet" description="Create a class first, then you can take attendance for it." /></Card>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div className="dash-rise"><StatCard label="On roll" value={total} Icon={CalendarCheck} /></div>
                <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Present + late" value={counts.present + counts.late} Icon={UserCheck} /></div>
                <div className="dash-rise" style={{ animationDelay: "140ms" }}><StatCard label="Attendance rate" value={rate} suffix="%" Icon={UserCheck} /></div>
              </div>

              <Card padded={false}>
                {loadingSheet ? (
                  <div style={{ padding: 48, display: "flex", justifyContent: "center" }}><LoadingSpinner size={22} /></div>
                ) : roster.length === 0 ? (
                  <EmptyState Icon={CalendarCheck} title="No students enrolled" description="Enroll students into this class to take its attendance." />
                ) : (
                  <>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                        <thead>
                          <tr><th style={thStyle}>Student</th><th style={{ ...thStyle, textAlign: "right" }}>Status</th></tr>
                        </thead>
                        <tbody>
                          {roster.map((s) => {
                            const cur = draft[s.student_id] ?? "present";
                            return (
                              <tr key={s.student_id}>
                                <td style={tdStyle}>
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                                    <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(s.name)}</span>
                                    <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{s.name}</span>
                                  </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: "right" }}>
                                  <div role="group" aria-label={`Status for ${s.name}`} style={{ display: "inline-flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    {STATUSES.map((st) => {
                                      const active = cur === st.key;
                                      return (
                                        <button key={st.key} type="button" aria-pressed={active} onClick={() => setStatus(s.student_id, st.key)}
                                          style={{ height: 30, padding: "0 10px", borderRadius: "var(--radius-sm)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "transparent" : "var(--border-strong)"}`, background: active ? st.onBg : "var(--bg)", color: active ? st.on : "var(--text-subtle)" }}>
                                          {st.label}
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, padding: "14px 16px", borderTop: "1px solid var(--border)" }}>
                      {saved && <span style={{ fontSize: 13, color: "#067647", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={15} aria-hidden="true" /> Register saved</span>}
                      <button onClick={handleSave} disabled={saving}
                        style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
                        {saving ? <LoadingSpinner size={16} color="#fff" /> : <Save size={16} strokeWidth={2} aria-hidden="true" />}
                        {saving ? "Saving…" : "Save register"}
                      </button>
                    </div>
                  </>
                )}
              </Card>
            </>
          )}
        </>
      ) : (
        <div style={{ maxWidth: 760 }}>
          {!correctionsLoaded ? (
            <div style={{ padding: 48, display: "flex", justifyContent: "center" }}><LoadingSpinner size={22} /></div>
          ) : corrections.length === 0 ? (
            <Card>
              <EmptyState Icon={ClipboardList} title="No correction requests" description="When students flag an attendance day as wrong, their requests appear here for review." />
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {corrections.map((c) => (
                <Card key={c.id}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(c.student_name)}</span>
                      <span>
                        <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{c.student_name}</span>
                        <span style={{ display: "block", fontSize: 12.5, color: "var(--text-subtle)" }}>{new Date(c.date).toLocaleDateString()}</span>
                      </span>
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
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
