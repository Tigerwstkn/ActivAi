// AI Food Scanner — analyzes a meal photo and estimates nutrition.
//
// Like the coach, this is demo-first: sample meals and the no-key path return
// instant, realistic pre-written analyses (free, offline, pitch-safe). When a
// GEMINI_API_KEY is set and Demo mode is OFF, an uploaded photo is sent to
// Gemini Vision for a real estimate, with this fallback if anything fails.

export interface FoodResult {
  name: string;
  emoji: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  grade: "A" | "B" | "C" | "D";
  score: number; // 0..100 health score
  tip: string;
  source?: "demo" | "gemini" | "fallback";
}

export const SAMPLE_FOODS: FoodResult[] = [
  {
    name: "Grilled Chicken Salad",
    emoji: "🥗",
    calories: 420,
    protein: 38,
    carbs: 18,
    fat: 22,
    grade: "A",
    score: 92,
    tip: "Great protein-to-calorie ratio. Add a fist of brown rice if you're training hard today.",
  },
  {
    name: "Cheeseburger & Fries",
    emoji: "🍔",
    calories: 890,
    protein: 34,
    carbs: 78,
    fat: 48,
    grade: "C",
    score: 54,
    tip: "Tasty but heavy on fat. Swap fries for a side salad to halve the calories and feel lighter.",
  },
  {
    name: "Berry Smoothie Bowl",
    emoji: "🥣",
    calories: 340,
    protein: 12,
    carbs: 62,
    fat: 8,
    grade: "B",
    score: 78,
    tip: "Carb-forward and clean — perfect pre-workout fuel. Add Greek yogurt for more staying power.",
  },
  {
    name: "Chicken Pesto Pasta",
    emoji: "🍝",
    calories: 620,
    protein: 32,
    carbs: 84,
    fat: 18,
    grade: "B",
    score: 71,
    tip: "Solid recovery meal after a long session. Watch the portion if it's a rest day.",
  },
  {
    name: "Avocado Toast & Egg",
    emoji: "🥑",
    calories: 380,
    protein: 16,
    carbs: 34,
    fat: 20,
    grade: "B",
    score: 80,
    tip: "Balanced healthy fats and protein — a strong way to start the day.",
  },
  {
    name: "Salmon & Roasted Veg",
    emoji: "🐟",
    calories: 480,
    protein: 40,
    carbs: 22,
    fat: 26,
    grade: "A",
    score: 90,
    tip: "Omega-3s plus high protein. Excellent dinner for recovery and sleep quality.",
  },
];

// Demo-mode placeholder for an uploaded photo. Demo mode can't actually see the
// image, so this is a clearly-labelled sample — not real detection.
export const ESTIMATED_MEAL: FoodResult = {
  name: "Sample meal (demo)",
  emoji: "🍽️",
  calories: 540,
  protein: 26,
  carbs: 58,
  fat: 22,
  grade: "B",
  score: 74,
  tip: "Demo mode shows sample numbers — it doesn't read your photo. Turn Demo mode OFF (with a Gemini key) for real detection.",
};

// Seeded "today" diary so the diet planner is never empty on first load.
// Leans calorie- and fat-heavy (avocado toast + a burger) so tomorrow's plan
// visibly tailors itself to "go lighter" — a clean demo storyline.
export const SEED_FOOD_LOG: FoodResult[] = [
  { ...SAMPLE_FOODS[4], source: "demo" }, // Avocado Toast & Egg (breakfast)
  { ...SAMPLE_FOODS[1], source: "demo" }, // Cheeseburger & Fries (lunch)
];

export function gradeFromScore(score: number): FoodResult["grade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

export const GRADE_COLOR: Record<FoodResult["grade"], string> = {
  A: "#10B981",
  B: "#3B82F6",
  C: "#F59E0B",
  D: "#EF4444",
};
