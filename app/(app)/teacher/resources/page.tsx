"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Plus, Link2, FileText, Video, File, ExternalLink } from "lucide-react";
import { getResources, createResource, type Resource } from "@/app/lib/api/teacher";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const TYPE_ICON: Record<string, typeof Link2> = { link: Link2, video: Video, document: FileText, file: File };

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("link");
  const [topic, setTopic] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => getResources().then((res) => {
    if (res.ok && res.data) setResources(res.data.resources);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setAdding(true);
    await createResource({ title: title.trim(), url: url.trim(), type, topic: topic.trim() || undefined });
    setTitle(""); setUrl(""); setTopic("");
    await load();
    setAdding(false);
  }

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Learning resources" subtitle="Share links, videos, and documents with your students." />

      <Card title="Add a resource" style={{ marginBottom: 20 }}>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Field label="Title" grow><input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="e.g. Photosynthesis notes" /></Field>
          <Field label="URL" grow><input value={url} onChange={(e) => setUrl(e.target.value)} style={inputStyle} placeholder="https://…" type="url" /></Field>
          <Field label="Topic"><input value={topic} onChange={(e) => setTopic(e.target.value)} style={{ ...inputStyle, width: 140 }} placeholder="Optional" /></Field>
          <Field label="Type">
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ ...inputStyle, width: 130, background: "var(--bg)" }}>
              <option value="link">Link</option><option value="file">File</option><option value="video">Video</option><option value="document">Document</option>
            </select>
          </Field>
          <button type="submit" disabled={adding || !title.trim() || !url.trim()}
            style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding || !title.trim() || !url.trim() ? "not-allowed" : "pointer", opacity: adding || !title.trim() || !url.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
            {adding ? <LoadingSpinner size={15} color="#fff" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />} Add resource
          </button>
        </form>
      </Card>

      {resources.length === 0 ? (
        <Card><EmptyState Icon={Link2} title="No resources yet" description="Add helpful links, videos, or documents for your students." /></Card>
      ) : (
        <Card padded={false}>
          <ul style={{ listStyle: "none" }}>
            {resources.map((r) => {
              const Icon = TYPE_ICON[r.type] ?? Link2;
              return (
                <li key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <span aria-hidden="true" style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} style={{ color: "var(--teal)" }} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{r.title}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                        <Badge tone="neutral">{r.type}</Badge>
                        {r.topic && <span style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>{r.topic}</span>}
                      </div>
                    </div>
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none", flexShrink: 0 }}>Open <ExternalLink size={13} strokeWidth={2.2} aria-hidden="true" /></a>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}

function Field({ label, children, grow }: { label: string; children: React.ReactNode; grow?: boolean }) {
  return (
    <div style={{ flex: grow ? "1 1 160px" : "0 0 auto", minWidth: 0 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  height: 42,
  padding: "0 12px",
  fontSize: 14,
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius-sm)",
  outline: "none",
  fontFamily: "var(--font-sans)",
  width: "100%",
} as const;
