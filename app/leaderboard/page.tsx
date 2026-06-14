"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Swords,
  TrendingUp,
  Sparkles,
  Crown,
  Footprints,
  Zap,
  Dumbbell,
  X,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar } from "@/components/ui/Avatar";
import { Toast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";
import type { LeaderboardUser } from "@/lib/types";

type Tab = "Global" | "Friends" | "Groups";
type SortKey = "score" | "steps" | "calories" | "workouts" | "improved" | "consistency";

const TABS: Tab[] = ["Global", "Friends", "Groups"];
const SORTS: { key: SortKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "score", label: "This Week", icon: Trophy },
  { key: "steps", label: "Steps", icon: Footprints },
  { key: "calories", label: "Calories", icon: Flame },
  { key: "workouts", label: "Workouts", icon: Dumbbell },
  { key: "improved", label: "Most Improved", icon: Sparkles },
  { key: "consistency", label: "Most Consistent", icon: TrendingUp },
];

const BADGE_STYLE: Record<string, string> = {
  "Rank Stealer": "bg-brand-violet/20 text-brand-violet-soft",
  "Top Challenger": "bg-blue-500/20 text-blue-300",
  "Most Improved": "bg-emerald-500/20 text-emerald-300",
  "Most Consistent": "bg-cyan-500/20 text-cyan-300",
  "Diet King": "bg-amber-500/20 text-amber-300",
  "Diet Queen": "bg-pink-500/20 text-pink-300",
};

