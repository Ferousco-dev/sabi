"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="get-started" className="cta-section" style={{ padding: "112px 80px", background: "var(--cream)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ duration: 0.7 }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--gold)",
              marginBottom: 28,
            }}
          >
            Join the revolution
          </p>
          <h2
            className="cta-headline"
            style={{
              fontSize: "clamp(32px, 5vw, 62px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "var(--teal)",
              marginBottom: 24,
            }}
          >
            No Dey Dull —{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--gold)",
              }}
            >
              Learn Well-Well!
            </span>
          </h2>
          <p
            className="cta-body"
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "#6B7A7D",
              maxWidth: 520,
              margin: "0 auto 48px",
            }}
          >
            Pilot schools write to us now. Creators start building today. Every student in Nigeria deserves the chance to learn well-well.
          </p>
          <div
            className="cta-btn-row"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <button
              className="cta-btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 10,
                cursor: "pointer",
                background: "var(--teal)",
                color: "white",
                border: "none",
                fontFamily: "var(--font-display)",
              }}
            >
              Pilot your school <ArrowRight size={16} />
            </button>
            <button
              className="cta-btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 10,
                cursor: "pointer",
                background: "var(--gold)",
                color: "var(--teal)",
                border: "none",
                fontFamily: "var(--font-display)",
              }}
            >
              Become a creator <ArrowRight size={16} />
            </button>
            <a
              href="mailto:sabihub@omobile.world"
              className="cta-email-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 10,
                cursor: "pointer",
                background: "white",
                color: "var(--teal)",
                border: "1px solid rgba(1,61,71,0.15)",
                textDecoration: "none",
                fontFamily: "var(--font-display)",
              }}
            >
              sabihub@omobile.world
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
