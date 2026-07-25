"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getContent, type StudentContent } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

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
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Course Content</h1>

      {content.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No content available"
          description="Check back later for lessons and learning materials."
        />
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {content.map((c) => (
          <Link key={c.id} href={`/student/content/${c.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", transition: "box-shadow 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow-xs)"}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "var(--gray-500)" }}>{c.course_title} · {c.teacher_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
