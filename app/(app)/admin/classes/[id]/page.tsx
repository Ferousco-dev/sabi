"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Users, Columns3 } from "lucide-react";
import { getSections, getEnrollments, type Section, type Enrollment } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";

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
    <div style={{ maxWidth: 800 }}>
      <Link href="/admin/classes" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Classes
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GraduationCap size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Class {id}</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>{enrollments.length} students · {sections.length} sections</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
          <Users size={20} color="var(--teal)" />
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gray-900)", lineHeight: 1, marginTop: 12 }}>{enrollments.length}</div>
          <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>Enrolled Students</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
          <Columns3 size={20} color="var(--gold)" />
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gray-900)", lineHeight: 1, marginTop: 12 }}>{sections.length}</div>
          <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>Sections</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Sections</div>
        {sections.length === 0 && <p style={{ padding: "20px", fontSize: 14, color: "var(--gray-400)" }}>No sections.</p>}
        {sections.map((s) => (
          <div key={s.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>Section {s.name}</div>
            <span style={{ fontSize: 13, color: "var(--gray-500)" }}>{s.student_count} students</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Students</div>
        {enrollments.length === 0 && <p style={{ padding: "20px", fontSize: 14, color: "var(--gray-400)" }}>No students enrolled.</p>}
        {enrollments.map((e) => (
          <div key={e.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{e.student_name}</div>
            <span style={{ fontSize: 13, color: "var(--gray-500)" }}>{e.section_name ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
