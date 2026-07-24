"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { getChildGrades, getReportCard } from "@/app/lib/api/parent";

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
    <div style={{ maxWidth: 720 }}>
      <Link href={`/parent/children/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Profile
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Grades & Report Cards</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>{grades.length} published results</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {grades.map((g) => (
          <div key={g.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{g.subject}</div>
              <div style={{ fontSize: 13, color: "var(--gray-400)", marginTop: 2 }}>Term: {g.term} · Session: {g.session}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)" }}>{g.score}</div>
                <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{g.grade}</div>
              </div>
              <a href={g.report_card_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "#fff", fontSize: 12, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>
                <FileText size={14} /> View Card
              </a>
            </div>
          </div>
        ))}
        {grades.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No published grades yet.</p>}
      </div>
    </div>
  );
}