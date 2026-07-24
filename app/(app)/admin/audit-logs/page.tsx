"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ScrollText, Search } from "lucide-react";
import { getAuditLogs, type AuditLog } from "@/app/lib/api/schools";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAuditLogs().then((res) => {
      if (res.ok && res.data) setLogs(res.data.logs);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((l) =>
    l.user_name.toLowerCase().includes(query.toLowerCase()) ||
    l.action.toLowerCase().includes(query.toLowerCase()) ||
    l.resource.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading audit logs…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Audit Logs</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>Track all administrative actions</p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }} />
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>User</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Action</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Resource</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>IP</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{l.user_name}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)", textTransform: "capitalize" }}>{l.action}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{l.resource}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "var(--gray-400)", fontFamily: "monospace" }}>{l.ip_address}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ padding: "32px", textAlign: "center", color: "var(--gray-400)" }}>No logs found.</p>}
      </div>
    </div>
  );
}

