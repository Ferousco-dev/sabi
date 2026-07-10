import { ImageResponse } from "next/og";

export const alt = "SabiHub, the all-in-one platform for Nigerian schools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card, generated at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #024F5E 0%, #013D47 48%, #012830 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#fff",
              color: "#013D47",
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>SabiHub</div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 66, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            <span>Run your whole school on&nbsp;</span>
            <span style={{ color: "#E8C878" }}>one platform.</span>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.82)", marginTop: 26, maxWidth: 860, lineHeight: 1.4 }}>
            Offline-first, WAEC-aligned, and built for the devices Nigerian schools already own.
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 24, color: "#E8C878", fontWeight: 600 }}>app.sabihub.ng</div>
          <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.6)" }}>No Dey Dull, Learn Well-Well!</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
