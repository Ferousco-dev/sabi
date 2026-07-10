import { Smartphone, Signal, Users } from "lucide-react";
import { Reveal } from "./Reveal";

// African student with a laptop — digital learning, not a chalkboard classroom.
const ABOUT_IMG =
  "https://images.unsplash.com/photo-1771412198236-c2a5a5778fb8?auto=format&fit=crop&w=1200&q=72";

const FACTS = [
  { icon: Smartphone, label: "Lightweight app" },
  { icon: Signal, label: "Offline-first" },
  { icon: Users, label: "One secure login" },
];

export function About() {
  return (
    <section id="about" style={{ padding: "clamp(72px, 10vw, 112px) 0", background: "var(--bg)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "clamp(40px, 6vw, 72px)",
            alignItems: "center",
          }}
        >
          {/* Left, copy */}
          <Reveal>
            <div>
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
                Our mission
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
                Nigerian classrooms deserve tools built for them.
              </h2>

              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "var(--gray-600)",
                  marginTop: 22,
                  maxWidth: 540,
                }}
              >
                Most school software assumes fast internet, new laptops and big
                budgets. Nigerian schools run on patchy connectivity, shared
                devices and tight timetables. SabiHub is built for that reality,
                not against it.
              </p>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "var(--gray-600)",
                  marginTop: 18,
                  maxWidth: 540,
                }}
              >
                One login covers your whole school. It is offline-first, aligned
                to the WAEC and NECO curriculum, and light enough to run on the
                low-end devices your teachers already use.
              </p>

              {/* Honest fact chips */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 32,
                }}
              >
                {FACTS.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      height: 44,
                      padding: "0 16px 0 12px",
                      borderRadius: 8,
                      background: "var(--white)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "var(--teal-50)",
                        color: "var(--teal)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--gray-700)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right, photo */}
          <Reveal delay={0.08}>
            <div style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ABOUT_IMG}
                alt="Students in a Nigerian classroom"
                width={1200}
                height={900}
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                }}
              />

              {/* Floating stat card */}
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-xl)",
                  maxWidth: "calc(100% - 40px)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--teal-50)",
                    color: "var(--teal)",
                    flexShrink: 0,
                  }}
                >
                  <Signal size={20} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--gray-900)",
                      lineHeight: 1.3,
                    }}
                  >
                    Built for low bandwidth
                  </p>
                  <p style={{ fontSize: 13, color: "var(--gray-500)", lineHeight: 1.4 }}>
                    Syncs automatically when connectivity returns
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
