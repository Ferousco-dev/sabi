"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, BookOpen, GraduationCap, Phone, Building2 } from "lucide-react";
import { getTeacherDetail, assignTeacherSubject, assignTeacherClass, type Teacher } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { initials } from "@/app/lib/dashboard";

export default function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherDetail(Number(id)).then((res) => {
      if (res.ok && res.data) setTeacher(res.data.teacher);
      else router.push("/admin/teachers");
    }).finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <LoadingPage />;
  if (!teacher) return null;

  const statusTone = teacher.status === "active" ? "success" : teacher.status === "pending" ? "warning" : "neutral";

  return (
    <div style={{ maxWidth: 820 }}>
      <Link href="/admin/teachers" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to teachers
      </Link>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span aria-hidden="true" style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
            {initials(teacher.name)}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "clamp(20px, 2.2vw, 24px)", fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>{teacher.name}</h1>
              <Badge tone={statusTone} dot>{teacher.status[0].toUpperCase() + teacher.status.slice(1)}</Badge>
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Mail size={14} aria-hidden="true" /> {teacher.email}</span>
              {teacher.department_name && <><span aria-hidden="true">·</span><span>{teacher.department_name}</span></>}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Subjects" value={teacher.subject_count} Icon={BookOpen} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Classes" value={teacher.class_count} Icon={GraduationCap} /></div>
      </div>

      <Card title="Profile details">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Phone size={16} style={{ color: "var(--teal)" }} />
            </span>
            <div>
              <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>Phone</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{teacher.phone ?? "—"}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Building2 size={16} style={{ color: "var(--teal)" }} />
            </span>
            <div>
              <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>Department</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{teacher.department_name ?? "—"}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
