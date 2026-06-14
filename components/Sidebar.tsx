"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Trophy,
  Swords,
  Gift,
  Ghost,
  Globe2,
  User,
  ChevronLeft,
} from "lucide-react";
import { Logo, LogoMark } from "./Logo";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/coach", label: "AI Coach", icon: Bot },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/teams", label: "Team Battles", icon: Swords },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/ghost", label: "Ghost Mode", icon: Ghost },
  { href: "/events", label: "Global Events", icon: Globe2 },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 z-20 hidden h-screen shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-[width] duration-300 md:flex ${
        collapsed ? "w-[78px]" : "w-[248px]"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" aria-label="ACTIVAI home">
          {collapsed ? <LogoMark size={30} /> : <Logo size={30} />}
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="btn-ghost grid h-7 w-7 place-items-center rounded-lg"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "text-head" : "text-muted hover:text-head"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-brand-gradient-soft ring-1 ring-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                className={`relative z-10 h-5 w-5 shrink-0 ${
                  active ? "text-brand-violet-soft" : ""
                }`}
              />
              {!collapsed && <span className="relative z-10">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-4 pb-5">
          <div className="glass rounded-xl p-3">
            <p className="text-xs font-semibold text-gradient">
              Stronger Together.
            </p>
            <p className="text-xs text-hint">Healthier Forever.</p>
          </div>
        </div>
      )}
    </aside>
  );
}
