"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthShell, Field, AuthButton, AuthError, GoogleButton, AuthDivider } from "../components/site/AuthUI";
import { signup, setToken, type AuthSuccess } from "../lib/auth";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!firstName.trim() || !lastName.trim()) return setError("Please enter your first and last name.");
    if (!EMAIL_RE.test(email.trim())) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (!agreed) return setError("Please accept the Terms and Privacy Policy to continue.");

    setLoading(true);
    const res = await signup({ name, email: email.trim(), password });
    setLoading(false);

    if (res.status === 0) return setError("Couldn't reach the server. Check your connection and try again.");
    if (res.ok && res.data && res.data.success) {
      setToken((res.data as AuthSuccess).token);
      // Role is chosen next, in onboarding.
      router.push("/onboarding");
      return;
    }
    setError(
      res.data && res.data.success === false
        ? res.data.error
        : res.status === 409
          ? "An account with that email already exists."
          : "Something went wrong. Please try again.",
    );
  }

  return (
    <AuthShell>
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--teal)", marginBottom: 10 }}>
        Get started
      </p>
      <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--gray-900)", marginBottom: 8 }}>
        Create your account
      </h1>
      <p style={{ fontSize: 15, color: "var(--gray-500)", marginBottom: 32 }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
      </p>

      <GoogleButton label="Sign up with Google" />
      <AuthDivider text="or sign up with email" />

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
        <div className="auth-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="First name" name="firstName" autoComplete="given-name" value={firstName} onChange={setFirstName} placeholder="Chidi" />
          <Field label="Last name" name="lastName" autoComplete="family-name" value={lastName} onChange={setLastName} placeholder="Okonkwo" />
        </div>
        <Field label="Email address" type="email" name="email" autoComplete="email" value={email} onChange={setEmail} placeholder="chidi@school.edu.ng" />
        <Field
          label="Password"
          type={showPass ? "text" : "password"}
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          placeholder="Min. 8 characters"
          trailing={
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              aria-label={showPass ? "Hide password" : "Show password"}
              aria-pressed={showPass}
              style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {showPass ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            </button>
          }
        />

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 2 }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: 17, height: 17, marginTop: 1, flexShrink: 0, accentColor: "var(--teal)", cursor: "pointer" }} />
          <span style={{ fontSize: 13.5, color: "var(--gray-500)", lineHeight: 1.5 }}>
            I agree to the{" "}
            <Link href="/terms" style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>
          </span>
        </label>

        <AuthButton loading={loading}>
          {loading ? <LoadingSpinner size={18} color="#fff" /> : <>Create account <ArrowRight size={16} aria-hidden="true" /></>}
        </AuthButton>
      </form>

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--gray-400)", textAlign: "center" }}>
        © 2026 SabiHub by OMobile · NDPR compliant
      </p>
    </AuthShell>
  );
}
