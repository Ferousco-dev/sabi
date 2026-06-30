"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const STATS = [
  { num: "50M",   label: "Students reached" },
  { num: "100K+", label: "Schools targeted" },
  { num: "5",     label: "User personas" },
];

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0EEE6" }}>

      {/* ── Left: image panel ──────────────────────────────────────── */}
      <div
        className="auth-image-panel"
        style={{
          flex: "0 0 46%",
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
        {/* photo */}
        <img
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80"
          alt="Nigerian classroom"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* teal gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(1,61,71,0.25) 0%, rgba(1,61,71,0.92) 75%)",
          }}
        />

        {/* panel content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 52px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src="/logo.png"
                alt="SabiHub"
                style={{ width: 28, height: 28, objectFit: "contain" }}
              />
            </div>
            <span
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-display)",
              }}
            >
              SabiHub
            </span>
          </div>

          {/* Bottom block */}
          <div>
            {/* quote */}
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(20px, 2.2vw, 30px)",
                color: "white",
                lineHeight: 1.35,
                marginBottom: 28,
                maxWidth: 360,
              }}
            >
              "The platform Nigeria's classrooms have been waiting for."
            </p>

            {/* attribution */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#AA852E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                A
              </div>
              <div>
                <p
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Adewale M.
                </p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                  Principal, Lagos State Secondary School
                </p>
              </div>
            </div>

            {/* stats row */}
            <div
              style={{
                display: "flex",
                gap: 24,
                borderTop: "1px solid rgba(255,255,255,0.15)",
                paddingTop: 24,
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p
                    style={{
                      color: "#AA852E",
                      fontWeight: 800,
                      fontSize: 20,
                      letterSpacing: "-0.02em",
                      fontFamily: "var(--font-display)",
                      marginBottom: 2,
                    }}
                  >
                    {s.num}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────────────── */}
      <div
        className="auth-form-panel"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 64px",
          background: "#F0EEE6",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Mobile-only logo */}
          <div className="auth-mobile-logo" style={{ display: "none", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "white",
                  border: "1px solid rgba(1,61,71,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/logo.png"
                  alt=""
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#013D47",
                  fontFamily: "var(--font-display)",
                }}
              >
                SabiHub
              </span>
            </div>
          </div>

          {/* Eyebrow */}
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#AA852E",
              marginBottom: 14,
            }}
          >
            Welcome back
          </p>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#013D47",
              lineHeight: 1.05,
              marginBottom: 8,
              fontFamily: "var(--font-display)",
            }}
          >
            Sign in to{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              your account
            </span>
          </h1>

          {/* Sub-text */}
          <p style={{ fontSize: 14, color: "#6B7A7D", marginBottom: 40, lineHeight: 1.5 }}>
            New to SabiHub?{" "}
            <Link
              href="/signup"
              style={{
                color: "#013D47",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Create an account
            </Link>
          </p>

          {/* Form */}
          <form style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#013D47",
                  letterSpacing: "0.04em",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu.ng"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  fontSize: 14,
                  border: "1.5px solid rgba(1,61,71,0.2)",
                  borderRadius: 8,
                  background: "white",
                  color: "#013D47",
                  outline: "none",
                  fontFamily: "var(--font-display)",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#013D47")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(1,61,71,0.2)")}
              />
            </div>

            {/* Password */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#013D47",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
                <a
                  href="#"
                  style={{
                    fontSize: 12,
                    color: "#AA852E",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "13px 46px 13px 16px",
                    fontSize: 14,
                    border: "1.5px solid rgba(1,61,71,0.2)",
                    borderRadius: 8,
                    background: "white",
                    color: "#013D47",
                    outline: "none",
                    fontFamily: "var(--font-display)",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#013D47")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(1,61,71,0.2)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(1,61,71,0.38)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px 24px",
                fontSize: 14,
                fontWeight: 700,
                background: "#013D47",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 4,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Sign in <ArrowRight size={15} />
            </button>
          </form>

          {/* Footer */}
          <p
            style={{
              marginTop: 52,
              fontSize: 11,
              color: "rgba(1,61,71,0.3)",
              textAlign: "center",
            }}
          >
            © 2026 SabiHub by OMobile · NDPR Compliant
          </p>
        </div>
      </div>
    </div>
  );
}
