"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Users, GraduationCap } from "lucide-react";
import { bulkImportStudents, bulkImportTeachers } from "@/app/lib/api/schools";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

export default function BulkImportPage() {
  const [mode, setMode] = useState<"students" | "teachers">("students");
  const [csv, setCsv] = useState("");
  const [classId, setClassId] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; duplicates: number; errors: string[] } | null>(null);

  async function handleImport() {
    if (!csv.trim()) return;
    setImporting(true);
    setResult(null);
    const res = mode === "students"
      ? await bulkImportStudents({ csv_data: csv, class_id: classId ? Number(classId) : undefined })
      : await bulkImportTeachers({ csv_data: csv });
    setImporting(false);
    if (res.ok && res.data) setResult(res.data);
  }

  const tabs: { key: "students" | "teachers"; label: string; Icon: typeof Users }[] = [
    { key: "students", label: "Students", Icon: Users },
    { key: "teachers", label: "Teachers", Icon: GraduationCap },
  ];

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader title="Bulk import" subtitle={`Import ${mode} in bulk by pasting CSV data.`} />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(({ key, label, Icon }) => {
          const active = mode === key;
          return (
            <button key={key} onClick={() => { setMode(key); setResult(null); }}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              <Icon size={15} strokeWidth={2} aria-hidden="true" /> {label}
            </button>
          );
        })}
      </div>

      <Card title="Paste CSV data" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <FileSpreadsheet size={16} style={{ color: "var(--teal)" }} aria-hidden="true" />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Columns: <strong style={{ color: "var(--gray-900)" }}>name, email</strong>{mode === "students" ? ", phone, class" : ", phone, department"}
          </span>
        </div>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={8} placeholder={`John Doe,john@school.edu.ng\nJane Smith,jane@school.edu.ng`}
          style={{ width: "100%", padding: "12px 14px", fontSize: 13, fontFamily: "monospace", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", resize: "vertical" }} />
        <button onClick={handleImport} disabled={importing || !csv.trim()}
          style={{ marginTop: 14, height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: importing || !csv.trim() ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: importing || !csv.trim() ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
          {importing ? <LoadingSpinner size={15} color="#fff" /> : <Upload size={16} strokeWidth={2} aria-hidden="true" />}
          {importing ? "Importing…" : "Import CSV"}
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
            <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", fontSize: 12.5, color: "#B42318", display: "flex", flexDirection: "column", gap: 4 }}>
              {result.errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