export default function LeaderboardPage() {
  const leaderboard = useStore((s) => s.leaderboard);
  const stealRank = useStore((s) => s.stealRank);

  const [tab, setTab] = useState<Tab>("Global");
  const [sort, setSort] = useState<SortKey>("score");
  const [climbing, setClimbing] = useState(true); // initial "climb on load" animation
  const [duelOpen, setDuelOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null);

  // On mount, the user is shown one rank lower, then climbs into place.
  useEffect(() => {
    const t = setTimeout(() => setClimbing(false), 900);
    return () => clearTimeout(t);
  }, []);

  // Filter dataset by tab (Friends/Groups show a subset to feel distinct).
  const dataset = useMemo(() => {
    if (tab === "Friends") return leaderboard.filter((_, i) => i % 2 === 0 || leaderboard[i].isUser);
    if (tab === "Groups") return leaderboard.slice(2, 10);
    return leaderboard;
  }, [tab, leaderboard]);

  const sorted = useMemo(() => {
    const arr = [...dataset];
    arr.sort((a, b) => {
      let av = a[sort] as number;
      let bv = b[sort] as number;
      // initial climb: temporarily depress the user's sort value by a touch
      if (climbing && sort === "score") {
        if (a.isUser) av -= 400;
        if (b.isUser) bv -= 400;
      }
      return bv - av;
    });
    return arr.map((u, i) => ({ ...u, rank: i + 1 }));
  }, [dataset, sort, climbing]);

  const userRow = sorted.find((u) => u.isUser);
  const userIdx = sorted.findIndex((u) => u.isUser);
  const rival = userIdx > 0 ? sorted[userIdx - 1] : null;

  function unitFor(u: LeaderboardUser): string {
    switch (sort) {
      case "steps":
        return `${u.steps.toLocaleString()} steps`;
      case "calories":
        return `${u.calories.toLocaleString()} kcal`;
      case "workouts":
        return `${u.workouts} workouts`;
      case "improved":
        return `+${u.improved}% improved`;
      case "consistency":
        return `${u.consistency}% consistent`;
      default:
        return `${u.score.toLocaleString()} pts`;
    }
  }

  function resolveDuel() {
    const swapped = stealRank();
    setDuelOpen(false);
    if (swapped) {
      setSort("score");
      setClimbing(false);
      setToast({
        title: "Rank stolen! 🗡️",
        body: rival ? `You overtook ${rival.name}.` : "You climbed a rank.",
      });
      setTimeout(() => setToast(null), 3600);
    }
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader title="Leaderboard" subtitle="Compete together. Climb faster." icon={Trophy}>
        {rival && (
          <button
            onClick={() => setDuelOpen(true)}
            className="btn-gradient flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
          >
            <Swords className="h-4 w-4" />
            Challenge {rival.name.split(" ")[0]}
          </button>
        )}
      </PageHeader>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t ? "text-head" : "text-muted hover:text-head"
            }`}
          >
            {tab === t && (
              <motion.span
                layoutId="lb-tab"
                className="absolute inset-0 rounded-full bg-brand-gradient-soft ring-1 ring-white/10"
              />
            )}
            <span className="relative z-10">{t}</span>
          </button>
        ))}
      </div>

      {/* Sort chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {SORTS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              sort === key
                ? "bg-white/10 text-head ring-1 ring-white/20"
                : "btn-ghost"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence>
          {sorted.map((u) => (
            <motion.div
              key={u.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ layout: { type: "spring", stiffness: 420, damping: 34 } }}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                u.isUser
                  ? "border-brand-violet/40 bg-brand-gradient-soft animate-pulse-glow"
                  : "border-white/[0.06] bg-white/[0.03]"
              }`}
            >
              <div
                className={`w-8 text-center text-lg font-extrabold ${
                  u.rank === 1
                    ? "text-amber-300"
                    : u.rank === 2
                    ? "text-slate-300"
                    : u.rank === 3
                    ? "text-orange-400"
                    : "text-hint"
                }`}
              >
                {u.rank}
              </div>
              <Avatar name={u.name} size={42} ring={u.isUser} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-head">
                    {u.name} <span className="ml-0.5">{u.country}</span>
                  </p>
                  {u.isUser && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-head">
                      YOU
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  {u.badges.map((b) => (
                    <span
                      key={b}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        BADGE_STYLE[b] ?? "bg-white/10 text-muted"
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-[11px] text-orange-300">
                    <Flame className="h-3 w-3" /> {u.streak}d
                  </span>
                  {u.multiplier > 1 && (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-metric-active">
                      <Zap className="h-3 w-3" /> {u.multiplier}×
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-head">{unitFor(u)}</p>
                {sort !== "score" && (
                  <p className="text-[11px] text-hint">{u.score.toLocaleString()} pts</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Duel modal */}
      <AnimatePresence>
        {duelOpen && rival && userRow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setDuelOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-lg rounded-3xl p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Swords className="h-5 w-5 text-brand-violet-soft" />
                  <h2 className="text-lg font-bold text-head">Rivalry Mode — Duel</h2>
                </div>
                <button onClick={() => setDuelOpen(false)} aria-label="Close" className="text-hint hover:text-head">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <DuelSide name="You" who={userRow} highlight />
                <span className="text-2xl font-extrabold text-gradient">VS</span>
                <DuelSide name={rival.name.split(" ")[0]} who={rival} />
              </div>

              <div className="mt-5 space-y-2">
                <DuelStat label="Steps" a={userRow.steps} b={rival.steps} fmt={(n) => n.toLocaleString()} />
                <DuelStat label="Calories" a={userRow.calories} b={rival.calories} fmt={(n) => `${n}`} />
                <DuelStat label="Workouts" a={userRow.workouts} b={rival.workouts} fmt={(n) => `${n}`} />
              </div>

              <button
                onClick={resolveDuel}
                className="btn-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold"
              >
                <Crown className="h-4 w-4" />
                Win the duel &amp; steal rank #{rival.rank}
              </button>
              <p className="mt-2 text-center text-xs text-hint">
                Beat your rival&apos;s stats to take their spot.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast show={!!toast} title={toast?.title ?? ""} body={toast?.body} />
    </div>
  );
}

function DuelSide({ name, who, highlight }: { name: string; who: LeaderboardUser & { rank?: number }; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center rounded-2xl p-4 ${highlight ? "bg-brand-gradient-soft ring-1 ring-white/15" : "bg-white/[0.04]"}`}>
      <Avatar name={who.name} size={56} ring />
      <p className="mt-2 text-sm font-semibold text-head">{name}</p>
      <p className="text-xs text-hint">{who.score.toLocaleString()} pts</p>
    </div>
  );
}

function DuelStat({ label, a, b, fmt }: { label: string; a: number; b: number; fmt: (n: number) => string }) {
  const aWins = a >= b;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2 text-sm">
      <span className={`flex items-center justify-end gap-1 font-semibold ${aWins ? "text-metric-active" : "text-muted"}`}>
        {aWins && <Check className="h-3.5 w-3.5" />} {fmt(a)}
      </span>
      <span className="text-xs uppercase tracking-wide text-hint">{label}</span>
      <span className={`flex items-center gap-1 font-semibold ${!aWins ? "text-metric-active" : "text-muted"}`}>
        {!aWins && <Check className="h-3.5 w-3.5" />} {fmt(b)}
      </span>
    </div>
  );
}
