"use client";

import { motion } from "framer-motion";

interface RingProps {
  progress: number; // 0..1
  size?: number;
  stroke?: number;
  color?: string; // solid color or "gradient"
  trackColor?: string;
  children?: React.ReactNode;
  delay?: number;
  gradientId?: string;
}

// Animated circular progress ring. Pass color="gradient" for the brand fill.
export function Ring({
  progress,
  size = 120,
  stroke = 12,
  color = "gradient",
  trackColor = "rgba(255,255,255,0.08)",
  children,
  delay = 0,
  gradientId = "ring-brand",
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const dash = c * clamped;
  const isGradient = color === "gradient";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={isGradient ? `url(#${gradientId})` : color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}
