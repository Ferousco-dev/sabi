"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, GraduationCap } from "lucide-react";
import { getTeachers, type Teacher } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";
import { initials } from "@/app/lib/dashboard";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getTeachers().then((res) => {
      if (res.ok && res.data) setTeachers(res.data.teachers);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const q = query.trim().toLowerCase();
  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
  );
  const activeCount = teachers.filter((t) => t.status === "active").length;

  return (
    <>
      <PageHeader title="Teachers" subtitle="Faculty across your school, with subjects and classes taught." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Total teachers" value={teachers.length} Icon={Users} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Active" value={activeCount} Icon={GraduationCap} /></div>
      </div>

      <Card padded={false}>
        <TableToolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email…" />
          <ResultCount shown={filtered.length} total={teachers.length} />
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState Icon={Users} title="No teachers found" description={query ? "No teachers match your search." : "A list of your school's faculty will appear here."} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Department</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Subjects</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Classes</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td style={tdStyle}>
                      <Link href={`/admin/teachers/${t.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(t.name)}</span>
                        <span style={{ fontWeight: 600, color: "var(--teal)" }}>{t.name}</span>
                      </Link>
                    </td>
                    <td style={tdStyle}>{t.email}</td>
                    <td style={tdStyle}>{t.department_name ?? "—"}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{t.subject_count}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{t.class_count}</td>
                    <td style={tdStyle}>
                      <Badge tone={t.status === "active" ? "success" : "danger"} dot>
                        {t.status[0].toUpperCase() + t.status.slice(1)}
                      </Badge>
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
