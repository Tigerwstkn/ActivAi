import type { FoodResult } from "./foodScanner";

// Tomorrow's nutrition is tailored to what was logged today: total intake and
// macro balance decide whether tomorrow should go lighter & protein-forward,
// stay balanced, or fuel up. This is deterministic and instant (no API), so it
// reacts the moment a meal is logged — perfect for a fast live demo.

export type Emphasis = "lighter" | "balanced" | "fuel";

export interface PlannedMeal {
  slot: "Breakfast" | "Lunch" | "Dinner";
  name: string;
  emoji: string;
  kcal: number;
}

export interface TomorrowPlan {
  emphasis: Emphasis;
  headline: string;
  rationale: string;
  targetCalories: number;
  yesterday: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fatPct: number;
  };
  focus: { protein: number; carbs: number; fat: number }; // target macro %
  meals: PlannedMeal[];
}

const MEALS: Record<Emphasis, PlannedMeal[]> = {
  lighter: [
    { slot: "Breakfast", name: "Greek yogurt & berries", emoji: "🫐", kcal: 280 },
    { slot: "Lunch", name: "Grilled chicken salad", emoji: "🥗", kcal: 420 },
    { slot: "Dinner", name: "Salmon & roasted greens", emoji: "🐟", kcal: 440 },
  ],
  balanced: [
    { slot: "Breakfast", name: "Oats, banana & nuts", emoji: "🥣", kcal: 360 },
    { slot: "Lunch", name: "Chicken & avocado wrap", emoji: "🌯", kcal: 520 },
    { slot: "Dinner", name: "Veg stir-fry & rice", emoji: "🍚", kcal: 560 },
  ],
  fuel: [
    { slot: "Breakfast", name: "Avocado toast & eggs", emoji: "🥑", kcal: 420 },
    { slot: "Lunch", name: "Chicken pesto pasta", emoji: "🍝", kcal: 620 },
    { slot: "Dinner", name: "Beef & rice power bowl", emoji: "🍛", kcal: 640 },
  ],
};

const FOCUS: Record<Emphasis, { protein: number; carbs: number; fat: number }> = {
  lighter: { protein: 40, carbs: 35, fat: 25 },
  balanced: { protein: 30, carbs: 45, fat: 25 },
  fuel: { protein: 30, carbs: 50, fat: 20 },
};

export function computeTomorrowPlan(log: FoodResult[]): TomorrowPlan {
  const calories = log.reduce((s, f) => s + f.calories, 0);
  const protein = log.reduce((s, f) => s + f.protein, 0);
  const carbs = log.reduce((s, f) => s + f.carbs, 0);
  const fat = log.reduce((s, f) => s + f.fat, 0);
  const fatPct = calories > 0 ? Math.round(((fat * 9) / calories) * 100) : 0;

  let emphasis: Emphasis = "balanced";
  if (calories > 2200 || fatPct > 38) emphasis = "lighter";
  else if (calories < 1500) emphasis = "fuel";

  const targetCalories = emphasis === "lighter" ? 1850 : emphasis === "fuel" ? 2150 : 2000;

  const headline =
    emphasis === "lighter"
      ? "Lighter & protein-forward"
      : emphasis === "fuel"
      ? "Fuel up for tomorrow"
      : "Keep it balanced";

  const rationale =
    emphasis === "lighter"
      ? `Today ran calorie- and fat-heavy (${calories.toLocaleString()} kcal, ${fatPct}% from fat). Tomorrow leans on lean protein and veg to rebalance and keep you feeling light.`
      : emphasis === "fuel"
      ? `Today was on the light side (${calories.toLocaleString()} kcal). Tomorrow adds clean carbs and protein to fuel your training and recovery.`
      : `Today's balance looks solid (${calories.toLocaleString()} kcal). Tomorrow holds a steady, balanced plate to keep the momentum.`;

  return {
    emphasis,
    headline,
    rationale,
    targetCalories,
    yesterday: { calories, protein, carbs, fat, fatPct },
    focus: FOCUS[emphasis],
    meals: MEALS[emphasis],
  };
}

// Short summary string fed into the coach chat so it can reference the diet.
export function dietSummary(log: FoodResult[]): string {
  if (!log.length) return "";
  const plan = computeTomorrowPlan(log);
  const names = log.map((f) => f.name).join(", ");
  return `Today's food log: ${names} (${plan.yesterday.calories} kcal, ${plan.yesterday.fatPct}% from fat). Tomorrow's tailored focus: ${plan.headline.toLowerCase()}, target ${plan.targetCalories} kcal.`;
}
