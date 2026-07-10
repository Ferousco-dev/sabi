"use client";
import { motion } from "framer-motion";
import { ROADMAP } from "@/app/data/content";
import { SectionHeader } from "./ui/SectionHeader";

export function Roadmap() {
  return (
    <section id="roadmap" className="roadmap-section" style={{ padding: "96px 80px", background: "white" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <SectionHeader
          className="roadmap-heading"
          eyebrow="Phased growth"
          heading={
            <>
              From pilot to{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
                50 million students.
              </span>
            </>
          }
          subtitle="One mission, delivered in deliberate phases, each building on the last."
          style={{ marginBottom: 64 }}
        />

        {/* Vertical timeline, communicates a journey, not three equal options. */}
        <div style={{ position: "relative" }}>
          {/* Connector rail sits behind the nodes (centered on the 40px node column). */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 19,
              top: 16,
              bottom: 16,
              width: 2,
              background: "linear-gradient(var(--gold) 0%, var(--border) 40%, var(--border) 100%)",
            }}
          />

          {ROADMAP.map((r, i) => {
            const active = i === 0;
            return (
              <motion.div
                key={r.phase}
                className="roadmap-row"
                style={{
                  display: "flex",
                  gap: 24,
                  position: "relative",
                  paddingBottom: i < ROADMAP.length - 1 ? 44 : 0,
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
              >
                {/* Timeline node */}
                <div
                  style={{
                    width: 40,
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 4,
                  }}
                >
                  <div
                    style={{
                      width: active ? 22 : 16,
                      height: active ? 22 : 16,
                      borderRadius: "50%",
                      background: active ? "var(--gold)" : "white",
                      border: active ? "none" : "2px solid var(--border)",
                      boxShadow: active ? "0 0 0 5px rgba(170,133,46,0.18)" : "none",
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* Phase card */}
                <div
                  className="roadmap-card"
                  style={{
                    flex: 1,
                    padding: "22px 26px",
                    borderRadius: "var(--radius-md)",
                    background: active ? "var(--teal)" : "var(--cream)",
                    border: active ? "none" : "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: active ? "var(--gold-light)" : "var(--gold)",
                      }}
                    >
                      {r.phase}
                    </span>
                    {/* Status pill, honest about a pre-launch timeline. */}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "3px 9px",
                        borderRadius: "var(--radius-pill)",
                        background: active ? "var(--gold)" : "rgba(1,61,71,0.08)",
                        color: active ? "var(--teal)" : "var(--text-muted)",
                      }}
                    >
                      {active ? "Up next" : r.label}
                    </span>
                  </div>

                  <div
                    className="roadmap-card-date"
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      marginBottom: 8,
                      color: active ? "#fff" : "var(--teal)",
                    }}
                  >
                    {r.date}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      // Bumped from 0.55 → 0.78 to clear WCAG AA on teal.
                      color: active ? "rgba(255,255,255,0.78)" : "var(--text-secondary)",
                    }}
                  >
                    {r.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
