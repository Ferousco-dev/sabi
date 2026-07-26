"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getEnrollments, getClasses, type Enrollment, type ClassItem } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount, FilterSelect } from "@/app/components/dashboard/table-controls";
import { initials } from "@/app/lib/dashboard";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState<number | undefined>(undefined);
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([getClasses(), getEnrollments()]).then(([c, e]) => {
      if (c.ok && c.data) setClasses(c.data.classes);
      if (e.ok && e.data) setEnrollments(e.data.enrollments);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getEnrollments(classId).then((res) => {
      if (res.ok && res.data) setEnrollments(res.data.enrollments);
    });
  }, [classId]);

  const filtered = enrollments.filter((e) =>
    e.student_name.toLowerCase().includes(query.toLowerCase()) ||
    e.class_name.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader
        title="Enrollments"
        subtitle="Students enrolled across your classes and sessions."
        actions={<Badge tone="teal">{enrollments.length} total</Badge>}
      />

      <Card padded={false}>
        <TableToolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search enrollments…" />
          <FilterSelect
            value={classId != null ? String(classId) : ""}
            onChange={(v) => setClassId(v ? Number(v) : undefined)}
            label="Filter by class"
            options={[{ value: "", label: "All classes" }, ...classes.map((c) => ({ value: String(c.id), label: c.name }))]}
          />
          <ResultCount shown={filtered.length} total={enrollments.length} />
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState
            Icon={Users}
            title="No enrollments found"
            description={query ? "No students match your search criteria." : "Students enrolled in classes will appear here."}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>{["Student", "Class", "Section", "Session", "Enrolled"].map((h, i) => (
                  <th key={i} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(e.student_name)}</span>
                        <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{e.student_name}</span>
                      </span>
                    </td>
                    <td style={tdStyle}>{e.class_name}</td>
                    <td style={tdStyle}>{e.section_name ?? "—"}</td>
                    <td style={tdStyle}>{e.session_name}</td>
                    <td style={tdStyle}>{new Date(e.enrolled_at).toLocaleDateString()}</td>
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
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
