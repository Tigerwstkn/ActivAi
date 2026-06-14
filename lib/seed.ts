import type {
  TodayStats,
  Mission,
  Badge,
  LeaderboardUser,
  Team,
  GlobalEvent,
  FeedItem,
  DayPoint,
} from "./types";

// Initials helper used by the local Avatar component (no network dependency).
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// ---------- Alex: the logged-in user, mid-day in-progress ----------
export const SEED_TODAY: TodayStats = {
  steps: 12456,
  stepsGoal: 15000,
  calories: 568,
  caloriesGoal: 700,
  heartRate: 128,
  sleepMinutes: 7 * 60 + 45, // 7h 45m
  activeMinutes: 68,
  activeGoal: 90,
  streak: 5,
};

// Fully-completed "end of day" target used by the Simulate money moment.
export const SIMULATED_DAY: TodayStats = {
  steps: 15240,
  stepsGoal: 15000,
  calories: 712,
  caloriesGoal: 700,
  heartRate: 96,
  sleepMinutes: 7 * 60 + 45,
  activeMinutes: 94,
  activeGoal: 90,
  streak: 6,
};

export const SEED_MISSIONS: Mission[] = [
  {
    id: "m1",
    label: "Burn 650 kcal",
    metric: "calories",
    current: 568,
    target: 650,
    unit: "kcal",
    done: false,
  },
  {
    id: "m2",
    label: "Walk 8,000 steps",
    metric: "steps",
    current: 8000,
    target: 8000,
    unit: "steps",
    done: true,
  },
  {
    id: "m3",
    label: "Hit 90 active minutes",
    metric: "active",
    current: 68,
    target: 90,
    unit: "min",
    done: false,
  },
  {
    id: "m4",
    label: "Sleep by 11:00 pm",
    metric: "sleep",
    current: 0,
    target: 1,
    unit: "",
    done: false,
  },
];

export const SEED_COACH_GREETING =
  "Good morning, Alex! You're on a 5-day streak — let's hit 15k steps today. You're already 83% of the way there. 🔥";

// ---------- Leaderboard (12 users, Alex mid-pack) ----------
export const SEED_LEADERBOARD: LeaderboardUser[] = [
  { id: "u1", name: "Maya Chen", avatar: "MC", score: 9840, steps: 21450, calories: 1120, workouts: 14, streak: 21, multiplier: 1.5, improved: 8, consistency: 97, badges: ["Most Consistent"], country: "🇸🇬" },
  { id: "u2", name: "Leo Martins", avatar: "LM", score: 9510, steps: 20110, calories: 1080, workouts: 13, streak: 16, multiplier: 1.4, improved: 12, consistency: 91, badges: ["Diet King"], country: "🇧🇷" },
  { id: "u3", name: "Aisha Khan", avatar: "AK", score: 9120, steps: 19320, calories: 990, workouts: 12, streak: 14, multiplier: 1.35, improved: 19, consistency: 88, badges: ["Most Improved"], country: "🇦🇪" },
  { id: "u4", name: "Tom Becker", avatar: "TB", score: 8730, steps: 18250, calories: 960, workouts: 11, streak: 9, multiplier: 1.2, improved: 6, consistency: 80, badges: [], country: "🇩🇪" },
  { id: "u5", name: "Sofia Rossi", avatar: "SR", score: 8410, steps: 17600, calories: 930, workouts: 11, streak: 12, multiplier: 1.3, improved: 14, consistency: 85, badges: ["Top Challenger"], country: "🇮🇹" },
  { id: "u6", name: "Jin Park", avatar: "JP", score: 8090, steps: 16940, calories: 880, workouts: 10, streak: 7, multiplier: 1.15, improved: 9, consistency: 78, badges: [], country: "🇰🇷" },
  { id: "u7", name: "Alex Rivera", avatar: "AR", score: 7820, steps: 12456, calories: 568, workouts: 9, streak: 5, multiplier: 1.25, improved: 22, consistency: 90, badges: ["Most Improved", "Rank Stealer"], isUser: true, country: "🇵🇭" },
  { id: "u8", name: "Nora Ahmed", avatar: "NA", score: 7540, steps: 15880, calories: 820, workouts: 9, streak: 6, multiplier: 1.1, improved: 4, consistency: 74, badges: [], country: "🇪🇬" },
  { id: "u9", name: "Diego Luna", avatar: "DL", score: 7210, steps: 15110, calories: 790, workouts: 8, streak: 4, multiplier: 1.05, improved: 11, consistency: 70, badges: [], country: "🇲🇽" },
  { id: "u10", name: "Emma Wright", avatar: "EW", score: 6890, steps: 14420, calories: 760, workouts: 8, streak: 3, multiplier: 1.0, improved: 7, consistency: 68, badges: [], country: "🇬🇧" },
  { id: "u11", name: "Kenji Sato", avatar: "KS", score: 6540, steps: 13700, calories: 720, workouts: 7, streak: 5, multiplier: 1.1, improved: 16, consistency: 72, badges: [], country: "🇯🇵" },
  { id: "u12", name: "Lila Novak", avatar: "LN", score: 6210, steps: 12980, calories: 690, workouts: 7, streak: 2, multiplier: 1.0, improved: 3, consistency: 64, badges: [], country: "🇨🇿" },
];

