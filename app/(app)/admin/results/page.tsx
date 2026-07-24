"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { FileText, CheckCircle2, XCircle, Send } from "lucide-react";
import { getResults, reviewResult, publishResults, type Result } from "@/app/lib/api/schools";

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

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading results…</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Results</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{results.length} entries</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["", "pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => { setFilter(s); load(s || undefined); }}
              style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: `1.5px solid ${filter === s ? "var(--teal)" : "var(--border)"}`, background: filter === s ? "var(--teal-50)" : "#fff", color: filter === s ? "var(--teal)" : "var(--gray-600)", cursor: "pointer", textTransform: "capitalize" }}>
              {s || "All"}
            </button>
          ))}
          <button onClick={handlePublish} disabled={publishing}
            style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", background: publishMsg ? (publishMsg.includes("failed") ? "#B42318" : "#0E8345") : "var(--teal)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Send size={14} /> {publishMsg || (publishing ? "Publishing…" : "Publish All")}
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Student</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Subject</th>
              <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Score</th>
              <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Grade</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Status</th>
              <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{r.student_name}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{r.subject}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "center", fontWeight: 600 }}>{r.score}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "center", fontWeight: 600 }}>{r.grade}</td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: r.status === "approved" ? "#ECFDF3" : r.status === "rejected" ? "#FEF3F2" : "rgba(170,133,46,0.1)", color: r.status === "approved" ? "#0E8345" : r.status === "rejected" ? "#B42318" : "var(--gold)", textTransform: "capitalize" }}>{r.status}</span>
                </td>
                <td style={{ padding: "12px 20px", textAlign: "center" }}>
                  {r.status === "pending" && (
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button onClick={() => handleReview(r.id, "approve")} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: "#ECFDF3", color: "#0E8345", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle2 size={15} />
                      </button>
                      <button onClick={() => handleReview(r.id, "reject")} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: "#FEF3F2", color: "#B42318", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <XCircle size={15} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && <p style={{ padding: "32px", textAlign: "center", color: "var(--gray-400)" }}>No results found.</p>}
      </div>
    </div>
  );
}

