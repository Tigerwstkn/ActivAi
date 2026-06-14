"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  Users,
  Flag,
  Activity,
  Flame,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard, fadeUp, staggerContainer } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Avatar } from "@/components/ui/Avatar";
import { useStore } from "@/lib/store";
import { SEED_EVENT, SEED_EVENTS_LIST, SEED_FEED } from "@/lib/seed";

export default function EventsPage() {
  const eventCurrent = useStore((s) => s.eventCurrent);
  const userContribution = useStore((s) => s.eventUserContribution);

  const pct = Math.min(100, (eventCurrent / SEED_EVENT.goal) * 100);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Global Community Events" subtitle="Move better. Compete together. Become more." icon={Globe2} />

      {/* Collective challenge */}
      <GlassCard strong glow className="relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-metric-active/20 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-metric-heart">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-metric-heart" /> LIVE · {SEED_EVENT.endsLabel}
            </span>
            <h2 className="mt-1 text-xl font-bold text-head md:text-2xl">{SEED_EVENT.title}</h2>
          </div>
          <span className="text-4xl">🔥</span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <p className="text-3xl font-extrabold text-gradient md:text-4xl">
            <AnimatedNumber value={eventCurrent} />
            <span className="text-lg text-muted"> / {SEED_EVENT.goal.toLocaleString()} kcal</span>
          </p>
          <p className="text-lg font-bold text-head">{Math.round(pct)}%</p>
        </div>
        <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="relative h-full rounded-full bg-gradient-to-r from-metric-active via-brand-blue to-brand-violet"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>
        </div>

        {/* Your contribution */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <Avatar name="Alex Rivera" size={38} ring />
          <p className="flex-1 text-sm text-muted">Your contribution to the global goal</p>
          <p className="text-lg font-bold text-gradient">
            <AnimatedNumber value={userContribution} /> <span className="text-xs text-muted">kcal</span>
          </p>
        </div>
      </GlassCard>

      {/* Live stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <LiveStat icon={Users} color="#3B82F6" label="Active members" value={SEED_EVENT.members} />
        <LiveStat icon={Flag} color="#8B5CF6" label="Countries" value={SEED_EVENT.countries} />
        <LiveStat icon={Activity} color="#10B981" label="Workouts" value={SEED_EVENT.workouts} />
        <LiveStat icon={Flame} color="#F97316" label="kcal / min" value={1240} suffix=" now" />
      </motion.div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Community feed */}
        <div className="lg:col-span-7">
          <h2 className="mb-3 text-lg font-bold text-head">Community feed</h2>
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
            {SEED_FEED.map((f) => (
              <motion.div key={f.id} variants={fadeUp} className="glass flex items-center gap-3 rounded-2xl p-3.5">
                <Avatar name={f.user} size={40} />
                <div className="flex-1">
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-head">{f.user}</span> {f.text}
                  </p>
                </div>
                <span className="text-xs text-hint">{f.timeAgo}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Events list + AR mini card */}
        <div className="space-y-5 lg:col-span-5">
          <div>
            <h2 className="mb-3 text-lg font-bold text-head">Events</h2>
            <GlassCard className="space-y-2 p-3">
              {SEED_EVENTS_LIST.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                  <span className="text-2xl">{e.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-head">{e.title}</p>
                    <p className="text-xs text-hint">{e.when}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      e.status === "live"
                        ? "bg-metric-heart/20 text-metric-heart"
                        : e.status === "upcoming"
                        ? "bg-brand-blue/20 text-brand-blue"
                        : "bg-white/10 text-hint"
                    }`}
                  >
                    {e.status === "live" ? "LIVE" : e.status === "upcoming" ? "Soon" : "Ended"}
                  </span>
                </div>
              ))}
            </GlassCard>
          </div>

          {/* AR "capture points" mini-card (concept only) */}
          <GlassCard className="relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-brand-violet/20 blur-2xl" />
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-violet-soft" />
              <p className="text-sm font-semibold text-head">Capture Points</p>
              <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-hint">concept</span>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Walk to glowing checkpoints around your city to earn bonus XP. 3 points active near you today.
            </p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 rounded-xl bg-white/[0.04] p-2 text-center">
                  <MapPin className="mx-auto h-4 w-4 text-metric-active" />
                  <p className="mt-1 text-[11px] text-muted">{0.4 * i}km</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function LiveStat({ icon: Icon, color, label, value, suffix }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; label: string; value: number; suffix?: string }) {
  return (
    <motion.div variants={fadeUp} className="glass rounded-2xl p-4">
      <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${color}22` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </span>
      <p className="mt-2 text-2xl font-extrabold text-head">
        <AnimatedNumber value={value} />
        {suffix && <span className="text-sm font-medium text-muted">{suffix}</span>}
      </p>
      <p className="text-xs text-hint">{label}</p>
    </motion.div>
  );
}
