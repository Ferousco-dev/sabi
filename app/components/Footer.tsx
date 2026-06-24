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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--teal)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            S
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--teal)" }}>SabiHub</span>
          <span style={{ fontSize: 12, color: "#A0AEC0" }}>by OMobile</span>
        </div>
        <p style={{ fontSize: 12, color: "#A0AEC0" }}>
          © 2026 SabiHub. NDPR compliant. No Dey Dull – Learn Well-Well!
        </p>
      </div>
    </footer>
  );
}
