// ACTIVAI logo: a bold geometric "A" (mountain/chevron) filled with the
// blue→violet brand gradient, beside the wordmark with "AI" in gradient.

export function LogoMark({ size = 32 }: { size?: number }) {
  const id = "activai-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="ACTIVAI logo mark"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Outer chevron "A" / mountain */}
      <path
        d="M24 4 L44 44 H33 L24 23 L15 44 H4 Z"
        fill={`url(#${id})`}
      />
      {/* Crossbar */}
      <rect x="17" y="31" width="14" height="5" rx="2.5" fill={`url(#${id})`} />
    </svg>
  );
}

export function Logo({
  size = 32,
  showWordmark = true,
}: {
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className="text-xl font-extrabold tracking-tight text-head"
          style={{ letterSpacing: "-0.02em" }}
        >
          ACTIV<span className="text-gradient">AI</span>
        </span>
      )}
    </div>
  );
}
