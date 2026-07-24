"use client";
import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { updateRole, type Role } from "@/app/lib/auth";

const ROLES: { key: Role; label: string }[] = [
  { key: "school_admin", label: "School Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
  { key: "parent", label: "Parent" },
  { key: "creator", label: "Creator" },
];

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
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Settings</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 16 }}>Profile</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Name</span>
            <p style={{ fontSize: 15, color: "var(--gray-900)", marginTop: 2 }}>{user.name}</p>
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Email</span>
            <p style={{ fontSize: 15, color: "var(--gray-900)", marginTop: 2 }}>{user.email}</p>
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Current Role</span>
            <p style={{ fontSize: 15, color: "var(--gray-900)", marginTop: 2, textTransform: "capitalize" }}>{user.role.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Switch Role</h2>
        <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 16 }}>Change your account role. You can switch back anytime.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ROLES.map(({ key, label }) => (
            <button key={key} onClick={() => handleRoleChange(key)} disabled={saving || key === user.role}
              style={{ height: 40, padding: "0 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: `1.5px solid ${key === user.role ? "var(--teal)" : "var(--border)"}`, background: key === user.role ? "var(--teal-50)" : "#fff", color: key === user.role ? "var(--teal)" : "var(--gray-600)", cursor: key === user.role ? "default" : "pointer" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
