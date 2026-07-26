"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { getAttendanceCorrections, approveAttendanceCorrection } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";

export default function AttendanceCorrectionsPage() {
  const [corrections, setCorrections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const load = () => getAttendanceCorrections().then((res) => {
    if (res.ok && res.data) setCorrections(res.data.corrections);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAction(id: number, approve: boolean) {
    setProcessing(id);
    await approveAttendanceCorrection(id, approve);
    load();
    setProcessing(null);
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader title="Attendance Corrections" subtitle="Review and resolve attendance change requests from students and teachers." />

      {corrections.length === 0 ? (
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
  );
}
