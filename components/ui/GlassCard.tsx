"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type GlassCardProps = HTMLMotionProps<"div"> & {
  strong?: boolean;
  glow?: boolean;
  className?: string;
};

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard({ strong, glow, className, children, ...rest }, ref) {
    return (
      <motion.div
        ref={ref}
        className={cx(
          strong ? "glass-strong" : "glass",
          "rounded-2xl p-5",
          glow && "shadow-glow-violet",
          className
        )}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

// Stagger helpers shared across screens.
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
