"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

export function Toast({
  show,
  title,
  body,
}: {
  show: boolean;
  title: string;
  body?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="glass-strong flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-glow-violet">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient">
              <PartyPopper className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-semibold text-head">{title}</p>
              {body && <p className="text-xs text-muted">{body}</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
