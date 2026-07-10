import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Reveal } from "./Reveal";

// African student studying on a laptop (with an Ankara bag) — digital learning.
const CTA_IMG =
  "https://images.unsplash.com/photo-1694175271713-a6e2cc378980?auto=format&fit=crop&w=1600&q=72";

export function CTASection() {
  return (
    <section id="get-started" style={{ background: "var(--bg)", padding: "clamp(64px, 8vw, 104px) 0" }}>
      <div className="container">
        <Reveal>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 20,
              minHeight: 440,
              display: "flex",
              alignItems: "center",
              boxShadow: "var(--shadow-xl)",
              background: "#012830",
            }}
          >
            {/* Nigerian classroom photo */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute", inset: 0,
                backgroundImage: `url("${CTA_IMG}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Scrim, heavier on the left where the copy sits */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute", inset: 0,
                background:
                  "linear-gradient(100deg, rgba(1,40,48,0.96) 0%, rgba(1,40,48,0.86) 42%, rgba(1,40,48,0.52) 72%, rgba(1,40,48,0.35) 100%)",
              }}
            />
            {/* faint dot texture */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1.3px, transparent 1.3px)",
                backgroundSize: "24px 24px",
                maskImage: "linear-gradient(90deg, #000, transparent 60%)",
                WebkitMaskImage: "linear-gradient(90deg, #000, transparent 60%)",
              }}
            />

            <div style={{ position: "relative", padding: "clamp(36px, 6vw, 72px)", maxWidth: 620 }}>
              <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#E8C878", marginBottom: 16 }}>
                Get started
              </p>
              <h2 style={{ fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.04, color: "#fff", textWrap: "balance", marginBottom: 18 }}>
                Bring your school online this term.
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", maxWidth: 460, marginBottom: 32 }}>
                Free to try, and simple enough to set up in a single day. No card,
                no long contract, no IT team required.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link
                  href="/signup"
                  className="btn"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    height: 54, padding: "0 28px", borderRadius: 8,
                    background: "#fff", color: "var(--teal)", fontSize: 16, fontWeight: 600,
                    textDecoration: "none", boxShadow: "0 8px 24px -6px rgba(0,0,0,0.4)",
                  }}
                >
                  Get started free
                  <ArrowRight size={18} aria-hidden="true" className="btn-arrow" />
                </Link>
                <Link
                  href="mailto:sabihub@omobile.world"
                  className="btn"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    height: 54, padding: "0 24px", borderRadius: 8,
                    background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 16, fontWeight: 600,
                    textDecoration: "none", border: "1px solid rgba(255,255,255,0.32)",
                    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
                  }}
                >
                  <CalendarClock size={18} aria-hidden="true" strokeWidth={1.9} />
                  Book a demo
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
