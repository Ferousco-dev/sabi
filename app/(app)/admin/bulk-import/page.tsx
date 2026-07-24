"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import { bulkImportStudents, bulkImportTeachers } from "@/app/lib/api/schools";

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

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Bulk Import</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>Import {mode} from CSV data</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => { setMode("students"); setResult(null); }}
          style={{ height: 38, padding: "0 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: `1.5px solid ${mode === "students" ? "var(--teal)" : "var(--border)"}`, background: mode === "students" ? "var(--teal-50)" : "#fff", color: mode === "students" ? "var(--teal)" : "var(--gray-600)", cursor: "pointer" }}>
          Import Students
        </button>
        <button onClick={() => { setMode("teachers"); setResult(null); }}
          style={{ height: 38, padding: "0 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: `1.5px solid ${mode === "teachers" ? "var(--teal)" : "var(--border)"}`, background: mode === "teachers" ? "var(--teal-50)" : "#fff", color: mode === "teachers" ? "var(--teal)" : "var(--gray-600)", cursor: "pointer" }}>
          Import Teachers
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <FileSpreadsheet size={18} color="var(--teal)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>Paste CSV Data</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 10 }}>
          Columns: <strong>name, email</strong>{mode === "students" ? ", phone, class" : ", phone, department"}
        </p>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={8} placeholder={`John Doe,john@school.edu.ng\nJane Smith,jane@school.edu.ng`}
          style={{ width: "100%", padding: "12px 14px", fontSize: 13, fontFamily: "monospace", border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", resize: "vertical" }} />
        <button onClick={handleImport} disabled={importing || !csv.trim()}
          style={{ marginTop: 14, height: 42, padding: "0 20px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: importing || !csv.trim() ? 0.65 : 1 }}>
          <Upload size={16} /> {importing ? "Importing…" : "Import CSV"}
        </button>
      </div>

      {result && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Import Results</h2>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, color: "#0E8345" }}>
              <CheckCircle2 size={16} /> {result.imported} imported
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, color: "var(--gold)" }}>
              <XCircle size={16} /> {result.duplicates} duplicates
            </div>
          </div>
          {result.errors.length > 0 && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: "#FEF3F2", border: "1px solid #FECDCA", fontSize: 12, color: "#B42318" }}>
              {result.errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

