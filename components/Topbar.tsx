"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, RotateCcw, Menu, X, Flame } from "lucide-react";
import { Logo } from "./Logo";
import { Avatar } from "./ui/Avatar";
import { useStore } from "@/lib/store";

const MOBILE_NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/coach", label: "AI Coach" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/teams", label: "Team Battles" },
  { href: "/rewards", label: "Rewards" },
  { href: "/ghost", label: "Ghost Mode" },
  { href: "/events", label: "Global Events" },
  { href: "/profile", label: "Profile" },
];

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const pathname = usePathname();
  const resetDemo = useStore((s) => s.resetDemo);
  const streak = useStore((s) => s.today.streak);

  function handleReset() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    resetDemo();
    setConfirming(false);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/[0.06] bg-ink/60 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="btn-ghost grid h-9 w-9 place-items-center rounded-lg md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="md:hidden">
          <Logo size={26} />
        </div>
        <p className="hidden text-sm text-muted lg:block">
          <span className="text-gradient font-semibold">
            Motivation is the real workout.
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden items-center gap-1.5 rounded-full bg-metric-calories/15 px-3 py-1.5 text-sm font-semibold text-orange-300 sm:flex">
          <Flame className="h-4 w-4" />
          {streak}-day streak
        </div>

        <button
          onClick={handleReset}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            confirming
              ? "bg-metric-heart/20 text-red-300"
              : "btn-ghost"
          }`}
          aria-label="Reset demo state"
          title="Restore the pristine demo starting state"
        >
          <RotateCcw className="h-4 w-4" />
          {confirming ? "Confirm reset" : "Reset demo"}
        </button>

        <button
          className="btn-ghost relative grid h-9 w-9 place-items-center rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-metric-heart" />
        </button>

        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-full bg-white/[0.04] py-1 pl-1 pr-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]"
        >
          <Avatar name="Alex Rivera" size={32} ring />
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold text-head">Alex Rivera</p>
            <p className="text-[10px] text-hint">Level 12 · 8,420 XP</p>
          </div>
        </Link>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-16 z-30 mx-3 rounded-2xl border border-white/10 bg-ink-soft/95 p-3 backdrop-blur-xl md:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {MOBILE_NAV.map((n) => {
                const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active
                        ? "bg-brand-gradient-soft text-head ring-1 ring-white/10"
                        : "text-muted"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
