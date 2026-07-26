"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { FileText, CheckCircle2, XCircle, Send, ClipboardList, Clock } from "lucide-react";
import { getResults, reviewResult, publishResults, type Result } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState<string | null>(null);

  const load = (status?: string) => getResults(status || undefined).then((res) => {
    if (res.ok && res.data) setResults(res.data.results);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleReview(id: number, action: "approve" | "reject") {
    await reviewResult(id, action);
    load(filter || undefined);
  }

  async function handlePublish() {
    setPublishing(true);
    const res = await publishResults();
    if (res.ok && res.data) setPublishMsg(`Published ${res.data.published_count} results`);
    else setPublishMsg("Publish failed");
    setPublishing(false);
    setTimeout(() => setPublishMsg(null), 3000);
    load();
  }

  if (loading) return <LoadingPage />;

  const pending = results.filter((r) => r.status === "pending").length;
  const approved = results.filter((r) => r.status === "approved").length;
  const rejected = results.filter((r) => r.status === "rejected").length;

  const FILTERS = [
    { key: "", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <>
      <PageHeader
        title="Results"
        subtitle="Review submitted results and publish approved scores."
        actions={
          <button onClick={handlePublish} disabled={publishing}
            style={{ height: 40, padding: "0 16px", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 600, border: "none", background: publishMsg ? (publishMsg.includes("failed") ? "#B42318" : "#0E8345") : "var(--teal)", color: "#fff", cursor: publishing ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", opacity: publishing ? 0.7 : 1 }}>
            {publishing ? <LoadingSpinner size={15} color="#fff" /> : <Send size={15} strokeWidth={2.2} aria-hidden="true" />}
            {publishMsg || (publishing ? "Publishing…" : "Publish All")}
          </button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Total entries" value={results.length} Icon={ClipboardList} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Pending" value={pending} Icon={Clock} /></div>
        <div className="dash-rise" style={{ animationDelay: "140ms" }}><StatCard label="Approved" value={approved} Icon={CheckCircle2} /></div>
        <div className="dash-rise" style={{ animationDelay: "210ms" }}><StatCard label="Rejected" value={rejected} Icon={XCircle} /></div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => { setFilter(f.key); load(f.key || undefined); }}
            style={{ height: 34, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: `1px solid ${filter === f.key ? "var(--teal)" : "var(--border-strong)"}`, background: filter === f.key ? "var(--teal-50)" : "var(--bg)", color: filter === f.key ? "var(--teal)" : "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {f.label}
          </button>
        ))}
      </div>

      <Card padded={false}>
        {results.length === 0 ? (
          <EmptyState Icon={FileText} title="No results found" description="Student results will appear here once submitted by teachers." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>{["Student", "Subject", "Score", "Grade", "Status", ""].map((h, i) => (
                  <th key={i} style={{ ...thStyle, textAlign: i === 2 || i === 3 ? "center" : i === 5 ? "right" : "left" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(r.student_name)}</span>
                        <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{r.student_name}</span>
                      </span>
                    </td>
                    <td style={tdStyle}>{r.subject}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: "var(--gray-900)" }}>{r.score}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: "var(--gray-900)" }}>{r.grade}</td>
                    <td style={tdStyle}>
                      <Badge tone={r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning"} dot>
                        {r.status[0].toUpperCase() + r.status.slice(1)}
                      </Badge>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {r.status === "pending" && (
                        <div style={{ display: "inline-flex", gap: 6, justifyContent: "flex-end" }}>
                          <button onClick={() => handleReview(r.id, "approve")} aria-label="Approve"
                            style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid #ABEFC6", background: "#ECFDF3", color: "#0E8345", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircle2 size={15} aria-hidden="true" />
                          </button>
                          <button onClick={() => handleReview(r.id, "reject")} aria-label="Reject"
                            style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid #FECDCA", background: "#FEF3F2", color: "#B42318", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            <XCircle size={15} aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
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
