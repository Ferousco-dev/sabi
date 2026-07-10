"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";

type QA = { q: string; a: string };

const FAQS: QA[] = [
  {
    q: "Does SabiHub work offline?",
    a: "Yes. SabiHub is offline-first. Everything you do is saved on the device and syncs automatically the moment connectivity returns, so learning is never interrupted and no work is ever lost.",
  },
  {
    q: "What devices does it run on?",
    a: "Everyday Android phones, tablets and any web browser. The app is deliberately lightweight, so it runs smoothly on the low-end devices most Nigerian schools already own.",
  },
  {
    q: "Is it aligned with the Nigerian curriculum?",
    a: "Yes. Lessons and assessments map to the WAEC and NECO curriculum out of the box.",
  },
  {
    q: "How much does it cost?",
    a: "SabiHub is free for students. Schools and creators can request pilot pricing when they get in touch.",
  },
  {
    q: "How do parents get updates?",
    a: "Through automatic SMS and in-app alerts, so parents see attendance and grades in real time, even without a smartphone or data plan.",
  },
  {
    q: "Is our data safe?",
    a: "Yes. SabiHub is built to comply with the NDPR (Nigeria Data Protection Regulation), and student data is encrypted.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ padding: "clamp(72px, 10vw, 112px) 0", background: "var(--bg)" }}>
      <div className="container">
        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
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
              FAQ
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
              Questions, answered.
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
              Everything you need to know before bringing your school online.
            </p>
          </div>
        </Reveal>

        {/* Accordion */}
        <Reveal delay={0.08}>
          <div style={{ maxWidth: 760, margin: "clamp(40px, 6vw, 56px) auto 0" }}>
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              const panelId = `faq-panel-${i}`;
              const buttonId = `faq-button-${i}`;
              return (
                <div
                  key={item.q}
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <h3 style={{ margin: 0 }}>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      style={{
                        width: "100%",
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                        padding: "22px 4px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "clamp(16px, 1.6vw, 18px)",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "var(--gray-900)",
                        fontFamily: "inherit",
                      }}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={20}
                        strokeWidth={2}
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          color: "var(--teal)",
                          transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    style={{
                      overflow: "hidden",
                      paddingRight: 40,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        padding: "0 4px 24px",
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: "var(--text-muted)",
                        maxWidth: 620,
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
            {/* Closing divider under the last item */}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
