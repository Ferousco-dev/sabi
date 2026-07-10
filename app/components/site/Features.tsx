"use client";
import { useState, type CSSProperties } from "react";
import {
  WifiOff,
  BookOpen,
  ClipboardCheck,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: WifiOff,
    title: "Offline-first design",
    description:
      "Lessons, grading and attendance keep working through power cuts and dropped connections, then sync seamlessly the moment you are back online.",
  },
  {
    icon: BookOpen,
    title: "WAEC-aligned lesson builder",
    description:
      "Build rich lessons and quizzes mapped to the WAEC and NECO curriculum in minutes.",
  },
  {
    icon: ClipboardCheck,
    title: "Assignments and auto-grading",
    description:
      "Set assignments, grade faster, and give students instant feedback.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance tracking",
    description:
      "Mark attendance in seconds and spot patterns before they become problems.",
  },
  {
    icon: MessageSquare,
    title: "Parent updates",
    description:
      "Automatic attendance and grade alerts by SMS and in-app, keeping parents informed even without a smartphone.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "See how classes, subjects and teachers are performing with clear, simple dashboards.",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  const cardStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: 28,
    background: "var(--white)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-xs)",
    transform: hovered ? "translateY(-3px)" : "translateY(0)",
    transition:
      "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "var(--teal-50)",
          marginBottom: 20,
        }}
      >
        <Icon size={22} strokeWidth={1.8} color="var(--teal)" aria-hidden="true" />
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          color: "var(--gray-900)",
          marginBottom: 8,
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: "var(--gray-500)",
        }}
      >
        {feature.description}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      style={{ padding: "clamp(72px, 10vw, 112px) 0", background: "var(--bg)" }}
    >
      <div className="container">
        <Reveal>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
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
              Features
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
              Everything a Nigerian school needs, in one place.
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
              No more juggling WhatsApp groups, paper registers and spreadsheets.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
              marginTop: 56,
            }}
          >
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
