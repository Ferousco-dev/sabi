"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, scrollTo } from "@/app/data/navigation";

export function StickyNav() {
  const [visible, setVisible]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Floor at 320px so the bar doesn't appear after ~176px on short viewports.
      setVisible(window.scrollY > Math.max(window.innerHeight * 0.55, 320));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeAndScroll(id: string) {
    setMenuOpen(false);
    setTimeout(() => scrollTo(id), 280);
  }

  return (
    <>
      {/* ── Sticky bar ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && (
          <motion.header
            className="sticky-header"
            key="sticky-nav"
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -72, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 200,
              background: "rgba(1,61,71,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 40px",
              }}
            >
              {/* Logo */}
              <div
                onClick={() => scrollTo("home")}
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img src="/logo.png" alt="SabiHub" style={{ width: 24, height: 24, objectFit: "contain" }} />
                </div>
                <span style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>
                  SabiHub
                </span>
              </div>

              {/* Desktop nav links */}
              <nav className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
                {NAV_LINKS.map(({ label, target }) => (
                  <button
                    key={label}
                    onClick={() => scrollTo(target)}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.65)",
                      padding: "7px 14px",
                      borderRadius: 10,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      transition: "color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* Desktop auth actions */}
              <div className="hidden md:flex" style={{ alignItems: "center", gap: 6 }}>
                <Link
                  href="/login"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    textDecoration: "none",
                    padding: "9px 14px",
                    borderRadius: 10,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "9px 20px",
                    borderRadius: 10,
                    background: "var(--gold)",
                    color: "var(--teal)",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Sign up
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                className="flex md:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  width: 38,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                <Menu size={20} />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Mobile fullscreen overlay, SIBLING to header, not child ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 400,
              background: "rgba(1,40,48,0.98)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "80px 32px 48px",
              gap: 8,
            }}
          >
            {/* Close */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                position: "absolute",
                top: 20,
                right: 24,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
              }}
            >
              <X size={18} />
            </button>

            {NAV_LINKS.map(({ label, target }, i) => (
              <motion.button
                key={label}
                onClick={() => closeAndScroll(target)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.28 }}
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  textAlign: "left",
                  color: "white",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.025em",
                  padding: "6px 0",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.55")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {label}
              </motion.button>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.06 + 0.06, duration: 0.28 }}
              style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}
            >
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 50,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.28)",
                }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 50,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--teal)",
                  background: "var(--gold)",
                  textDecoration: "none",
                  borderRadius: 12,
                }}
              >
                Sign up
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
