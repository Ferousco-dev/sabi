"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Trophy, Zap, BookOpen, Badge } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getProgress, type ProgressData } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function ProgressPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("student_id") ? Number(searchParams.get("student_id")) : undefined;
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgress(studentId).then((res) => {
      if (res.ok && res.data) setProgress(res.data.progress);
    }).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <LoadingPage />;

  if (!progress) return (
    <EmptyState
      icon={Trophy}
      title="No progress data"
      description="Start completing lessons to track your learning journey."
    />
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Learning Progress</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { icon: Trophy, label: "Total XP", value: progress.xp, color: "var(--gold)" },
          { icon: BookOpen, label: "Completed Lessons", value: progress.completed_lessons, color: "var(--teal)" },
          { icon: Zap, label: "Streak", value: "—", color: "var(--teal-700)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 16 }}>Badges</h2>
        {progress.badges.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--gray-400)" }}>No badges earned yet. Complete lessons to earn badges!</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {progress.badges.map((b, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: "var(--gold)", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                <Badge size={14} /> {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
