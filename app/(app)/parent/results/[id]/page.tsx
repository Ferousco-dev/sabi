"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { getChildGrades } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { AreaChart, type AreaPoint } from "@/app/components/dashboard/AreaChart";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const backLink = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 } as const;

export default function ChildResultsPage() {
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
      <PageHeader title="Published results" subtitle="Grades released by the school for this child." />

      {grades.length === 0 ? (
        <Card>
          <EmptyState Icon={Award} title="No results published" description="Results will be available once they are processed and published by the school." />
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {points.length >= 2 && (
            <Card title="Scores by subject">
              <AreaChart data={points} height={170} caption="Published score for each subject, as a percentage." />
            </Card>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {grades.map((g, i) => (
              <Card key={i}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{g.subject}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)" }}>{g.score}%</span>
                    {g.grade && <Badge tone="teal">{g.grade}</Badge>}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {g.term && <Badge tone="neutral">Term: {g.term}</Badge>}
                  {g.session && <Badge tone="neutral">Session: {g.session}</Badge>}
                </div>
                {g.teacher_comment && (
                  <div style={{ marginTop: 12, padding: "11px 14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>Teacher: </span>{g.teacher_comment}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
