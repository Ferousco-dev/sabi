"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Award } from "lucide-react";
import { getChildGrades } from "@/app/lib/api/parent";

export default function ChildGradesPage() {
  const { id } = useParams<{ id: string }>();
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChildGrades(Number(id)).then((res) => {
      if (res.ok && res.data) setGrades(res.data.grades);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading grades…</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href={`/parent/children/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Profile
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Published Results</h1>

      {grades.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <Award size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>No published results yet.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {grades.map((g, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{g.subject}</div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>{g.score}%</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--gray-500)" }}>
              <span>Grade: <strong style={{ color: "var(--gray-900)" }}>{g.grade}</strong></span>
              <span>Term: <strong style={{ color: "var(--gray-900)" }}>{g.term}</strong></span>
              <span>Session: <strong style={{ color: "var(--gray-900)" }}>{g.session}</strong></span>
            </div>
            {g.teacher_comment && <div style={{ marginTop: 8, fontSize: 13, color: "var(--gray-600)" }}>Teacher: {g.teacher_comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}