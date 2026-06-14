"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Star,
  Coins,
  Lock,
  Sunrise,
  CalendarCheck,
  Swords,
  TrendingUp,
  Sparkles,
  Gem,
  Footprints,
  Moon,
  Dumbbell,
  Tag,
  Droplets,
  Crown,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard, fadeUp, staggerContainer } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useStore } from "@/lib/store";
import { SEED_BADGES, SEED_REWARDS_STATE, SEED_CYCLE } from "@/lib/seed";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise, CalendarCheck, Swords, TrendingUp, Sparkles, Gem, Footprints, Moon,
  Dumbbell, Tag, Droplets, Crown,
};

export default function RewardsPage() {
  const xp = useStore((s) => s.xp);
  const points = useStore((s) => s.points);

  const xpPct = Math.min(
    100,
    Math.round(
      ((xp - SEED_REWARDS_STATE.xpLevelFloor) /
        (SEED_REWARDS_STATE.xpLevelCeil - SEED_REWARDS_STATE.xpLevelFloor)) *
        100
    )
  );
  const missionPct = Math.round((SEED_REWARDS_STATE.missionsDone / SEED_REWARDS_STATE.missionsGoal) * 100);
  const cyclePct = Math.round((SEED_CYCLE.daysElapsed / SEED_CYCLE.daysTotal) * 100);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Rewards" subtitle="Every move earns you more." icon={Gift} />

      {/* XP + points + next reward */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard strong className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient text-2xl font-extrabold text-white shadow-glow-violet">
                {SEED_REWARDS_STATE.level}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-hint">Level</p>
                <p className="text-lg font-bold text-head">Platinum Athlete</p>
              </div>
            </div>
            <div className="flex gap-6">
              <Stat icon={Star} color="#8B5CF6" label="Total XP" value={xp} />
              <Stat icon={Coins} color="#F59E0B" label="Points" value={points} />
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs text-muted">
              <span>Level {SEED_REWARDS_STATE.level}</span>
              <span>
                {xp.toLocaleString()} / {SEED_REWARDS_STATE.xpLevelCeil.toLocaleString()} XP → Level{" "}
                {SEED_REWARDS_STATE.level + 1}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Next reward */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold text-head">Next reward</p>
            <p className="mt-1 text-xs text-muted">Complete 20 missions to unlock a bonus chest</p>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-gradient">
              {SEED_REWARDS_STATE.missionsDone}/{SEED_REWARDS_STATE.missionsGoal}
            </p>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${missionPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="mt-2 text-xs text-hint">{SEED_REWARDS_STATE.missionsGoal - SEED_REWARDS_STATE.missionsDone} missions to go</p>
          </div>
        </GlassCard>
      </div>

      {/* Badges */}
      <h2 className="mb-3 mt-7 text-lg font-bold text-head">Badges</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {SEED_BADGES.map((b) => {
          const Icon = ICONS[b.icon] ?? Star;
          return (
            <motion.div
              key={b.id}
              variants={fadeUp}
              className={`relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center ${
                b.unlocked ? "glass" : "border border-dashed border-white/10 bg-white/[0.015]"
              }`}
            >
              <div
                className={`grid h-14 w-14 place-items-center rounded-full ${
                  b.unlocked ? "bg-brand-gradient shadow-glow-violet" : "bg-white/5"
                }`}
              >
                {b.unlocked ? (
                  <Icon className="h-7 w-7 text-white" />
                ) : (
                  <Lock className="h-6 w-6 text-hint" />
                )}
              </div>
              <p className={`text-xs font-semibold ${b.unlocked ? "text-head" : "text-hint"}`}>{b.name}</p>
              {!b.unlocked && b.hint && <p className="text-[10px] leading-tight text-hint">{b.hint}</p>}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Transformation Cycle */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-head">Transformation Cycle</h2>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <GlassCard strong className="lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-head">{SEED_CYCLE.cycleName}</p>
              <p className="text-xs text-muted">Real-life rewards every 2 months</p>
            </div>
            <span className="rounded-full bg-metric-active/15 px-3 py-1 text-xs font-semibold text-metric-active">
              +{SEED_CYCLE.improvement}% improved
            </span>
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex justify-between text-xs text-muted">
              <span>Day {SEED_CYCLE.daysElapsed}</span>
              <span>{SEED_CYCLE.daysTotal} days</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${cyclePct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {SEED_CYCLE.rewards.map((r) => {
              const Icon = ICONS[r.icon] ?? Gift;
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 rounded-xl p-3 ${
                    r.unlocked ? "bg-brand-gradient-soft ring-1 ring-white/10" : "bg-white/[0.03]"
                  }`}
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-lg ${r.unlocked ? "bg-brand-gradient" : "bg-white/5"}`}>
                    {r.unlocked ? <Icon className="h-5 w-5 text-white" /> : <Lock className="h-4 w-4 text-hint" />}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${r.unlocked ? "text-head" : "text-muted"}`}>{r.name}</p>
                    <p className="text-[11px] text-hint">Unlocks at +{r.need}% improvement</p>
                  </div>
                  {r.unlocked ? (
                    <button className="btn-gradient rounded-full px-3 py-1.5 text-xs font-semibold">Redeem</button>
                  ) : (
                    <Lock className="h-4 w-4 text-hint" />
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Before / After report */}
        <GlassCard className="lg:col-span-5">
          <p className="text-sm font-semibold text-head">Before → After report</p>
          <p className="text-xs text-muted">Last completed cycle</p>
          <div className="mt-4 space-y-3">
            <BeforeAfter label="Avg daily steps" before={SEED_CYCLE.before.avgSteps} after={SEED_CYCLE.after.avgSteps} good="up" />
            <BeforeAfter label="Resting heart rate" before={SEED_CYCLE.before.restingHr} after={SEED_CYCLE.after.restingHr} good="down" unit=" bpm" />
            <BeforeAfter label="Streak record" before={SEED_CYCLE.before.streakRecord} after={SEED_CYCLE.after.streakRecord} good="up" unit=" days" />
          </div>
          <div className="mt-4 rounded-xl bg-white/[0.04] p-3 text-xs text-muted">
            <span className="font-semibold text-gradient">Avg steps up 22%</span>, resting HR down 7 bpm, and a new
            12-day streak record. Keep it going! 🔥
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, color, label, value }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${color}22` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-hint">{label}</p>
        <p className="text-lg font-bold text-head">
          <AnimatedNumber value={value} />
        </p>
      </div>
    </div>
  );
}

function BeforeAfter({ label, before, after, good, unit = "" }: { label: string; before: number; after: number; good: "up" | "down"; unit?: string }) {
  const improved = good === "up" ? after > before : after < before;
  const delta = good === "up" ? Math.round(((after - before) / before) * 100) : Math.round(((before - after) / before) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <p className="text-xs text-hint">{label}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">{before.toLocaleString()}{unit}</span>
          <ArrowRight className="h-3.5 w-3.5 text-hint" />
          <span className="font-bold text-head">{after.toLocaleString()}{unit}</span>
        </div>
      </div>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${improved ? "bg-metric-active/15 text-metric-active" : "bg-metric-heart/15 text-metric-heart"}`}>
        {improved ? "▲" : "▼"} {delta}%
      </span>
    </div>
  );
}
