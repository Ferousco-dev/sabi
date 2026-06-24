"use client";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { WordsPullUp } from "./ui/WordsPullUp";
import { PERSONAS } from "@/app/data/content";

const CREATOR_POINTS = ["Build courses", "Peer review", "Certification badge", "Monetise expertise"];

export function PersonaCards() {
  return (
    <section id="stakeholders" style={{ padding: "112px 80px", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
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
            <WordsPullUp text="Studio-grade tools" />{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
              <WordsPullUp text="for every role." delay={0.22} />
            </span>
          </h2>
          <p style={{ marginTop: 12, fontSize: 14, color: "#6B7A7D" }}>
            Built for pure impact. Powered by community.
          </p>
        </div>

        {/* 4-col persona grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {PERSONAS.map((p, i) => (
            <motion.div
              key={p.role}
              style={{
                borderRadius: 20,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 28,
                minHeight: 380,
                background: p.gradient,
                border: "1px solid rgba(1,61,71,0.07)",
              }}
              initial={{ opacity: 1, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.01 }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
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
                <p style={{ fontSize: 13, color: "#4A6065", lineHeight: 1.4, marginBottom: 24 }}>
                  {p.headline}
                </p>
              </div>

              {/* Bottom checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {p.points.map((pt) => (
                  <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Check size={12} style={{ color: p.accent, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "#4A6065", lineHeight: 1.4 }}>{pt}</span>
                  </div>
                ))}
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: p.accent,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                    marginTop: 16,
                    fontFamily: "var(--font-display)",
                    padding: 0,
                  }}
                >
                  Learn more <ArrowRight size={11} style={{ transform: "rotate(-45deg)" }} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Creators — full-width row */}
        <motion.div
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
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 8, maxWidth: 340 }}>
              Build curriculum-aligned courses. Get certified. Earn revenue. Reach 50M students.
            </p>
          </div>

          {/* Center badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
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
                  borderRadius: 99,
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              padding: "12px 24px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              background: "var(--gold)",
              color: "var(--teal)",
              fontFamily: "var(--font-display)",
              flexShrink: 0,
            }}
          >
            Become a creator <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
