import { ESTIMATED_MEAL, type FoodResult } from "./foodScanner";

export type ScanOutcome =
  | { ok: true; food: FoodResult }
  | { ok: false; reason: "notfood" | "notconnected" | "error"; message: string };

// Analyze an uploaded meal photo.
// - Demo mode: instant labelled sample estimate (no real detection, no network).
// - Live mode: posts to /api/scan (Gemini Vision), which honestly reports
//   non-food images, a missing key, or errors. Never throws.
export async function scanFoodImage(
  imageDataUrl: string,
  demoMode: boolean
): Promise<ScanOutcome> {
  if (demoMode) {
    // Demo mode can't actually see the image — return a clearly-labelled sample.
    return { ok: true, food: { ...ESTIMATED_MEAL, source: "demo" } };
  }
  try {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });
    const data = await res.json();
    if (data?.notConnected) return { ok: false, reason: "notconnected", message: data.message };
    if (data?.notFood) return { ok: false, reason: "notfood", message: data.message };
    if (data?.error) return { ok: false, reason: "error", message: data.message };
    return { ok: true, food: data as FoodResult };
  } catch {
    return { ok: false, reason: "error", message: "Couldn't reach the AI. Try again." };
  }
}
