"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Users, Columns3 } from "lucide-react";
import { getSections, getEnrollments, type Section, type Enrollment } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const classId = Number(id);

  useEffect(() => {
    Promise.all([getSections(classId), getEnrollments(classId)]).then(([s, e]) => {
      if (s.ok && s.data) setSections(s.data.sections);
      if (e.ok && e.data) setEnrollments(e.data.enrollments);
    }).finally(() => setLoading(false));
  }, [classId]);

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 820 }}>
      <Link href="/admin/classes" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to classes
      </Link>

      <PageHeader
        title={`Class ${id}`}
        subtitle={`${enrollments.length} students · ${sections.length} sections`}
        actions={<Badge tone="teal">Class</Badge>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Enrolled students" value={enrollments.length} Icon={Users} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Sections" value={sections.length} Icon={Columns3} /></div>
      </div>

      <Card title="Sections" padded={false} style={{ marginBottom: 20 }}>
        {sections.length === 0 ? (
          <EmptyState Icon={Columns3} title="No sections" description="This class has no sections yet." />
        ) : (
          sections.map((s) => (
            <div key={s.id} style={{ padding: "13px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Columns3 size={16} style={{ color: "var(--teal)" }} />
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>Section {s.name}</span>
              </span>
              <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>{s.student_count} students</span>
            </div>
          ))
        )}
      </Card>

      <Card title="Students" padded={false}>
        {enrollments.length === 0 ? (
          <EmptyState Icon={GraduationCap} title="No students enrolled" description="No students are enrolled in this class yet." />
        ) : (
          enrollments.map((e) => (
            <div key={e.id} style={{ padding: "13px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{initials(e.student_name)}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{e.student_name}</span>
              </span>
              <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>{e.section_name ?? "—"}</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
