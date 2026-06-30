"use client";
import { motion } from "framer-motion";
import { ROADMAP } from "@/app/data/content";

export function Roadmap() {
  return (
    <section id="roadmap" className="roadmap-section" style={{ padding: "96px 80px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
          Phased growth
        </p>
        <h2
          className="roadmap-heading"
          style={{
            fontSize: "clamp(28px, 4vw, 46px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--teal)",
            marginBottom: 64,
          }}
        >
          Maximum impact,{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
            built to last.
          </span>
        </h2>

        <div
          className="roadmap-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {ROADMAP.map((r, i) => (
            <motion.div
              key={r.phase}
              className="roadmap-card"
              style={{
                padding: 32,
                borderRadius: 20,
                background: i === 0 ? "var(--teal)" : "var(--cream)",
                border: i !== 0 ? "1px solid rgba(1,61,71,0.1)" : "none",
              }}
              initial={{ opacity: 1, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.01 }}
              transition={{ delay: i * 0.14, duration: 0.6 }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  opacity: 0.8,
                  marginBottom: 6,
                }}
              >
                {r.phase}
              </div>
              <div
                className="roadmap-card-date"
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 4,
                  color: i === 0 ? "white" : "var(--teal)",
                }}
              >
                {r.date}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: i === 0 ? "rgba(255,255,255,0.5)" : "#6B7A7D",
                }}
              >
                {r.label}
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: i === 0 ? "rgba(255,255,255,0.55)" : "#4A6065",
                }}
              >
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
