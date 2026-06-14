"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  Moon,
  Timer,
  Droplets,
  BedDouble,
  Sunrise,
  Sun,
  CheckCircle2,
  Circle,
  Zap,
  Battery,
  Brain,
  Flame,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard, fadeUp, staggerContainer } from "@/components/ui/GlassCard";
import { Toggle } from "@/components/ui/Toggle";
import { useStore } from "@/lib/store";
import { askCoach, getRecap } from "@/lib/coachClient";
import { FoodScanner } from "@/components/coach/FoodScanner";
import { TomorrowPlan } from "@/components/coach/TomorrowPlan";
import { SMART_REMINDERS, moodSuggestion } from "@/lib/fallbackCoach";
import { dietSummary } from "@/lib/dietPlan";
import type { CoachMessage, Mood } from "@/lib/types";
import { SEED_COACH_GREETING } from "@/lib/seed";

const REMINDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Moon,
  Timer,
  Droplets,
  BedDouble,
};

const MOODS: { key: Mood; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }[] = [
  { key: "energized", label: "Energized", icon: Zap, color: "#10B981" },
  { key: "tired", label: "Tired", icon: Battery, color: "#6366F1" },
  { key: "stressed", label: "Stressed", icon: Brain, color: "#EF4444" },
  { key: "motivated", label: "Motivated", icon: Flame, color: "#F97316" },
];

