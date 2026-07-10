"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, GraduationCap, WifiOff, ShieldCheck, TrendingUp, BookOpen, Users } from "lucide-react";
import { Marquee } from "./ui/Marquee";
import { Logo } from "./ui/Logo";
import { NAV_LINKS, scrollTo } from "@/app/data/navigation";

const TRUST = [
  { Icon: GraduationCap, label: "WAEC / NECO aligned" },
  { Icon: WifiOff, label: "Works offline on 2G" },
  { Icon: ShieldCheck, label: "NDPR compliant" },
];

export function Hero() {
  const [navOpen, setNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Reliable mount-triggered reveal (avoids the Framer whileInView invisibility
  // trap). Each element fades/slides up on a staggered delay.
  const reveal = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  function closeAndScroll(id: string) {
    setNavOpen(false);
    setTimeout(() => scrollTo(id), 260);
  }

  return (
    <section id="home" className="hero-section" style={{ padding: 16, paddingBottom: 0 }}>
      <div
        className="hero-box"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          background:
            "radial-gradient(120% 90% at 85% 5%, #024F5E 0%, #013D47 45%, #012830 100%)",
          boxShadow: "0 40px 120px -30px rgba(1,40,48,0.5)",
          minHeight: 720,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Background decoration ── */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Soft gold glow */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,169,74,0.22) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          {/* Dot grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage: "linear-gradient(to bottom, black, transparent 75%)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
            }}
          />
        </div>

        {/* ── Navbar ── */}
        <header
          className="hero-nav"
          style={{
            position: "relative",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 32px",
          }}
        >
          <button
            onClick={() => scrollTo("home")}
            aria-label="SabiHub home"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <Logo tone="light" size="md" />
          </button>

          {/* Desktop links */}
          <nav className="hero-nav-links hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => scrollTo(target)}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.78)",
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.78)")}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Desktop auth actions */}
          <div className="hero-nav-actions hidden md:flex" style={{ alignItems: "center", gap: 6 }}>
            <Link
              href="/login"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                padding: "10px 16px",
                borderRadius: 10,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 700,
                color: "var(--teal)",
                background: "var(--gold)",
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: 10,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Sign up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.24)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: 12,
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <Menu size={22} />
          </button>
        </header>

        {/* ── Body: copy + product mockup ── */}
        <div
          className="hero-body"
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            alignItems: "center",
            gap: 48,
            padding: "8px 52px 56px",
          }}
        >
          {/* Left, copy */}
          <div className="hero-copy">
            {/* Announcement pill */}
            <div
              className="hero-announce"
              style={{
                ...reveal(0),
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 14px 7px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                marginBottom: 24,
              }}
            >
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                <span
                  className="hero-ping"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "var(--gold-light)",
                  }}
                />
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--gold-light)", opacity: 0.5 }} />
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.01em" }}>
                Now piloting with schools across Nigeria
              </span>
            </div>

            <h1
              className="hero-h1"
              style={{
                ...reveal(0.08),
                fontSize: "clamp(38px, 4.6vw, 62px)",
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "#fff",
                marginBottom: 22,
                textWrap: "balance",
              }}
            >
              One platform.{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--gold-light)" }}>
                Five stakeholders.
              </span>{" "}
              All of Nigeria.
            </h1>

            <p
              className="hero-sub"
              style={{
                ...reveal(0.16),
                fontSize: 17,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.72)",
                maxWidth: 460,
                marginBottom: 32,
              }}
            >
              SabiHub brings schools, teachers, students, parents and creators onto
              one offline-first platform, WAEC-aligned and built for the devices
              Nigerians actually own.
            </p>

            {/* CTAs */}
            <div className="hero-cta-row" style={{ ...reveal(0.24), display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 34 }}>
              <button
                onClick={() => scrollTo("get-started")}
                className="hero-cta-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "15px 28px",
                  minHeight: 52,
                  borderRadius: 12,
                  cursor: "pointer",
                  background: "var(--gold)",
                  color: "var(--teal)",
                  border: "none",
                  fontFamily: "var(--font-display)",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Pilot your school <ArrowRight size={17} aria-hidden="true" />
              </button>
              <button
                onClick={() => scrollTo("features")}
                className="hero-cta-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "15px 26px",
                  minHeight: 52,
                  borderRadius: 12,
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.22)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  fontFamily: "var(--font-display)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                Explore features
              </button>
            </div>

            {/* Trust chips */}
            <div className="hero-chips" style={{ ...reveal(0.32), display: "flex", flexWrap: "wrap", gap: 18 }}>
              {TRUST.map(({ Icon, label }) => (
                <div key={label} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <Icon size={15} aria-hidden="true" style={{ color: "var(--gold-light)" }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right, product mockup */}
          <div
            className="hero-visual"
            style={{ ...reveal(0.2), display: "flex", justifyContent: "center", position: "relative" }}
          >
            <DashboardMock />
          </div>
        </div>

        {/* ── Trust marquee ── */}
        <div className="hero-marquee-wrap" style={{ position: "relative", zIndex: 10, paddingBottom: 20 }}>
          <Marquee />
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      {navOpen && (
        <div
          className="hero-mobile-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "rgba(1,40,48,0.98)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            padding: "24px 24px 40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Logo tone="light" size="md" />
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.24)",
                borderRadius: 12,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <X size={22} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 48 }}>
            {NAV_LINKS.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => closeAndScroll(target)}
                style={{
                  textAlign: "left",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  background: "none",
                  border: "none",
                  padding: "12px 0",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 52,
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 52,
                fontSize: 15,
                fontWeight: 700,
                color: "var(--teal)",
                background: "var(--gold)",
                textDecoration: "none",
                borderRadius: 12,
              }}
            >
              Sign up <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── SabiHub product mockup, a self-contained school dashboard preview.
   Communicates "this is a real product" without any external image. ── */
function DashboardMock() {
  const stats = [
    { Icon: Users, label: "Students", value: "1,240", trend: "+18 this term" },
    { Icon: TrendingUp, label: "Attendance", value: "94%", trend: "+3% vs last week" },
    { Icon: BookOpen, label: "Lessons live", value: "38", trend: "6 new today" },
  ];
  const bars = [58, 72, 64, 88, 79, 94, 68];

  return (
    <div
      className="hero-mock"
      style={{
        width: "100%",
        maxWidth: 460,
        borderRadius: 18,
        background: "#fff",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.5)",
        overflow: "hidden",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid var(--border-soft)",
          background: "var(--cream)",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E5675E" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E7B14A" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#5FB97A" }} />
        <div
          style={{
            marginLeft: 10,
            flex: 1,
            maxWidth: 220,
            fontSize: 11,
            color: "var(--text-muted)",
            background: "#fff",
            border: "1px solid var(--border-soft)",
            borderRadius: 6,
            padding: "4px 10px",
            textAlign: "center",
            fontFamily: "var(--font-display)",
          }}
        >
          app.sabihub.ng
        </div>
      </div>

      {/* Dashboard body */}
      <div style={{ padding: 20 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--teal)", letterSpacing: "-0.01em" }}>
              Govt. Model College
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Lagos · 2025/26 Session</div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--teal)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            A
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
          {stats.map(({ Icon, label, value, trend }) => (
            <div
              key={label}
              style={{
                background: "var(--cream)",
                border: "1px solid var(--border-soft)",
                borderRadius: 12,
                padding: "12px 12px",
              }}
            >
              <Icon size={15} aria-hidden="true" style={{ color: "var(--gold-dark)", marginBottom: 8 }} />
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--teal)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{label}</div>
              <div style={{ fontSize: 9, color: "#3E8E5A", marginTop: 4, fontWeight: 600 }}>{trend}</div>
            </div>
          ))}
        </div>

        {/* Weekly attendance chart */}
        <div
          style={{
            background: "var(--cream)",
            border: "1px solid var(--border-soft)",
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)" }}>Weekly attendance</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold-dark)", background: "rgba(170,133,46,0.12)", padding: "2px 8px", borderRadius: 999 }}>
              WAEC-aligned
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 7, height: 60 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: "5px 5px 0 0",
                  background: i === 5 ? "var(--gold)" : "rgba(1,61,71,0.18)",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--text-muted)" }}>{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
