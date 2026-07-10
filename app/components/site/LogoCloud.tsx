"use client";
import { useState } from "react";
import { Reveal } from "./Reveal";

// Real Nigerian education/standards logos. Drop more into public/logos/ and add
// them here; a missing file falls back to a neutral placeholder.
const LOGOS = [
  { name: "WAEC", src: "/logos/waec.png" },
  { name: "JAMB", src: "/logos/jamb.png" },
  { name: "NECO", src: "/logos/neco.jpg" },
  { name: "NDPR", src: "/logos/ndpr.jpg" },
];

function LogoCard({ name, src }: { name: string; src: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 150, height: 60, marginRight: 48, flexShrink: 0,
      }}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} onError={() => setOk(false)} style={{ maxHeight: 52, maxWidth: 130, objectFit: "contain" }} />
      ) : (
        <div aria-label={name} title={name} style={{ width: 110, height: 30, borderRadius: 6, background: "var(--gray-100)" }} />
      )}
    </div>
  );
}

export function LogoCloud() {
  // Repeat enough that one half of the track fills wide screens, then duplicate
  // for a seamless -50% loop.
  const half = [...LOGOS, ...LOGOS, ...LOGOS];
  const items = [...half, ...half];
  return (
    <section style={{ padding: "14px 0 48px", background: "var(--bg)" }}>
      <Reveal>
        <div className="marquee-mask">
          <div className="marquee-track">
            {items.map((l, i) => (
              <LogoCard key={`${l.name}-${i}`} name={l.name} src={l.src} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