export default function CoachPage() {
  const today = useStore((s) => s.today);
  const missions = useStore((s) => s.missions);
  const toggleMission = useStore((s) => s.toggleMission);
  const demoMode = useStore((s) => s.demoMode);
  const setDemoMode = useStore((s) => s.setDemoMode);

  const [mood, setMood] = useState<Mood | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([
    { id: "g0", role: "coach", text: SEED_COACH_GREETING, ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recap, setRecapState] = useState<{ score: number; summary: string; tomorrow: string } | null>(null);
  const [loadingRecap, setLoadingRecap] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const foodLog = useStore((s) => s.foodLog);

  const ctx = {
    steps: today.steps,
    stepsGoal: today.stepsGoal,
    calories: today.calories,
    caloriesGoal: today.caloriesGoal,
    streak: today.streak,
    activeMinutes: today.activeMinutes,
    mood: mood ?? undefined,
    diet: dietSummary(foodLog),
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    const userMsg: CoachMessage = { id: `u${Date.now()}`, role: "user", text: trimmed, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    const { reply } = await askCoach(trimmed, ctx, demoMode);
    setMessages((m) => [...m, { id: `c${Date.now()}`, role: "coach", text: reply, ts: Date.now() }]);
    setThinking(false);
  }

  function pickMood(m: Mood) {
    setMood(m);
    const suggestion = moodSuggestion(m);
    setMessages((prev) => [
      ...prev,
      { id: `mu${Date.now()}`, role: "user", text: `I'm feeling ${m} today.`, ts: Date.now() },
      { id: `mc${Date.now()}`, role: "coach", text: suggestion, ts: Date.now() + 1 },
    ]);
  }

  async function buildRecap() {
    setLoadingRecap(true);
    const r = await getRecap(ctx, demoMode);
    setRecapState(r);
    setLoadingRecap(false);
  }

  const QUICK = ["Plan tomorrow's meals", "What should I eat?", "How's my streak?", "Help me sleep better"];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="AI Coach"
        subtitle="Your AI Coach. Your Fitness Ally."
        icon={Bot}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-2 ring-1 ring-white/10">
          <span className="text-xs font-medium text-muted">Demo mode</span>
          <Toggle checked={demoMode} onChange={setDemoMode} label="Demo mode" />
          <span
            className={`text-[10px] font-semibold ${demoMode ? "text-metric-active" : "text-brand-violet-soft"}`}
          >
            {demoMode ? "instant" : "live Gemini"}
          </span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Chat */}
        <div className="lg:col-span-7">
          <GlassCard strong className="flex h-[640px] flex-col p-0">
            {/* header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient">
                <Sparkles className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="text-sm font-semibold text-head">ACTIVAI Coach</p>
                <p className="text-xs text-metric-active">● Online · adapts to your stats &amp; mood</p>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-brand-gradient text-white"
                          : "glass text-slate-200"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {thinking && (
                <div className="flex justify-start">
                  <div className="glass flex items-center gap-1 rounded-2xl px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-brand-violet-soft"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* quick chips */}
            <div className="flex flex-wrap gap-2 px-5 pb-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="btn-ghost rounded-full px-3 py-1.5 text-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your coach anything…"
                className="flex-1 rounded-full bg-white/[0.04] px-4 py-2.5 text-sm text-head outline-none ring-1 ring-white/10 placeholder:text-hint focus:ring-brand-violet/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="btn-gradient grid h-10 w-10 place-items-center rounded-full disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="space-y-5 lg:col-span-5">
          {/* Mood check-in */}
          <GlassCard>
            <p className="mb-3 text-sm font-semibold text-head">How are you feeling?</p>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => pickMood(key)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs font-medium transition ${
                    mood === key
                      ? "bg-white/10 ring-1 ring-white/20"
                      : "bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                  style={mood === key ? { boxShadow: `0 0 24px -8px ${color}` } : undefined}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                  <span className="text-muted">{label}</span>
                </button>
              ))}
            </div>
            {mood && (
              <p className="mt-3 text-xs text-hint">
                Coach is now adapting suggestions to your <span className="text-brand-violet-soft">{mood}</span> mood.
              </p>
            )}
          </GlassCard>

          {/* Daily missions */}
          <GlassCard>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-head">Daily missions</p>
              <span className="text-xs text-hint">
                {missions.filter((m) => m.done).length}/{missions.length} done
              </span>
            </div>
            <div className="space-y-2.5">
              {missions.map((m) => {
                const pct = Math.min(100, Math.round((m.current / m.target) * 100));
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMission(m.id)}
                    className="group flex w-full items-center gap-3 rounded-xl bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.06]"
                  >
                    {m.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-metric-active" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-hint group-hover:text-muted" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${m.done ? "text-muted line-through" : "text-head"}`}>
                        {m.label}
                      </p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-brand-gradient"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.done ? 100 : pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Food Scanner + tailored next-day plan */}
      <div className="mt-5 space-y-5">
        <FoodScanner />
        <TomorrowPlan />
      </div>

      {/* Daily loop framing */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        <LoopCard icon={Sunrise} phase="Morning" title="Plan" accent="#F97316">
          Coach set your 4 missions and a 15k step target. Mood check-in done — energy looks good.
        </LoopCard>
        <LoopCard icon={Sun} phase="Daytime" title="Track" accent="#3B82F6">
          Live tracking your steps, calories &amp; active minutes. Smart nudges fire when you stall.
        </LoopCard>
        <LoopCard icon={Moon} phase="Nighttime" title="Recap + Score" accent="#6366F1">
          Wind-down summary with a daily score /100 and one focus for tomorrow.
        </LoopCard>
      </motion.div>

      {/* Smart reminders + Tonight's recap */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="mb-3 text-sm font-semibold text-head">Smart, context-aware reminders</p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {SMART_REMINDERS.map((r) => {
              const Icon = REMINDER_ICONS[r.icon] ?? Sparkles;
              return (
                <motion.div key={r.id} variants={fadeUp} className="glass flex gap-3 rounded-2xl p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-gradient-soft">
                    <Icon className="h-5 w-5 text-brand-violet-soft" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-head">{r.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{r.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Tonight's recap */}
        <div className="lg:col-span-5">
          <p className="mb-3 text-sm font-semibold text-head">Tonight&apos;s recap</p>
          <GlassCard strong glow className="relative overflow-hidden">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-violet/20 blur-3xl" />
            {recap ? (
              <div>
                <div className="flex items-center gap-4">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-gradient">
                    <div className="text-center leading-none">
                      <p className="text-2xl font-extrabold text-white">{recap.score}</p>
                      <p className="text-[10px] text-white/80">/ 100</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-head">Daily score</p>
                    <p className="text-xs text-muted">{recap.summary}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-white/[0.04] p-3">
                  <p className="text-xs font-semibold text-brand-violet-soft">Coach · for tomorrow</p>
                  <p className="mt-1 text-sm text-slate-200">{recap.tomorrow}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <Moon className="h-8 w-8 text-brand-violet-soft" />
                <p className="text-sm text-muted">
                  Generate tonight&apos;s wind-down summary and daily score.
                </p>
                <button
                  onClick={buildRecap}
                  disabled={loadingRecap}
                  className="btn-gradient rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
                >
                  {loadingRecap ? "Scoring your day…" : "Generate tonight's recap"}
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function LoopCard({
  icon: Icon,
  phase,
  title,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  phase: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} className="glass rounded-2xl p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${accent}22` }}>
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-hint">{phase}</p>
          <p className="text-sm font-bold text-head">{title}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted">{children}</p>
    </motion.div>
  );
}
