"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssignments, type Assignment } from "@/app/lib/api/teacher";

export default function GradingPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Grading</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>Select an assignment to grade submissions.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {assignments.map((a) => (
          <Link key={a.id} href={`/teacher/assignments/${a.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "var(--gray-400)" }}>{a.submission_count} submissions</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)" }}>Grade &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
