"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Upload, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import { registerStudent, bulkImportStudents, getClasses, type ClassItem } from "@/app/lib/api/schools";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)" } as const;

type Mode = "manual" | "import";

export default function StudentRegistrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("manual");

  const [classes, setClasses] = useState<ClassItem[]>([]);
  useEffect(() => { getClasses().then((res) => { if (res.ok && res.data) setClasses(res.data.classes); }); }, []);

  // Manual entry
  const [form, setForm] = useState({ name: "", email: "", phone: "", date_of_birth: "", gender: "", address: "" });
  const [manualClassId, setManualClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CSV import
  const [csv, setCsv] = useState("");
  const [classId, setClassId] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; duplicates: number; errors: string[] } | null>(null);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email are required.");
    setLoading(true);
    setError(null);
    const res = await registerStudent({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined, date_of_birth: form.date_of_birth || undefined, gender: form.gender || undefined, address: form.address.trim() || undefined, class_id: manualClassId ? Number(manualClassId) : undefined });
    setLoading(false);
    if (res.ok) router.push("/admin/students");
    else setError(res.data && "error" in res.data ? (res.data as any).error : "Failed to register student.");
  }

  async function handleImport() {
    if (!csv.trim()) return;
    setImporting(true);
    setResult(null);
    const res = await bulkImportStudents({ csv_data: csv, class_id: classId ? Number(classId) : undefined });
    setImporting(false);
    if (res.ok && res.data) setResult(res.data);
  }

  const tabs: { key: Mode; label: string; Icon: typeof UserPlus }[] = [
    { key: "manual", label: "Add one student", Icon: UserPlus },
    { key: "import", label: "Import CSV", Icon: Upload },
  ];

  return (
    <div style={{ maxWidth: 760 }}>
      <Link href="/admin/students" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to students
      </Link>

      <PageHeader title="Add students" subtitle="Register one student, or import many at once from a spreadsheet." />

      <div role="tablist" aria-label="Registration method" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(({ key, label, Icon }) => {
          const active = mode === key;
          return (
            <button key={key} role="tab" aria-selected={active} onClick={() => setMode(key)}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              <Icon size={15} strokeWidth={2} aria-hidden="true" /> {label}
            </button>
          );
        })}
      </div>

      {mode === "manual" ? (
        <>
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

              <div style={{ marginTop: 18, maxWidth: 340 }}>
                <label htmlFor="manual-class" style={labelStyle}>Class</label>
                <select id="manual-class" value={manualClassId} onChange={(e) => setManualClassId(e.target.value)} style={fieldStyle}>
                  <option value="">No class yet</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
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
        </>
      ) : (
        <>
          <Card title="Paste CSV data" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FileSpreadsheet size={16} style={{ color: "var(--teal)" }} aria-hidden="true" />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Columns: <strong style={{ color: "var(--gray-900)" }}>name, email</strong>, phone, class
              </span>
            </div>
            <div style={{ maxWidth: 340, marginBottom: 16 }}>
              <label htmlFor="csv-class" style={labelStyle}>Assign all to class (optional)</label>
              <select id="csv-class" value={classId} onChange={(e) => setClassId(e.target.value)} style={fieldStyle}>
                <option value="">No class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label htmlFor="student-csv" style={{ ...labelStyle, marginTop: 4 }}>CSV rows</label>
            <textarea id="student-csv" value={csv} onChange={(e) => setCsv(e.target.value)} rows={8} placeholder={`John Doe,john@school.edu.ng\nJane Smith,jane@school.edu.ng`}
              style={{ width: "100%", padding: "12px 14px", fontSize: 13, fontFamily: "monospace", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", resize: "vertical" }} />
            <button onClick={handleImport} disabled={importing || !csv.trim()}
              style={{ marginTop: 14, height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: importing || !csv.trim() ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: importing || !csv.trim() ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
              {importing ? <LoadingSpinner size={15} color="#fff" /> : <Upload size={16} strokeWidth={2} aria-hidden="true" />}
              {importing ? "Importing…" : "Import students"}
            </button>
          </Card>

          {result && (
            <Card title="Import results">
              <div style={{ display: "flex", gap: 12, marginBottom: result.errors.length > 0 ? 16 : 0, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-full)", background: "#ECFDF3", color: "#067647", fontSize: 13.5, fontWeight: 600 }}>
                  <CheckCircle2 size={16} aria-hidden="true" /> {result.imported} imported
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-full)", background: "#FFFAEB", color: "#B54708", fontSize: 13.5, fontWeight: 600 }}>
                  <XCircle size={16} aria-hidden="true" /> {result.duplicates} duplicates
                </span>
              </div>
              {result.errors.length > 0 && (
                <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", fontSize: 12.5, color: "#B42318", display: "flex", flexDirection: "column", gap: 4 }}>
                  {result.errors.map((e, i) => <div key={i}>{e}</div>)}
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
