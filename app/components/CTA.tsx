"use client";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "./ui/Button";

// Real, working actions, pre-filled so the recipient can triage by audience.
const PILOT_MAILTO =
  "mailto:sabihub@omobile.world?subject=School%20Pilot%20%E2%80%94%20Early%20Access&body=Tell%20us%20about%20your%20school%20(name%2C%20state%2C%20number%20of%20students)%20and%20we'll%20be%20in%20touch.";
const CREATOR_MAILTO =
  "mailto:sabihub@omobile.world?subject=Creator%20Access%20%E2%80%94%20SabiHub&body=Tell%20us%20what%20you%20teach%20and%20we'll%20get%20you%20set%20up.";

export function CTA() {
  return (
    <section
      id="get-started"
      className="cta-section"
      style={{
        position: "relative",
        padding: "120px 80px",
        // Dark teal full-bleed, deliberate contrast against the cream sections
        // above and below, so the conversion moment reads as a distinct place.
        background:
          "radial-gradient(120% 120% at 50% 0%, var(--teal-mid) 0%, var(--teal) 45%, var(--teal-dark) 100%)",
        overflow: "hidden",
      }}
    >
      {/* Subtle grain so the flat dark field doesn't read as a plain block. */}
      <div
        aria-hidden="true"
        className="noise-overlay"
        style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }}
      />

      <div style={{ position: "relative", maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "var(--gold-light)",
              marginBottom: 24,
            }}
          >
            Join the revolution
          </p>
          <h2
            className="cta-headline"
            style={{
              fontSize: "clamp(34px, 5vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: "#fff",
              marginBottom: 24,
              textWrap: "balance",
            }}
          >
            No Dey Dull -{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--gold-light)",
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
              color: "rgba(255,255,255,0.72)",
              maxWidth: 540,
              margin: "0 auto 44px",
            }}
          >
            Bringing your school online, or building courses for millions of
            students? Start with SabiHub today.
          </p>

          <div
            className="cta-btn-row"
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}
          >
            <Button
              href={PILOT_MAILTO}
              variant="gold"
              size="lg"
              icon={<ArrowRight size={17} />}
              className="cta-btn-primary"
            >
              Apply for early access
            </Button>
            <Button
              href={CREATOR_MAILTO}
              variant="outline"
              size="lg"
              icon={<ArrowRight size={17} />}
              className="cta-btn-secondary"
              // Ghost-on-dark: transparent with a light border reads better here
              // than the default white fill.
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              Become a creator
            </Button>
          </div>

          <a
            href="mailto:sabihub@omobile.world"
            className="cta-email-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 28,
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              minHeight: 44,
            }}
          >
            <Mail size={15} />
            sabihub@omobile.world
          </a>
        </motion.div>
      </div>
    </section>
  );
}
