# ACTIVAI — Your AI Coach. Your Fitness Ally.

ACTIVAI is a next-gen fitness **ecosystem** demo: a smartwatch concept paired with a
companion web app that uses an AI coach, real-time social competition, and a global
community to keep teens (ages 10–18) consistent. It blends an Apple Fitness / Whoop /
Oura aesthetic with a gaming-style social layer — leaderboards, rivalries, team battles,
ghost-mode races, real-life reward cycles, and worldwide community events. This repo is a
polished, demo-ready single Next.js app built for a 30–40 second live elevator pitch:
it loads stunning, is full of believable live data on every screen, and **never breaks**
even with no network or no API key.

> Taglines: *Motivation is the real workout.* · *Your AI Coach. Your Fitness Ally.* ·
> *Stronger Together. Healthier Forever.* · *Move better. Compete together. Become more.*

---

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (custom dark, premium theme)
- **Framer Motion** (count-ups, ring fills, staggered entrances, page transitions)
- **Recharts** (trend bars, area charts, ghost-mode line race)
- **lucide-react** icons
- **Zustand** + `localStorage` for in-session persistence
- **Google Gemini** for the AI Coach, called from a server-side API route (key never
  reaches the browser) — with an instant offline fallback

---

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Every route renders fully populated **with no API key
present** — the AI Coach uses instant pre-written responses by default.

Routes: `/` Dashboard · `/coach` AI Coach · `/leaderboard` · `/teams` · `/rewards` ·
`/ghost` · `/events` · `/profile`.

---

## AI Coach + Gemini (optional)

The coach works out of the box in **Demo mode** (instant, pre-written, realistic
responses). To prove the live integration:

1. Get a **free** API key from **Google AI Studio** (<https://aistudio.google.com>) —
   no credit card required.
2. Copy `.env.local.example` to `.env.local` and set your key:
   ```
   GEMINI_API_KEY=your_key_here
   ```
   The server route uses a current free-tier **Flash** model (`gemini-2.5-flash` by
   default; override with `GEMINI_MODEL`). The free Flash lineup changes over time —
   verify the current free model in Google AI Studio if needed. Do not use a Pro model
   (those require billing).
3. Restart `npm run dev`, open **AI Coach**, and toggle **Demo mode OFF** to call the
   real Gemini API.

**Reliability:** if the key is missing, the request errors, or the network is slow
(>8s), the coach **instantly** falls back to pre-written responses. The UI looks
identical either way, and a raw error is never shown. This is why the live pitch can
never break.

---

## AI Food Scanner + next-day diet planner

On the **AI Coach** screen:

- **AI Food Scanner** — scan a meal three ways:
  1. **Take photo** — opens the device's live camera (rear camera by default) for a
     point-and-shoot scan.
  2. **Upload** — choose an existing photo.
  3. **Sample meals** — one-tap canned results (🥗🍔🥣🍝🥑🐟); instant and offline, so
     they're the safest path for a live pitch.
  It returns calories, protein/carbs/fat, a health grade (A–D), and a coaching tip.
- **Honest detection.** With a Gemini key + Demo mode OFF, uploaded/captured photos go
  to **Gemini Vision**, which also rejects non-food images ("That's not food"). With no
  key it clearly says "AI vision not connected" instead of inventing numbers. In Demo
  mode, custom photos are labelled as sample estimates (no real detection).
- **"Tomorrow, tailored to today"** — logging a meal updates a food diary and instantly
  re-tailors tomorrow's plan (Lighter / Balanced / Fuel-up) with an adjusted calorie
  target and recommended meals, to keep the diet healthy. The chat coach is diet-aware
  and references what you logged.

> **Camera requires a secure origin.** Browsers only grant camera access over `https://`
> or `localhost`. The camera works on the **deployed Vercel URL** (https) and on
> `http://localhost:3000`, but **not** when opening the dev server over your local
> network (e.g. `http://192.168.x.x:3000`) — that's plain http and iOS/Safari will block
> it. For iPad camera testing, use the Vercel URL. On first use, tap **Allow** when
> Safari asks for camera permission.

---

## Demo controls

- **"Simulate today's activity"** (Dashboard) — the money moment. One click animates a
  full day in ~3 seconds: rings fill, counters race up, the coach posts a recap, Alex
  climbs a rank on the leaderboard (animated swap + toast), team contribution ticks up,
  and the global event bar advances.
- **Demo mode toggle** (AI Coach, default **ON**) — instant pre-written coach responses
  for a guaranteed-smooth pitch. Turn OFF to use the live Gemini API + Gemini Vision.
- **AI Food Scanner** (AI Coach) — tap a sample meal for an instant scan, or use the
  camera/upload. Logging a meal re-tailors tomorrow's plan live.
- **"Reset demo"** (top bar) — restores the pristine starting state (click once to arm,
  again to confirm). Use this right before presenting.

All changes persist to `localStorage` for the session, so the demo state holds as you
click around.

---

## Deploying to Vercel (for iPad presentation)

The app is a standard Next.js App Router project — Vercel deploys it with zero config.
It renders fully **even with no `GEMINI_API_KEY` set**, so the pitch works whether or
not the key is configured.

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

No `vercel.json` is needed. All API calls use relative paths (`/api/coach`), so they
work identically on local dev and on the deployed Vercel domain.

---

## Notes (this is a demo, not production)

No real auth, database, wearable/Bluetooth integration, payments, or AR. Everything is
mocked and seeded to look alive. The "Capture Points" card on Global Events represents
the AR challenge idea as a simple concept card only.
