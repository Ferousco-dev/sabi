"use client";
import { useEffect, useState } from "react";
import { Store, Search } from "lucide-react";
import { getCreatorCourses, type Course } from "@/app/lib/api/creator";

export default function MarketplacePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreatorCourses().then((res) => {
      if (res.ok && res.data) setCourses(res.data.courses);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading marketplace…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Marketplace</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input placeholder="Search courses…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }} />
      </div>

      {courses.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <Store size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>No courses published yet.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {courses.map((c) => (
          <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Store size={22} color="var(--teal)" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 6 }}>{c.title}</h3>
            <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 12, lineHeight: 1.5 }}>{c.description ?? "No description"}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>₦{c.price?.toLocaleString() ?? "0"}</span>
              <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{c.enrollment_count} enrolled</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
