"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { registerStudent } from "@/app/lib/api/schools";

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
    <div style={{ maxWidth: 640 }}>
      <Link href="/admin/students" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to Students
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 24 }}>Register New Student</h1>

      {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {[
            { label: "Full Name", field: "name", required: true },
            { label: "Email", field: "email", type: "email", required: true },
            { label: "Phone", field: "phone" },
            { label: "Date of Birth", field: "date_of_birth", type: "date" },
            { label: "Gender", field: "gender", type: "select", options: ["", "male", "female"] },
          ].map(({ label, field, type, required, options }) => (
            <div key={field}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label} {required && <span style={{ color: "#B42318" }}>*</span>}</label>
              {type === "select" ? (
                <select value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)}
                  style={{ width: "100%", height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", background: "#fff" }}>
                  {options?.map((o) => <option key={o} value={o}>{o || "Select…"}</option>)}
                </select>
              ) : (
                <input value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)} type={type ?? "text"}
                  style={{ width: "100%", height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none" }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Address</label>
          <textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={3}
            style={{ width: "100%", padding: "12px 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", fontFamily: "var(--font-sans)", resize: "vertical" }} />
        </div>

        <button type="submit" disabled={loading}
          style={{ marginTop: 24, height: 48, padding: "0 24px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <UserPlus size={18} /> {loading ? "Registering…" : "Register Student"}
        </button>
      </form>
    </div>
  );
}
