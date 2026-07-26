"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { registerStudent } from "@/app/lib/api/schools";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)" } as const;

export default function StudentRegistrationPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", date_of_birth: "", gender: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email are required.");
    setLoading(true);
    setError(null);
    const res = await registerStudent({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined, date_of_birth: form.date_of_birth || undefined, gender: form.gender || undefined, address: form.address.trim() || undefined });
    setLoading(false);
    if (res.ok) router.push("/admin/students");
    else setError(res.data && "error" in res.data ? (res.data as any).error : "Failed to register student.");
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <Link href="/admin/students" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to students
      </Link>

      <PageHeader title="Register new student" subtitle="Add a student to your school roster." />

      {error && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {[
              { label: "Full name", field: "name", required: true },
              { label: "Email", field: "email", type: "email", required: true },
              { label: "Phone", field: "phone" },
              { label: "Date of birth", field: "date_of_birth", type: "date" },
              { label: "Gender", field: "gender", type: "select", options: ["", "male", "female"] },
            ].map(({ label, field, type, required, options }) => (
              <div key={field}>
                <label htmlFor={field} style={labelStyle}>{label} {required && <span style={{ color: "#B42318" }}>*</span>}</label>
                {type === "select" ? (
                  <select id={field} value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)} style={fieldStyle}>
                    {options?.map((o) => <option key={o} value={o}>{o ? o[0].toUpperCase() + o.slice(1) : "Select…"}</option>)}
                  </select>
                ) : (
                  <input id={field} value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)} type={type ?? "text"} style={fieldStyle} />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <label htmlFor="address" style={labelStyle}>Address</label>
            <textarea id="address" value={form.address} onChange={(e) => update("address", e.target.value)} rows={3}
              style={{ ...fieldStyle, height: "auto", padding: "12px 12px", resize: "vertical" }} />
          </div>

          <button type="submit" disabled={loading}
            style={{ marginTop: 24, height: 46, padding: "0 24px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
            {loading ? <LoadingSpinner size={18} color="#fff" /> : <UserPlus size={18} strokeWidth={2} aria-hidden="true" />}
            {loading ? "Registering…" : "Register student"}
          </button>
        </form>
      </Card>
    </div>
  );
}
