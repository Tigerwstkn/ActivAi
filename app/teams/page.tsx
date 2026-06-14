"use client";

import { motion } from "framer-motion";
import {
  Swords,
  Crown,
  Megaphone,
  Activity,
  User as UserIcon,
  Salad,
  Footprints,
  Flame,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard, fadeUp, staggerContainer } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Countdown } from "@/components/ui/Countdown";
import { Avatar } from "@/components/ui/Avatar";
import { useStore } from "@/lib/store";
import { SEED_TEAMS, SEED_YEARLY_TEAMS } from "@/lib/seed";
import type { TeamMember } from "@/lib/types";

const ROLE_ICON: Record<TeamMember["role"], React.ComponentType<{ className?: string }>> = {
  Leader: Crown,
  Motivator: Megaphone,
  Tracker: Activity,
  Member: UserIcon,
};
const ROLE_COLOR: Record<TeamMember["role"], string> = {
  Leader: "#F59E0B",
  Motivator: "#8B5CF6",
  Tracker: "#10B981",
  Member: "#64748B",
};

export default function TeamsPage() {
  const teamScore = useStore((s) => s.teamScore);
  const teamContribution = useStore((s) => s.teamContribution);

  const alpha = { ...SEED_TEAMS[0], score: teamScore };
  const nova = SEED_TEAMS[1];
  const total = alpha.score + nova.score;
  const alphaPct = (alpha.score / total) * 100;

  const categories = [
    { key: "dietScore", label: "Diet", icon: Salad, color: "#10B981" },
    { key: "stepsScore", label: "Steps", icon: Footprints, color: "#3B82F6" },
    { key: "caloriesScore", label: "Calories", icon: Flame, color: "#F97316" },
  ] as const;

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Team Battles" subtitle="Stronger together. Healthier forever." icon={Swords} />

      {/* Monthly battle */}
      <GlassCard strong glow className="overflow-hidden">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-hint">Monthly Battle</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-metric-heart">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-metric-heart" />
            Ends in <Countdown className="font-mono tabular-nums text-head" />
          </span>
        </div>

        <div className="my-4 flex items-center justify-between">
          <TeamBanner logo={alpha.logo} name={alpha.name} score={alpha.score} color={alpha.color} align="left" />
          <span className="text-3xl font-extrabold text-gradient">VS</span>
          <TeamBanner logo={nova.logo} name={nova.name} score={nova.score} color={nova.color} align="right" />
        </div>

        {/* Split progress bar */}
        <div className="relative h-5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="absolute left-0 top-0 h-full"
            style={{ background: "linear-gradient(90deg,#3B82F6,#60A5FA)" }}
            initial={{ width: 0 }}
            animate={{ width: `${alphaPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full"
            style={{ background: "linear-gradient(90deg,#A78BFA,#8B5CF6)" }}
            initial={{ width: 0 }}
            animate={{ width: `${100 - alphaPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow">
            {Math.round(alphaPct)}% · {Math.round(100 - alphaPct)}%
          </div>
        </div>

        {/* Your contribution */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <Avatar name="Alex Rivera" size={40} ring />
          <div className="flex-1">
            <p className="text-sm font-semibold text-head">Your contribution to Team Alpha</p>
            <p className="text-xs text-muted">Motivator · keeping the squad fired up</p>
          </div>
          <p className="text-lg font-bold text-gradient">
            <AnimatedNumber value={teamContribution} /> <span className="text-xs text-muted">pts</span>
          </p>
        </div>
      </GlassCard>

      {/* Rosters */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[alpha, nova].map((team) => (
          <GlassCard key={team.id}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">{team.logo}</span>
              <p className="text-sm font-bold text-head">{team.name}</p>
              <span className="ml-auto text-xs text-hint">{team.members.length} members</span>
            </div>
            <div className="space-y-2">
              {team.members.map((m) => {
                const RoleIcon = ROLE_ICON[m.role];
                return (
                  <div key={m.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5">
                    <Avatar name={m.name} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-head">{m.name}</p>
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold"
                        style={{ color: ROLE_COLOR[m.role] }}
                      >
                        <RoleIcon className="h-3 w-3" /> {m.role}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-muted">{m.contribution.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Weekly category leaders */}
      <h2 className="mb-3 mt-7 text-lg font-bold text-head">Weekly team performance</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {categories.map((cat) => {
          const aVal = alpha[cat.key];
          const nVal = nova[cat.key];
          const leader = aVal >= nVal ? alpha : nova;
          return (
            <motion.div key={cat.key} variants={fadeUp} className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${cat.color}22` }}>
                  <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                </span>
                <p className="text-sm font-semibold text-head">{cat.label}</p>
                <span className="ml-auto text-[11px] font-semibold text-metric-active">
                  {leader.logo} leads
                </span>
              </div>
              <Bar label={alpha.name} value={aVal} color={alpha.color} max={100} />
              <div className="h-2" />
              <Bar label={nova.name} value={nVal} color={nova.color} max={100} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Yearly rankings */}
      <h2 className="mb-3 mt-7 flex items-center gap-2 text-lg font-bold text-head">
        <Calendar className="h-5 w-5 text-brand-violet-soft" /> Yearly rankings
      </h2>
      <GlassCard className="p-0">
        <div className="divide-y divide-white/[0.06]">
          {SEED_YEARLY_TEAMS.map((t) => (
            <div key={t.rank} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`w-7 text-center text-lg font-extrabold ${
                  t.rank === 1 ? "text-amber-300" : t.rank === 2 ? "text-slate-300" : t.rank === 3 ? "text-orange-400" : "text-hint"
                }`}
              >
                {t.rank}
              </span>
              <span className="text-xl">{t.logo}</span>
              <p className="flex-1 text-sm font-semibold text-head">{t.name}</p>
              <span className="text-xs text-hint">{t.wins} wins</span>
              <p className="w-28 text-right text-sm font-bold text-muted">{t.points.toLocaleString()} pts</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function TeamBanner({
  logo,
  name,
  score,
  color,
  align,
}: {
  logo: string;
  name: string;
  score: number;
  color: string;
  align: "left" | "right";
}) {
  return (
    <div className={`flex flex-col ${align === "right" ? "items-end" : "items-start"}`}>
      <span className="text-3xl">{logo}</span>
      <p className="mt-1 text-sm font-bold text-head">{name}</p>
      <p className="text-xl font-extrabold" style={{ color }}>
        <AnimatedNumber value={score} />
      </p>
    </div>
  );
}

function Bar({ label, value, color, max }: { label: string; value: number; color: string; max: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-muted">
        <span>{label}</span>
        <span className="font-semibold text-head">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
