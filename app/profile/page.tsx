"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Flame,
  Star,
  Trophy,
  Sunrise,
  CalendarCheck,
  Swords,
  TrendingUp,
  Sparkles,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard, fadeUp, staggerContainer } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Avatar } from "@/components/ui/Avatar";
import { useStore } from "@/lib/store";
import { SEED_WEEK, SEED_MONTH, SEED_BADGES } from "@/lib/seed";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise, CalendarCheck, Swords, TrendingUp, Sparkles,
};

type Metric = "steps" | "calories" | "sleep";
type Range = "Week" | "Month";

const METRICS: { key: Metric; label: string; color: string }[] = [
  { key: "steps", label: "Steps", color: "#3B82F6" },
  { key: "calories", label: "Calories", color: "#F97316" },
  { key: "sleep", label: "Sleep", color: "#6366F1" },
];

const TIMELINE = [
  { date: "Today", title: "Reached a 5-day streak", icon: Flame, color: "#F97316" },
  { date: "2 days ago", title: "Earned 'Rank Stealer' badge", icon: Swords, color: "#8B5CF6" },
  { date: "This week", title: "New step PR — 15,600", icon: TrendingUp, color: "#10B981" },
  { date: "Last week", title: "Hit Level 12 — Platinum Athlete", icon: Star, color: "#3B82F6" },
  { date: "2 weeks ago", title: "Joined Team Alpha", icon: Trophy, color: "#F59E0B" },
];

export default function ProfilePage() {
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.today.streak);
  const [metric, setMetric] = useState<Metric>("steps");
  const [range, setRange] = useState<Range>("Week");

  const data = range === "Week" ? SEED_WEEK : SEED_MONTH;
  const color = METRICS.find((m) => m.key === metric)!.color;
  const unlocked = SEED_BADGES.filter((b) => b.unlocked);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Profile & Progress" subtitle="Your journey, measured." icon={User} />

      {/* Profile header */}
      <GlassCard strong className="relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-violet/20 blur-3xl" />
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name="Alex Rivera" size={84} ring />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-head">Alex Rivera 🇵🇭</h2>
            <p className="text-sm text-muted">Level 12 · Platinum Athlete · Team Alpha 🐺</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip icon={Flame} color="#F97316" text={`${streak}-day streak`} />
              <Chip icon={Star} color="#8B5CF6" text={`${xp.toLocaleString()} XP`} />
              <Chip icon={Award} color="#10B981" text={`${unlocked.length} badges`} />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stat strip */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total XP" value={xp} color="#8B5CF6" />
        <StatCard label="Current streak" value={streak} suffix=" days" color="#F97316" />
        <StatCard label="Workouts" value={186} color="#10B981" />
        <StatCard label="Global rank" value={7} prefix="#" color="#3B82F6" />
      </motion.div>

      {/* Trend chart */}
      <div className="mt-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-head">Progress over time</h2>
          <div className="flex gap-2">
            <div className="flex gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    metric === m.key ? "bg-white/10 text-head" : "text-muted hover:text-head"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10">
              {(["Week", "Month"] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    range === r ? "bg-white/10 text-head" : "text-muted hover:text-head"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <GlassCard strong>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {range === "Week" ? (
                <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{ background: "rgba(14,20,36,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#F8FAFC" }}
                  />
                  <Bar dataKey={metric} fill="url(#barGrad)" radius={[6, 6, 0, 0]} animationDuration={1200} />
                </BarChart>
              ) : (
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} interval={4} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "rgba(14,20,36,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#F8FAFC" }}
                  />
                  <Area type="monotone" dataKey={metric} stroke={color} strokeWidth={2.5} fill="url(#areaGrad)" animationDuration={1400} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Badges + timeline */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="mb-3 text-lg font-bold text-head">Badge showcase</h2>
          <GlassCard>
            <div className="grid grid-cols-3 gap-3">
              {unlocked.map((b) => {
                const Icon = ICONS[b.icon] ?? Star;
                return (
                  <div key={b.id} className="flex flex-col items-center gap-1.5 text-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient shadow-glow-violet">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-[11px] font-medium text-muted">{b.name}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-7">
          <h2 className="mb-3 text-lg font-bold text-head">Achievements timeline</h2>
          <GlassCard>
            <div className="relative space-y-4 pl-4">
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex items-center gap-3"
                >
                  <span
                    className="absolute -left-4 grid h-4 w-4 place-items-center rounded-full ring-4 ring-ink"
                    style={{ background: t.color }}
                  />
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: `${t.color}22` }}>
                    <t.icon className="h-4 w-4" style={{ color: t.color }} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-head">{t.title}</p>
                    <p className="text-xs text-hint">{t.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon: Icon, color, text }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-head">
      <Icon className="h-3.5 w-3.5" style={{ color }} /> {text}
    </span>
  );
}

function StatCard({ label, value, color, prefix = "", suffix = "" }: { label: string; value: number; color: string; prefix?: string; suffix?: string }) {
  return (
    <motion.div variants={fadeUp} className="glass rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-hint">{label}</p>
      <p className="mt-1 text-2xl font-extrabold" style={{ color }}>
        {prefix}
        <AnimatedNumber value={value} />
        {suffix}
      </p>
    </motion.div>
  );
}
