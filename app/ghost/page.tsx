"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Ghost,
  Footprints,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { GHOST_PAST_DAY, GHOST_TODAY, GHOST_HOURS } from "@/lib/seed";

const PAST_OPTIONS = ["Last Tuesday", "Last week's best", "7-day average"];

export default function GhostPage() {
  const [pastChoice, setPastChoice] = useState(PAST_OPTIONS[0]);

  // Scale the chosen "ghost" trace a bit so each option feels distinct.
  const factor = pastChoice === "Last week's best" ? 1.18 : pastChoice === "7-day average" ? 0.92 : 1;

  const data = useMemo(
    () =>
      GHOST_HOURS.map((h, i) => ({
        hour: h,
        You: GHOST_TODAY.trace[i],
        Ghost: Math.round(GHOST_PAST_DAY.trace[i] * factor),
      })),
    [factor]
  );

  const youNow = GHOST_TODAY.total;
  const ghostNow = Math.round(GHOST_PAST_DAY.total * factor);
  const gap = youNow - ghostNow;
  const ahead = gap >= 0;

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Ghost Mode" subtitle="Race against your past self." icon={Ghost} />

      {/* Past-self selector */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PAST_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setPastChoice(opt)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              pastChoice === opt ? "bg-white/10 text-head ring-1 ring-white/20" : "btn-ghost"
            }`}
          >
            <Ghost className="h-3.5 w-3.5" /> {opt}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Chart */}
        <GlassCard strong className="lg:col-span-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-head">Cumulative steps — you vs your ghost</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-brand-blue">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" /> You
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Ghost ({pastChoice})
              </span>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="youLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(14,20,36,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#F8FAFC",
                  }}
                  formatter={(v: number) => [`${v.toLocaleString()} steps`, ""]}
                />
                <Legend wrapperStyle={{ display: "none" }} />
                <Line
                  type="monotone"
                  dataKey="Ghost"
                  stroke="#94A3B8"
                  strokeWidth={2.5}
                  strokeDasharray="6 5"
                  dot={false}
                  isAnimationActive
                  animationDuration={1400}
                />
                <Line
                  type="monotone"
                  dataKey="You"
                  stroke="url(#youLine)"
                  strokeWidth={3.5}
                  dot={false}
                  isAnimationActive
                  animationDuration={1600}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Live status */}
        <div className="space-y-5 lg:col-span-4">
          <GlassCard strong glow className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-gradient shadow-glow-violet">
              <span className="text-3xl">{ahead ? "🏃" : "👻"}</span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-hint">
              {ahead ? "You're ahead" : "Ghost is ahead"}
            </p>
            <p className="mt-1 text-4xl font-extrabold text-gradient">
              {ahead ? "+" : "−"}
              <AnimatedNumber value={Math.abs(gap)} />
            </p>
            <p className="text-xs text-muted">steps {ahead ? "ahead of" : "behind"} your past self</p>
          </GlassCard>

          <GlassCard>
            <Row icon={Footprints} color="#3B82F6" label="You (now)" value={youNow} />
            <div className="my-2 h-px bg-white/[0.06]" />
            <Row icon={Ghost} color="#94A3B8" label={`Ghost (${pastChoice})`} value={ghostNow} />
          </GlassCard>

          <div className="glass flex items-center gap-3 rounded-2xl p-4">
            <Zap className="h-5 w-5 shrink-0 text-metric-active" />
            <p className="text-sm leading-relaxed text-slate-200">
              You&apos;re <span className="font-semibold text-gradient">{Math.abs(gap).toLocaleString()} steps {ahead ? "ahead" : "behind"}</span>{" "}
              {pastChoice === "Last Tuesday" ? "last Tuesday's you 👻" : "your ghost 👻"}
            </p>
          </div>
        </div>
      </div>

      {/* Pace summary */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Summary icon={TrendingUp} color="#10B981" label="Pace vs ghost" value={`${ahead ? "+" : "−"}${Math.round((Math.abs(gap) / ghostNow) * 100)}%`} sub="faster overall" />
        <Summary icon={Trophy} color="#F59E0B" label="Best gap today" value={`+${(gap + 280).toLocaleString()}`} sub="peak lead at 6pm" />
        <Summary icon={Footprints} color="#3B82F6" label="Projected finish" value={`${(youNow + 1800).toLocaleString()}`} sub="if you keep this pace" />
      </div>
    </div>
  );
}

function Row({ icon: Icon, color, label, value }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${color}22` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </span>
      <p className="flex-1 text-sm text-muted">{label}</p>
      <p className="text-lg font-bold text-head">{value.toLocaleString()}</p>
    </div>
  );
}

function Summary({ icon: Icon, color, label, value, sub }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; label: string; value: string; sub: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <p className="text-xs font-semibold uppercase tracking-wide text-hint">{label}</p>
      </div>
      <p className="text-2xl font-extrabold text-head">{value}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}
