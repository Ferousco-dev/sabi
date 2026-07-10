import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TypewriterHeading } from "./TypewriterHeading";

// African student focused on a laptop — digital, offline-first learning.
const HERO_IMG =
  "https://images.unsplash.com/photo-1646300291345-e7f3f97986ed?auto=format&fit=crop&w=2000&q=72";

function NigeriaFlag() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <clipPath id="ng-flag"><rect width="20" height="14" rx="3" /></clipPath>
      </defs>
      <g clipPath="url(#ng-flag)">
        <rect width="20" height="14" fill="#fff" />
        <rect width="6.67" height="14" fill="#008751" />
        <rect x="13.33" width="6.67" height="14" fill="#008751" />
      </g>
      <rect width="20" height="14" rx="3" fill="none" stroke="rgba(255,255,255,0.35)" />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        background: "#012830",
      }}
    >
      {/* Nigerian classroom photograph, full screen behind the transparent nav */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: -2,
          backgroundImage: `url("${HERO_IMG}")`,
          backgroundSize: "cover",
          backgroundPosition: "center 42%",
        }}
      />
      {/* Scrim for legibility */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: -1,
          background:
            "linear-gradient(90deg, rgba(1,32,38,0.94) 0%, rgba(1,32,38,0.82) 38%, rgba(1,40,48,0.44) 72%, rgba(1,40,48,0.3) 100%), linear-gradient(0deg, rgba(1,32,38,0.65) 0%, rgba(1,40,48,0) 55%)",
        }}
      />

      <div className="container" style={{ position: "relative", width: "100%", paddingTop: 96, paddingBottom: 48 }}>
        <div style={{ maxWidth: 640 }}>
          <div
            className="rise"
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "7px 12px 7px 10px", borderRadius: 8,
              background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
              marginBottom: 26,
            }}
          >
            <NigeriaFlag />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.92)", fontWeight: 500 }}>
              Built for schools across Nigeria
            </span>
          </div>

          <TypewriterHeading
            lead="Run your whole school on "
            accent="one platform."
            accentColor="#E8C878"
            style={{
              fontSize: "clamp(40px, 5.6vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.038em",
              lineHeight: 1.03,
              color: "#fff",
              marginBottom: 22,
              maxWidth: 620,
            }}
          />

          <p
            className="rise rise-2"
            style={{ fontSize: "clamp(16px, 1.55vw, 19px)", lineHeight: 1.6, color: "rgba(255,255,255,0.82)", maxWidth: 500, marginBottom: 34 }}
          >
            SabiHub unifies lessons, grading, attendance, analytics and parent
            updates in one place. Offline-first and WAEC-aligned, it is light
            enough to run on the devices your school already owns.
          </p>

          <div className="rise rise-3 hero-cta-row" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link
              href="/signup"
              className="btn btn-primary hero-cta-primary"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                height: 54, padding: "0 28px", borderRadius: 8,
                background: "var(--gold)", color: "#fff", fontSize: 16, fontWeight: 600,
                textDecoration: "none", boxShadow: "0 8px 24px -6px rgba(0,0,0,0.4)",
              }}
            >
              Get started free <ArrowRight size={18} aria-hidden="true" className="btn-arrow" />
            </Link>
            <Link
              href="#how"
              className="btn hero-cta-secondary"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 54, padding: "0 26px", borderRadius: 8,
                background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 16, fontWeight: 600,
                textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              }}
            >
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
