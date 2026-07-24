"use client";
import { useEffect, useState } from "react";
import { Award, TrendingUp, BarChart3 } from "lucide-react";
import { getScoreHistory } from "@/app/lib/api/student";

export default function ScoreHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScoreHistory().then((res) => {
      if (res.ok && res.data) setHistory(res.data.history);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading score history…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Score History</h1>

      {history.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <Award size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>No score history yet.</p>
        </div>
      )}

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