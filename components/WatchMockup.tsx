"use client";

import { motion } from "framer-motion";
import { Heart, Footprints, Flame, Moon } from "lucide-react";
import { LogoMark } from "./Logo";
import type { TodayStats } from "@/lib/types";

// Concentric activity rings (Apple-Fitness style): steps / calories / active.
function TripleRing({ stats }: { stats: TodayStats }) {
  const rings = [
    { p: stats.steps / stats.stepsGoal, color: "#3B82F6", r: 62 },
    { p: stats.calories / stats.caloriesGoal, color: "#F97316", r: 49 },
    { p: stats.activeMinutes / stats.activeGoal, color: "#10B981", r: 36 },
  ];
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
      {rings.map((ring, i) => {
        const c = 2 * Math.PI * ring.r;
        const p = Math.max(0, Math.min(1, ring.p));
        return (
          <g key={i}>
            <circle
              cx="75"
              cy="75"
              r={ring.r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="9"
            />
            <motion.circle
              cx="75"
              cy="75"
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: c - c * p }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function WatchMockup({ stats }: { stats: TodayStats }) {
  const sleepH = Math.floor(stats.sleepMinutes / 60);
  const sleepM = stats.sleepMinutes % 60;

  return (
    <div className="flex flex-col items-center">
      {/* Watch body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Side buttons */}
        <div className="absolute -right-1.5 top-16 h-12 w-1.5 rounded-r-md bg-gradient-to-b from-slate-500 to-slate-700" />
        <div className="absolute -right-1.5 top-32 h-7 w-1.5 rounded-r-md bg-slate-600" />

        <div className="relative h-[280px] w-[232px] rounded-[54px] bg-gradient-to-b from-slate-800 to-black p-[10px] shadow-2xl ring-1 ring-white/10">
          {/* Screen */}
          <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[46px] bg-[#05070f] px-4 py-5">
            {/* glow */}
            <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-brand-violet/30 blur-3xl" />

            {/* Top row: time + logo */}
            <div className="flex w-full items-center justify-between">
              <span className="text-2xl font-bold tracking-tight text-white">10:09</span>
              <LogoMark size={20} />
            </div>

            {/* Rings */}
            <div className="relative">
              <TripleRing stats={stats} />
              <div className="absolute inset-0 grid place-items-center">
                <Heart className="h-6 w-6 text-metric-heart animate-pulse-glow" fill="currentColor" />
              </div>
            </div>

            {/* Readouts */}
            <div className="grid w-full grid-cols-2 gap-1.5 text-[11px]">
              <Readout icon={Footprints} color="#3B82F6" label={stats.steps.toLocaleString()} sub="steps" />
              <Readout icon={Flame} color="#F97316" label={`${stats.calories}`} sub="kcal" />
              <Readout icon={Heart} color="#EF4444" label={`${stats.heartRate}`} sub="bpm" />
              <Readout icon={Moon} color="#6366F1" label={`${sleepH}h ${sleepM}m`} sub="sleep" />
            </div>
          </div>
        </div>
      </motion.div>
      <p className="mt-4 text-center text-xs text-hint">
        ACTIVAI Watch · the product hero
      </p>
    </div>
  );
}

function Readout({
  icon: Icon,
  color,
  label,
  sub,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2 py-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
      <div className="leading-none">
        <p className="font-bold text-white">{label}</p>
        <p className="text-[9px] text-slate-400">{sub}</p>
      </div>
    </div>
  );
}
