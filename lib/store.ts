"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TodayStats, Mission, LeaderboardUser } from "./types";
import type { FoodResult } from "./foodScanner";
import {
  SEED_TODAY,
  SIMULATED_DAY,
  SEED_MISSIONS,
  SEED_LEADERBOARD,
  SEED_EVENT,
  SEED_REWARDS_STATE,
} from "./seed";
import { SEED_FOOD_LOG } from "./foodScanner";

interface ActivaiState {
  today: TodayStats;
  missions: Mission[];
  leaderboard: LeaderboardUser[];
  eventCurrent: number;
  eventUserContribution: number;
  teamContribution: number; // Alex's contribution to Team Alpha
  teamScore: number; // Team Alpha combined score
  xp: number;
  points: number;
  foodLog: FoodResult[]; // today's logged meals → tailors tomorrow's plan
  simulated: boolean; // has the money moment run this session
  demoMode: boolean; // AI Coach demo (pre-written) vs live Gemini
  lastRecap: { score: number; summary: string; tomorrow: string } | null;

  // actions
  setDemoMode: (v: boolean) => void;
  logFood: (food: FoodResult) => void;
  toggleMission: (id: string) => void;
  simulateDay: () => void;
  stealRank: () => boolean; // returns true if a swap happened
  setRecap: (r: { score: number; summary: string; tomorrow: string }) => void;
  resetDemo: () => void;
}

const PRISTINE = {
  today: SEED_TODAY,
  missions: SEED_MISSIONS,
  leaderboard: SEED_LEADERBOARD,
  eventCurrent: SEED_EVENT.current,
  eventUserContribution: SEED_EVENT.userContribution,
  teamContribution: 31240,
  teamScore: 184520,
  xp: SEED_REWARDS_STATE.xp,
  points: SEED_REWARDS_STATE.points,
  foodLog: SEED_FOOD_LOG,
  simulated: false,
  lastRecap: null,
};

export const useStore = create<ActivaiState>()(
  persist(
    (set, get) => ({
      ...PRISTINE,
      demoMode: true,

      setDemoMode: (v) => set({ demoMode: v }),

      logFood: (food) => set((s) => ({ foodLog: [...s.foodLog, food] })),

      toggleMission: (id) =>
        set((s) => ({
          missions: s.missions.map((m) =>
            m.id === id ? { ...m, done: !m.done } : m
          ),
        })),

      simulateDay: () =>
        set((s) => {
          // Bump Alex's leaderboard row by a believable amount.
          const lb = s.leaderboard.map((u) =>
            u.isUser
              ? {
                  ...u,
                  steps: SIMULATED_DAY.steps,
                  calories: SIMULATED_DAY.calories,
                  score: u.score + 980,
                  workouts: u.workouts + 1,
                }
              : u
          );
          return {
            today: { ...SIMULATED_DAY },
            missions: s.missions.map((m) => ({ ...m, done: true, current: m.target })),
            leaderboard: lb,
            eventCurrent: Math.min(SEED_EVENT.goal, s.eventCurrent + 712),
            eventUserContribution: s.eventUserContribution + 712,
            teamContribution: s.teamContribution + 4280,
            teamScore: s.teamScore + 4280,
            xp: s.xp + 320,
            points: s.points + 120,
            simulated: true,
          };
        }),

      // Move Alex up one rank if she now out-scores the user directly above.
      stealRank: () => {
        const lb = [...get().leaderboard].sort((a, b) => b.score - a.score);
        const idx = lb.findIndex((u) => u.isUser);
        if (idx <= 0) return false;
        const rival = lb[idx - 1];
        const user = lb[idx];
        // Give the user a small edge so the steal lands.
        const boosted = { ...user, score: rival.score + 60 };
        const next = [...get().leaderboard].map((u) =>
          u.isUser ? boosted : u
        );
        set({ leaderboard: next });
        return true;
      },

      setRecap: (r) => set({ lastRecap: r }),

      resetDemo: () => set({ ...PRISTINE }),
    }),
    {
      name: "activai-demo-state",
      // Skip automatic hydration: server and first client render both use the
      // in-memory defaults (which equal the pristine seed), so there is no
      // hydration mismatch. We rehydrate from localStorage after mount.
      skipHydration: true,
      partialize: (s) => ({
        today: s.today,
        missions: s.missions,
        leaderboard: s.leaderboard,
        eventCurrent: s.eventCurrent,
        eventUserContribution: s.eventUserContribution,
        teamContribution: s.teamContribution,
        teamScore: s.teamScore,
        xp: s.xp,
        points: s.points,
        foodLog: s.foodLog,
        simulated: s.simulated,
        demoMode: s.demoMode,
        lastRecap: s.lastRecap,
      }),
    }
  )
);

// Helper to rank the leaderboard (sorted desc by score) with positions.
export function rankedLeaderboard(lb: LeaderboardUser[]) {
  return [...lb]
    .sort((a, b) => b.score - a.score)
    .map((u, i) => ({ ...u, rank: i + 1 }));
}
