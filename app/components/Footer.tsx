"use client";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Logo } from "./ui/Logo";
import { scrollTo } from "@/app/data/navigation";

const SECTION_LINKS = [
  { label: "Features", target: "features" },
  { label: "Personas", target: "stakeholders" },
  { label: "Roadmap", target: "roadmap" },
  { label: "Get access", target: "get-started" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "NDPR Compliance", href: "/privacy#ndpr" },
];

const SOCIALS = [
  { label: "X (Twitter)", href: "https://x.com", short: "X" },
  { label: "Instagram", href: "https://instagram.com", short: "IG" },
  { label: "LinkedIn", href: "https://linkedin.com", short: "in" },
];

const colHeadingStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "var(--gold-light)",
  marginBottom: 16,
};

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 32,
  fontSize: 14,
  color: "rgba(255,255,255,0.72)",
  textDecoration: "none",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: "var(--font-display)",
  textAlign: "left",
  transition: "color 0.18s",
};

function hoverLink(on: boolean) {
  return (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = on ? "#fff" : "rgba(255,255,255,0.72)";
  };
}

export function Footer() {
  return (
    <footer
      className="footer-root"
      style={{
        background: "var(--teal-dark)",
        padding: "72px 64px 40px",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="footer-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Brand column */}
          <div className="footer-logo-group">
            <Logo size="md" tone="light" />
            <p
              style={{
                marginTop: 18,
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                maxWidth: 300,
              }}
            >
              OMobile&apos;s education platform, unifying Nigeria&apos;s schools,
              teachers, students, parents and creators.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "background 0.18s, border-color 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                >
                  {s.short}
                </a>
              ))}
            </div>
          </div>

          {/* Explore column */}
          <div>
            <div style={colHeadingStyle}>Explore</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {SECTION_LINKS.map((l) => (
                <button
                  key={l.target}
                  onClick={() => scrollTo(l.target)}
                  style={linkStyle}
                  onMouseEnter={hoverLink(true)}
                  onMouseLeave={hoverLink(false)}
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Legal column */}
          <div>
            <div style={colHeadingStyle}>Legal</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {LEGAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={linkStyle}
                  onMouseEnter={hoverLink(true)}
                  onMouseLeave={hoverLink(false)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p className="footer-copyright" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            © 2026 SabiHub by OMobile. NDPR compliant.
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--gold-light)" }}>
            No Dey Dull, Learn Well-Well!
          </p>
        </div>
      </div>
    </footer>
  );
}
