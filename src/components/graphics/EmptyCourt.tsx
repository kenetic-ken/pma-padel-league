import { PadelCourt } from "./PadelCourt";

/**
 * Empty-state art: a court with a ball resting on it. Used where there is
 * nothing to show yet — before a season's first results come in.
 */
export function EmptyCourt({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="relative mx-auto w-full max-w-xs text-fg-subtle/50">
        <PadelCourt className="w-full" strokeWidth={0.09} />
        {/* Ball, sitting just inside the near service box */}
        <span className="absolute top-[62%] left-[27%] block size-2.5 rounded-full bg-accent/70" />
        <span className="absolute top-[62%] left-[27%] block size-2.5 animate-ping rounded-full bg-accent/40" />
      </div>
    </div>
  );
}
