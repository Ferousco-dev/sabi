"use client";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ padding: "32px 64px", borderTop: "1px solid rgba(1,61,71,0.1)" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* Left: logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "white",
              border: "1px solid rgba(1,61,71,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img src="/logo.png" alt="SabiHub" style={{ width: 22, height: 22, objectFit: "contain" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--teal)" }}>SabiHub</span>
          <span style={{ fontSize: 12, color: "#A0AEC0" }}>by OMobile</span>
        </div>

        {/* Center: copyright */}
        <p style={{ fontSize: 12, color: "#A0AEC0" }}>
          © 2026 SabiHub. NDPR compliant. No Dey Dull – Learn Well-Well!
        </p>

        {/* Right: contact button */}
        <a
          href="mailto:sabihub@omobile.world"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            padding: "9px 20px",
            borderRadius: 99,
            border: "1.5px solid var(--teal)",
            color: "var(--teal)",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            textDecoration: "none",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--teal)";
            (e.currentTarget as HTMLAnchorElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--teal)";
          }}
        >
          <Mail size={14} />
          Contact us
        </a>
      </div>
    </footer>
  );
}
