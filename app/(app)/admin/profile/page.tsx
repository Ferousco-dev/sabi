"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Building2, Save, Check } from "lucide-react";
import { getSchoolProfile, updateSchoolProfile, type SchoolProfile } from "@/app/lib/api/schools";
import { useResource } from "@/app/lib/useResource";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 } as const;
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--text)" } as const;

export default function SchoolProfilePage() {
  const { data, loading, refresh } = useResource("admin:profile", async () => {
    const res = await getSchoolProfile();
    return { school: res.ok && res.data ? res.data.school : null };
  });

  // Editable form, seeded from the fetched profile.
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (data?.school) setProfile(data.school);
  }, [data]);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setError("");
    const res = await updateSchoolProfile(profile);
    setSaving(false);
    if (!res.ok) { setError("Could not save changes. Please try again."); return; }
    setSaved(true); setTimeout(() => setSaved(false), 2000);
    refresh();
  }

  function update(field: keyof SchoolProfile, value: string) {
    setProfile((p) => p ? { ...p, [field]: value } : p);
  }

  if (loading) return <LoadingPage />;

  if (!data?.school) return (
    <Card><EmptyState Icon={Building2} title="Profile not found" description="Could not load your school profile data." /></Card>
  );

  if (!profile) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader
        title="School profile"
        subtitle="Manage your school's public information."
        actions={
          <button onClick={handleSave} disabled={saving}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: saved ? "#067647" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1, transition: "background 0.2s", fontFamily: "var(--font-sans)" }}>
            {saving ? <LoadingSpinner size={15} color="#fff" /> : saved ? <Check size={16} strokeWidth={2.4} aria-hidden="true" /> : <Save size={16} strokeWidth={2} aria-hidden="true" />}
            {saved ? "Saved" : saving ? "Saving…" : "Save changes"}
          </button>
        }
      />

      {error && <p role="alert" style={{ fontSize: 13, color: "#D92D20", marginBottom: 14 }}>{error}</p>}

      <Card title="School details">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {[
            { label: "School name", field: "name" as const, placeholder: "e.g. St. Mary's International School" },
            { label: "Short name", field: "short_name" as const, placeholder: "e.g. SMIS" },
            { label: "Email", field: "email" as const, type: "email" },
            { label: "Phone", field: "phone" as const, placeholder: "+234 800 000 0000" },
            { label: "Website", field: "website" as const, placeholder: "https://" },
            { label: "Motto", field: "motto" as const, placeholder: "School motto" },
            { label: "School type", field: "school_type" as const, placeholder: "e.g. Secondary, Primary, Mixed" },
            { label: "Founded year", field: "founded_year" as const, type: "number" },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label htmlFor={field} style={labelStyle}>{label}</label>
              <input id={field} value={(profile[field] ?? "").toString()} onChange={(e) => update(field, e.target.value)} type={type ?? "text"} placeholder={placeholder} style={fieldStyle} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <label htmlFor="address" style={labelStyle}>Address</label>
          <textarea id="address" value={profile.address ?? ""} onChange={(e) => update("address", e.target.value)} rows={3} placeholder="School address"
            style={{ ...fieldStyle, height: "auto", padding: "12px 12px", resize: "vertical" }} />
        </div>
      </Card>
    </div>
  );
}
