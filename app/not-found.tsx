import Link from "next/link";

export const metadata = { title: "Page not found · SabiHub" };

/**
 * Custom 404. Renders under the root layout (Inter + design tokens), no
 * dashboard chrome. Calm, on-brand, and gives the user two clear ways out.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 0,
        padding: "40px 24px",
        background: "var(--bg-subtle)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 52, height: 52, borderRadius: 13, background: "#fff",
          border: "1px solid var(--border)", display: "inline-flex",
          alignItems: "center", justifyContent: "center", marginBottom: 28,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <img src="/logo.png" alt="" style={{ width: 34, height: 34, objectFit: "contain" }} />
      </span>

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--teal)" }}>
        Error 404
      </p>
      <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-900)", margin: "10px 0 8px" }}>
        This page isn&apos;t here.
      </h1>
      <p style={{ fontSize: 15.5, color: "var(--text-muted)", maxWidth: 440, lineHeight: 1.55 }}>
        The page you&apos;re looking for may have been moved, renamed, or never existed.
        Let&apos;s get you back to somewhere useful.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 28 }}>
        <Link
          href="/dashboard"
          style={{
            height: 46, padding: "0 22px", display: "inline-flex", alignItems: "center", gap: 8,
            borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff",
            fontSize: 15, fontWeight: 600, textDecoration: "none",
          }}
        >
          Go to my dashboard
        </Link>
        <Link
          href="/"
          style={{
            height: 46, padding: "0 22px", display: "inline-flex", alignItems: "center",
            borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)",
            border: "1px solid var(--border-strong)", fontSize: 15, fontWeight: 600, textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
