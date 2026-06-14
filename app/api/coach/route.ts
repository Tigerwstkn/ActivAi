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
    "You are ACTIVAI's AI Coach — an upbeat, concise fitness coach for teens (ages 10-18).",
    "Give specific, actionable, encouraging guidance. Keep it warm but never preachy.",
    "Always be safe: never suggest extreme dieting, overtraining, or anything unsafe for a teen.",
    "Keep replies short (2-4 sentences) unless asked for a list.",
  ];
  if (ctx.steps != null)
    lines.push(
      `Current context — steps: ${ctx.steps}/${ctx.stepsGoal ?? 15000}, calories: ${
        ctx.calories ?? 0
      }/${ctx.caloriesGoal ?? 700} kcal, streak: ${ctx.streak ?? 0} days${
        ctx.mood ? `, mood: ${ctx.mood}` : ""
      }.`
    );
  if (ctx.mood)
    lines.push(
      `Adapt the suggestion to the user's mood (${ctx.mood}). If stressed or tired, lower the intensity.`
    );
  if (ctx.diet)
    lines.push(
      `Diet context — ${ctx.diet} Use this to give tailored nutrition advice and to recommend how tomorrow's meals should adjust to stay healthy.`
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
