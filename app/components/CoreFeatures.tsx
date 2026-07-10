"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  BookOpen,
  Wifi,
  Package,
  RefreshCw,
  Zap,
  GraduationCap,
  Ruler,
  Languages,
  Laptop,
  Leaf,
  Search,
  Sparkles,
  WifiOff,
  Store,
} from "lucide-react";

const FEATURES = [
  {
    num: "01",
    title: "Smart Lesson Builder",
    // Short label for the compact segmented control (icon + this text).
    tabLabel: "Lesson Builder",
    Icon: Sparkles,
    tagline: "Write lessons in minutes, not hours",
    description:
      "AI-powered curriculum builder aligned to WAEC and NECO standards. Generate quizzes, add diagrams, and publish instantly to all your students.",
    bullets: [
      "WAEC / NECO aligned templates",
      "AI-generated quiz questions",
      "Multimedia drag & drop",
      "One-click lesson export",
    ],
    // Subtle brand-tinted panel surface (soft gold wash), not a loud pastel.
    surface: "linear-gradient(160deg, rgba(170,133,46,0.06) 0%, rgba(240,238,230,0.5) 55%, #FFFFFF 100%)",
    accent: "var(--gold-dark)",
    // Faint chip tint behind the feature icon.
    chip: "rgba(170,133,46,0.12)",
  },
  {
    num: "02",
    title: "Offline-First Sync",
    tabLabel: "Offline Sync",
    Icon: WifiOff,
    tagline: "Works even when the network doesn't",
    description:
      // "CRDT" was engineer jargon on a student-facing bullet; the benefit is
      // that work is never lost, so say that instead.
      "Students keep learning during power outages and network drops. Their work saves locally and syncs automatically the moment they reconnect, nothing is ever lost.",
    bullets: [
      "Works on 2G & 3G networks",
      "< 50 MB installed size",
      "Never lose your work",
      "Budget device optimised",
    ],
    surface: "linear-gradient(160deg, rgba(2,79,94,0.06) 0%, rgba(240,238,230,0.5) 55%, #FFFFFF 100%)",
    accent: "var(--teal-mid)",
    chip: "rgba(2,79,94,0.12)",
  },
  {
    num: "03",
    title: "Creator Marketplace",
    tabLabel: "Marketplace",
    Icon: Store,
    tagline: "Build once. Earn from 50M students",
    description:
      "Publish curriculum-aligned courses, earn revenue, and reach every school across Nigeria. Get certified and grow your creator brand.",
    bullets: [
      "Revenue share model",
      "Certification badge",
      "Peer review system",
      "50K creators by 2030",
    ],
    surface: "linear-gradient(160deg, rgba(170,133,46,0.06) 0%, rgba(240,238,230,0.5) 55%, #FFFFFF 100%)",
    accent: "var(--gold-dark)",
    chip: "rgba(170,133,46,0.12)",
  },
];

// Shared surface styling for the mini "product screenshot" cards.
const cardStyle = {
  background: "white",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-soft)",
  boxShadow: "0 4px 20px rgba(1,61,71,0.05)",
} as const;

