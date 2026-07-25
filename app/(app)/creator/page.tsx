"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Wallet, Plus, Users, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getCreatorCourses, getRevenue, type Course, type RevenueData } from "@/app/lib/api/creator";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Button } from "@/app/components/ui/Button";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCreatorCourses(), getRevenue()]).then(([c, r]) => {
      if (c.ok && c.data) setCourses(c.data.courses);
      if (r.ok && r.data) setRevenue(r.data.revenue);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollment_count, 0);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        title={`Welcome, ${firstName}`}
        subtitle="Your creator overview"
        actions={<Button href="/creator/courses/new" icon={<Plus size={16} strokeWidth={2.2} aria-hidden="true" />}>New course</Button>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        {[
          { key: "courses", label: "Courses", value: courses.length, Icon: BookOpen },
          { key: "enroll", label: "Enrollments", value: totalEnrollments, Icon: Users },
          { key: "revenue", label: `Revenue (${revenue?.currency ?? "NGN"})`, value: revenue?.total ?? 0, Icon: Wallet },
          { key: "sales", label: "Sales", value: revenue?.sales ?? 0, Icon: ShoppingBag },
        ].map((s, i) => (
          <div key={s.key} className="dash-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <StatCard label={s.label} value={s.value} Icon={s.Icon} />
          </div>
        ))}
      </div>

      <Card
        title="Your courses"
        padded={false}
        action={<Link href="/creator/courses" style={linkStyle}>View all <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>}
      >
        {courses.length === 0 ? (
          <EmptyState Icon={BookOpen} title="No courses yet" description="Create your first course to start reaching schools." action={<Button href="/creator/courses/new">New course</Button>} />
        ) : (
          <ul style={{ listStyle: "none" }}>
            {courses.map((c) => (
              <li key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{c.title}</p>
                  <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2 }}>{c.enrollment_count} enrolled</p>
                </div>
                <Badge tone="teal">{c.enrollment_count}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 13.5,
  fontWeight: 600,
  color: "var(--teal)",
  textDecoration: "none",
};
