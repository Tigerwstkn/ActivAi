"use client";

import { motion } from "framer-motion";
import { Ring } from "@/components/ui/Ring";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { fadeUp } from "@/components/ui/GlassCard";

export function MetricRingCard({
  label,
  value,
  goal,
  unit,
  color,
  icon: Icon,
  gradientId,
  decimals = 0,
  display,
}: {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  gradientId: string;
  decimals?: number;
  display?: string; // override the big number (e.g. "7h 45m")
}) {
  const pct = goal > 0 ? value / goal : 0;
  return (
    <motion.div
      variants={fadeUp}
      className="glass flex items-center gap-4 rounded-2xl p-4"
    >
      <Ring progress={pct} size={84} stroke={9} color={color} gradientId={gradientId}>
        <Icon className="h-5 w-5" style={{ color: color === "gradient" ? "#A78BFA" : color }} />
      </Ring>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-hint">{label}</p>
        <p className="text-xl font-bold text-head">
          {display ? (
            display
          ) : (
            <AnimatedNumber value={value} decimals={decimals} />
          )}
          {unit && <span className="ml-1 text-sm font-medium text-muted">{unit}</span>}
        </p>
        {goal > 1 && (
          <p className="text-xs text-hint">
            of {goal.toLocaleString()} {unit ?? ""} · {Math.round(pct * 100)}%
          </p>
        )}
      </div>
    </motion.div>
  );
}
