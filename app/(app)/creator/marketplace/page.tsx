"use client";

export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import { Store, Search, Users } from "lucide-react";
import { getCreatorCourses, type Course } from "@/app/lib/api/creator";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function MarketplacePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getCreatorCourses().then((res) => {
      if (res.ok && res.data) setCourses(res.data.courses);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      c.title.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q)
    );
  }, [courses, query]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader
        title="Marketplace"
        subtitle="Discover courses published by creators across SabiHub."
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "0 14px", height: 42, marginBottom: 20, maxWidth: 420 }}>
        <Search size={17} strokeWidth={2} style={{ color: "var(--text-subtle)", flexShrink: 0 }} aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent", color: "var(--text)" }}
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            Icon={Store}
            title={query ? "No matching courses" : "Marketplace is empty"}
            description={query ? "Try a different search term." : "Courses published by creators will appear here for schools to discover."}
          />
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((c) => (
            <div key={c.id} className="stat-card" style={{ display: "flex", flexDirection: "column", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-xs)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <span aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Store size={20} style={{ color: "var(--teal)" }} />
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>₦{c.price?.toLocaleString() ?? "0"}</span>
              </div>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em", marginBottom: 4 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5, flex: 1 }}>{c.description ?? "No description"}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--text-subtle)" }}>
                <Users size={14} aria-hidden="true" /> {c.enrollment_count} enrolled
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
