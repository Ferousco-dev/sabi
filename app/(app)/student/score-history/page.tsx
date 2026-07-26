import { Suspense } from "react";
import { Award } from "lucide-react";
import { getScoreHistory } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { AreaChart, type AreaPoint } from "@/app/components/dashboard/AreaChart";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export const dynamic = "force-dynamic";

type Score = { date: string; score: number; max: number; grade: string; term: string };

async function ScoreHistoryContent() {
  const res = await getScoreHistory();
  const history = res.ok && res.data ? res.data.history : [];

  if (history.length === 0) {
    return (
      <>
        <PageHeader title="Score history" subtitle="Your assessment scores and grades over time." />
        <Card><EmptyState Icon={Award} title="No score history yet" description="Your assessment scores and grades appear here once published." /></Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Score history" subtitle="Your assessment scores and grades over time." />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {history.map((subject) => {
          const scores = subject.scores as Score[];
          const chronological = [...scores].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const points: AreaPoint[] = chronological.map((s) => ({
            label: new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            value: s.max > 0 ? Math.round((s.score / s.max) * 100) : 0,
          }));
          const avg = points.length ? Math.round(points.reduce((sum, p) => sum + p.value, 0) / points.length) : 0;
          return (
            <Card key={subject.subject} title={subject.subject} action={<Badge tone="teal">Avg {avg}%</Badge>}>
              {points.length >= 2 && (
                <div style={{ marginBottom: 12 }}>
                  <AreaChart data={points} height={160} caption={`${subject.subject} scores over time, as a percentage.`} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {scores.map((s, i) => (
                  <div key={i} style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--text-muted)", flexWrap: "wrap" }}>
                      <span>{new Date(s.date).toLocaleDateString()}</span>
                      <span style={{ color: "var(--text-subtle)" }}>{s.term}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)" }}>{s.score}<span style={{ fontSize: 13, color: "var(--text-subtle)", fontWeight: 500 }}> / {s.max}</span></span>
                      {s.grade && <Badge tone="neutral">{s.grade}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default function ScoreHistoryPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ScoreHistoryContent />
    </Suspense>
  );
}
