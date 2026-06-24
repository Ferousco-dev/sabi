"use client";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { WordsPullUp } from "./ui/WordsPullUp";
import { PERSONAS } from "@/app/data/content";

const CREATOR_POINTS = ["Build courses", "Peer review", "Certification badge", "Monetise expertise"];

export function PersonaCards() {
  return (
    <section className="py-28 px-6 md:px-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-5" style={{ color: "var(--gold)" }}>
            One platform, five stakeholders
          </p>
          <h2 className="text-[30px] md:text-[46px] font-extrabold tracking-[-0.03em] leading-tight" style={{ color: "var(--teal)" }}>
            <WordsPullUp text="Studio-grade tools" />{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
              <WordsPullUp text="for every role." delay={0.22} />
            </span>
          </h2>
          <p className="mt-3 text-[14px]" style={{ color: "#6B7A7D" }}>
            Built for pure impact. Powered by community.
          </p>
        </div>

        {/* 4-col staggered grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PERSONAS.map((p, i) => (
            <motion.div
              key={p.role}
              className="relative rounded-[20px] overflow-hidden flex flex-col justify-between p-7"
              style={{ minHeight: 380, background: p.gradient, border: "1px solid rgba(1,61,71,0.07)" }}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.16em] uppercase mb-3" style={{ color: p.accent, opacity: 0.65 }}>
                  {p.num}
                </p>
                <h3 className="text-[19px] font-extrabold mb-2 leading-snug" style={{ color: "var(--teal)" }}>
                  {p.role}
                </h3>
                <p className="text-[13px] leading-snug mb-6" style={{ color: "#4A6065" }}>
                  {p.headline}
                </p>
              </div>
              <div className="space-y-2.5">
                {p.points.map(pt => (
                  <div key={pt} className="flex items-start gap-2">
                    <Check size={12} className="shrink-0 mt-0.5" style={{ color: p.accent }} />
                    <span className="text-[12px] leading-snug" style={{ color: "#4A6065" }}>{pt}</span>
                  </div>
                ))}
                <button className="mt-4 flex items-center gap-1.5 text-[12px] font-bold underline underline-offset-2" style={{ color: p.accent }}>
                  Learn more <ArrowRight size={11} style={{ transform: "rotate(-45deg)" }} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Creators — full width */}
        <motion.div
          className="mt-3 rounded-[20px] overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between p-8 md:p-12 gap-8"
          style={{ background: "var(--teal)" }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] uppercase mb-2" style={{ color: "var(--gold)", opacity: 0.75 }}>05</p>
            <h3 className="text-[24px] md:text-[34px] font-extrabold tracking-tight leading-tight text-white">Creators</h3>
            <p className="text-[14px] mt-2 max-w-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Build curriculum-aligned courses. Get certified. Earn revenue. Reach 50M students.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {CREATOR_POINTS.map(pt => (
              <div
                key={pt}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <Check size={11} style={{ color: "var(--gold)" }} /> {pt}
              </div>
            ))}
          </div>
          <button
            className="shrink-0 flex items-center gap-2 text-[13px] font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            style={{ background: "var(--gold)", color: "var(--teal)" }}
          >
            Become a creator <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
