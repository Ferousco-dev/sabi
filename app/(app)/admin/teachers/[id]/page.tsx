"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, BookOpen, GraduationCap } from "lucide-react";
import { getTeacherDetail, assignTeacherSubject, assignTeacherClass, type Teacher } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";

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

  return (
    <div style={{ maxWidth: 800 }}>
      <Link href="/admin/teachers" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Teachers
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <span style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>
          {teacher.name.charAt(0)}
        </span>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>{teacher.name}</h1>
          <div style={{ fontSize: 14, color: "var(--gray-500)", display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <Mail size={14} /> {teacher.email}
            {teacher.department_name && <><span>·</span> {teacher.department_name}</>}
            <span>·</span>
            <span style={{ textTransform: "capitalize" }}>{teacher.status}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
          <BookOpen size={20} color="var(--teal)" />
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gray-900)", lineHeight: 1, marginTop: 12 }}>{teacher.subject_count}</div>
          <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>Subjects</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
          <GraduationCap size={20} color="var(--gold)" />
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gray-900)", lineHeight: 1, marginTop: 12 }}>{teacher.class_count}</div>
          <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>Classes</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Profile Details</div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 14 }}>
          <div><span style={{ color: "var(--gray-500)" }}>Phone:</span> <span style={{ color: "var(--gray-900)", fontWeight: 500 }}>{teacher.phone ?? "—"}</span></div>
          <div><span style={{ color: "var(--gray-500)" }}>Department:</span> <span style={{ color: "var(--gray-900)", fontWeight: 500 }}>{teacher.department_name ?? "—"}</span></div>
        </div>
      </div>
    </div>
  );
}
