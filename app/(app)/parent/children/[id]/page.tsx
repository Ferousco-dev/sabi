"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, XCircle, Clock } from "lucide-react";
import { getChildAttendance } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Badge, type BadgeTone } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const backLink = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 } as const;

const STATUS_TONE: Record<string, BadgeTone> = { present: "success", absent: "danger", late: "warning", excused: "teal" };

export default function ChildAttendancePage() {
  const { id } = useParams<{ id: string }>();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChildAttendance(Number(id)).then((res) => {
      if (res.ok && res.data) setRecords(res.data.records);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingPage />;

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;

  return (
    <div style={{ maxWidth: 720 }}>
      <Link href={`/parent/children/${id}`} style={backLink}>
        <ArrowLeft size={16} strokeWidth={2.1} /> Back to profile
      </Link>
      <PageHeader title="Attendance history" subtitle="Daily attendance recorded by the school." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
        <StatCard label="Present" value={present} Icon={CalendarCheck} />
        <StatCard label="Absent" value={absent} Icon={XCircle} />
        <StatCard label="Late" value={late} Icon={Clock} />
      </div>

      <Card padded={false} title="Records">
        {records.length === 0 ? (
          <EmptyState Icon={CalendarCheck} title="No attendance records" description="Daily attendance history will be shown here." />
        ) : (
          <div>
            {records.slice().reverse().map((r, i) => (
              <div key={i} style={{ padding: "13px 20px", borderBottom: i < records.length - 1 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 14, color: "var(--gray-900)", fontWeight: 500 }}>{new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                <Badge tone={STATUS_TONE[r.status] ?? "neutral"} dot style={{ textTransform: "capitalize" }}>{r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