function LessonBuilderVisual() {
  return (
    <div className="lesson-builder-visual" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      <div style={{ ...cardStyle, padding: 18, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
        Write a{" "}
        <strong style={{ color: "var(--gold-dark)" }}>JSS2 lesson on photosynthesis</strong> with{" "}
        <strong style={{ color: "var(--gold-dark)" }}>diagrams and 5 quiz questions</strong> aligned to WAEC.
        <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--gold)" }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22 }}
            />
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 18, flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
          <BookOpen size={14} aria-hidden="true" /> Photosynthesis, JSS2
        </div>
        {["Introduction to photosynthesis", "Chlorophyll & light absorption", "WAEC-style diagrams (3)", "Quiz: 5 NECO questions"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
            <Check size={11} aria-hidden="true" style={{ color: "var(--gold)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Export PDF", "Share to class", "Add to WAEC bank"].map((label) => (
          <div
            key={label}
            style={{
              background: "rgba(1,61,71,0.06)",
              color: "var(--teal)",
              borderRadius: "var(--radius-sm)",
              padding: "7px 14px",
              fontSize: 11,
              fontWeight: 600,
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
    { label: "Teacher Hub", status: "online" },
    { label: "Student A", status: "online" },
    { label: "Student B", status: "offline" },
    { label: "Student C", status: "online" },
    { label: "Student D", status: "offline" },
  ];
  const stats = [
    { Icon: Wifi, val: "2G ready", label: "Min network" },
    { Icon: Package, val: "< 50 MB", label: "Install size" },
    { Icon: RefreshCw, val: "Auto-sync", label: "On reconnect" },
    { Icon: Zap, val: "Unlimited", label: "Offline time" },
  ];
  return (
    <div className="offline-sync-visual" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      <div style={{ ...cardStyle, padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)", marginBottom: 2 }}>Live sync status</div>
        {nodes.map((n) => {
          const online = n.status === "online";
          return (
            <div key={n.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{n.label}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 11px",
                  borderRadius: "var(--radius-pill)",
                  // On-brand teal / gold tints instead of off-brand green/amber.
                  background: online ? "rgba(2,79,94,0.10)" : "rgba(170,133,46,0.12)",
                  color: online ? "var(--teal-mid)" : "var(--gold-dark)",
                }}
              >
                {online ? "● Synced" : "○ Queued"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="offline-sync-stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map(({ Icon, val, label }) => (
          <div key={label} style={{ ...cardStyle, padding: "13px 15px" }}>
            <Icon size={17} aria-hidden="true" style={{ color: "var(--teal-mid)", marginBottom: 7 }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--teal)" }}>{val}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketplaceVisual() {
  const courses = [
    { title: "Photosynthesis Deep Dive", creator: "Mr. Bello", price: "₦2,500", Icon: Leaf },
    { title: "WAEC Maths Mastery", creator: "Mrs. Adaeze", price: "₦3,200", Icon: Ruler },
    { title: "Hausa Language Arts", creator: "Alhaji Musa", price: "₦1,800", Icon: Languages },
    { title: "Computer Basics JSS3", creator: "Engr. Tunde", price: "₦2,100", Icon: Laptop },
  ];
  return (
    <div className="marketplace-visual" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      <div style={{ ...cardStyle, padding: "11px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <Search size={13} aria-hidden="true" style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Search 10,000+ courses…</span>
      </div>

      <div className="marketplace-course-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
        {courses.map(({ title, creator, price, Icon }) => (
          <div
            key={title}
            style={{ ...cardStyle, padding: 14, cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(1,61,71,0.12)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(1,61,71,0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-sm)",
                background: "rgba(1,61,71,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Icon size={17} aria-hidden="true" style={{ color: "var(--teal)" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)", lineHeight: 1.3, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>{creator}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold-dark)" }}>{price}</div>
          </div>
        ))}
      </div>

      <div
        className="marketplace-creator-badge"
        style={{ ...cardStyle, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}
      >
        <GraduationCap size={22} aria-hidden="true" style={{ color: "var(--gold)", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)" }}>50K certified creators by 2030</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Join the waitlist today</div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: "var(--gold)",
            color: "var(--teal)",
            borderRadius: "var(--radius-sm)",
            padding: "7px 14px",
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const feat = FEATURES[active];

  const go = (i: number) => setActive((i + FEATURES.length) % FEATURES.length);

  // Arrow-key navigation between tabs, per the WAI-ARIA tabs pattern.
  const onTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = e.key === "ArrowRight" ? i + 1 : i - 1;
      const clamped = (next + FEATURES.length) % FEATURES.length;
      setActive(clamped);
      tabRefs.current[clamped]?.focus();
    }
  };

  return (
    <section id="features" className="core-features-section" style={{ padding: "96px 80px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44, maxWidth: 620, marginInline: "auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: 16,
              color: "var(--gold)",
            }}
          >
            Core Features
          </p>
          <h2
            className="core-features-heading"
            style={{
              fontSize: "clamp(32px, 3.5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "var(--teal)",
              marginBottom: 14,
              textWrap: "balance",
            }}
          >
            Built for Speed &amp; Nigeria
          </h2>
          <p className="core-features-subtitle" style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Everything you need to go from zero to a connected school.
          </p>
        </div>

        {/* Segmented control, rounded container with a sliding active pill (layoutId). */}
        <div
          className="core-features-tab-pills"
          role="tablist"
          aria-label="Core features"
          style={{
            // Block-level flex + fit-content + auto inline margins centers the
            // pill container while keeping its background hugging the segments.
            display: "flex",
            width: "fit-content",
            marginInline: "auto",
            gap: 4,
            marginBottom: 40,
            padding: 5,
            background: "var(--cream)",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-pill)",
            justifyContent: "center",
          }}
        >
          {FEATURES.map((f, i) => {
            const selected = active === i;
            const TabIcon = f.Icon;
            return (
              <button
                key={f.title}
                ref={(el) => { tabRefs.current[i] = el; }}
                id={`feature-tab-${i}`}
                role="tab"
                aria-selected={selected}
                aria-controls="feature-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className="core-features-tab-pill"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "0 22px",
                  minHeight: 44,
                  borderRadius: "var(--radius-pill)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  background: "transparent",
                  border: "none",
                  color: selected ? "white" : "var(--teal)",
                  transition: "color 0.25s ease",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Sliding active indicator sits behind the label. */}
                {selected && (
                  <motion.span
                    layoutId="core-features-active-pill"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "var(--radius-pill)",
                      background: "var(--teal)",
                      boxShadow: "0 6px 18px rgba(1,61,71,0.22)",
                      zIndex: 0,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <TabIcon
                  size={16}
                  aria-hidden="true"
                  style={{ position: "relative", zIndex: 1, flexShrink: 0, opacity: selected ? 1 : 0.7 }}
                />
                <span style={{ position: "relative", zIndex: 1, whiteSpace: "nowrap" }}>{f.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Feature panel, initial={false} so the first panel renders visible on
            mount (React 19 + Framer leaves initial-opacity:0 elements stuck
            otherwise); tab-switch cross-fades still animate normally. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            id="feature-panel"
            role="tabpanel"
            aria-labelledby={`feature-tab-${active}`}
            className="core-features-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 45) go(active + (dx < 0 ? 1 : -1));
              touchStartX.current = null;
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 48,
              alignItems: "center",
              background: feat.surface,
              borderRadius: "var(--radius-lg)",
              padding: "52px 52px 52px 56px",
              minHeight: 460,
              border: "1px solid var(--border)",
              boxShadow: "0 10px 40px rgba(1,61,71,0.08)",
            }}
          >
            {/* Left, text */}
            <div>
              {/* Icon chip + feature number. */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: feat.chip,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <feat.Icon size={22} aria-hidden="true" style={{ color: feat.accent }} />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: feat.accent,
                    opacity: 0.85,
                  }}
                >
                  {feat.num}, Feature
                </span>
              </div>

              <h3
                className="core-features-panel-heading"
                style={{
                  fontSize: "clamp(24px, 2.6vw, 34px)",
                  fontWeight: 800,
                  color: "var(--teal)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.12,
                  marginBottom: 10,
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: feat.accent,
                  marginBottom: 18,
                }}
              >
                {feat.tagline}
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 30, maxWidth: 380 }}>
                {feat.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {feat.bullets.map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "var(--radius-sm)",
                        background: feat.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={12} aria-hidden="true" style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right, visual card */}
            <div
              className="core-features-visual-card"
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "0 10px 40px rgba(1,61,71,0.08)",
                overflow: "hidden",
                minHeight: 380,
                backdropFilter: "blur(8px)",
                border: "1px solid var(--border-soft)",
              }}
            >
              {VISUALS[active]}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators, supplementary; 44px hit area around each 8px dot. */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 24 }}>
          {FEATURES.map((f, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show ${f.title}`}
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: active === i ? 28 : 8,
                  height: 8,
                  borderRadius: 10,
                  background: active === i ? "var(--teal)" : "rgba(1,61,71,0.18)",
                  transition: "all 0.3s ease",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
