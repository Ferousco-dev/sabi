"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, UserPlus, Upload, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import { getTeachers, createTeacher, bulkImportTeachers, type Teacher } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";
import { initials } from "@/app/lib/dashboard";

type Tab = "directory" | "add" | "import";
const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)" } as const;

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("directory");

  // Add
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addOk, setAddOk] = useState<string | null>(null);

  // Import
  const [csv, setCsv] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; duplicates: number; errors: string[] } | null>(null);

  const load = () => getTeachers().then((res) => {
    if (res.ok && res.data) setTeachers(res.data.teachers);
  });

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return setAddError("Name and email are required.");
    setAdding(true); setAddError(null); setAddOk(null);
    const res = await createTeacher({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined });
    setAdding(false);
    if (res.ok && res.data?.success) {
      setAddOk(`${form.name.trim()} added. Temporary password: sabihub123`);
      setForm({ name: "", email: "", phone: "" });
      load();
    } else {
      setAddError(res.data?.error ?? "Could not add teacher.");
    }
  }

  async function handleImport() {
    if (!csv.trim()) return;
    setImporting(true); setResult(null);
    const res = await bulkImportTeachers({ csv_data: csv });
    setImporting(false);
    if (res.ok && res.data) { setResult(res.data); load(); }
  }

  if (loading) return <LoadingPage />;

  const q = query.trim().toLowerCase();
  const filtered = teachers.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
  const activeCount = teachers.filter((t) => t.status === "active").length;

  const tabs: { key: Tab; label: string; Icon: typeof Users }[] = [
    { key: "directory", label: "Directory", Icon: Users },
    { key: "add", label: "Add teacher", Icon: UserPlus },
    { key: "import", label: "Import CSV", Icon: Upload },
  ];

  return (
    <>
      <PageHeader title="Teachers" subtitle="Faculty across your school. Add one at a time, or import many from a spreadsheet." />

      <div role="tablist" aria-label="Teacher views" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(({ key, label, Icon }) => {
          const active = tab === key;
          return (
            <button key={key} role="tab" aria-selected={active} onClick={() => setTab(key)}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              <Icon size={15} strokeWidth={2} aria-hidden="true" /> {label}
            </button>
          );
        })}
      </div>

      {tab === "directory" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
            <div className="dash-rise"><StatCard label="Total teachers" value={teachers.length} Icon={Users} /></div>
            <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Active" value={activeCount} Icon={GraduationCap} /></div>
          </div>

          <Card padded={false}>
            <TableToolbar>
              <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email…" />
              <ResultCount shown={filtered.length} total={teachers.length} />
            </TableToolbar>

            {filtered.length === 0 ? (
              <EmptyState Icon={Users} title="No teachers yet" description={query ? "No teachers match your search." : "Add your first teacher, or import a spreadsheet, using the tabs above."} />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Department</th>
                      <th style={{ ...thStyle, textAlign: "center" }}>Subjects</th>
                      <th style={{ ...thStyle, textAlign: "center" }}>Classes</th>
                      <th style={thStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr key={t.id}>
                        <td style={tdStyle}>
                          <Link href={`/admin/teachers/${t.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                            <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(t.name)}</span>
                            <span style={{ fontWeight: 600, color: "var(--teal)" }}>{t.name}</span>
                          </Link>
                        </td>
                        <td style={tdStyle}>{t.email}</td>
                        <td style={tdStyle}>{t.department_name ?? "—"}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>{t.subject_count}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>{t.class_count}</td>
                        <td style={tdStyle}>
                          <Badge tone={t.status === "active" ? "success" : "danger"} dot>
                            {t.status[0].toUpperCase() + t.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {tab === "add" && (
        <div style={{ maxWidth: 620 }}>
          {addError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{addError}</div>}
          {addOk && <div role="status" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#ECFDF3", border: "1px solid #A6F4C5", color: "#067647", fontSize: 13, marginBottom: 16 }}>{addOk}</div>}
          <Card title="Add a teacher">
            <form onSubmit={handleAdd}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
                <div>
                  <label htmlFor="t-name" style={labelStyle}>Full name <span style={{ color: "#B42318" }}>*</span></label>
                  <input id="t-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label htmlFor="t-email" style={labelStyle}>Email <span style={{ color: "#B42318" }}>*</span></label>
                  <input id="t-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label htmlFor="t-phone" style={labelStyle}>Phone</label>
                  <input id="t-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={fieldStyle} />
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 12 }}>The teacher signs in with a temporary password (<strong style={{ color: "var(--gray-900)" }}>sabihub123</strong>) and is prompted to change it.</p>
              <button type="submit" disabled={adding}
                style={{ marginTop: 18, height: 46, padding: "0 24px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: adding ? "not-allowed" : "pointer", opacity: adding ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
                {adding ? <LoadingSpinner size={18} color="#fff" /> : <UserPlus size={18} strokeWidth={2} aria-hidden="true" />}
                {adding ? "Adding…" : "Add teacher"}
              </button>
            </form>
          </Card>
        </div>
      )}

      {tab === "import" && (
        <div style={{ maxWidth: 760 }}>
          <Card title="Paste CSV data" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FileSpreadsheet size={16} style={{ color: "var(--teal)" }} aria-hidden="true" />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Columns: <strong style={{ color: "var(--gray-900)" }}>name, email</strong>, phone
              </span>
            </div>
            <label htmlFor="teacher-csv" style={labelStyle}>CSV rows</label>
            <textarea id="teacher-csv" value={csv} onChange={(e) => setCsv(e.target.value)} rows={8} placeholder={`Ada Obi,ada@school.edu.ng,08030000000\nBimpe Cole,bimpe@school.edu.ng`}
              style={{ width: "100%", padding: "12px 14px", fontSize: 13, fontFamily: "monospace", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", resize: "vertical" }} />
            <button onClick={handleImport} disabled={importing || !csv.trim()}
              style={{ marginTop: 14, height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: importing || !csv.trim() ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: importing || !csv.trim() ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
              {importing ? <LoadingSpinner size={15} color="#fff" /> : <Upload size={16} strokeWidth={2} aria-hidden="true" />}
              {importing ? "Importing…" : "Import teachers"}
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
        </div>
      )}
    </>
  );
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textAlign: "left" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
