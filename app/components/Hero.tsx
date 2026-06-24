"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { WordsPullUp } from "./ui/WordsPullUp";
import { Marquee } from "./ui/Marquee";
import { useTypewriter } from "@/app/hooks/useTypewriter";
import { useVideoScrub } from "@/app/hooks/useVideoScrub";
import { PILL_LINKS } from "@/app/data/content";

const NAV_LINKS = [
  { label: "Features",  target: "features" },
  { label: "Roadmap",   target: "roadmap" },
  { label: "Partners",  target: "about" },
  { label: "About",     target: "about" },
];

const PILL_LINK_TARGETS: Record<string, string> = {
  Schools:  "stakeholders",
  Teachers: "stakeholders",
  Students: "stakeholders",
  Creators: "stakeholders",
};

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4";

const TYPEWRITER_TEXT =
  "Unifying Nigeria's classrooms — schools, teachers, students, parents and creators on one platform.";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const videoRef = useVideoScrub(0.7);
  const [navOpen, setNavOpen] = useState(false);
  const [pillsIn, setPillsIn] = useState(false);
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT, 36, 900);

  useEffect(() => {
    const t = setTimeout(() => setPillsIn(true), 400);
    return () => clearTimeout(t);
  }, []);

  function closeAndScroll(id: string) {
    setNavOpen(false);
    setTimeout(() => scrollTo(id), 300);
  }

  return (
    <section id="home" style={{ padding: "16px", paddingBottom: 0 }}>
      {/* ── Hero box ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 40,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 32px)",
          minHeight: 620,
          maxHeight: 860,
          background: "var(--teal)",
          boxShadow: "0 40px 120px -20px rgba(0,0,0,0.12)",
        }}
      >
        {/* ── Video background ── */}
        <div
          className="pointer-events-none select-none"
          style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}
        >
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            muted
            playsInline
            preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.05)" }}
          />
          <div
            className="noise-overlay"
            style={{ position: "absolute", inset: 0, opacity: 0.22, mixBlendMode: "overlay" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(1,61,71,0.65) 0%, rgba(1,61,71,0.1) 40%, rgba(1,61,71,0.88) 100%)",
            }}
          />
        </div>

        {/* ── Top navbar ── */}
        <div
          style={{
            position: "relative",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 40px",
          }}
        >
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            onClick={() => scrollTo("home")}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img src="/logo.png" alt="SabiHub" style={{ width: 28, height: 28, objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", lineHeight: 1 }}>
                SabiHub
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>
                OMobile Education
              </div>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => scrollTo(target)}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  padding: "8px 16px",
                  borderRadius: 99,
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
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <button
            className="hidden md:block"
            onClick={() => scrollTo("get-started")}
            style={{
              fontSize: 13,
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: 99,
              background: "var(--gold)",
              color: "var(--teal)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Pilot Your School
          </button>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
            }}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* ── Hero content — bottom-anchored ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 100,
            paddingLeft: 52,
            paddingRight: 52,
            gap: 18,
          }}
        >
          {/* Blurred label */}
          <p
            className="pointer-events-none select-none"
            style={{ color: "white", fontSize: 14, fontWeight: 400, lineHeight: 1.5, filter: "blur(3.5px)" }}
          >
            No Dey Dull – Learn Well-Well!
            <br />
            OMobile's Education Persona Consolidator
          </p>

          {/* Typewriter */}
          <p
            style={{ color: "white", fontSize: 22, fontWeight: 600, lineHeight: 1.45, maxWidth: 680, minHeight: 60 }}
          >
            {displayed}
            {!done && (
              <span
                className="cursor-blink"
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1.1em",
                  background: "white",
                  verticalAlign: "middle",
                  marginLeft: 2,
                }}
              />
            )}
          </p>

          {/* Pull-up headline */}
          <h1
            style={{
              color: "white",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              maxWidth: 820,
            }}
          >
            <WordsPullUp text="One platform." delay={0.1} />{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--gold)" }}>
              <WordsPullUp text="Five stakeholders." delay={0.28} />
            </span>{" "}
            <WordsPullUp text="All of Nigeria." delay={0.48} />
          </h1>

          {/* Pill action buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              paddingTop: 4,
              opacity: pillsIn ? 1 : 0,
              transform: pillsIn ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {[
              { label: "Pilot your school",   action: () => scrollTo("get-started"),  primary: true },
              { label: "Become a creator",     action: () => scrollTo("stakeholders"), primary: false },
              { label: "See how it works",     action: () => scrollTo("features"),     primary: false },
              { label: "Contact us",           action: () => window.location.href = "mailto:sabihub@omobile.world", primary: false },
            ].map(({ label, action, primary }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "10px 22px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  transition: "opacity 0.2s",
                  ...(primary
                    ? { background: "var(--gold)", color: "var(--teal)", border: "none" }
                    : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }),
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Floating pill nav — pinned bottom center ── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.18)",
              whiteSpace: "nowrap",
            }}
          >
            {/* Logo circle */}
            <div
              onClick={() => scrollTo("home")}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginRight: 4,
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <img src="/logo.png" alt="SabiHub" style={{ width: 26, height: 26, objectFit: "contain" }} />
            </div>

            {PILL_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(PILL_LINK_TARGETS[l] ?? "stakeholders")}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  padding: "7px 14px",
                  borderRadius: 99,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  flexShrink: 0,
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {l}
              </button>
            ))}

            <button
              onClick={() => scrollTo("get-started")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--teal)",
                background: "white",
                padding: "8px 18px",
                borderRadius: 99,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                marginLeft: 4,
                flexShrink: 0,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get in touch <ChevronRight size={12} />
            </button>
          </nav>
        </motion.div>

        {/* ── Mobile fullscreen overlay ── */}
        <AnimatePresence>
          {navOpen && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px 40px 48px",
                gap: 8,
                background: "rgba(1,40,48,0.97)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Close button */}
              <button
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                style={{
                  position: "absolute",
                  top: 24,
                  right: 40,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 10,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                <X size={20} />
              </button>

              {/* Mobile nav links */}
              {NAV_LINKS.map(({ label, target }, i) => (
                <motion.button
                  key={label}
                  onClick={() => closeAndScroll(target)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    textAlign: "left",
                    color: "white",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.025em",
                    padding: "6px 0",
                    opacity: 1,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {label}
                </motion.button>
              ))}

              {/* Mobile CTA */}
              <motion.button
                onClick={() => closeAndScroll("get-started")}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06 + 0.06, duration: 0.3 }}
                style={{
                  marginTop: 24,
                  alignSelf: "flex-start",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "12px 28px",
                  borderRadius: 99,
                  background: "var(--gold)",
                  color: "var(--teal)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                }}
              >
                Pilot Your School
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Marquee strip ── */}
      <div style={{ marginTop: 16 }}>
        <Marquee />
      </div>
    </section>
  );
}
