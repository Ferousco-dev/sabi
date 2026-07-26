"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { getAuditLogs, type AuditLog } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";

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

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Audit Logs" subtitle="Track all administrative actions across the school." />

      <Card padded={false}>
        <TableToolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search by user, action, or resource…" />
          <ResultCount shown={filtered.length} total={logs.length} />
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState
            Icon={ScrollText}
            title="No logs found"
            description={query ? "No administrative actions match your search." : "Administrative actions will be tracked here."}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Action</th>
                  <th style={thStyle}>Resource</th>
                  <th style={thStyle}>IP</th>
                  <th style={thStyle}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)" }}>{l.user_name}</td>
                    <td style={{ ...tdStyle, textTransform: "capitalize" }}>{l.action}</td>
                    <td style={tdStyle}>{l.resource}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "var(--text-subtle)" }}>{l.ip_address}</td>
                    <td style={tdStyle}>{new Date(l.created_at).toLocaleString()}</td>
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
