"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useTransform,
  animate,
  useInView,
  motion,
} from "framer-motion";
import { useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  format?: (n: number) => string;
  delay?: number;
}

// Counts up from 0 (or from its previous value) to `value` whenever it changes.
export function AnimatedNumber({
  value,
  duration = 1.4,
  decimals = 0,
  className,
  format,
  delay = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => {
    const n = decimals > 0 ? Number(latest.toFixed(decimals)) : Math.round(latest);
    return format ? format(n) : n.toLocaleString();
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, inView, mv, duration, delay]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}
