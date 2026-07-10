"use client";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Reveal } from "./Reveal";

/* Brand social marks (this lucide-react version dropped the brand glyphs), 19px
   inline SVGs inheriting currentColor. */
function TwitterMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}
function InstagramMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkedinMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
function FacebookMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

type FooterLink = { label: string; href: string };
const PRODUCT: FooterLink[] = [
  { label: "Features", href: "/#features" },
  { label: "Platforms", href: "/#platforms" },
  { label: "How it works", href: "/#how" },
  { label: "FAQ", href: "/#faq" },
];
const COMPANY: FooterLink[] = [
  { label: "About", href: "/#about" },
  { label: "Contact", href: "mailto:sabihub@omobile.world" },
];
const LEGAL: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "NDPR", href: "/privacy#ndpr" },
];
const SOCIALS = [
  { label: "SabiHub on Twitter", icon: <TwitterMark /> },
  { label: "SabiHub on Instagram", icon: <InstagramMark /> },
  { label: "SabiHub on LinkedIn", icon: <LinkedinMark /> },
  { label: "SabiHub on Facebook", icon: <FacebookMark /> },
];

const MUTED = "rgba(255,255,255,0.6)";

function FooterNavLink({ label, href }: FooterLink) {
  const [hover, setHover] = useState(false);
  return (
    <li>
      <Link
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{
          display: "inline-flex", alignItems: "center", minHeight: 40,
          fontSize: 15, lineHeight: 1.4, textDecoration: "none",
          color: hover ? "#fff" : MUTED, transition: "color 0.18s ease",
        }}
      >
        {label}
      </Link>
    </li>
  );
}

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div style={{ minWidth: 130 }}>
      <p style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>
        {title}
      </p>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
        {links.map((l) => <FooterNavLink key={l.label} {...l} />)}
      </ul>
    </div>
  );
}

function SocialLink({ label, icon }: { label: string; icon: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 40, height: 40, borderRadius: 8,
        border: `1px solid ${hover ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.16)"}`,
        background: hover ? "rgba(255,255,255,0.1)" : "transparent",
        color: hover ? "#fff" : MUTED,
        transition: "all 0.18s ease",
      }}
    >
      {icon}
    </a>
  );
}

export function SiteFooter() {
  const bottomBar: CSSProperties = {
    display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
    gap: 12, marginTop: 56, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <footer style={{ background: "linear-gradient(180deg, #013D47 0%, #012830 100%)", color: MUTED }}>
      <div className="container" style={{ paddingTop: "clamp(56px, 8vw, 80px)", paddingBottom: 36 }}>
        <Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "clamp(40px, 6vw, 88px)" }}>
            {/* Brand */}
            <div style={{ maxWidth: 340, minWidth: 260, flex: "1 1 260px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, background: "#fff", boxShadow: "var(--shadow-xs)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="SabiHub" width={26} height={26} style={{ width: 26, height: 26, objectFit: "contain", display: "block" }} />
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>SabiHub</span>
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.65, color: MUTED, marginTop: 18, maxWidth: 300 }}>
                The all-in-one platform for Nigerian schools. Built for Nigeria, by Nigerians.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                {SOCIALS.map((s) => <SocialLink key={s.label} label={s.label} icon={s.icon} />)}
              </div>
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(36px, 5vw, 72px)" }}>
              <LinkColumn title="Product" links={PRODUCT} />
              <LinkColumn title="Company" links={COMPANY} />
              <LinkColumn title="Legal" links={LEGAL} />
            </div>
          </div>
        </Reveal>

        <div style={bottomBar}>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)" }}>
            &copy; 2026 SabiHub by OMobile. NDPR compliant.
          </p>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: "#E8C878", letterSpacing: "0.01em" }}>
            No Dey Dull, Learn Well-Well!
          </p>
        </div>
      </div>
    </footer>
  );
}