// ---------- Teams ----------
export const SEED_TEAMS: Team[] = [
  {
    id: "alpha",
    name: "Team Alpha",
    logo: "🐺",
    color: "#3B82F6",
    score: 184520,
    dietScore: 82,
    stepsScore: 91,
    caloriesScore: 78,
    members: [
      { id: "a1", name: "Alex Rivera", avatar: "AR", role: "Motivator", contribution: 31240, steps: 12456 },
      { id: "a2", name: "Maya Chen", avatar: "MC", role: "Leader", contribution: 42100, steps: 21450 },
      { id: "a3", name: "Jin Park", avatar: "JP", role: "Tracker", contribution: 33980, steps: 16940 },
      { id: "a4", name: "Emma Wright", avatar: "EW", role: "Member", contribution: 28900, steps: 14420 },
      { id: "a5", name: "Diego Luna", avatar: "DL", role: "Member", contribution: 26800, steps: 15110 },
      { id: "a6", name: "Kenji Sato", avatar: "KS", role: "Member", contribution: 21500, steps: 13700 },
    ],
  },
  {
    id: "nova",
    name: "Team Nova",
    logo: "⚡",
    color: "#8B5CF6",
    score: 171340,
    dietScore: 88,
    stepsScore: 84,
    caloriesScore: 86,
    members: [
      { id: "n1", name: "Leo Martins", avatar: "LM", role: "Leader", contribution: 39800, steps: 20110 },
      { id: "n2", name: "Aisha Khan", avatar: "AK", role: "Motivator", contribution: 36200, steps: 19320 },
      { id: "n3", name: "Sofia Rossi", avatar: "SR", role: "Tracker", contribution: 33100, steps: 17600 },
      { id: "n4", name: "Nora Ahmed", avatar: "NA", role: "Member", contribution: 29400, steps: 15880 },
      { id: "n5", name: "Tom Becker", avatar: "TB", role: "Member", contribution: 18840, steps: 18250 },
      { id: "n6", name: "Lila Novak", avatar: "LN", role: "Member", contribution: 13900, steps: 12980 },
    ],
  },
];

export const SEED_YEARLY_TEAMS = [
  { rank: 1, name: "Team Nova", logo: "⚡", points: 1842300, wins: 7 },
  { rank: 2, name: "Team Alpha", logo: "🐺", points: 1796450, wins: 6 },
  { rank: 3, name: "Iron Pulse", logo: "🔥", points: 1654200, wins: 5 },
  { rank: 4, name: "Sky Runners", logo: "🌀", points: 1588900, wins: 4 },
  { rank: 5, name: "Vital Edge", logo: "💎", points: 1490100, wins: 3 },
];

// ---------- Global event ----------
export const SEED_EVENT: GlobalEvent = {
  id: "e1",
  title: "Burn 1,000,000 calories as a community this week",
  unit: "kcal",
  current: 742318,
  goal: 1000000,
  endsLabel: "Ends Sunday 11:59 pm",
  userContribution: 3420,
  status: "live",
  members: 48213,
  countries: 64,
  workouts: 192847,
};

export const SEED_EVENTS_LIST = [
  { id: "ev-live", title: "Million Calorie Week", when: "This week", status: "live" as const, emoji: "🔥" },
  { id: "ev-up1", title: "10 Million Step March", when: "Starts in 3 days", status: "upcoming" as const, emoji: "👟" },
  { id: "ev-up2", title: "Global Sleep Reset", when: "Next month", status: "upcoming" as const, emoji: "🌙" },
  { id: "ev-past1", title: "Summer Shred Challenge", when: "Last month", status: "past" as const, emoji: "☀️" },
  { id: "ev-past2", title: "New Year Streak Sprint", when: "January", status: "past" as const, emoji: "🎉" },
];

