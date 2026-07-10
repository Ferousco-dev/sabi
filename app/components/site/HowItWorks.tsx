import { Building2, UserPlus, LineChart, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

type Step = {
  number: string;
  Icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    Icon: Building2,
    title: "Set up your school",
    description:
      "Add your classes and import your student list. It takes minutes, and works from a phone.",
  },
  {
    number: "02",
    Icon: UserPlus,
    title: "Invite teachers and parents",
    description:
      "Everyone gets a single login. Teachers start building lessons, parents start getting updates.",
  },
  {
    number: "03",
    Icon: LineChart,
    title: "Teach, track and grow",
    description:
      "Run lessons, mark attendance, grade work and watch results improve, online or offline.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      style={{ padding: "clamp(72px, 10vw, 112px) 0", background: "var(--bg-subtle)" }}
    >
      <div className="container">
        {/* Centered header */}
        <Reveal>
          <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--teal)",
                marginBottom: 12,
              }}
            >
              How it works
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: "var(--gray-900)",
                textWrap: "balance",
              }}
            >
              Up and running in a day.
            </h2>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--gray-500)",
                marginTop: 14,
                maxWidth: 560,
                marginInline: "auto",
              }}
            >
              No IT team required. If you can use WhatsApp, you can run SabiHub.
            </p>
          </div>
        </Reveal>

        {/* Steps */}
        <div style={{ position: "relative", marginTop: "clamp(44px, 6vw, 64px)" }}>
          {/* Subtle connector line behind the cards on wide screens. */}
          <div
            aria-hidden="true"
            className="hidden md:block"
            style={{
              position: "absolute",
              top: 44,
              left: "16.6%",
              right: "16.6%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--border-strong) 12%, var(--border-strong) 88%, transparent)",
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.08}>
                <StepCard step={step} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const { number, Icon, title, description } = step;
  return (
    <div
      style={{
        height: "100%",
        background: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        boxShadow: "var(--shadow-xs)",
        padding: "28px 26px 30px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "var(--teal)",
          }}
        >
          {number}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "var(--teal-50)",
            color: "var(--teal)",
            flexShrink: 0,
          }}
        >
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>

      <h3
        style={{
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--gray-900)",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--gray-500)" }}>
        {description}
      </p>
    </div>
  );
}
