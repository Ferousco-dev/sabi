"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { getTeacherPerformanceReport, getTeacherAttendanceTrends, getCompletionRates } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type Tab = "performance" | "trends" | "completion";
const TABS: { key: Tab; label: string }[] = [
  { key: "performance", label: "Performance" },
  { key: "trends", label: "Attendance trends" },
  { key: "completion", label: "Completion" },
];

export default function TeacherReportsPage() {
  const [tab, setTab] = useState<Tab>("performance");
  const [report, setReport] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = tab === "performance" ? getTeacherPerformanceReport() : tab === "trends" ? getTeacherAttendanceTrends() : getCompletionRates();
    p.then((res: any) => { if (res.ok && res.data) setReport(res.data.report ?? res.data.trends ?? res.data.rates ?? []); }).finally(() => setLoading(false));
  }, [tab]);

  return (
    <>
      <PageHeader title="Reports" subtitle="Performance, attendance, and completion insights for your classes." />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingPage />
      ) : report.length === 0 ? (
        <Card><EmptyState Icon={BarChart3} title="No data available" description="Reports generate once students start participating in lessons and assessments." /></Card>
      ) : (
        <Card padded={false}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
              <thead>
                <tr>{Object.keys(report[0]).map((key) => <th key={key} style={thStyle}>{key.replace(/_/g, " ")}</th>)}</tr>
              </thead>
              <tbody>
                {report.map((r, i) => (
                  <tr key={i}>
                    {Object.values(r).map((v, j) => (
                      <td key={j} style={{ ...tdStyle, fontWeight: j === 0 ? 600 : 400, color: j === 0 ? "var(--gray-900)" : "var(--text-muted)" }}>{v == null ? "—" : String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textAlign: "left" as const,
  textTransform: "capitalize" as const,
  letterSpacing: "0.02em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
