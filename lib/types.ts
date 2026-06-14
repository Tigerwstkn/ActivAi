// ---------- Core domain types for ACTIVAI ----------

export type MetricKey = "steps" | "calories" | "heart" | "sleep" | "active";

export type Mood = "energized" | "tired" | "stressed" | "motivated";

export interface TodayStats {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  heartRate: number; // bpm (current)
  sleepMinutes: number; // last night
  activeMinutes: number;
  activeGoal: number;
  streak: number; // days
}

export interface Mission {
  id: string;
  label: string;
  metric: MetricKey;
  current: number;
  target: number;
  unit: string;
  done: boolean;
}

export interface CoachMessage {
  id: string;
  role: "coach" | "user";
  text: string;
  ts: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // lucide icon name
  unlocked: boolean;
  hint?: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  steps: number;
  calories: number;
  workouts: number;
  streak: number;
  multiplier: number; // streak multiplier
  improved: number; // % improvement (for Most Improved)
  consistency: number; // 0-100 (for Most Consistent)
  badges: string[]; // titles like "Rank Stealer"
  isUser?: boolean;
  country: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: "Leader" | "Motivator" | "Tracker" | "Member";
  contribution: number; // points contributed
  steps: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string; // emoji / mark
  color: string;
  score: number;
  members: TeamMember[];
  dietScore: number;
  stepsScore: number;
  caloriesScore: number;
}

export interface GlobalEvent {
  id: string;
  title: string;
  unit: string;
  current: number;
  goal: number;
  endsLabel: string;
  userContribution: number;
  status: "live" | "upcoming" | "past";
  members: number;
  countries: number;
  workouts: number;
}

export interface FeedItem {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface DayPoint {
  label: string; // e.g. "Mon" or date
  steps: number;
  calories: number;
  sleep: number; // hours
  active: number; // minutes
}
