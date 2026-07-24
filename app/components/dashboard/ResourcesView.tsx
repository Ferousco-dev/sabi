"use client";
import { useMemo, useState } from "react";
import { FileText, LinkIcon, File, Video, Bookmark, FolderOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { EmptyState } from "./EmptyState";
import { SearchInput, FilterSelect, TableToolbar, ResultCount } from "./table-controls";
import { RESOURCES, RESOURCE_SUBJECTS, type ResourceType } from "../../data/mock/resources";

const TYPE_ICON: Record<ResourceType, LucideIcon> = {
  note: FileText,
  link: LinkIcon,
  file: File,
  video: Video,
};

/**
 * Shared learning-resources browser used by the student and teacher screens:
 * search, subject filter, and a card grid with per-resource bookmarking.
 */
export function ResourcesView() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      const matchesQuery = q === "" || r.title.toLowerCase().includes(q);
      const matchesSubject = subject === "all" || r.subject === subject;
      return matchesQuery && matchesSubject;
    });
  }, [query, subject]);

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Card padded={false}>
      <TableToolbar>
        <SearchInput value={query} onChange={setQuery} label="Search resources" placeholder="Search resources" />
        <FilterSelect
          value={subject}
          onChange={setSubject}
          label="Filter by subject"
          options={[{ value: "all", label: "All subjects" }, ...RESOURCE_SUBJECTS.map((s) => ({ value: s, label: s }))]}
        />
        <ResultCount shown={filtered.length} total={RESOURCES.length} />
      </TableToolbar>

      {filtered.length === 0 ? (
        <EmptyState Icon={FolderOpen} title="No resources found" description="Try a different search term or subject." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, padding: 16 }}>
          {filtered.map((r) => {
            const Icon = TYPE_ICON[r.type];
            const isSaved = saved.has(r.id);
            return (
              <div key={r.id} style={{ display: "flex", flexDirection: "column", gap: 12, border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--teal-50)", flexShrink: 0 }}>
                    <Icon size={18} strokeWidth={1.9} style={{ color: "var(--teal)" }} />
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSave(r.id)}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? `Remove ${r.title} from bookmarks` : `Bookmark ${r.title}`}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: isSaved ? "var(--teal-50)" : "var(--bg)", cursor: "pointer" }}
                  >
                    <Bookmark size={16} strokeWidth={2} style={{ color: isSaved ? "var(--teal)" : "var(--text-subtle)", fill: isSaved ? "var(--teal)" : "none" }} aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)", lineHeight: 1.3 }}>{r.title}</p>
                  <p style={{ fontSize: 12.5, color: "var(--text-subtle)", marginTop: 4 }}>{r.meta}</p>
                </div>
                <Badge tone="neutral">{r.subject}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
