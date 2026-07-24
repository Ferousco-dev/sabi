"use client";
import { useEffect, useState } from "react";
import { History, Search } from "lucide-react";
import { getLoginHistory } from "@/app/lib/api/schools";

export default function LoginHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getLoginHistory().then((res) => {
      if (res.ok && res.data) setHistory(res.data.history);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = history.filter((h) => h.user_name.toLowerCase().includes(query.toLowerCase()));

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading login history…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Login History</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>Recent login activity across the school</p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }} />
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>User</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>IP Address</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>User Agent</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Login Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => (
              <tr key={h.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{h.user_name}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, fontFamily: "monospace", color: "var(--gray-500)" }}>{h.ip_address}</td>
                <td style={{ padding: "12px 20px", fontSize: 12, color: "var(--gray-400)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.user_agent}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(h.login_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ padding: "32px", textAlign: "center", color: "var(--gray-400)" }}>No login history.</p>}
      </div>
    </div>
  );
}
