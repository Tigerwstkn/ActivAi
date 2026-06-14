"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ScanLine,
  Camera,
  Sparkles,
  Flame,
  Drumstick,
  Wheat,
  Droplet,
  RotateCcw,
  Plus,
  Upload,
  ImageOff,
  PlugZap,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Toast } from "@/components/ui/Toast";
import { CameraCapture } from "@/components/coach/CameraCapture";
import { useStore } from "@/lib/store";
import { SAMPLE_FOODS, GRADE_COLOR, type FoodResult } from "@/lib/foodScanner";
import { scanFoodImage, type ScanOutcome } from "@/lib/scanClient";

type Phase = "idle" | "scanning" | "result";

export function FoodScanner() {
  const demoMode = useStore((s) => s.demoMode);
  const logFood = useStore((s) => s.logFood);
  const fileRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null); // data URL of upload
  const [emojiPreview, setEmojiPreview] = useState<string | null>(null); // sample emoji
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);
  const [toast, setToast] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  function reset() {
    setPhase("idle");
    setPreview(null);
    setEmojiPreview(null);
    setOutcome(null);
  }

  // Sample meal: always an instant canned analysis (pitch-safe).
  function scanSample(food: FoodResult) {
    setPreview(null);
    setEmojiPreview(food.emoji);
    setPhase("scanning");
    setTimeout(() => {
      setOutcome({ ok: true, food: { ...food, source: "demo" } });
      setPhase("result");
    }, 1700);
  }

  // Shared analysis for any captured/uploaded photo.
  // Demo → labelled sample; live → real Gemini Vision detection.
  async function analyze(dataUrl: string) {
    setEmojiPreview(null);
    setPreview(dataUrl);
    setPhase("scanning");
    const [res] = await Promise.all([
      scanFoodImage(dataUrl, demoMode),
      new Promise((r) => setTimeout(r, 1700)), // let the scan animation play
    ]);
    setOutcome(res);
    setPhase("result");
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => analyze(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-selecting the same file
  }

  const result = outcome?.ok ? outcome.food : null;

  return (
    <GlassCard strong className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient">
            <ScanLine className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-head">AI Food Scanner</p>
            <p className="text-xs text-hint">Snap a meal — get instant nutrition</p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            demoMode ? "bg-metric-active/15 text-metric-active" : "bg-brand-violet/20 text-brand-violet-soft"
          }`}
        >
          {demoMode ? "demo vision" : "live Gemini Vision"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Scan stage */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#05070f]">
          {/* preview layer */}
          {preview ? (
            <Image src={preview} alt="Meal to scan" fill className="object-cover" unoptimized />
          ) : emojiPreview ? (
            <div className="grid h-full w-full place-items-center text-[120px]">{emojiPreview}</div>
          ) : (
            <button
              onClick={() => setCameraOpen(true)}
              className="flex h-full w-full flex-col items-center justify-center gap-3 text-center transition hover:bg-white/[0.02]"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-gradient-soft">
                <Camera className="h-8 w-8 text-brand-violet-soft" />
              </span>
              <div>
                <p className="text-sm font-semibold text-head">Tap to scan with your camera</p>
                <p className="text-xs text-hint">upload a photo or pick a sample meal →</p>
              </div>
            </button>
          )}

          {/* scanning overlay */}
          <AnimatePresence>
            {phase === "scanning" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
              >
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-violet-soft to-transparent shadow-[0_0_20px_4px_rgba(139,92,246,0.7)]"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Sparkles className="h-7 w-7 animate-pulse text-brand-violet-soft" />
                  <p className="text-sm font-semibold text-head">Analyzing your meal…</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
        </div>

        {/* Results / controls */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {phase === "result" && outcome && !outcome.ok ? (
              <ScanMessage key="msg" outcome={outcome} onRetry={reset} />
            ) : phase === "result" && result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-head">
                      {result.emoji} {result.name}
                    </p>
                    <p className="text-xs text-hint">
                      {result.source === "gemini" ? "Detected by Gemini Vision" : "AI estimate"}
                    </p>
                  </div>
                  <div
                    className="grid h-12 w-12 place-items-center rounded-full text-xl font-extrabold text-white"
                    style={{ background: GRADE_COLOR[result.grade] }}
                    title={`Health score ${result.score}/100`}
                  >
                    {result.grade}
                  </div>
                </div>

                {/* Calories */}
                <div className="mt-3 flex items-baseline gap-2">
                  <Flame className="h-5 w-5 text-metric-calories" />
                  <span className="text-3xl font-extrabold text-gradient">
                    <AnimatedNumber value={result.calories} />
                  </span>
                  <span className="text-sm text-muted">kcal</span>
                </div>

                {/* Macros */}
                <div className="mt-3 space-y-2.5">
                  <Macro icon={Drumstick} color="#F97316" label="Protein" grams={result.protein} max={50} />
                  <Macro icon={Wheat} color="#3B82F6" label="Carbs" grams={result.carbs} max={100} />
                  <Macro icon={Droplet} color="#A78BFA" label="Fat" grams={result.fat} max={60} />
                </div>

                {/* Coach tip */}
                <div className="mt-3 flex gap-2 rounded-xl bg-white/[0.04] p-3">
                  <Sparkles className="h-4 w-4 shrink-0 text-brand-violet-soft" />
                  <p className="text-xs leading-relaxed text-slate-200">{result.tip}</p>
                </div>

                <div className="mt-auto flex gap-2 pt-3">
                  <button
                    onClick={() => {
                      if (result) logFood(result);
                      setToast(true);
                      setTimeout(() => setToast(false), 2800);
                    }}
                    className="btn-gradient flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold"
                  >
                    <Plus className="h-4 w-4" /> Log to food diary
                  </button>
                  <button onClick={reset} className="btn-ghost grid h-10 w-10 place-items-center rounded-full" aria-label="Scan another">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="samples"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col"
              >
                <p className="mb-2 text-sm font-semibold text-head">Try a sample meal</p>
                <div className="grid flex-1 grid-cols-3 gap-2">
                  {SAMPLE_FOODS.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => scanSample(f)}
                      disabled={phase === "scanning"}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/[0.03] p-2 text-center transition hover:bg-white/[0.06] disabled:opacity-50"
                    >
                      <span className="text-2xl">{f.emoji}</span>
                      <span className="text-[10px] leading-tight text-muted">{f.name}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setCameraOpen(true)}
                    disabled={phase === "scanning"}
                    className="btn-gradient flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" /> Take photo
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={phase === "scanning"}
                    className="btn-ghost flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" /> Upload
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {cameraOpen && (
          <CameraCapture
            onCapture={(dataUrl) => {
              setCameraOpen(false);
              analyze(dataUrl);
            }}
            onClose={() => setCameraOpen(false)}
            onUploadInstead={() => {
              setCameraOpen(false);
              fileRef.current?.click();
            }}
          />
        )}
      </AnimatePresence>

      <Toast show={toast} title="Logged 🍽️ — tomorrow's plan updated" body="Coach re-tailored tomorrow's meals to your intake." />
    </GlassCard>
  );
}

// Honest non-result state: photo isn't food, the live model isn't connected,
// or analysis failed. No fabricated calories.
function ScanMessage({
  outcome,
  onRetry,
}: {
  outcome: Extract<ScanOutcome, { ok: false }>;
  onRetry: () => void;
}) {
  const cfg = {
    notfood: { icon: ImageOff, color: "#F59E0B", title: "That's not food" },
    notconnected: { icon: PlugZap, color: "#8B5CF6", title: "AI vision not connected" },
    error: { icon: AlertCircle, color: "#EF4444", title: "Couldn't analyze that" },
  }[outcome.reason];
  const Icon = cfg.icon;

  return (
    <motion.div
      key="msg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center gap-3 py-6 text-center"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full" style={{ background: `${cfg.color}22` }}>
        <Icon className="h-7 w-7" style={{ color: cfg.color }} />
      </span>
      <p className="text-base font-bold text-head">{cfg.title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-muted">{outcome.message}</p>
      <button onClick={onRetry} className="btn-gradient mt-1 flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold">
        <RotateCcw className="h-4 w-4" /> Scan another
      </button>
    </motion.div>
  );
}

function Macro({
  icon: Icon,
  color,
  label,
  grams,
  max,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  grams: number;
  max: number;
}) {
  const pct = Math.min(100, (grams / max) * 100);
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <span className="w-14 text-xs text-muted">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-head">{grams}g</span>
    </div>
  );
}
