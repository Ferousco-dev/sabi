"use client";
import { CHIPS } from "@/app/data/content";

export function Marquee() {
  const doubled = [...CHIPS, ...CHIPS];

  return (
    <div className="max-w-[1400px] mx-auto mt-5">
      <div className="marquee-wrap">
        <div className="marquee-track py-2">
          {doubled.map((chip, i) => (
            <div
              key={i}
              className="group relative shrink-0 h-12 flex items-center justify-center rounded-full mx-2 px-6 transition-all cursor-default overflow-hidden"
              style={{
                background: "white",
                border: "1px solid rgba(1,61,71,0.1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                minWidth: 170,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: i % 2 === 0
                    ? "linear-gradient(135deg,rgba(1,61,71,0.08),rgba(170,133,46,0.12))"
                    : "linear-gradient(135deg,rgba(170,133,46,0.1),rgba(1,61,71,0.07))",
                }}
              />
              <span
                className="relative z-10 text-[12px] font-semibold whitespace-nowrap"
                style={{ color: "var(--teal)" }}
              >
                {chip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
