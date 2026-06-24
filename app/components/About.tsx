"use client";
import { WordsPullUp } from "./ui/WordsPullUp";
import { AnimatedParagraph } from "./ui/AnimatedParagraph";
import { STATS } from "@/app/data/content";

const MISSION_TEXT =
  "Over 80% of Nigerian schools lack centralised digital tools. Teachers build lessons in isolation. Parents have no visibility. Students in rural areas fall behind because quality content never reaches them. SabiHub unifies every stakeholder — from school admins to local creators — into one offline-first platform built for the devices Nigerians actually own.";

export function About() {
  return (
    <section
      id="about"
      style={{
        padding: "112px 80px",
        background: "var(--cream)",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
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
          text={MISSION_TEXT}
          className=""
          style={{
            fontSize: 17,
            lineHeight: 1.85,
            maxWidth: 780,
            color: "var(--ink)",
          }}
        />

        {/* Stats row — each in its own box so they never run together */}
        <div
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
                  color: "#6B7A7D",
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
