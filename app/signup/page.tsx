"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const ROLES = [
  { key: "school",   label: "School",   desc: "Manage enrolment, timetables & analytics" },
  { key: "teacher",  label: "Teacher",  desc: "Build lessons, grade & collaborate" },
  { key: "student",  label: "Student",  desc: "Learn offline, earn XP & badges" },
  { key: "parent",   label: "Parent",   desc: "Track progress & receive alerts" },
  { key: "creator",  label: "Creator",  desc: "Publish courses & earn revenue" },
];

export default function SignupPage() {
  const [role,      setRole]      = useState("school");
  const [showPass,  setShowPass]  = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [agreed,    setAgreed]    = useState(false);

  const INPUT: React.CSSProperties = {
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
  };

  const LABEL: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#013D47",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 7,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0EEE6" }}>

      {/* ── Left: image panel ──────────────────────────────────────── */}
      <div
        className="auth-image-panel"
        style={{
          flex: "0 0 42%",
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
          alt="Students collaborating"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(150deg, rgba(1,61,71,0.15) 0%, rgba(1,61,71,0.9) 70%)",
          }}
        />

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
              <img src="/logo.png" alt="SabiHub" style={{ width: 28, height: 28, objectFit: "contain" }} />
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

          {/* Bottom copy */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#AA852E",
                marginBottom: 14,
              }}
            >
              Join the movement
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(22px, 2.4vw, 34px)",
                color: "white",
                lineHeight: 1.25,
                marginBottom: 32,
              }}
            >
              One platform. Five stakeholders.
              <br />
              All of Nigeria.
            </h2>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Works offline on 2G networks",
                "WAEC & NECO curriculum aligned",
                "Free for students, always",
                "NDPR compliant data protection",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: "rgba(170,133,46,0.25)",
                      border: "1px solid rgba(170,133,46,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} style={{ color: "#AA852E" }} />
                  </div>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{item}</span>
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
          overflowY: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "48px 64px",
          background: "#F0EEE6",
        }}
      >
        <div style={{ width: "100%", maxWidth: 480 }}>

          {/* Mobile-only logo */}
          <div className="auth-mobile-logo" style={{ display: "none", marginBottom: 28 }}>
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
                <img src="/logo.png" alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#013D47", fontFamily: "var(--font-display)" }}>
                SabiHub
              </span>
            </div>
          </div>

          {/* Eyebrow + heading */}
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#AA852E",
              marginBottom: 12,
            }}
          >
            Get started free
          </p>
          <h1
            style={{
              fontSize: "clamp(26px, 2.8vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#013D47",
              lineHeight: 1.05,
              marginBottom: 8,
              fontFamily: "var(--font-display)",
            }}
          >
            Create your{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
              account
            </span>
          </h1>
          <p style={{ fontSize: 14, color: "#6B7A7D", marginBottom: 32, lineHeight: 1.5 }}>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#013D47",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Sign in
            </Link>
          </p>

          {/* Role picker */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ ...LABEL, marginBottom: 12 }}>I am a…</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ROLES.map((r) => {
                const active = role === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    style={{
                      padding: "8px 18px",
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 8,
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      transition: "all 0.18s ease",
                      background: active ? "#013D47" : "white",
                      color: active ? "white" : "#013D47",
                      border: active
                        ? "1.5px solid #013D47"
                        : "1.5px solid rgba(1,61,71,0.18)",
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            {/* Role description */}
            <p
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#6B7A7D",
                fontStyle: "italic",
              }}
            >
              {ROLES.find((r) => r.key === role)?.desc}
            </p>
          </div>

          {/* Form fields */}
          <form style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Name row */}
            <div className="auth-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={LABEL}>First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Chidi"
                  style={INPUT}
                  onFocus={(e) => (e.target.style.borderColor = "#013D47")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(1,61,71,0.2)")}
                />
              </div>
              <div>
                <label style={LABEL}>Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Okonkwo"
                  style={INPUT}
                  onFocus={(e) => (e.target.style.borderColor = "#013D47")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(1,61,71,0.2)")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={LABEL}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chidi@school.edu.ng"
                style={INPUT}
                onFocus={(e) => (e.target.style.borderColor = "#013D47")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(1,61,71,0.2)")}
              />
            </div>

            {/* Password */}
            <div>
              <label style={LABEL}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  style={{ ...INPUT, paddingRight: 46 }}
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
              <p style={{ fontSize: 11, color: "#6B7A7D", marginTop: 6 }}>
                Use at least 8 characters with a mix of letters and numbers.
              </p>
            </div>

            {/* Terms */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                onClick={() => setAgreed((a) => !a)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: agreed ? "none" : "1.5px solid rgba(1,61,71,0.3)",
                  background: agreed ? "#013D47" : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                  cursor: "pointer",
                  transition: "background 0.18s",
                }}
              >
                {agreed && <Check size={11} style={{ color: "white" }} />}
              </div>
              <span style={{ fontSize: 13, color: "#6B7A7D", lineHeight: 1.5 }}>
                I agree to the{" "}
                <a
                  href="#"
                  style={{ color: "#013D47", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  style={{ color: "#013D47", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px 24px",
                fontSize: 14,
                fontWeight: 700,
                background: agreed ? "#013D47" : "rgba(1,61,71,0.35)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: agreed ? "pointer" : "not-allowed",
                fontFamily: "var(--font-display)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 6,
                transition: "opacity 0.2s, background 0.2s",
              }}
              disabled={!agreed}
              onMouseEnter={(e) => {
                if (agreed) e.currentTarget.style.opacity = "0.88";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Create account <ArrowRight size={15} />
            </button>
          </form>

          <p
            style={{
              marginTop: 40,
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
