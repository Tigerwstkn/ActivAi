import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gradeFromScore, type FoodResult } from "@/lib/foodScanner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

interface ScanRequest {
  // data URL: "data:image/jpeg;base64,...."
  image?: string;
}

const PROMPT = `You are a nutrition vision model. First decide whether the image actually shows food or drink that a person would eat.
Respond with JSON ONLY, no prose.
If it is NOT food or drink (e.g. a screenshot, object, person, scenery): {"isFood": false}
If it IS food or drink: {"isFood": true, "name": "<short dish name>", "emoji": "<one food emoji>", "calories": <int>, "protein": <grams int>, "carbs": <grams int>, "fat": <grams int>, "score": <0-100 health score int>, "tip": "<one short, encouraging coaching tip for a teen>"}`;

export async function POST(req: NextRequest) {
  let body: ScanRequest;
  try {
    body = (await req.json()) as ScanRequest;
  } catch {
    body = {};
  }

  const key = process.env.GEMINI_API_KEY;

  // Live mode but no key configured → be honest, don't fabricate a meal.
  if (!key) {
    return NextResponse.json({
      notConnected: true,
      message:
        "Live AI vision isn't connected. Add a free GEMINI_API_KEY (or use Demo mode) to analyze real photos.",
    });
  }

  if (!body.image) {
    return NextResponse.json({ error: true, message: "No image was received." });
  }

  const match = /^data:(.+?);base64,(.*)$/.exec(body.image);
  if (!match) {
    return NextResponse.json({ error: true, message: "That image format couldn't be read." });
  }
  const [, mimeType, data] = match;

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = (await Promise.race([
      model.generateContent([
        { text: PROMPT },
        { inlineData: { mimeType, data } },
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 9000)),
    ])) as Awaited<ReturnType<typeof model.generateContent>>;

    const text = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);

    // Gemini decided the photo isn't food.
    if (parsed.isFood === false) {
      return NextResponse.json({
        notFood: true,
        message: "I don't see any food in that photo — try snapping a meal or drink. 🍽️",
      });
    }

    const score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 70)));
    const food: FoodResult = {
      name: parsed.name ?? "Detected meal",
      emoji: parsed.emoji ?? "🍽️",
      calories: Math.round(parsed.calories ?? 0),
      protein: Math.round(parsed.protein ?? 0),
      carbs: Math.round(parsed.carbs ?? 0),
      fat: Math.round(parsed.fat ?? 0),
      score,
      grade: gradeFromScore(score),
      tip: parsed.tip ?? "Nice choice — balance it with protein and veg across the day.",
      source: "gemini",
    };
    return NextResponse.json(food);
  } catch {
    // Couldn't analyze — say so rather than inventing numbers.
    return NextResponse.json({
      error: true,
      message: "Couldn't analyze that image. Check your connection and try again.",
    });
  }
}
