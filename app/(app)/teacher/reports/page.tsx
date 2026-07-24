"use client";
import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, CheckCircle2 } from "lucide-react";
import { getTeacherPerformanceReport, getTeacherAttendanceTrends, getCompletionRates } from "@/app/lib/api/teacher";

export default function TeacherReportsPage() {
  const [tab, setTab] = useState("performance");
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = tab === "performance" ? getTeacherPerformanceReport() : tab === "trends" ? getTeacherAttendanceTrends() : getCompletionRates();
    p.then((res: any) => { if (res.ok && res.data) setReport(res.data.report ?? res.data.trends ?? res.data.rates ?? []); }).finally(() => setLoading(false));
  }, [tab]);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading reports…</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["performance", "trends", "completion"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: `1.5px solid ${tab === t ? "var(--teal)" : "var(--border)"}`, background: tab === t ? "var(--teal-50)" : "#fff", color: tab === t ? "var(--teal)" : "var(--gray-600)", cursor: "pointer", textTransform: "capitalize" }}>
            {t} Report
          </button>
        ))}
      </div>

      {report.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No data available.</p>}

      {report.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "var(--gray-50)" }}>
              {Object.keys(report[0]).map((key) => (
                <th key={key} style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>{key.replace("_", " ")}</th>
              ))}
            </tr></thead>
            <tbody>
              {report.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  {Object.values(r).map((v: any, j) => (
                    <td key={j} style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)" }}>{v ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
