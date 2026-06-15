import { ESTIMATED_MEAL, type FoodResult } from "./foodScanner";

export type ScanOutcome =
  | { ok: true; food: FoodResult }
  | { ok: false; reason: "notfood" | "notconnected" | "error"; message: string };

// Phone/laptop cameras produce ~12MP photos. Sent raw as base64 they can blow
// past Vercel's request size limit and Gemini's processing window, which surfaces
// as "Couldn't analyze that image". Gemini only needs ~1024px for food, so we
// downscale + recompress in the browser first. Falls back to the original on
// any failure (e.g. an exotic image format the canvas can't decode).
function downscaleImage(
  dataUrl: string,
  maxDim = 1024,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}

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
    const compact = await downscaleImage(imageDataUrl);
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: compact }),
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
