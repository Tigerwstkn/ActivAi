import type { Mood } from "./types";

// Pre-written, realistic coach responses. These power Demo mode and act as the
// instant fallback whenever Gemini is missing, slow, or errors — the UI is
// identical either way, so the live pitch can never break.

export interface CoachContext {
  steps?: number;
  stepsGoal?: number;
  calories?: number;
  caloriesGoal?: number;
  streak?: number;
  mood?: Mood;
  activeMinutes?: number;
  diet?: string; // summary of today's food log + tomorrow's tailored focus
}

const moodLine: Record<Mood, string> = {
  energized:
    "You're buzzing with energy today — let's channel it into a strong tempo session. Push the pace on your next walk.",
  tired:
    "You're running low today, and that's okay. Let's keep it light: a 10-minute mobility flow and an early wind-down beats forcing a hard session.",
  stressed:
    "Stressed? Let's lower the intensity. Try a calm 15-minute walk with slow breathing — movement is the fastest way to reset your nervous system.",
  motivated:
    "Love the fire 🔥 Let's use it: chase a step PR today and close every ring. You've got a clear shot at the top of your group.",
};

export function fallbackChat(message: string, ctx: CoachContext): string {
  const m = message.toLowerCase();
  const steps = ctx.steps ?? 0;
  const goal = ctx.stepsGoal ?? 15000;
  const left = Math.max(0, goal - steps);
  const streak = ctx.streak ?? 0;

  if (ctx.mood && (m.includes("feel") || m.includes("mood") || m.length < 4)) {
    return moodLine[ctx.mood];
  }
  if (m.includes("tired") || m.includes("rest")) return moodLine.tired;
  if (m.includes("stress") || m.includes("anx")) return moodLine.stressed;
  if (m.includes("tomorrow") || m.includes("plan tomorrow"))
    return ctx.diet
      ? `Based on what you logged today, ${ctx.diet} I've already lined up tomorrow's meals on your plan card below the scanner.`
      : "Log a meal in the food scanner and I'll tailor tomorrow's plan to keep your diet on track.";
  if (m.includes("water") || m.includes("hydrat"))
    return "Good call — aim for a glass now and one with each meal. Hydration keeps your heart rate lower and recovery faster.";
  if (m.includes("sleep") || m.includes("tired by") || m.includes("bed"))
    return "Wind down 45 minutes before bed: screens off, lights low. Sleeping by 11pm tonight protects tomorrow's streak and your recovery score.";
  if (m.includes("step") || m.includes("walk"))
    return `You're at ${steps.toLocaleString()} steps — just ${left.toLocaleString()} to hit ${goal.toLocaleString()}. A brisk 18-minute walk closes the gap. Want me to start a quick challenge?`;
  if (m.includes("eat") || m.includes("diet") || m.includes("food") || m.includes("meal"))
    return ctx.diet
      ? `${ctx.diet} Build each plate around protein + colour — lean protein, a fist of carbs, two handfuls of veg.`
      : "Build the plate around protein + colour: lean protein, a fist of carbs, and two handfuls of veg. It keeps energy steady so you move more without crashing.";
  if (m.includes("workout") || m.includes("train") || m.includes("exercise"))
    return "Let's do a 20-minute circuit: 3 rounds of squats, push-ups, and a 2-minute brisk walk between. Short, sharp, and it'll close your active ring.";
  if (m.includes("streak"))
    return `Your ${streak}-day streak is a real asset — consistency is the multiplier that climbs the leaderboard. One light session today keeps it alive.`;

  // Generic upbeat, specific, actionable
  return `You're at ${steps.toLocaleString()}/${goal.toLocaleString()} steps with a ${streak}-day streak going. Let's bank an easy win: a 15-minute walk now, hydrate, then we'll plan tomorrow. Small moves, big momentum. 💪`;
}

export function fallbackMissions(ctx: CoachContext): string[] {
  const goal = ctx.stepsGoal ?? 15000;
  return [
    `Walk ${goal.toLocaleString()} steps`,
    `Burn ${(ctx.caloriesGoal ?? 700).toLocaleString()} kcal`,
    "Hit 90 active minutes",
    "Sleep by 11:00 pm",
  ];
}

export function fallbackRecap(ctx: CoachContext): {
  score: number;
  summary: string;
  tomorrow: string;
} {
  const steps = ctx.steps ?? 15240;
  const goal = ctx.stepsGoal ?? 15000;
  const pct = Math.min(100, Math.round((steps / goal) * 100));
  const score = Math.min(100, 60 + Math.round(pct * 0.4));
  return {
    score,
    summary: `Big day, Alex — ${steps.toLocaleString()} steps (${pct}% of goal), all rings closed, and you extended your streak. Recovery is trending up too.`,
    tomorrow:
      "Tomorrow: start with a 10-minute morning walk to bank early steps, and aim to be in bed by 11 to protect your recovery score.",
  };
}

// Smart, context-aware reminder cards rendered by the coach.
export const SMART_REMINDERS = [
  {
    id: "rem1",
    icon: "Moon",
    tone: "sleep",
    title: "You slept a little late",
    body: "Keep today lighter — a brisk walk over a hard session. We'll go big tomorrow.",
  },
  {
    id: "rem2",
    icon: "Timer",
    tone: "active",
    title: "You haven't moved in 3 hours",
    body: "Quick 5-minute challenge: 50 steps + 10 squats. Want me to start it?",
  },
  {
    id: "rem3",
    icon: "Droplets",
    tone: "hydrate",
    title: "Time to hydrate",
    body: "A glass of water now keeps your heart rate steady through the afternoon.",
  },
  {
    id: "rem4",
    icon: "BedDouble",
    tone: "winddown",
    title: "Wind down soon",
    body: "Aim to sleep by 11pm to protect your streak and recovery score.",
  },
] as const;

export function moodSuggestion(mood: Mood): string {
  return moodLine[mood];
}
