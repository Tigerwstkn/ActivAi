import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  fallbackChat,
  fallbackMissions,
  fallbackRecap,
  type CoachContext,
} from "@/lib/fallbackCoach";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CoachKind = "chat" | "missions" | "recap";

interface CoachRequest {
  kind: CoachKind;
  message?: string;
  context?: CoachContext;
}

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function systemInstruction(ctx: CoachContext): string {
  const lines = [
    "You are ACTIVAI's AI Coach — a friendly, easy-going companion for teens (ages 10-18) who happens to specialize in fitness, nutrition and wellbeing.",
    "Talk like a real person texting a friend: relaxed, warm, genuine, and a little playful. Use natural language and the occasional emoji when it fits.",
    "Answer whatever the user actually asks — including casual, off-topic, or just-for-fun questions (pop culture, games, random thoughts, venting). Engage with the real topic honestly and conversationally first.",
    "Do NOT force fitness into every reply. Only bring up their steps, streak, meals or goals when it's genuinely relevant or they ask about it — otherwise just have a normal conversation. A reply with zero fitness talk is completely fine.",
    "Match the length to the question: a quick reply for small talk, more detail when they want help. Don't pad answers or end every message with a pep talk.",
    "Stay safe and supportive: never encourage extreme dieting, overtraining, or anything unsafe or harmful for a teen, and gently steer away from clearly inappropriate topics.",
  ];
  const ctxBits: string[] = [];
  if (ctx.steps != null)
    ctxBits.push(
      `steps ${ctx.steps}/${ctx.stepsGoal ?? 15000}, calories ${ctx.calories ?? 0}/${
        ctx.caloriesGoal ?? 700
      } kcal, streak ${ctx.streak ?? 0} days${ctx.mood ? `, mood ${ctx.mood}` : ""}`
    );
  if (ctx.diet) ctxBits.push(`today's meals: ${ctx.diet}`);
  if (ctxBits.length)
    lines.push(
      `For reference only (mention it just when it's relevant) — ${ctxBits.join("; ")}.`
    );
  if (ctx.mood)
    lines.push(
      `The user is feeling ${ctx.mood}. Read the room: if they're stressed or tired and ask for activity, dial the intensity down.`
    );
  return lines.join(" ");
}

// Always-succeeds fallback so the UI is identical with or without Gemini.
function fallbackResponse(body: CoachRequest) {
  const ctx = body.context ?? {};
  if (body.kind === "missions")
    return { source: "fallback", missions: fallbackMissions(ctx) };
  if (body.kind === "recap")
    return { source: "fallback", recap: fallbackRecap(ctx) };
  return { source: "fallback", reply: fallbackChat(body.message ?? "", ctx) };
}

export async function POST(req: NextRequest) {
  let body: CoachRequest;
  try {
    body = (await req.json()) as CoachRequest;
  } catch {
    body = { kind: "chat" };
  }

  const key = process.env.GEMINI_API_KEY;

  // No key configured → instant pre-written response (the safe default).
  if (!key) {
    return NextResponse.json(fallbackResponse(body));
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemInstruction(body.context ?? {}),
    });

    // Race the model against a timeout so a slow network can never stall the pitch.
    const prompt =
      body.kind === "missions"
        ? "Generate exactly 4 short daily fitness missions for today as a plain list, one per line, no numbering or extra text. Each should be concrete and measurable (e.g. 'Walk 8,000 steps')."
        : body.kind === "recap"
        ? "Write a short end-of-day recap. Return JSON only: {\"score\": <0-100 integer>, \"summary\": \"<1 sentence>\", \"tomorrow\": \"<1 sentence suggestion>\"}."
        : body.message || "Give me a quick coaching tip for right now.";

    const result = (await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      ),
    ])) as Awaited<ReturnType<typeof model.generateContent>>;

    const text = result.response.text().trim();

    if (body.kind === "missions") {
      const missions = text
        .split("\n")
        .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 4);
      return NextResponse.json({
        source: "gemini",
        missions: missions.length ? missions : fallbackMissions(body.context ?? {}),
      });
    }

    if (body.kind === "recap") {
      try {
        const json = JSON.parse(text.replace(/```json|```/g, "").trim());
        return NextResponse.json({ source: "gemini", recap: json });
      } catch {
        return NextResponse.json({
          source: "fallback",
          recap: fallbackRecap(body.context ?? {}),
        });
      }
    }

    return NextResponse.json({ source: "gemini", reply: text });
  } catch {
    // Any error → graceful fallback. Never surface a raw error to the user.
    return NextResponse.json(fallbackResponse(body));
  }
}
