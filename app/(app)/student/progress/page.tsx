"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Trophy, Zap, BookOpen, Award } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getProgress, type ProgressData } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

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
    <>
      <PageHeader title="Learning progress" subtitle="Track your learning journey." />
      <Card><EmptyState Icon={Trophy} title="No progress data" description="Start completing lessons to track your learning journey." /></Card>
    </>
  );

  return (
    <>
      <PageHeader title="Learning progress" subtitle="Your XP, streak, and badges at a glance." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Total XP" value={progress.xp} Icon={Trophy} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Completed lessons" value={progress.completed_lessons} Icon={BookOpen} /></div>
        <div className="dash-rise" style={{ animationDelay: "140ms" }}><StatCard label="Day streak" value={progress.streak ?? 0} Icon={Zap} /></div>
      </div>

      <Card title="Badges">
        {progress.badges.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--text-subtle)" }}>No badges earned yet. Complete lessons to earn badges!</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {progress.badges.map((b, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 13, fontWeight: 600, border: "1px solid var(--teal-100, var(--border))" }}>
                <Award size={15} strokeWidth={2} aria-hidden="true" /> {b}
              </span>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
