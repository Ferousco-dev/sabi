"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-28 px-6 md:px-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[900px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-7" style={{ color: "var(--gold)" }}>
            Join the revolution
          </p>
          <h2
            className="text-[36px] md:text-[62px] font-extrabold tracking-[-0.03em] leading-[1.0] mb-6"
            style={{ color: "var(--teal)" }}
          >
            No Dey Dull —{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--gold)" }}>
              Learn Well-Well!
            </span>
          </h2>
          <p
            className="text-[15px] md:text-[17px] leading-relaxed mb-12 max-w-lg mx-auto"
            style={{ color: "#6B7A7D" }}
          >
            Pilot schools write to us now. Creators start building today. Every student in Nigeria deserves the chance to learn well-well.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="flex items-center gap-2 text-[14px] font-bold px-7 py-4 rounded-full hover:opacity-90 transition-opacity"
              style={{ background: "var(--teal)", color: "white" }}
            >
              Pilot your school <ArrowRight size={16} />
            </button>
            <button
              className="flex items-center gap-2 text-[14px] font-bold px-7 py-4 rounded-full hover:opacity-90 transition-opacity"
              style={{ background: "var(--gold)", color: "var(--teal)" }}
            >
              Become a creator <ArrowRight size={16} />
            </button>
            <a
              href="mailto:sabihub@omobile.world"
              className="flex items-center gap-2 text-[14px] font-semibold px-7 py-4 rounded-full transition-all"
              style={{ color: "var(--teal)", background: "white", border: "1px solid rgba(1,61,71,0.15)" }}
            >
              sabihub@omobile.world
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
