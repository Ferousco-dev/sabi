"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { getAttendanceCorrections, approveAttendanceCorrection } from "@/app/lib/api/schools";

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

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading corrections…</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Attendance Corrections</h1>

      {corrections.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <ClipboardList size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>No pending corrections.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {corrections.map((c) => (
          <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{c.student_name}</div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: c.status === "pending" ? "rgba(170,133,46,0.1)" : c.status === "approved" ? "#ECFDF3" : "#FEF3F2", color: c.status === "pending" ? "var(--gold)" : c.status === "approved" ? "#0E8345" : "#B42318", textTransform: "capitalize" }}>{c.status}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 4 }}>
              {c.original_status} → <strong>{c.new_status}</strong>
            </div>
            <div style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 10 }}>{c.reason}</div>
            {c.status === "pending" && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleAction(c.id, true)} disabled={processing === c.id}
                  style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", background: "#ECFDF3", color: "#0E8345", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button onClick={() => handleAction(c.id, false)} disabled={processing === c.id}
                  style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", background: "#FEF3F2", color: "#B42318", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