export const SEED_FEED: FeedItem[] = [
  { id: "f1", user: "Maya Chen", avatar: "MC", text: "just smashed a 21-day streak! 🔥", timeAgo: "2m" },
  { id: "f2", user: "Aisha Khan", avatar: "AK", text: "hit a new PR — 19,320 steps today 👟", timeAgo: "8m" },
  { id: "f3", user: "Leo Martins", avatar: "LM", text: "earned the Diet King title 👑", timeAgo: "15m" },
  { id: "f4", user: "Sofia Rossi", avatar: "SR", text: "completed all daily missions ✅", timeAgo: "23m" },
  { id: "f5", user: "Jin Park", avatar: "JP", text: "joined Team Alpha for the monthly battle ⚔️", timeAgo: "41m" },
];

// ---------- Rewards ----------
export const SEED_BADGES: Badge[] = [
  { id: "b1", name: "Early Bird", icon: "Sunrise", unlocked: true },
  { id: "b2", name: "Consistency Champion", icon: "CalendarCheck", unlocked: true },
  { id: "b3", name: "Weekend Warrior", icon: "Swords", unlocked: true },
  { id: "b4", name: "Rank Stealer", icon: "TrendingUp", unlocked: true },
  { id: "b5", name: "Most Improved", icon: "Sparkles", unlocked: true },
  { id: "b6", name: "Platinum Performer", icon: "Gem", unlocked: false, hint: "Reach the global top 100" },
  { id: "b7", name: "Marathoner", icon: "Footprints", unlocked: false, hint: "Walk 30,000 steps in a day" },
  { id: "b8", name: "Night Owl Reformed", icon: "Moon", unlocked: false, hint: "Sleep before 11pm for 7 days" },
];

export const SEED_REWARDS_STATE = {
  xp: 8420,
  xpLevelFloor: 8000,
  xpLevelCeil: 10000,
  level: 12,
  points: 2640,
  missionsDone: 14,
  missionsGoal: 20,
};

// Real-life "Transformation Cycle" (every 2 months)
export const SEED_CYCLE = {
  cycleName: "Transformation Cycle — Apr → Jun",
  daysElapsed: 47,
  daysTotal: 60,
  improvement: 22, // % overall
  before: { avgSteps: 8900, restingHr: 74, streakRecord: 4 },
  after: { avgSteps: 10860, restingHr: 67, streakRecord: 12 },
  rewards: [
    { id: "r1", name: "1-Month Gym Pass", need: 15, icon: "Dumbbell", unlocked: true },
    { id: "r2", name: "20% Off Running Gear", need: 20, icon: "Tag", unlocked: true },
    { id: "r3", name: "Smart Water Bottle", need: 30, icon: "Droplets", unlocked: false },
    { id: "r4", name: "Premium Coaching Month", need: 40, icon: "Crown", unlocked: false },
  ],
};

// ---------- History (Ghost Mode + Profile charts) ----------
export const SEED_WEEK: DayPoint[] = [
  { label: "Mon", steps: 11200, calories: 540, sleep: 7.2, active: 62 },
  { label: "Tue", steps: 9800, calories: 480, sleep: 6.5, active: 51 },
  { label: "Wed", steps: 13400, calories: 610, sleep: 7.8, active: 74 },
  { label: "Thu", steps: 10250, calories: 505, sleep: 7.0, active: 58 },
  { label: "Fri", steps: 14100, calories: 660, sleep: 8.1, active: 82 },
  { label: "Sat", steps: 15600, calories: 720, sleep: 8.4, active: 95 },
  { label: "Sun", steps: 12456, calories: 568, sleep: 7.75, active: 68 },
];

export const SEED_MONTH: DayPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 9000 + Math.round(3500 * Math.sin(i / 3.2) + i * 90);
  return {
    label: `${i + 1}`,
    steps: base,
    calories: Math.round(420 + base / 28),
    sleep: +(6.4 + 1.6 * Math.abs(Math.sin(i / 4))).toFixed(1),
    active: Math.round(40 + base / 260),
  };
});

// Cumulative step trace for a chosen "ghost" past day, sampled across the day.
export const GHOST_PAST_DAY = {
  label: "Last Tuesday",
  total: 11216,
  // cumulative steps at each hour marker (6am -> 10pm)
  trace: [0, 420, 1180, 2240, 3650, 4980, 6210, 7050, 8120, 9040, 9880, 10510, 11216],
};

export const GHOST_TODAY = {
  label: "Today",
  total: 12456,
  trace: [0, 560, 1490, 2780, 4120, 5510, 6920, 7980, 9210, 10340, 11280, 12010, 12456],
};

export const GHOST_HOURS = ["6a", "7a", "9a", "11a", "1p", "2p", "4p", "5p", "6p", "8p", "9p", "10p", "now"];

export const COACH_TAGLINE = "Your AI Coach. Your Fitness Ally.";
