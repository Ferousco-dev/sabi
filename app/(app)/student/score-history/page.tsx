import { Suspense } from "react";
import { Award, TrendingUp, BarChart3 } from "lucide-react";
import { getScoreHistory } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export const dynamic = "force-dynamic";

async function ScoreHistoryContent() {
  const res = await getScoreHistory();
  const history = res.ok && res.data ? res.data.history : [];

  if (history.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No score history yet"
        description="Your assessment scores and grades will appear here once published."
      />
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Score History</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {history.map((subject) => (
          <div key={subject.subject} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--gray-900)" }}>{subject.subject}</h2>
              <span style={{ fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>{subject.scores.length} entries</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {subject.scores.map((s: any, i: number) => (
                <div key={i} style={{ background: "var(--gray-50)", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--gray-600)" }}>
                    <span>{new Date(s.date).toLocaleDateString()}</span>
                    <span>Term: {s.term}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)" }}>{s.score} / {s.max}</div>
                    <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{s.grade}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScoreHistoryPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ScoreHistoryContent />
    </Suspense>
  );
}