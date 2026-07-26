"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getClassRoster, type ClassRosterStudent } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";
import { initials } from "@/app/lib/dashboard";

export default function RosterPage() {
  const [students, setStudents] = useState<ClassRosterStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getClassRoster().then((res) => {
      if (res.ok && res.data) setStudents(res.data.students);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const q = query.trim().toLowerCase();
  const filtered = students.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));

  return (
    <>
      <PageHeader title="Class roster" subtitle="Students enrolled in your classes." actions={<Badge tone="teal">{students.length} students</Badge>} />

      <Card padded={false}>
        <TableToolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email…" />
          <ResultCount shown={filtered.length} total={students.length} />
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState Icon={Users} title="No students found" description={query ? "No students match your search." : "Your roster appears here once students are enrolled."} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
              <thead>
                <tr>{["Student", "Email", "Section"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(s.name)}</span>
                        <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{s.name}</span>
                      </span>
                    </td>
                    <td style={tdStyle}>{s.email}</td>
                    <td style={tdStyle}>{s.section_name ?? "—"}</td>
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
