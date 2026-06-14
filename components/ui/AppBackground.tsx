// Fixed, decorative background: near-black navy with soft blue/violet radial
// glows bleeding in from the corners. Very low opacity, no harsh edges.
export function AppBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink"
    >
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-blue opacity-[0.16] blur-[140px]" />
      <div className="absolute -right-48 -top-24 h-[560px] w-[560px] rounded-full bg-brand-violet opacity-[0.15] blur-[150px]" />
      <div className="absolute bottom-[-200px] left-1/3 h-[600px] w-[600px] rounded-full bg-brand-blue-deep opacity-[0.10] blur-[160px]" />
      <div className="absolute right-[-120px] bottom-[-160px] h-[480px] w-[480px] rounded-full bg-brand-violet-soft opacity-[0.08] blur-[150px]" />
      {/* faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
