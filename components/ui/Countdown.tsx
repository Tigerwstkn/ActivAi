"use client";

import { useEffect, useState } from "react";

// Live ticking countdown. Seeds from a fixed offset so it always shows a
// believable "battle ends in…" without depending on a real date.
export function Countdown({
  initialSeconds = 18 * 3600 + 42 * 60 + 7,
  className,
}: {
  initialSeconds?: number;
  className?: string;
}) {
  const [secs, setSecs] = useState(initialSeconds);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className={className}>
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
