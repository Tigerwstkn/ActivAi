"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Footprints,
  Flame,
  Heart,
  Moon,
  Timer,
  Sparkles,
  Trophy,
  Swords,
  Globe2,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { WatchMockup } from "@/components/WatchMockup";
import { MetricRingCard } from "@/components/dashboard/MetricRingCard";
import { GlassCard, staggerContainer, fadeUp } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Countdown } from "@/components/ui/Countdown";
import { Toast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { useStore, rankedLeaderboard } from "@/lib/store";
import { fallbackRecap } from "@/lib/fallbackCoach";
import { SEED_COACH_GREETING, SEED_EVENT } from "@/lib/seed";

export default function DashboardPage() {
  const today = useStore((s) => s.today);
  const leaderboard = useStore((s) => s.leaderboard);
  const eventCurrent = useStore((s) => s.eventCurrent);
  const teamScore = useStore((s) => s.teamScore);
  const simulateDay = useStore((s) => s.simulateDay);
  const stealRank = useStore((s) => s.stealRank);
  const setRecap = useStore((s) => s.setRecap);
  const lastRecap = useStore((s) => s.lastRecap);

  const [simulating, setSimulating] = useState(false);
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null);

  const ranked = rankedLeaderboard(leaderboard);
  const userRank = ranked.find((u) => u.isUser)?.rank ?? 7;

  const sleepH = Math.floor(today.sleepMinutes / 60);
  const sleepM = today.sleepMinutes % 60;
  const eventPct = Math.round((eventCurrent / SEED_EVENT.goal) * 100);

  function runSimulation() {
    if (simulating) return;
    setSimulating(true);

    // 1) Kick off the stat ramp immediately — rings + counters animate to new values.
    simulateDay();

    // 2) Mid-way, climb a rank with a celebratory toast.
    setTimeout(() => {
      const swapped = stealRank();
      if (swapped) {
        setToast({
          title: "You climbed a rank! 🚀",
          body: "Alex passed a rival on the leaderboard.",
        });
      }
    }, 1400);

    // 3) Post the AI coach recap.
    setTimeout(() => {
      const recap = fallbackRecap({
        steps: 15240,
        stepsGoal: 15000,
        streak: 6,
      });
      setRecap(recap);
    }, 1800);

    // 4) Finish.
    setTimeout(() => {
      setSimulating(false);
      setToast({
        title: "Day complete — 92/100 🔥",
        body: "Rings closed, streak extended, team + global goals advanced.",
      });
      setTimeout(() => setToast(null), 3800);
    }, 3000);
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm font-medium text-brand-violet-soft">
            Good morning, Alex 👋
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-head md:text-4xl">
            Your day, <span className="text-gradient">already in motion.</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            Move better. Compete together. Become more.
          </p>
        </div>

        <motion.button
          onClick={runSimulation}
          disabled={simulating}
          whileTap={{ scale: 0.97 }}
          className="btn-gradient flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-80 animate-pulse-glow"
        >
          <Zap className={`h-5 w-5 ${simulating ? "animate-spin" : ""}`} />
          {simulating ? "Simulating your day…" : "Simulate today's activity"}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Watch hero */}
        <GlassCard
          strong
          className="lg:col-span-4 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WatchMockup stats={today} />
        </GlassCard>

        {/* Today overview rings */}
        <div className="lg:col-span-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <MetricRingCard
              label="Steps"
              value={today.steps}
              goal={today.stepsGoal}
              color="gradient"
              icon={Footprints}
              gradientId="g-steps"
            />
            <MetricRingCard
              label="Calories"
              value={today.calories}
              goal={today.caloriesGoal}
              unit="kcal"
              color="#F97316"
              icon={Flame}
              gradientId="g-cal"
            />
            <MetricRingCard
              label="Active time"
              value={today.activeMinutes}
              goal={today.activeGoal}
              unit="min"
              color="#10B981"
              icon={Timer}
              gradientId="g-active"
            />
            <MetricRingCard
              label="Heart rate"
              value={today.heartRate}
              goal={1}
              unit="bpm"
              color="#EF4444"
              icon={Heart}
              gradientId="g-hr"
              display={`${today.heartRate}`}
            />
            <MetricRingCard
              label="Sleep"
              value={today.sleepMinutes}
              goal={480}
              color="#6366F1"
              icon={Moon}
              gradientId="g-sleep"
              display={`${sleepH}h ${sleepM}m`}
            />
            {/* Coach message of the day */}
            <motion.div
              variants={fadeUp}
              className="glass relative overflow-hidden rounded-2xl p-4 sm:col-span-2 xl:col-span-1"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-violet/20 blur-2xl" />
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient">
                  <Sparkles className="h-4 w-4 text-white" />
                </span>
                <p className="text-xs font-semibold text-brand-violet-soft">
                  Coach · today
                </p>
              </div>
              <p className="text-sm leading-relaxed text-slate-200">
                {lastRecap ? lastRecap.summary : SEED_COACH_GREETING}
              </p>
              <Link
                href="/coach"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
              >
                Open AI Coach <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Snapshot row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        {/* Leaderboard rank */}
        <SnapshotCard
          href="/leaderboard"
          icon={Trophy}
          tag="Leaderboard"
          accent="#3B82F6"
        >
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-gradient">
              #<AnimatedNumber value={userRank} duration={1} />
            </span>
            <span className="mb-1.5 text-sm text-muted">of {ranked.length} this week</span>
          </div>
          <p className="mt-1 text-xs text-metric-active">▲ Climbing — 1.25× streak bonus active</p>
          <div className="mt-3 flex -space-x-2">
            {ranked.slice(0, 5).map((u) => (
              <Avatar key={u.id} name={u.name} size={28} ring />
            ))}
          </div>
        </SnapshotCard>

        {/* Team battle */}
        <SnapshotCard
          href="/teams"
          icon={Swords}
          tag="Team Battle"
          accent="#8B5CF6"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-head">🐺 Team Alpha</span>
            <span className="text-sm text-hint">vs</span>
            <span className="text-lg font-bold text-muted">Team Nova ⚡</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-brand-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${(teamScore / (teamScore + 171340)) * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-metric-heart">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-metric-heart" />
            Battle ends in{" "}
            <Countdown className="font-mono tabular-nums text-head" />
          </p>
        </SnapshotCard>

        {/* Global event */}
        <SnapshotCard
          href="/events"
          icon={Globe2}
          tag="Global Event"
          accent="#10B981"
        >
          <p className="text-sm font-semibold text-head">Million Calorie Week</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-2xl font-extrabold text-gradient">
              <AnimatedNumber value={eventCurrent} />
            </span>
            <span className="mb-0.5 text-xs text-hint">/ 1,000,000 kcal</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-metric-active to-brand-blue"
              initial={{ width: 0 }}
              animate={{ width: `${eventPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">{eventPct}% of the community goal</p>
        </SnapshotCard>
      </motion.div>

      <Toast show={!!toast} title={toast?.title ?? ""} body={toast?.body} />
    </div>
  );
}

function SnapshotCard({
  href,
  icon: Icon,
  tag,
  accent,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  tag: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={href} className="block">
        <div className="glass group rounded-2xl p-5 transition hover:bg-white/[0.06]">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg"
              style={{ background: `${accent}22` }}
            >
              <Icon className="h-4 w-4" style={{ color: accent }} />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-hint">
              {tag}
            </p>
            <ArrowUpRight className="ml-auto h-4 w-4 text-hint transition group-hover:text-head" />
          </div>
          {children}
        </div>
      </Link>
    </motion.div>
  );
}
