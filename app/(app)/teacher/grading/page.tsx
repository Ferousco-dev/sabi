"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssignments, type Assignment } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { BarChart3 } from "lucide-react";

export default function GradingPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignments().then((res) => {
      if (res.ok && res.data) setAssignments(res.data.assignments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Grading</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>Select an assignment to grade submissions.</p>

      {assignments.length === 0 && (
        <EmptyState
          icon={BarChart3}
          title="No assignments to grade"
          description="Assignments you create for your classes will appear here for grading."
        />
      )}
    </div>
  );
}
