import { cn } from "@/lib/cn";

/**
 * Sticky R1…Rn chips. A full season is several screens tall on a phone, so
 * every long round list gets one of these rather than making people scroll.
 */
export function RoundJumpNav({
  rounds,
  highlight,
  label = "Jump to round",
}: {
  rounds: number[];
  /** Round to mark as current, if any. */
  highlight?: number;
  label?: string;
}) {
  if (rounds.length < 2) return null;

  return (
    <nav
      aria-label={label}
      className="sticky top-16 z-40 -mx-4 mb-7 bg-canvas/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
    >
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {rounds.map((round) => (
          <li key={round}>
            <a
              href={`#round-${round}`}
              className={cn(
                "block rounded-chip px-3 py-1.5 text-label font-semibold whitespace-nowrap uppercase transition-colors",
                round === highlight
                  ? "bg-accent text-accent-ink"
                  : "bg-surface text-fg-muted hover:text-fg",
              )}
            >
              R{round}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Scroll anchor for a round section, offset clear of the sticky bars. */
export function RoundAnchor({ round }: { round: number }) {
  return <div id={`round-${round}`} className="scroll-mt-36" />;
}
