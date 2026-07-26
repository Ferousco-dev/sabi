"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Award } from "lucide-react";
import { getChildGrades } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { AreaChart, type AreaPoint } from "@/app/components/dashboard/AreaChart";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const backLink = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 } as const;

export default function ChildGradesPage() {
  const { id } = useParams<{ id: string }>();
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChildGrades(Number(id)).then((res) => {
      if (res.ok && res.data) setGrades(res.data.grades);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingPage />;

  const points: AreaPoint[] = grades
    .filter((g) => typeof g.score === "number")
    .map((g) => ({ label: g.subject, value: g.score }));

  return (
    <div style={{ maxWidth: 720 }}>
      <Link href={`/parent/children/${id}`} style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.1} /> Back to profile
      </Link>
      <PageHeader title="Grades & report cards" subtitle={`${grades.length} published ${grades.length === 1 ? "result" : "results"}.`} />

      {grades.length === 0 ? (
        <Card>
          <EmptyState Icon={Award} title="No published grades" description="Grades and report cards will be visible here once released by the school." />
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {points.length >= 2 && (
            <Card title="Scores by subject">
              <AreaChart data={points} height={170} caption="Score for each subject." />
            </Card>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {grades.map((g) => (
              <Card key={g.id}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{g.subject}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {g.term && <Badge tone="neutral">Term: {g.term}</Badge>}
                      {g.session && <Badge tone="neutral">Session: {g.session}</Badge>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{g.score}</div>
                      {g.grade && <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", marginTop: 2 }}>{g.grade}</div>}
                    </div>
                    <a href={g.report_card_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", background: "var(--bg)", fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none", whiteSpace: "nowrap" }}>
                      <FileText size={15} strokeWidth={2} /> View card
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
