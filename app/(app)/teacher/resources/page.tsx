"use client";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Link, FileText } from "lucide-react";
import { getResources, createResource, type Resource } from "@/app/lib/api/teacher";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("link");
  const [topic, setTopic] = useState("");

  const load = () => getResources().then((res) => {
    if (res.ok && res.data) setResources(res.data.resources);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    await createResource({ title: title.trim(), url: url.trim(), type, topic: topic.trim() || undefined });
    setTitle(""); setUrl(""); setTopic("");
    load();
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading resources…</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Learning Resources</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div><label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 180 }} /></div>
        <div><label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 200 }} /></div>
        <div><label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
            <option value="link">Link</option><option value="file">File</option><option value="video">Video</option><option value="document">Document</option>
          </select></div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Resource
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {resources.map((r) => (
          <div key={r.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {r.type === "link" ? <Link size={18} color="var(--teal)" /> : <FileText size={18} color="var(--teal)" />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{r.title}</div>
                {r.topic && <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{r.topic}</div>}
              </div>
            </div>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>Open</a>
          </div>
        ))}
        {resources.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No resources added yet.</p>}
      </div>
    </div>
  );
}
