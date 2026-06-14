import { initials } from "@/lib/seed";

// Local, network-free avatar: initials on a deterministic gradient derived
// from the name. Keeps the demo working with zero wifi dependency.
const PALETTES = [
  ["#3B82F6", "#8B5CF6"],
  ["#8B5CF6", "#EC4899"],
  ["#10B981", "#3B82F6"],
  ["#F97316", "#EF4444"],
  ["#6366F1", "#22D3EE"],
  ["#EAB308", "#F97316"],
];

function hash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return h;
}

export function Avatar({
  name,
  size = 40,
  ring = false,
}: {
  name: string;
  size?: number;
  ring?: boolean;
}) {
  const [from, to] = PALETTES[hash(name) % PALETTES.length];
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${
        ring ? "ring-2 ring-white/20" : ""
      }`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
