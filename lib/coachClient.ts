import {
  fallbackChat,
  fallbackMissions,
  fallbackRecap,
  type CoachContext,
} from "./fallbackCoach";

// Client helper for the coach. In demo mode it returns instant pre-written
// responses without any network call. Otherwise it calls /api/coach (which
// itself falls back gracefully). Either way this never throws.

export async function askCoach(
  message: string,
  ctx: CoachContext,
  demoMode: boolean
): Promise<{ reply: string; source: "demo" | "gemini" | "fallback" }> {
  if (demoMode) {
    return { reply: fallbackChat(message, ctx), source: "demo" };
  }
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "chat", message, context: ctx }),
    });
    const data = await res.json();
    return { reply: data.reply ?? fallbackChat(message, ctx), source: data.source ?? "fallback" };
  } catch {
    return { reply: fallbackChat(message, ctx), source: "fallback" };
  }
}

export async function getMissions(
  ctx: CoachContext,
  demoMode: boolean
): Promise<string[]> {
  if (demoMode) return fallbackMissions(ctx);
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "missions", context: ctx }),
    });
    const data = await res.json();
    return data.missions ?? fallbackMissions(ctx);
  } catch {
    return fallbackMissions(ctx);
  }
}

export async function getRecap(ctx: CoachContext, demoMode: boolean) {
  if (demoMode) return fallbackRecap(ctx);
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "recap", context: ctx }),
    });
    const data = await res.json();
    return data.recap ?? fallbackRecap(ctx);
  } catch {
    return fallbackRecap(ctx);
  }
}
