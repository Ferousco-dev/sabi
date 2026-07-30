"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, UserPlus, Upload, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import { getTeachers, createTeacher, bulkImportTeachers } from "@/app/lib/api/schools";
import { useResource } from "@/app/lib/useResource";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";
import { Modal } from "@/app/components/ui/Modal";
import { initials } from "@/app/lib/dashboard";

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)" } as const;

export default function TeachersPage() {
  const { data, loading, refresh } = useResource("admin:teachers", async () => {
    const res = await getTeachers();
    return { teachers: res.ok && res.data ? res.data.teachers : [] };
  });
  const teachers = data?.teachers ?? [];
  const [query, setQuery] = useState("");

  // Add (modal)
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addOk, setAddOk] = useState<string | null>(null);

  // Import (modal)
  const [importOpen, setImportOpen] = useState(false);
  const [csv, setCsv] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; duplicates: number; errors: string[] } | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return setAddError("Name and email are required.");
    setAdding(true); setAddError(null); setAddOk(null);
    const res = await createTeacher({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined });
    setAdding(false);
    if (res.ok && res.data?.success) {
      setAddOk(`${form.name.trim()} added. Temporary password: sabihub123`);
      setForm({ name: "", email: "", phone: "" });
      refresh();
    } else {
      setAddError(res.data?.error ?? "Could not add teacher.");
    }
  }

  async function handleImport() {
    if (!csv.trim()) return;
    setImporting(true); setResult(null);
    const res = await bulkImportTeachers({ csv_data: csv });
    setImporting(false);
    if (res.ok && res.data) { setResult(res.data); refresh(); }
  }

  if (loading) return <LoadingPage />;

  const q = query.trim().toLowerCase();
  const filtered = teachers.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
  const activeCount = teachers.filter((t) => t.status === "active").length;

  return (
    <>
      <PageHeader
        title="Teachers"
        subtitle="Faculty across your school. Add one at a time, or import many from a spreadsheet."
        actions={
          <>
            <button type="button" onClick={() => { setResult(null); setImportOpen(true); }}
              style={{ height: 40, padding: "0 16px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 13.5, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-sans)" }}>
              <Upload size={16} strokeWidth={2} aria-hidden="true" /> Import CSV
            </button>
            <button type="button" onClick={() => { setAddError(null); setAddOk(null); setAddOpen(true); }}
              style={{ height: 40, padding: "0 16px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-sans)" }}>
              <UserPlus size={16} strokeWidth={2} aria-hidden="true" /> Add teacher
            </button>
          </>
        }
      />

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
          <EmptyState Icon={Users} title="No teachers yet" description={query ? "No teachers match your search." : "Add your first teacher, or import a spreadsheet, using the buttons above."} />
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add a teacher">
        {addError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{addError}</div>}
        {addOk && <div role="status" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#ECFDF3", border: "1px solid #A6F4C5", color: "#067647", fontSize: 13, marginBottom: 16 }}>{addOk}</div>}
        <form onSubmit={handleAdd}>
          <div style={{ display: "grid", gap: 16 }}>
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
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setAddOpen(false)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={adding}
              style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding ? "not-allowed" : "pointer", opacity: adding ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {adding ? <LoadingSpinner size={16} color="#fff" /> : <UserPlus size={16} strokeWidth={2} aria-hidden="true" />}
              {adding ? "Adding…" : "Add teacher"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import teachers from CSV" maxWidth={620}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <FileSpreadsheet size={16} style={{ color: "var(--teal)" }} aria-hidden="true" />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Columns: <strong style={{ color: "var(--gray-900)" }}>name, email</strong>, phone
          </span>
        </div>
        <label htmlFor="teacher-csv" style={labelStyle}>CSV rows</label>
        <textarea id="teacher-csv" value={csv} onChange={(e) => setCsv(e.target.value)} rows={7} placeholder={`Ada Obi,ada@school.edu.ng,08030000000\nBimpe Cole,bimpe@school.edu.ng`}
          style={{ width: "100%", padding: "12px 14px", fontSize: 13, fontFamily: "monospace", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", resize: "vertical" }} />

        {result && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: result.errors.length > 0 ? 12 : 0, flexWrap: "wrap" }}>
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
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button type="button" onClick={() => setImportOpen(false)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Close</button>
          <button onClick={handleImport} disabled={importing || !csv.trim()}
            style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: importing || !csv.trim() ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: importing || !csv.trim() ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
            {importing ? <LoadingSpinner size={15} color="#fff" /> : <Upload size={16} strokeWidth={2} aria-hidden="true" />}
            {importing ? "Importing…" : "Import teachers"}
          </button>
        </div>
      </Modal>
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
