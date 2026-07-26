"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getContent, type StudentContent } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function ContentPage() {
  const [content, setContent] = useState<StudentContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent().then((res) => {
      if (res.ok && res.data) setContent(res.data.content);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Course content" subtitle="Lessons and learning materials from your teachers." />

      {content.length === 0 ? (
        <Card><EmptyState Icon={BookOpen} title="No content available" description="Check back later for lessons and learning materials." /></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {content.map((c) => (
            <Link key={c.id} href={`/student/content/${c.id}`} className="stat-card" style={{ textDecoration: "none", display: "block", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-xs)" }}>
              <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <BookOpen size={19} style={{ color: "var(--teal)" }} />
              </span>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em", marginBottom: 4 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-subtle)", marginBottom: 14 }}>{c.course_title}{c.teacher_name ? ` · ${c.teacher_name}` : ""}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--teal)" }}>Open <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
