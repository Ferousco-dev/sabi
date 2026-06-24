"use client";
import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Smart Lesson Builder",
    gradient: "radial-gradient(circle at 50% 0%, #FFD97A 0%, #FFF4CC 35%, #F0EEE6 65%, #F0EEE6 100%)",
    visual: (
      <div className="absolute top-6 left-5 right-5">
        <div
          className="bg-white rounded-xl p-4 shadow-sm text-[12px] leading-relaxed"
          style={{ color: "#475569" }}
        >
          Write a{" "}
          <span className="font-semibold" style={{ color: "#92620A" }}>JSS2 lesson on photosynthesis</span>{" "}
          with{" "}
          <span className="font-semibold" style={{ color: "#92620A" }}>diagrams and 5 quiz questions</span>{" "}
          aligned to WAEC.
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div
            className="bg-white border border-black/10 rounded-full px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm"
            style={{ color: "#1e293b" }}
          >
            <span style={{ color: "#a855f7", fontSize: "1rem" }}>✦</span> Add NECO objectives
          </div>
          <svg className="w-5 h-5 drop-shadow" viewBox="0 0 24 24" fill="#0D1F23">
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
      <div className="absolute inset-0 bottom-14 flex items-center justify-center px-4 pt-4">
        <img
          src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg"
          alt="sync network diagram"
          className="w-full h-40 object-contain"
          onError={e => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </div>
    ),
  },
  {
    title: "Creator Marketplace",
    gradient: "radial-gradient(circle at 50% 0%, #DDD4F5 0%, #EDE9FA 35%, #F0EEE6 65%, #F0EEE6 100%)",
    visual: (
      <div className="absolute inset-0 bottom-14 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)",
            backgroundSize: "16px 16px",
            maskImage: "radial-gradient(circle at center top, black 0%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at center top, black 0%, transparent 80%)",
          }}
        />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl">🎓</div>
          <div
            className="text-[11px] font-semibold rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.85)", color: "#533BAF" }}
          >
            50K creators by 2030
          </div>
        </div>
        <div className="absolute top-[148px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-black/10 rounded-full px-4 py-2 shadow-md whitespace-nowrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[12px] font-medium" style={{ color: "#1e293b" }}>Search courses</span>
        </div>
      </div>
    ),
  },
];

export function CoreFeatures() {
  return (
    <section className="py-24 px-6 md:px-20" style={{ background: "white" }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-4"
            style={{
              background: "linear-gradient(90deg,#AA852E,#013D47,#AA852E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Core Features
          </p>
          <h2
            className="text-[36px] md:text-[46px] font-extrabold tracking-[-0.03em] leading-tight mb-3"
            style={{ color: "#0f172a" }}
          >
            Built for Speed & Nigeria
          </h2>
          <p className="text-[17px] leading-relaxed" style={{ color: "#64748b" }}>
            Everything you need to go<br />from zero to a connected school.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="relative overflow-hidden flex flex-col justify-end text-left"
              style={{ borderRadius: 20, height: 340, background: feat.gradient, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {feat.visual}
              <h3 className="relative z-10 text-[16px] font-bold px-6 pb-6 pt-4" style={{ color: "#1e293b" }}>
                {feat.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
