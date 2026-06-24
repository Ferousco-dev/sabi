"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    title: "Smart Lesson Builder",
    tagline: "Write lessons in minutes, not hours",
    description:
      "AI-powered curriculum builder aligned to WAEC and NECO standards. Generate quizzes, add diagrams, and publish instantly to all your students.",
    bullets: [
      "WAEC / NECO aligned templates",
      "AI-generated quiz questions",
      "Multimedia drag & drop",
      "One-click lesson export",
    ],
    gradient: "radial-gradient(circle at 30% 0%, #FFD97A 0%, #FFF4CC 40%, #F9F8F3 100%)",
    accent: "#AA852E",
  },
  {
    num: "02",
    title: "Offline-First Sync",
    tagline: "Works even when the network doesn't",
    description:
      "Students keep learning during power outages and network drops. Content syncs automatically via CRDT conflict resolution when reconnected.",
    bullets: [
      "Works on 2G & 3G networks",
      "< 50 MB installed size",
      "CRDT conflict-free sync",
      "Budget device optimised",
    ],
    gradient: "radial-gradient(circle at 30% 0%, #B5D4F4 0%, #E6F1FB 40%, #F9F8F3 100%)",
    accent: "#2D7DD2",
  },
  {
    num: "03",
    title: "Creator Marketplace",
    tagline: "Build once. Earn from 50M students",
    description:
      "Publish curriculum-aligned courses, earn revenue, and reach every school across Nigeria. Get certified and grow your creator brand.",
    bullets: [
      "Revenue share model",
      "Certification badge",
      "Peer review system",
      "50K creators by 2030",
    ],
    gradient: "radial-gradient(circle at 30% 0%, #DDD4F5 0%, #EDE9FA 40%, #F9F8F3 100%)",
    accent: "#533BAF",
  },
];

