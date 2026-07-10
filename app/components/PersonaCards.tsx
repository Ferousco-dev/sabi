"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { WordsPullUp } from "./ui/WordsPullUp";
import { PERSONAS } from "@/app/data/content";
import { scrollTo } from "@/app/data/navigation";

const CREATOR_POINTS = ["Build courses", "Peer review", "Certification badge", "Monetise expertise"];

export function PersonaCards() {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCreatorHighlighted = highlighted === "Creators";

  useEffect(() => {
    const handler = (e: Event) => {
      const role = (e as CustomEvent<string>).detail;
      setHighlighted(role);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHighlighted(null), 3000);
    };
    window.addEventListener("highlight-persona", handler);
    return () => {
      window.removeEventListener("highlight-persona", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section id="stakeholders" className="persona-section" style={{ padding: "112px 80px", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div className="persona-header" style={{ marginBottom: 64 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--gold)",
              marginBottom: 20,
            }}
          >
            One platform, five stakeholders
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--teal)",
            }}
          >
            <WordsPullUp text="Purpose-built tools" />{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
              <WordsPullUp text="for every role." delay={0.22} />
            </span>
          </h2>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--text-muted)" }}>
            Built for real impact. Powered by community.
          </p>
        </div>

        {/* 4-col persona grid */}
        <div className="persona-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {PERSONAS.map((p, i) => {
            const isHighlighted = highlighted === p.role;
            return (
              <motion.div
                key={p.role}
                className="persona-card"
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 28,
                  minHeight: 380,
                  background: p.gradient,
                  border: isHighlighted
                    ? `2px solid ${p.accent}`
                    : "1px solid rgba(1,61,71,0.07)",
                  boxShadow: isHighlighted
                    ? `0 0 0 4px ${p.accent}30, 0 20px 60px rgba(0,0,0,0.12)`
                    : "none",
                  transition: "border 0.35s ease, box-shadow 0.35s ease",
                }}
                initial={{ opacity: 1, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.01 }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Highlight label */}
                {isHighlighted && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: "absolute",
                      top: -1,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: p.accent,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 12px",
                      borderRadius: "0 0 8px 8px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    You&apos;re here
                  </motion.div>
                )}

                {/* Top */}
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: p.accent,
                      opacity: 0.65,
                      marginBottom: 12,
                    }}
                  >
                    {p.num}
                  </p>
                  <h3
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: "var(--teal)",
                      lineHeight: 1.2,
                      marginBottom: 8,
                    }}
                  >
                    {p.role}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 24 }}>
                    {p.headline}
                  </p>
                </div>

                {/* Bottom checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.points.map((pt) => (
                    <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <Check size={12} aria-hidden="true" style={{ color: p.accent, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{pt}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => scrollTo("get-started")}
                    aria-label={`Get early access for ${p.role}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      minHeight: 44,
                      fontSize: 12,
                      fontWeight: 700,
                      color: p.accent,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      marginTop: 8,
                      fontFamily: "var(--font-display)",
                      padding: "10px 0",
                      alignSelf: "flex-start",
                    }}
                  >
                    Learn more <ArrowRight size={11} aria-hidden="true" style={{ transform: "rotate(-45deg)" }} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Creators, full-width row */}
        {(
            <motion.div
              className="persona-creator-row"
              style={{
                marginTop: 12,
                borderRadius: 20,
                overflow: "hidden",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 48,
                gap: 32,
                background: "var(--teal)",
                minHeight: 200,
                border: isCreatorHighlighted
                  ? "2px solid var(--gold)"
                  : "2px solid transparent",
                boxShadow: isCreatorHighlighted
                  ? "0 0 0 4px rgba(170,133,46,0.25), 0 20px 60px rgba(0,0,0,0.18)"
                  : "none",
                transition: "border 0.35s ease, box-shadow 0.35s ease",
              }}
              initial={{ opacity: 1, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.01 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Left text */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    opacity: 0.75,
                    marginBottom: 8,
                  }}
                >
                  05
                </p>
                <h3
                  className="persona-creator-heading"
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  Creators
                </h3>
                <p className="persona-creator-desc" style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", marginTop: 8, maxWidth: 340 }}>
                  Build curriculum-aligned courses. Get certified. Earn revenue. Reach 50M students.
                </p>
              </div>

              {/* Center badges */}
              <div className="persona-creator-badges" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {CREATOR_POINTS.map((pt) => (
                  <div
                    key={pt}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.75)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 10,
                      padding: "8px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <Check size={11} style={{ color: "var(--gold)" }} />
                    {pt}
                  </div>
                ))}
              </div>

              {/* Right CTA */}
              <button
                onClick={() => scrollTo("get-started")}
                className="persona-creator-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "14px 24px",
                  minHeight: 44,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: "var(--gold)",
                  color: "var(--teal)",
                  fontFamily: "var(--font-display)",
                  flexShrink: 0,
                }}
              >
                Become a creator <ArrowRight size={14} aria-hidden="true" />
              </button>
            </motion.div>
        )}
      </div>
    </section>
  );
}
