"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "64px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "var(--teal-50)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Icon size={28} color="var(--teal)" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: "var(--gray-500)", maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 24,
            height: 42,
            padding: "0 20px",
            borderRadius: 8,
            background: "var(--teal)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
