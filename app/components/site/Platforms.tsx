"use client";

import { useState, type CSSProperties } from "react";
import {
  School,
  Presentation,
  BookOpen,
  Users,
  Store,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";

type Role = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: [string, string];
};

const ROLES: Role[] = [
  {
    icon: School,
    title: "Schools",
    description: "Run the whole school from one screen.",
    bullets: ["Enrolment and class timetables", "Real-time attendance and analytics"],
  },
  {
    icon: Presentation,
    title: "Teachers",
    description: "Plan lessons and grade without the grind.",
    bullets: ["WAEC-aligned lesson builder", "Assignments and auto-grading"],
  },
  {
    icon: BookOpen,
    title: "Students",
    description: "Keep learning, even when the network drops.",
    bullets: ["Uninterrupted offline learning", "Progress, XP and milestones"],
  },
  {
    icon: Users,
    title: "Parents",
    description: "Stay in the loop without chasing the school.",
    bullets: ["Real-time attendance and grade alerts", "SMS updates, no smartphone needed"],
  },
  {
    icon: Store,
    title: "Creators",
    description: "Build once, reach schools nationwide.",
    bullets: ["Publish curriculum-aligned courses", "Earn in Naira"],
  },
];

function RoleCard({ role }: { role: Role }) {
  const [hovered, setHovered] = useState(false);
  const Icon = role.icon;

  const cardStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 300px",
    maxWidth: 380,
    padding: 24,
    background: "var(--white)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-xs)",
    transform: hovered ? "translateY(-3px)" : "translateY(0)",
    transition:
      "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease",
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
          color: "var(--teal)",
          marginBottom: 18,
        }}
      >
        <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
      </div>

      <h3
        style={{
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "var(--gray-900)",
          marginBottom: 8,
        }}
      >
        {role.title}
      </h3>

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--gray-500)",
          marginBottom: 18,
        }}
      >
        {role.description}
      </p>

      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: "auto",
          paddingTop: 18,
          borderTop: "1px solid var(--border)",
        }}
      >
        {role.bullets.map((bullet) => (
          <li
            key={bullet}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              fontSize: 14,
              lineHeight: 1.5,
              color: "var(--gray-700)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                width: 18,
                height: 18,
                marginTop: 1,
                borderRadius: 999,
                background: "var(--teal-50)",
                color: "var(--teal)",
              }}
            >
              <Check size={12} strokeWidth={2.4} aria-hidden="true" />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Platforms() {
  return (
    <section
      id="platforms"
      style={{ padding: "clamp(72px, 10vw, 112px) 0", background: "var(--bg-subtle)" }}
    >
      <div className="container">
        <Reveal>
          <div
            style={{
              maxWidth: 620,
              marginInline: "auto",
              textAlign: "center",
              marginBottom: "clamp(40px, 5vw, 56px)",
            }}
          >
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
              One platform
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
              Built for every role, from the head teacher to the parent.
            </h2>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--gray-500)",
                marginTop: 14,
                marginInline: "auto",
                maxWidth: 560,
              }}
            >
              SabiHub gives each person in your school the exact tools they need,
              with a single login.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 16,
            }}
          >
            {ROLES.map((role) => (
              <RoleCard key={role.title} role={role} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
