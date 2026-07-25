"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, DollarSign, Plus, Users } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getCreatorCourses, getRevenue, type Course, type RevenueData } from "@/app/lib/api/creator";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";

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

  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollment_count, 0);

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
            Welcome, {user?.name?.split(" ")[0]}
          </h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>Your creator overview</p>
        </div>
        <Link href="/creator/courses/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          <Plus size={17} /> New Course
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { icon: BookOpen, label: "Courses", value: courses.length, color: "var(--teal)" },
          { icon: Users, label: "Total Enrollments", value: totalEnrollments, color: "var(--teal-700)" },
          { icon: DollarSign, label: "Revenue", value: revenue ? `${revenue.currency} ${revenue.total.toLocaleString()}` : "—", color: "var(--gold)" },
          { icon: DollarSign, label: "Sales", value: revenue?.sales ?? 0, color: "#0E8345" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {courses.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Your Courses</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--gray-50)" }}>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Price</th>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Enrollments</th>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{c.title}</td>
                    <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>₦{c.price?.toLocaleString() ?? "0"}</td>
                    <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{c.enrollment_count}</td>
                    <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
