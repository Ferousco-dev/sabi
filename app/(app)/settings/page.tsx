"use client";
import { useState } from "react";
import { UserCog } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { updateRole, type Role } from "@/app/lib/auth";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

const ROLES: { key: Role; label: string }[] = [
  { key: "school_admin", label: "School Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
  { key: "parent", label: "Parent" },
  { key: "creator", label: "Creator" },
];

const fieldLabel = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.04em" } as const;
const fieldValue = { fontSize: 15, color: "var(--gray-900)", marginTop: 3 } as const;

export default function SettingsPage() {
  const { user, updateRole: updateLocalRole } = useAuth();
  const [saving, setSaving] = useState(false);

  async function handleRoleChange(role: Role) {
    if (role === user?.role) return;
    setSaving(true);
    const res = await updateRole(role);
    if (res.ok) updateLocalRole(role);
    setSaving(false);
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="Settings" subtitle="Your profile and account role." />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Profile">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={fieldLabel}>Name</div>
              <p style={fieldValue}>{user.name}</p>
            </div>
            <div>
              <div style={fieldLabel}>Email</div>
              <p style={fieldValue}>{user.email}</p>
            </div>
            <div>
              <div style={fieldLabel}>Current role</div>
              <p style={{ ...fieldValue, textTransform: "capitalize" }}>{user.role.replace("_", " ")}</p>
            </div>
          </div>
        </Card>

        <Card title={<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><UserCog size={16} color="var(--teal)" /> Switch role</span>}>
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 16 }}>Change your account role. You can switch back anytime.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ROLES.map(({ key, label }) => {
              const active = key === user.role;
              return (
                <button key={key} onClick={() => handleRoleChange(key)} disabled={saving || active}
                  style={{ height: 40, padding: "0 16px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: `1.5px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal-50)" : "var(--bg)", color: active ? "var(--teal)" : "var(--text-muted)", cursor: active ? "default" : saving ? "default" : "pointer", fontFamily: "var(--font-sans)" }}>
                  {label}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
