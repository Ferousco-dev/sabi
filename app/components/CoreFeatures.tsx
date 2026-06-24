"use client";
import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Smart Lesson Builder",
    gradient: "radial-gradient(circle at 50% 0%, #FFD97A 0%, #FFF4CC 35%, #F0EEE6 65%, #F0EEE6 100%)",
    visual: (
      <div style={{ position: "absolute", top: 24, left: 20, right: 20 }}>
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 16,
            fontSize: 12,
            color: "#475569",
            lineHeight: 1.6,
            boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          }}
        >
          Write a{" "}
          <span style={{ fontWeight: 600, color: "#92620A" }}>JSS2 lesson on photosynthesis</span>{" "}
          with{" "}
          <span style={{ fontWeight: 600, color: "#92620A" }}>diagrams and 5 quiz questions</span>{" "}
          aligned to WAEC.
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 99,
              padding: "5px 14px",
              fontSize: 11,
              fontWeight: 600,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            <span style={{ color: "#a855f7", fontSize: "1rem" }}>✦</span> Add NECO objectives
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0D1F23" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}>
            <path d="M4 2L20 11L11 13L9 22L4 2Z" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "Offline-First Sync",
    gradient: "radial-gradient(circle at 50% 0%, #B5D4F4 0%, #E6F1FB 35%, #F0EEE6 65%, #F0EEE6 100%)",
    visual: (
      <div
        style={{
          position: "absolute",
          inset: "0 0 56px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          paddingTop: 16,
        }}
      >
        <img
          src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg"
          alt="sync network diagram"
          style={{ width: "100%", height: 180, objectFit: "contain", marginTop: 20 }}
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </div>
    ),
  },
  {
    title: "Creator Marketplace",
    gradient: "radial-gradient(circle at 50% 0%, #DDD4F5 0%, #EDE9FA 35%, #F0EEE6 65%, #F0EEE6 100%)",
    visual: (
      <div style={{ position: "absolute", inset: "0 0 56px 0", overflow: "hidden" }}>
        {/* Mesh overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)",
            backgroundSize: "16px 16px",
            maskImage: "radial-gradient(circle at center top, black 0%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at center top, black 0%, transparent 80%)",
          }}
        />
        {/* Center content */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 15px 25px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🎓
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              background: "rgba(255,255,255,0.85)",
              color: "#533BAF",
              padding: "6px 14px",
              borderRadius: 99,
            }}
          >
            50K creators by 2030
          </div>
        </div>
        {/* Search pill */}
        <div
          style={{
            position: "absolute",
            top: 220,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "white",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 99,
            padding: "8px 18px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, color: "#1e293b" }}>Search courses</span>
        </div>
      </div>
    ),
  },
];

export function CoreFeatures() {
  return (
    <section id="features" style={{ padding: "96px 80px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: 16,
              background: "linear-gradient(90deg,#AA852E,#013D47,#AA852E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Core Features
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 3.5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#0f172a",
              marginBottom: 12,
            }}
          >
            Built for Speed & Nigeria
          </h2>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.5 }}>
            Everything you need to go
            <br />
            from zero to a connected school.
          </p>
        </div>

        {/* 3-col grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              style={{
                borderRadius: 20,
                height: 340,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
                overflow: "hidden",
                textAlign: "left",
                background: feat.gradient,
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
              }}
              initial={{ opacity: 1, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.01 }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {feat.visual}
              <h3
                style={{
                  position: "relative",
                  zIndex: 10,
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "24px",
                  color: "#1e293b",
                }}
              >
                {feat.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
