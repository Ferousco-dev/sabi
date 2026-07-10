import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "./ui/Logo";

type Section = { id?: string; heading: string; body: string };

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string;
  sections: Section[];
};

// Shared shell for the pre-launch legal stubs (/privacy, /terms). Deliberately
// plain and honest, placeholder copy, real contact route, no fabricated policy.
export function LegalPage({ eyebrow, title, updated, sections }: LegalPageProps) {
  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <header style={{ padding: "28px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/" aria-label="Back to SabiHub home" style={{ textDecoration: "none" }}>
            <Logo size="sm" tone="dark" />
          </Link>
        </div>
      </header>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--gold-dark)",
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={15} /> Back to home
        </Link>

        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--gold)",
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </p>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--teal)",
            lineHeight: 1.05,
            marginBottom: 10,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 48 }}>{updated}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {sections.map((s) => (
            <section key={s.heading} id={s.id} style={{ scrollMarginTop: 24 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--teal)",
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.heading}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
