"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Building2, Save } from "lucide-react";
import { getSchoolProfile, updateSchoolProfile, type SchoolProfile } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function SchoolProfilePage() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSchoolProfile().then((res) => {
      if (res.ok && res.data) setProfile(res.data.school);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    const res = await updateSchoolProfile(profile);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  }

  function update(field: keyof SchoolProfile, value: string) {
    setProfile((p) => p ? { ...p, [field]: value } : p);
  }

  if (loading) return <LoadingPage />;

  if (!profile) return (
    <EmptyState
      icon={Building2}
      title="Profile not found"
      description="Could not load your school profile data."
    />
  );

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>School Profile</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>Manage your school&apos;s public information</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 18px", borderRadius: 8, background: saved ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", opacity: saving ? 0.65 : 1, transition: "background 0.2s" }}>
          <Save size={16} /> {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { label: "School Name", field: "name" as const, placeholder: "e.g. St. Mary's International School" },
            { label: "Short Name", field: "short_name" as const, placeholder: "e.g. SMIS" },
            { label: "Email", field: "email" as const, type: "email" },
            { label: "Phone", field: "phone" as const, placeholder: "+234 800 000 0000" },
            { label: "Website", field: "website" as const, placeholder: "https://" },
            { label: "Motto", field: "motto" as const, placeholder: "School motto" },
            { label: "School Type", field: "school_type" as const, placeholder: "e.g. Secondary, Primary, Mixed" },
            { label: "Founded Year", field: "founded_year" as const, type: "number" },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
              <input value={(profile[field] ?? "").toString()} onChange={(e) => update(field, e.target.value)} type={type ?? "text"} placeholder={placeholder}
                style={{ width: "100%", height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", background: "#fff" }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Address</label>
          <textarea value={profile.address ?? ""} onChange={(e) => update("address", e.target.value)} rows={3} placeholder="School address"
            style={{ width: "100%", padding: "12px 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", fontFamily: "var(--font-sans)", resize: "vertical" }} />
        </div>
      </div>
    </div>
  );
}

