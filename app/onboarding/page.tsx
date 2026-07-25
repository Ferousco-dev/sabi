"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { School, Presentation, BookOpen, Users, Store, Check, ArrowRight } from "lucide-react";
import { updateRole, type Role } from "../lib/auth";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const ROLES: { key: Role; label: string; desc: string; Icon: typeof School }[] = [
  { key: "school_admin", label: "School", desc: "Manage enrolment, staff and analytics", Icon: School },
  { key: "teacher", label: "Teacher", desc: "Build lessons and grade your classes", Icon: Presentation },
  { key: "student", label: "Student", desc: "Learn, take quizzes and track progress", Icon: BookOpen },
  { key: "parent", label: "Parent", desc: "Follow attendance and grades", Icon: Users },
  { key: "creator", label: "Creator", desc: "Publish courses and reach schools", Icon: Store },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  async function finish() {
    if (!role) return;
    setLoading(true);
    await updateRole(role); // best-effort; proceed regardless in this early build
    router.push("/");
  }

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "radial-gradient(70% 40% at 50% 0%, var(--teal-50) 0%, rgba(236,243,244,0) 60%), var(--bg)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "56px 24px 64px",
      }}
    >
      <span style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "var(--shadow-xs)", marginBottom: 28 }}>
        <img src="/logo.png" alt="SabiHub" style={{ width: 30, height: 30, objectFit: "contain" }} />
      </span>

      <h1 style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--gray-900)", textAlign: "center", marginBottom: 8 }}>
        Welcome to SabiHub
      </h1>
      <p style={{ fontSize: 16, color: "var(--gray-500)", textAlign: "center", marginBottom: 36 }}>
        What best describes you? You can change this later.
      </p>

      <div
        role="radiogroup"
        aria-label="Choose your role"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, width: "100%", maxWidth: 760, marginBottom: 32 }}
      >
        {ROLES.map(({ key, label, desc, Icon }) => {
          const active = role === key;
          return (
            <button
              key={key}
              role="radio"
              aria-checked={active}
              onClick={() => setRole(key)}
              style={{
                position: "relative", textAlign: "left", cursor: "pointer",
                padding: "20px 18px", borderRadius: 12,
                background: active ? "var(--teal-50)" : "#fff",
                border: `1.5px solid ${active ? "var(--teal)" : "var(--border)"}`,
                boxShadow: active ? "none" : "var(--shadow-xs)",
                transition: "border-color 0.15s, background 0.15s, transform 0.15s",
                fontFamily: "var(--font-sans)",
              }}
            >
              {active && (
                <span style={{ position: "absolute", top: 14, right: 14, width: 20, height: 20, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={13} style={{ color: "#fff" }} aria-hidden="true" />
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: active ? "var(--teal)" : "var(--teal-50)", marginBottom: 14 }}>
                <Icon size={20} strokeWidth={1.9} style={{ color: active ? "#fff" : "var(--teal)" }} aria-hidden="true" />
              </span>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--gray-900)", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: "var(--gray-500)", lineHeight: 1.45 }}>{desc}</div>
            </button>
          );
        })}
      </div>

      <button
        onClick={finish}
        disabled={!role || loading}
        className="btn btn-primary"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          height: 50, padding: "0 32px", borderRadius: 8,
          background: "var(--teal)", color: "#fff", fontSize: 15.5, fontWeight: 600,
          border: "none", cursor: !role || loading ? "not-allowed" : "pointer",
          opacity: !role || loading ? 0.55 : 1, fontFamily: "var(--font-sans)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {loading ? <LoadingSpinner size={20} color="#fff" /> : <>Continue <ArrowRight size={17} aria-hidden="true" className="btn-arrow" /></>}
      </button>
    </main>
  );
}
