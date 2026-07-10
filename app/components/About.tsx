"use client";
import { WordsPullUp } from "./ui/WordsPullUp";
import { AnimatedParagraph } from "./ui/AnimatedParagraph";
import { STATS } from "@/app/data/content";

// Split the former wall-of-text into a scannable lead + a pull quote so the
// section has visual rhythm instead of one dense block.
const MISSION_LEAD =
  "Over 80% of Nigerian schools lack centralised digital tools. Teachers build lessons in isolation. Parents have no visibility. Students in rural areas fall behind because quality content never reaches them.";
const MISSION_QUOTE =
  "SabiHub unifies every stakeholder, from school admins to local creators, into one offline-first platform built for the devices Nigerians actually own.";

export function About() {
  return (
    <section
      id="about"
      className="about-section"
      style={{
        padding: "112px 80px",
        background: "var(--cream)",
      }}
    >
      <div className="about-inner" style={{ maxWidth: 860, margin: "0 auto" }}>
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
          Our mission
        </p>

        <h2
          className="about-heading"
          style={{
            fontSize: "clamp(28px, 4vw, 50px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "var(--teal)",
            marginBottom: 48,
          }}
        >
          <WordsPullUp text="Nigeria's education system" delay={0} />{" "}
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--gold)",
            }}
          >
            <WordsPullUp text="is fragmented." delay={0.2} />
          </span>{" "}
          <WordsPullUp text="SabiHub fixes that." delay={0.4} />
        </h2>

        <AnimatedParagraph
          text={MISSION_LEAD}
          className="about-mission-text"
          style={{
            fontSize: 17,
            lineHeight: 1.85,
            maxWidth: 720,
            color: "var(--text-secondary)",
          }}
        />

        {/* Pull quote, the strongest sentence, lifted out for emphasis. */}
        <blockquote
          className="about-pullquote"
          style={{
            margin: "36px 0 0",
            paddingLeft: 24,
            borderLeft: "3px solid var(--gold)",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(22px, 2.6vw, 30px)",
            lineHeight: 1.4,
            color: "var(--teal)",
            maxWidth: 760,
          }}
        >
          {MISSION_QUOTE}
        </blockquote>

        {/* Stats row, each in its own box so they never run together */}
        <div
          className="about-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
            marginTop: 64,
          }}
        >
          {STATS.map(({ num, label }) => (
            <div key={num}>
              <div
                className="about-stat-num"
                style={{
                  fontSize: "clamp(36px, 3.5vw, 52px)",
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  color: "var(--teal)",
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 12,
                  marginTop: 8,
                  lineHeight: 1.4,
                  color: "var(--text-muted)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
