"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const LINKS = [
  { label: "Platforms", href: "#platforms" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#faq" },
];

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="SabiHub home" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
      <span
        style={{
          width: 34, height: 34, borderRadius: 9, background: "#fff",
          border: "1px solid var(--border)", display: "flex", alignItems: "center",
          justifyContent: "center", overflow: "hidden", flexShrink: 0,
        }}
      >
        <img src="/logo.png" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
      </span>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: light ? "#fff" : "var(--gray-900)", transition: "color 0.25s" }}>
        SabiHub
      </span>
    </Link>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Stay transparent over the full-height hero; flip to a solid bar only as the
    // hero scrolls past, so the color change lands on the seam, not mid-photo.
    const hero = document.getElementById("home");
    const threshold = () => (hero ? hero.offsetHeight - 72 : window.innerHeight - 72);
    let t = threshold();
    const onScroll = () => setScrolled(window.scrollY > t);
    const onResize = () => { t = threshold(); onScroll(); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function go(href: string) {
    setOpen(false);
    const id = href.replace("#", "");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 40);
  }

  // At the top the nav floats transparently over the hero photo (light text);
  // once scrolled it becomes a solid white bar (dark text).
  const light = !scrolled;
  const linkColor = light ? "rgba(255,255,255,0.88)" : "var(--gray-600)";
  const linkHover = light ? "#fff" : "var(--gray-900)";

  return (
    <>
      <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(180%) blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      <div className="container" style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark light={light} />

        <nav className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              style={{
                fontSize: 14.5, fontWeight: 500, color: linkColor,
                padding: "8px 14px", borderRadius: 8, background: "none", border: "none",
                cursor: "pointer", fontFamily: "var(--font-sans)", transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
          <Link
            href="/login"
            style={{ fontSize: 14.5, fontWeight: 600, color: light ? "#fff" : "var(--gray-700)", textDecoration: "none", padding: "9px 14px", borderRadius: 8, transition: "color 0.25s" }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn btn-primary"
            style={{
              fontSize: 14.5, fontWeight: 600, color: "#fff", background: "var(--teal)",
              textDecoration: "none", padding: "10px 18px", borderRadius: 8, boxShadow: "var(--shadow-xs)",
            }}
          >
            Get started
          </Link>
        </div>

        <button
          className="flex md:hidden hamburger-btn"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{
            width: 44, height: 44,
            background: "transparent", border: "none", cursor: "pointer",
            alignItems: "center", justifyContent: "center",
            color: light ? "#fff" : "var(--gray-900)",
          }}
        >
          <span className="hamburger" aria-hidden="true">
            <span className="l1" />
            <span className="l2" />
          </span>
        </button>
      </div>
      </header>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--white)", display: "flex", flexDirection: "column", padding: "16px 20px 32px" }}>
          <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <Wordmark />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{ width: 42, height: 42, borderRadius: 8, border: "1px solid var(--border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--gray-900)" }}
            >
              <X size={20} />
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column" }}>
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                style={{ textAlign: "left", fontSize: 18, fontWeight: 600, color: "var(--gray-900)", background: "none", border: "none", borderBottom: "1px solid var(--border)", padding: "18px 4px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
              >
                {l.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 50, fontSize: 15, fontWeight: 600, color: "var(--gray-900)", textDecoration: "none", borderRadius: 8, border: "1px solid var(--border-strong)" }}>
              Log in
            </Link>
            <Link href="/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 50, fontSize: 15, fontWeight: 600, color: "#fff", background: "var(--teal)", textDecoration: "none", borderRadius: 8 }}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
