"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthShell, Field, AuthButton, AuthError, GoogleButton, AuthDivider } from "../components/site/AuthUI";
import { login, setToken, type AuthSuccess, type Role } from "../lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Where each role lands after signing in. */
const HOME_BY_ROLE: Record<Role, string> = {
  school_admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
  creator: "/creator",
};

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email.trim())) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    const res = await login({ email: email.trim(), password });
    setLoading(false);

    if (res.status === 0) return setError("Couldn't reach the server. Check your connection and try again.");
    if (res.ok && res.data && res.data.success) {
      const data = res.data as AuthSuccess;
      setToken(data.token);
      router.push(HOME_BY_ROLE[data.user.role] ?? "/");
      return;
    }
    setError(res.data && res.data.success === false ? res.data.error : "Invalid email or password.");
  }

  return (
    <AuthShell>
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--teal)", marginBottom: 10 }}>
        Welcome back
      </p>
      <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--gray-900)", marginBottom: 8 }}>
        Sign in to your account
      </h1>
      <p style={{ fontSize: 15, color: "var(--gray-500)", marginBottom: 32 }}>
        New to SabiHub?{" "}
        <Link href="/signup" style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
      </p>

      <GoogleButton label="Continue with Google" />
      <AuthDivider text="or continue with email" />

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }} noValidate>
        <Field
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@school.edu.ng"
        />
        <Field
          label="Password"
          type={showPass ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          labelRight={
            <Link href="/login" style={{ fontSize: 13, color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>Forgot password?</Link>
          }
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
        <AuthButton loading={loading}>
          {loading ? "Signing in…" : <>Sign in <ArrowRight size={16} aria-hidden="true" /></>}
        </AuthButton>
      </form>

      <p style={{ marginTop: 40, fontSize: 12, color: "var(--gray-400)", textAlign: "center" }}>
        © 2026 SabiHub by OMobile · NDPR compliant
      </p>
    </AuthShell>
  );
}
