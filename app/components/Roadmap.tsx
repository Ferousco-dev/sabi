"use client";
import { motion } from "framer-motion";
import { ROADMAP } from "@/app/data/content";

export function Roadmap() {
  return (
    <section className="py-24 px-6 md:px-20" style={{ background: "white" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-5" style={{ color: "var(--gold)" }}>
          Phased growth
        </p>
        <h2
          className="text-[30px] md:text-[46px] font-extrabold tracking-[-0.03em] leading-tight mb-16"
          style={{ color: "var(--teal)" }}
        >
          Maximum impact,{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
            built to last.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROADMAP.map((r, i) => (
            <motion.div
              key={r.phase}
              className="p-8 rounded-[20px] relative overflow-hidden"
              style={{
                background: i === 0 ? "var(--teal)" : "var(--cream)",
                border: i !== 0 ? "1px solid rgba(1,61,71,0.1)" : "none",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.14, duration: 0.6 }}
            >
              <div
                className="text-[10px] font-extrabold tracking-[0.16em] uppercase mb-1.5"
                style={{ color: "var(--gold)", opacity: 0.8 }}
              >
                {r.phase}
              </div>
              <div
                className="text-[30px] font-extrabold tracking-tight mb-1"
                style={{ color: i === 0 ? "white" : "var(--teal)" }}
              >
                {r.date}
              </div>
              <div
                className="text-[13px] font-semibold mb-3"
                style={{ color: i === 0 ? "rgba(255,255,255,0.5)" : "#6B7A7D" }}
              >
                {r.label}
              </div>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: i === 0 ? "rgba(255,255,255,0.5)" : "#4A6065" }}
              >
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