function LessonBuilderVisual() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      {/* AI prompt */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 18,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          fontSize: 13,
          color: "#475569",
          lineHeight: 1.65,
        }}
      >
        Write a{" "}
        <strong style={{ color: "#92620A" }}>JSS2 lesson on photosynthesis</strong> with{" "}
        <strong style={{ color: "#92620A" }}>diagrams and 5 quiz questions</strong> aligned to WAEC.
        <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#AA852E" }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22 }}
            />
          ))}
        </div>
      </div>

      {/* Generated lesson */}
      <div style={{ background: "white", borderRadius: 14, padding: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#013D47", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span>📗</span> Photosynthesis — JSS2
        </div>
        {["Introduction to photosynthesis", "Chlorophyll & light absorption", "WAEC-style diagrams (3)", "Quiz: 5 NECO questions"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <Check size={11} style={{ color: "#AA852E", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#475569" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Export PDF", "Share to class", "Add to WAEC bank"].map((label) => (
          <div
            key={label}
            style={{
              background: "rgba(1,61,71,0.08)",
              color: "#013D47",
              borderRadius: 99,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function OfflineSyncVisual() {
  const nodes = [
    { label: "Teacher Hub", status: "online",  y: "50%" },
    { label: "Student A",   status: "online",  y: "20%" },
    { label: "Student B",   status: "offline", y: "40%" },
    { label: "Student C",   status: "online",  y: "60%" },
    { label: "Student D",   status: "offline", y: "80%" },
  ];
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      {/* Network diagram */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "#013D47", marginBottom: 4 }}>Live sync status</div>
        {nodes.map((n) => (
          <div key={n.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#475569" }}>{n.label}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 99,
                background: n.status === "online" ? "#DCFCE7" : "#FEE2E2",
                color: n.status === "online" ? "#16A34A" : "#DC2626",
              }}
            >
              {n.status === "online" ? "● Synced" : "○ Queued"}
            </span>
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { icon: "📶", val: "2G ready",   label: "Min network" },
          { icon: "📦", val: "< 50 MB",    label: "Install size" },
          { icon: "🔄", val: "CRDT",        label: "Sync method" },
          { icon: "⚡", val: "Unlimited",   label: "Offline time" },
        ].map(({ icon, val, label }) => (
          <div
            key={label}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#013D47" }}>{val}</div>
            <div style={{ fontSize: 10, color: "#6B7A7D", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketplaceVisual() {
  const courses = [
    { title: "Photosynthesis Deep Dive", creator: "Mr. Bello",    price: "₦2,500", icon: "🌿" },
    { title: "WAEC Maths Mastery",        creator: "Mrs. Adaeze",  price: "₦3,200", icon: "📐" },
    { title: "Hausa Language Arts",       creator: "Alhaji Musa",  price: "₦1,800", icon: "📝" },
    { title: "Computer Basics JSS3",      creator: "Engr. Tunde",  price: "₦2,100", icon: "💻" },
  ];
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      {/* Search bar */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>Search 10,000+ courses…</span>
      </div>

      {/* Course grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
        {courses.map((c) => (
          <div
            key={c.title}
            style={{
              background: "white",
              borderRadius: 12,
              padding: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)")}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#013D47", lineHeight: 1.3, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 10, color: "#6B7A7D", marginBottom: 6 }}>{c.creator}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#533BAF" }}>{c.price}</div>
          </div>
        ))}
      </div>

      {/* Creator badge */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <span style={{ fontSize: 22 }}>🎓</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#013D47" }}>50K certified creators by 2030</div>
          <div style={{ fontSize: 11, color: "#6B7A7D" }}>Join the waitlist today</div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: "var(--gold)",
            color: "var(--teal)",
            borderRadius: 99,
            padding: "6px 14px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Apply
        </div>
      </div>
    </div>
  );
}

const VISUALS = [<LessonBuilderVisual key={0} />, <OfflineSyncVisual key={1} />, <MarketplaceVisual key={2} />];

export function CoreFeatures() {
  const [active, setActive] = useState(0);
  const feat = FEATURES[active];

  return (
    <section id="features" style={{ padding: "96px 80px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
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
            Everything you need to go from zero to a connected school.
          </p>
        </div>

        {/* Tab pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
          {FEATURES.map((f, i) => (
            <button
              key={f.title}
              onClick={() => setActive(i)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "10px 24px",
                borderRadius: 99,
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                transition: "all 0.25s ease",
                background: active === i ? "var(--teal)" : "rgba(1,61,71,0.05)",
                color: active === i ? "white" : "var(--teal)",
                border: active === i ? "2px solid transparent" : "2px solid rgba(1,61,71,0.12)",
                boxShadow: active === i ? "0 4px 20px rgba(1,61,71,0.25)" : "none",
              }}
            >
              {f.title}
            </button>
          ))}
        </div>

        {/* Feature panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 40,
              alignItems: "center",
              background: feat.gradient,
              borderRadius: 28,
              padding: "48px 48px 48px 52px",
              minHeight: 460,
              border: "1px solid rgba(1,61,71,0.06)",
            }}
          >
            {/* Left — text */}
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: feat.accent,
                  opacity: 0.75,
                  marginBottom: 14,
                }}
              >
                {feat.num}
              </p>
              <h3
                style={{
                  fontSize: "clamp(22px, 2.4vw, 32px)",
                  fontWeight: 800,
                  color: "var(--teal)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  marginBottom: 16,
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: feat.accent,
                  marginBottom: 14,
                  fontStyle: "italic",
                }}
              >
                {feat.tagline}
              </p>
              <p style={{ fontSize: 14, color: "#4A6065", lineHeight: 1.75, marginBottom: 28, maxWidth: 360 }}>
                {feat.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {feat.bullets.map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: feat.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#4A6065" }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual card */}
            <div
              style={{
                background: "rgba(255,255,255,0.6)",
                borderRadius: 20,
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                overflow: "hidden",
                minHeight: 380,
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.8)",
              }}
            >
              {VISUALS[active]}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {FEATURES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: active === i ? 28 : 8,
                height: 8,
                borderRadius: 99,
                background: active === i ? "var(--teal)" : "rgba(1,61,71,0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
              aria-label={`Feature ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
