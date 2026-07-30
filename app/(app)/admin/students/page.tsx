"use client";

export const dynamic = "force-dynamic";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, UserPlus } from "lucide-react";
import { getStudents } from "@/app/lib/api/schools";
import { useResource } from "@/app/lib/useResource";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";
import { initials } from "@/app/lib/dashboard";

export default function AdminStudentsPage() {
  const { data, loading } = useResource("admin:students", async () => {
    const res = await getStudents();
    return { students: res.ok && res.data ? res.data.students : [] };
  });
  const students = data?.students ?? [];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }, [students, query]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Everyone enrolled at your school."
        actions={
          <>
            <Badge tone="teal">{students.length} enrolled</Badge>
            <Link href="/admin/student-registration"
              style={{ height: 40, padding: "0 16px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-sans)", textDecoration: "none" }}>
              <UserPlus size={16} strokeWidth={2} aria-hidden="true" /> Add students
            </Link>
          </>
        }
      />

      <Card padded={false}>
        <TableToolbar>
          <SearchInput value={query} onChange={setQuery} label="Search students" placeholder="Search by name or email" />
          <ResultCount shown={filtered.length} total={students.length} />
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState Icon={Users} title={query ? "No students match" : "No students yet"} description={query ? "Try a different search term." : "Enrolled students will appear here once registered."} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr>{["Student", "Email", "Enrolled"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {initials(s.name)}
                        </span>
                        <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{s.name}</span>
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: "var(--text-subtle)" }}>{s.email}</td>
                    <td style={{ ...tdStyle, color: "var(--text-subtle)" }}>{new Date(s.enrolled_at).toLocaleDateString()}</td>
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
  textAlign: "left" as const,
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
