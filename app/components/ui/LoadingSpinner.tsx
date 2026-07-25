"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

export function LoadingSpinner({
  size = 40,
  color = "var(--teal)",
  label,
}: LoadingSpinnerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <motion.div
        style={{
          width: size,
          height: size,
          border: `3px solid ${color}20`,
          borderTop: `3px solid ${color}`,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      {label && (
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--gray-500)", fontWeight: 500 }}>
          {label}
        </p>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LoadingSpinner size={44} label="Loading..." />
    </div>
  );
}
