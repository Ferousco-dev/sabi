"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { getLoginHistory } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";

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

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Login History" subtitle="Recent login activity across the school." />

      <Card padded={false}>
        <TableToolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search users…" />
          <ResultCount shown={filtered.length} total={history.length} />
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState
            Icon={History}
            title="No login history"
            description={query ? "No logins match your search." : "Login activity will be shown here."}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>IP Address</th>
                  <th style={thStyle}>User Agent</th>
                  <th style={thStyle}>Login Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)" }}>{h.user_name}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "var(--text-subtle)" }}>{h.ip_address}</td>
                    <td style={{ ...tdStyle, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", fontSize: 13, color: "var(--text-subtle)" }}>{h.user_agent}</td>
                    <td style={tdStyle}>{new Date(h.login_at).toLocaleString()}</td>
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
  textAlign: "left" as const,
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
