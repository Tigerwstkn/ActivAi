# Claude Code Build Prompt — ACTIVAI Web App

> Paste everything below the line into Claude Code. It is written as instructions to Claude Code.

---

## 1. What you're building

Build **ACTIVAI** — a next-gen fitness *ecosystem* presented as a polished web app. It pairs a smartwatch concept with a companion app that uses an AI coach, real-time social competition, and a global community to keep people consistent. The target users are teens aged 10–18.

This is a **demo, not a production app.** It will be shown live on a projector to a class of ~20 people during a **30–40 second elevator pitch**, as part of a Samsung Solve for Tomorrow Next Gen school project. That single fact drives every decision:

- **It must look stunning the instant it loads.** Premium, modern, "wow" on first frame.
- **It must never break live.** No blank states, no spinner-of-death, no dependency on good wifi. If the network or AI fails, everything degrades gracefully to pre-loaded content.
- **It must be navigable in seconds.** The presenter clicks through 3–4 screens fast. Every screen must already be full of believable, alive-looking data.
- **Do not over-engineer.** No real authentication, no real database, no real wearable integration, no payment. Mock and simulate everything convincingly.

## 2. Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animation (the wow factor — animated number counters, ring fills, card entrances, page transitions)
- **Recharts** for charts (weekly bars, trend lines, progress)
- **lucide-react** for icons
- **Google Gemini** for the AI Coach, called from a **Next.js server-side API route** (never expose the key in the browser)
- **localStorage** for persistence within a session (so changes feel real without a backend)
- Runnable with `npm install && npm run dev`, deployable to Vercel with zero config
- Optimize layout for a **1920×1080 laptop/projector** screen first; keep it responsive but desktop is the priority surface

Keep it a single Next.js codebase. No separate backend service.

## 3. Brand & visual design (this is critical — spend real effort here)

Match the look of a premium dark-mode fitness flagship (think Apple Fitness / Whoop / Oura crossed with a gaming UI).

**Theme: dark, premium, high-tech.**
- Background: near-black navy `#0A0E1A`, with subtle large radial glows in blue and violet bleeding in from the corners (very low opacity, no harsh gradients)
- Primary blue: `#3B82F6`, deeper `#2563EB`
- Violet/purple: `#8B5CF6`, `#A78BFA`
- **Signature gradient (use everywhere — logo, buttons, key numbers, progress fills): 135° blue → violet**, `#3B82F6 → #8B5CF6`
- Metric accent colors (used on the watch + dashboard rings, matching real fitness apps): steps = blue/violet gradient, calories = coral/orange `#F97316`, heart rate = red/pink `#EF4444`, sleep = indigo `#6366F1`, active time = teal/green `#10B981`
- Surfaces: glassmorphism cards — `rgba(255,255,255,0.04)` fill, `1px solid rgba(255,255,255,0.08)` border, `backdrop-blur`, generous rounded corners (16–20px)
- Text: white headlines, `#94A3B8` secondary, `#64748B` hints

**Logo:** Build an SVG "A" mark — a bold, stylized geometric "A" (like a mountain/chevron) filled with the blue→violet gradient, next to the wordmark `ACTIVAI` in white with the `AI` in gradient. Reuse it in the sidebar and on the watch face.

**Typography:** Use Inter (or a similar clean geometric sans). Big, confident display weights for headlines (sentence case, not all-caps). Tight line height on hero text.

**Motion (Framer Motion):**
- Numbers count up from 0 on load (steps, calories, XP, etc.)
- Progress rings and bars animate fill on mount
- Cards stagger-fade in
- Smooth page transitions between routes
- A subtle pulse/glow on the primary CTA and the "live" elements (battle countdown, your leaderboard row)

Use these brand taglines verbatim somewhere appropriate: **"Motivation is the real workout."**, **"Your AI Coach. Your Fitness Ally."**, **"Stronger Together. Healthier Forever."**, **"Move better. Compete together. Become more."**

## 4. App structure

A persistent left sidebar (collapsible) with the ACTIVAI logo and nav to these routes. A simulated logged-in user named **Alex** (with avatar) is shown top-right.

- `/` — **Dashboard / Home** (the hero screen, lands here)
- `/coach` — **AI Coach**
- `/leaderboard` — **Leaderboard + Rivalry**
- `/teams` — **Team Battles**
- `/rewards` — **Rewards**
- `/ghost` — **Ghost Mode**
- `/events` — **Global Community Events**
- `/profile` — **Profile & Progress**

Include a **device-frame view** of the smartwatch somewhere prominent (on the dashboard) — a watch mockup showing the ACTIVAI watch face with animated activity rings, time `10:09`, steps, calories, heart rate, sleep. This is the product hero.

## 5. Feature specifications

Build **all** of the following. Every screen ships pre-populated with realistic seed data so it looks alive in a demo.

