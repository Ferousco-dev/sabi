"use client";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { WifiOff, GraduationCap, Users, ArrowLeft } from "lucide-react";
import { googleAuthUrl } from "../../lib/auth";

// African student focused on a laptop — digital learning.
const BRAND_IMG =
  "https://images.unsplash.com/photo-1646300291345-e7f3f97986ed?auto=format&fit=crop&w=1400&q=72";

const FEATURES = [
  { Icon: WifiOff, label: "Offline-first, built for low bandwidth" },
  { Icon: GraduationCap, label: "WAEC & NECO curriculum aligned" },
  { Icon: Users, label: "One login for your whole school" },
];

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="SabiHub home" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
      <span style={{ width: 34, height: 34, borderRadius: 8, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
        <img src="/logo.png" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
      </span>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: light ? "#fff" : "var(--gray-900)" }}>SabiHub</span>
    </Link>
  );
}

/** Small floating product card to give the brand panel life. */
function MiniCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 24px 60px -16px rgba(0,0,0,0.55)", padding: 16, width: 288, marginBottom: 34 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)" }}>JSS 2 · Science</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--teal)", background: "var(--teal-50)", padding: "3px 8px", borderRadius: 6 }}>WAEC</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7 }}>
        <span style={{ color: "var(--gray-500)" }}>Attendance today</span>
        <span style={{ fontWeight: 700, color: "var(--gray-900)" }}>94%</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "var(--gray-100)", overflow: "hidden", marginBottom: 14 }}>
        <div style={{ width: "94%", height: "100%", borderRadius: 999, background: "var(--teal)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
        <span style={{ color: "var(--gray-500)" }}>Lessons this week</span>
        <span style={{ fontWeight: 700, color: "var(--gray-900)" }}>12</span>
      </div>
    </div>
  );
}

/** Split-screen auth layout: brand panel (desktop) + centered form. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100svh", background: "var(--white)" }}>
      <aside className="auth-brand" style={{ position: "relative", flex: "0 0 47%", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `url("${BRAND_IMG}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(1,40,48,0.55) 0%, rgba(1,32,38,0.93) 100%)" }} />
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 48px" }}>
          <Wordmark light />
          <div>
            <MiniCard />
            <h2 style={{ fontSize: "clamp(24px, 2.1vw, 30px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.18, color: "#fff", maxWidth: 400, marginBottom: 24 }}>
              Learning that works for every Nigerian school.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FEATURES.map(({ Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} strokeWidth={2} style={{ color: "#fff" }} aria-hidden="true" />
                  </span>
                  <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.85)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-form" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--gray-500)", textDecoration: "none" }}
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back to home
            </Link>
            <span className="auth-mobile-logo" style={{ display: "none" }}>
              <Wordmark />
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

type FieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  labelRight?: ReactNode;
  trailing?: ReactNode;
  wrapperStyle?: CSSProperties;
};

/** Clean, sleek input with a soft focus ring. */
export function Field({ label, type = "text", value, onChange, placeholder, autoComplete, name, labelRight, trailing, wrapperStyle }: FieldProps) {
  const id = useId();
  const [focus, setFocus] = useState(false);
  return (
    <div style={wrapperStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-700)" }}>{label}</label>
        {labelRight}
      </div>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: "100%", height: 46,
            padding: trailing ? "0 44px 0 14px" : "0 14px",
            fontSize: 15, color: "var(--gray-900)", background: "#fff",
            border: `1px solid ${focus ? "var(--teal)" : "var(--border-strong)"}`,
            borderRadius: 8, outline: "none",
            boxShadow: focus ? "0 0 0 3px var(--teal-50)" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            fontFamily: "var(--font-sans)",
          }}
        />
        {trailing}
      </div>
    </div>
  );
}

/** Primary submit button with loading state. */
export function AuthButton({ children, loading }: { children: ReactNode; loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn btn-primary"
      style={{
        width: "100%", height: 48, marginTop: 4,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontSize: 15, fontWeight: 600, color: "#fff",
        background: "var(--teal)", border: "none", borderRadius: 8,
        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1,
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </button>
  );
}

/** Inline error banner. */
export function AuthError({ message }: { message: string }) {
  return (
    <div role="alert" aria-live="polite" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 14px", marginBottom: 20, borderRadius: 8, background: "#FEF3F2", border: "1px solid #FECDCA" }}>
      <span style={{ fontSize: 13, color: "#B42318", lineHeight: 1.45 }}>{message}</span>
    </div>
  );
}

/** Google "G" mark, official brand colors. */
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

/** "Continue with Google" button that starts the OAuth flow via the backend. */
export function GoogleButton({ label }: { label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={googleAuthUrl()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
        width: "100%", height: 48, borderRadius: 8,
        background: hover ? "var(--gray-50)" : "#fff",
        color: "var(--gray-900)", border: "1px solid var(--border-strong)",
        fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "var(--shadow-xs)",
        transition: "background 0.15s",
      }}
    >
      <GoogleG /> {label}
    </a>
  );
}

/** Labelled divider between social and email auth. */
export function AuthDivider({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
      <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      <span style={{ fontSize: 12.5, color: "var(--gray-500)" }}>{text}</span>
      <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}
