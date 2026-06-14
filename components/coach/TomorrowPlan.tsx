"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Sparkles,
  Flame,
  Drumstick,
  Wheat,
  Droplet,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useStore } from "@/lib/store";
import { computeTomorrowPlan, type Emphasis } from "@/lib/dietPlan";

const SLOT_ICON = { Breakfast: Sunrise, Lunch: Sun, Dinner: Moon } as const;

const EMPHASIS_STYLE: Record<Emphasis, { label: string; color: string }> = {
  lighter: { label: "Lighter day", color: "#10B981" },
  balanced: { label: "Balanced day", color: "#3B82F6" },
  fuel: { label: "Fuel-up day", color: "#F97316" },
};

export function TomorrowPlan() {
  const foodLog = useStore((s) => s.foodLog);
  const plan = useMemo(() => computeTomorrowPlan(foodLog), [foodLog]);
  const style = EMPHASIS_STYLE[plan.emphasis];
  const y = plan.yesterday;

  return (
    <GlassCard strong className="relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: `${style.color}22`, filter: "blur(40px)" }} />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient">
            <CalendarClock className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-head">Tomorrow, tailored to today</p>
            <p className="text-xs text-hint">Auto-adjusts to keep your diet healthy · rolls over at midnight</p>
          </div>
        </div>
        <motion.span
          key={plan.emphasis}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${style.color}22`, color: style.color }}
        >
          {style.label}
        </motion.span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Today summary + rationale */}
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-hint">Today so far</p>
          <div className="mt-2 flex items-baseline gap-2">
            <Flame className="h-5 w-5 text-metric-calories" />
            <span className="text-2xl font-extrabold text-head">
              <AnimatedNumber value={y.calories} />
            </span>
            <span className="text-sm text-muted">kcal · {y.fatPct}% from fat</span>
          </div>
          <div className="mt-3 flex gap-2 text-[11px]">
            <MacroPill icon={Drumstick} color="#F97316" label="P" g={y.protein} />
            <MacroPill icon={Wheat} color="#3B82F6" label="C" g={y.carbs} />
            <MacroPill icon={Droplet} color="#A78BFA" label="F" g={y.fat} />
          </div>

          <motion.div
            key={plan.rationale}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-2 rounded-xl bg-white/[0.04] p-3"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-brand-violet-soft" />
            <div>
              <p className="text-sm font-semibold text-head">{plan.headline}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{plan.rationale}</p>
            </div>
          </motion.div>
        </div>

        {/* Tomorrow's meals */}
        <div className="lg:col-span-7">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-hint">Recommended for tomorrow</p>
            <p className="text-xs text-muted">
              Target <span className="font-bold text-gradient"><AnimatedNumber value={plan.targetCalories} /></span> kcal
            </p>
          </div>
          <div className="space-y-2">
            {plan.meals.map((m, i) => {
              const Icon = SLOT_ICON[m.slot];
              return (
                <motion.div
                  key={`${plan.emphasis}-${m.slot}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05]">
                    <Icon className="h-4 w-4 text-brand-violet-soft" />
                  </span>
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-hint">{m.slot}</p>
                    <p className="truncate text-sm font-medium text-head">{m.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-muted">{m.kcal} kcal</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function MacroPill({
  icon: Icon,
  color,
  label,
  g,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  g: number;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1 font-semibold text-head">
      <Icon className="h-3 w-3" style={{ color }} />
      {label} {g}g
    </span>
  );
}