### Core — Dashboard
- Smartwatch mockup with animated rings (steps/calories/active time) + readouts for heart rate and sleep
- "Today overview": Steps `12,456 / 15,000`, Calories `568 / 700 kcal`, Heart rate `128 bpm`, Sleep `7h 45m`, Active time `68 / 90 min` — all animated count-ups with progress rings
- The AI Coach's message of the day, already present ("Good morning, Alex! You're on a 5-day streak — let's hit 15k steps today.")
- A snapshot of: your current leaderboard rank, your active team battle (with live countdown), and the global event progress
- A prominent **"Simulate today's activity"** button (see §7 — this is the demo's money moment)

### Core — AI Coach (`/coach`)
- A chat-style coach interface powered by Gemini (see §6)
- **Daily missions** generated for the user: e.g. "Burn 650 kcal", "Walk 8,000 steps", "Sleep by 11pm" — each with a progress bar and a checkable complete state
- **Daily loop framing:** Morning plan → daytime tasks/tracking → nighttime summary + score. Show a "Tonight's recap" card with a daily score out of 100 and a one-line AI suggestion for tomorrow
- **Smart, context-aware reminders** rendered as coach cards: "You slept late → lighter workout today", "You haven't moved in 3 hours → quick 5-min challenge", "Time to hydrate", "Wind down — aim to sleep by 11pm"
- **Mood + health check-in:** let the user tap how they feel (energized / tired / stressed / motivated); the coach adapts its suggestion to match (e.g. stressed → a calming low-intensity workout). Wire the selected mood into the Gemini prompt
- The coach should adapt its tone/content to the user's current stats (steps so far, streak, mood)

### Core — Leaderboard + Rivalry (`/leaderboard`)
- Tabs: **Global / Friends / Groups**, and filter chips: **This Week / Steps / Calories / Workouts**
- A ranked list of ~12 seeded users (names, avatars, scores, steps, calories, workouts) with the logged-in user **Alex** sitting mid-pack and visibly climbing (animate a rank change on load)
- **Rivalry Mode:** the user can **challenge someone directly above them**. Show a "duel" panel (You vs Rival) comparing steps/calories/workouts. If the user beats the rival's stats, they **steal that rank** — animate the swap and fire a celebratory toast
- **Streak bonuses:** consistent users climb faster — show a streak multiplier on the user's row
- **Badges/titles:** "Rank Stealer", "Top Challenger", "Most Improved", "Most Consistent", "Diet King/Queen" — display earned badges on rows
- Alternate leaderboard views for "Most Improved" and "Most Consistent" (not just raw score)

### Optional (include all) — Team Battles (`/teams`)
- The user belongs to a squad. Show a **monthly team battle**: Team Alpha vs Team Nova, with team logos, combined scores, an animated progress bar splitting the two, and a **live countdown** ("Battle ends in 18:42:07")
- Show the user's **contribution** to their team
- **Team roles:** Leader, Motivator, Tracker — assign roles to teammates
- **Weekly team performance** breakdown: which team leads on diet, steps, and calories burnt (separate mini-leaderboards per category)
- A **yearly rankings** view: teams ranked across the season

### Optional (include all) — Rewards (`/rewards`)
- **XP + points** balance, animated
- **Badges** earned (with locked/unlocked states): Early Bird, Consistency Champion, Weekend Warrior, Platinum Performer, etc.
- A **"next reward" progress** card ("Complete 20 missions — 14/20")
- **Real-life rewards every 2 months ("Transformation Cycles"):** a cycle tracker showing the current 2-month cycle, the user's improvement, and rewards unlockable based on improvement (gym passes, discounts, gear) — framed as redeemable for things that help reach their goal
- A **before/after stats report** for the completed cycle (e.g. avg steps up 22%, resting HR down, streak record)

### Optional (include all) — Ghost Mode (`/ghost`)
- **Race against your past self.** Pick a past day/week; show a live "ghost" runner/trace vs your current pace on a line chart or animated track
- Display whether you're ahead/behind your past self in real time, with the gap
- A summary: "You're 1,240 steps ahead of last Tuesday's you 👻"

### Optional (include all) — Global Community Events (`/events`)
- A **collective global challenge** with a big animated community progress bar: "Burn 1,000,000 calories as a community this week — 742,318 / 1,000,000"
- The user's personal contribution to the global goal
- A few seeded community posts/feed items (other users hitting milestones), and live-ish stats: total active members, countries, workouts completed
- A list of past + upcoming events

### Profile & Progress (`/profile`)
- User profile (Alex), level, total XP, badges showcase, current streak
- **Progress over time:** weekly/monthly trend charts for steps, calories, sleep
- Achievements timeline

## 6. AI Coach — Gemini integration

Wire the AI Coach to **Google Gemini** through a **Next.js API route** (e.g. `app/api/coach/route.ts`). The route reads the API key from an environment variable and calls Gemini server-side.

- Use the official `@google/generative-ai` SDK.
- Read the key from `process.env.GEMINI_API_KEY`. Create a `.env.local.example` with `GEMINI_API_KEY=` and a README note: **get a free key from Google AI Studio (aistudio.google.com), no credit card required.**
- **Model:** use a current **free-tier Flash model** — `gemini-2.5-flash` is a safe default, but the free model lineup changes, so verify the current free Flash model in Google AI Studio and use that (do not use a Pro model — those moved behind billing).
- The route accepts the user's current context (stats so far today, streak, selected mood, and either a daily-mission request or a chat message) and returns the coach's response. Send a system-style instruction making the coach an upbeat, concise teen fitness coach for ACTIVAI that gives specific, actionable, encouraging guidance.

**Critical reliability requirement — the pitch cannot depend on the network:**
- If `GEMINI_API_KEY` is missing, or the request errors, or it's slow, **fall back instantly to a set of pre-written, realistic coach responses** (daily missions, recaps, mood-based suggestions). The UI must look identical whether the response came from Gemini or the fallback.
- Add a **"Demo mode" toggle** (default ON) that uses the instant pre-written responses, so the live pitch is guaranteed smooth. Turning it OFF calls the real Gemini API to prove it genuinely works. Make switching seamless.
- Never show a raw error to the user. Never leave the coach area blank.

## 7. Mock data & the demo "money moment"

- Seed a realistic dataset: ~12 leaderboard users (varied names, avatars via a placeholder avatar service or generated initials, plausible stats), 2 full teams with rosters and roles, a running global event, and **historical daily data for Alex** (needed for ghost mode and progress charts).
- Seed "Alex" with a believable in-progress day (partway to goals) and a 5-day streak.
- **The money moment:** a **"Simulate today's activity"** button on the dashboard. When clicked, it animates a full day of progress in ~3 seconds — rings fill, step/calorie counters race up, the AI coach posts a congratulatory recap, Alex climbs one rank on the leaderboard (animated swap), team contribution ticks up, and the global event bar advances. This is what the presenter clicks during the pitch to show the whole ecosystem reacting at once. Make it genuinely impressive.
- Persist changes to `localStorage` so the demo state holds during the session; include a small **"Reset demo"** control to restore the pristine starting state before presenting.

## 8. Quality bar & non-goals

**Quality bar:**
- Polished, consistent spacing and typography on every screen
- Every screen full of data on first load — no empty states during a demo
- Fast initial load; animations smooth, not janky
- Reasonable accessibility (alt text, focus states, semantic markup)

**Explicit non-goals (do not build these):**
- No real auth / login / signup
- No real database or server persistence beyond localStorage
- No real wearable/Bluetooth/health-API integration
- No payments
- No real AR (the original concept mentioned AR challenges — represent that idea only as a simple map/step-based "capture points" mini-card if you want, but do not attempt real AR)

## 9. Build order (if you need to prioritize)

Build in this order so the pitch centerpiece exists first:
1. Project setup, brand system (colors, logo, fonts, glass card + ring components), sidebar/layout
2. **Dashboard** with watch mockup, animated rings, and the "Simulate today's activity" money moment
3. **AI Coach** (with Gemini route + fallback/demo mode)
4. **Leaderboard + Rivalry** (with rank-stealing animation)
5. **Team Battles**, **Rewards**
6. **Ghost Mode**, **Global Events**, **Profile**
7. Final polish pass: animations, responsive checks, reset/demo controls

## 10. Vercel deployment (required — the app will be presented from a school iPad)

The finished app **must be deployable to Vercel** so it can be accessed from a school iPad via a public URL. Do not assume it will be presented from the development laptop.

Make sure the following are true:

- The project is a standard Next.js App Router app — Vercel detects and deploys this automatically with zero config
- All environment variables (i.e. `GEMINI_API_KEY`) are documented clearly so they can be added in the Vercel dashboard under Project → Settings → Environment Variables
- **Demo mode is ON by default** and the app renders fully with no API key present — this is the fallback for when Vercel doesn't have the key set, and guarantees the pitch never breaks
- No hardcoded `localhost` URLs anywhere — all API calls must use relative paths (e.g. `/api/coach`) so they work on both local dev and the deployed Vercel domain
- Include a `vercel.json` only if actually needed; for a standard Next.js app it is not required

Include the following in the `README.md` under a **"Deploying to Vercel (for iPad presentation)"** section:

```
1. Push your code to a GitHub repository
2. Go to vercel.com → "Add New Project" → import the GitHub repo
3. Vercel auto-detects Next.js — click Deploy, no config needed
4. Once deployed, go to Project → Settings → Environment Variables
   and add GEMINI_API_KEY with your key from aistudio.google.com
5. Redeploy (or it picks up automatically) — your app is now live at
   yourproject.vercel.app
6. On your iPad: open Safari → go to the Vercel URL → tap Share →
   "Add to Home Screen" → it opens full-screen like a native app
7. Demo mode is ON by default so the pitch works even without the key set
```

## 11. Deliverables

- The full Next.js app
- A `README.md` covering: how to install and run locally, how to get a free Gemini key and where to put it, how Demo mode + the "Simulate" and "Reset" controls work, the Vercel deployment steps above, and a one-paragraph overview of ACTIVAI for context
- Confirm it runs cleanly with `npm install && npm run dev` and that **every route renders fully populated with the API key absent** (fallback path)

Start by scaffolding the project and building the brand system and dashboard. Show me the dashboard before moving on.
