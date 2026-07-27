import { cn } from "@/lib/cn";

/**
 * A padel court, to regulation proportions.
 *
 * 20m x 10m; net across the middle; service lines 6.95m back from the net;
 * a centre service line running from each service line to the back wall.
 * The viewBox is in metres, so the geometry is the real thing rather than a
 * decorative approximation — worth it, because the people reading this site
 * play on one every Tuesday.
 *
 * Strokes use `currentColor`, so colour and opacity come from the parent.
 */
export function PadelCourt({
  className,
  strokeWidth = 0.07,
  showNet = true,
}: {
  className?: string;
  strokeWidth?: number;
  showNet?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 10"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
    >
      {/* Perimeter (the glass and mesh enclosure) */}
      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={20 - strokeWidth}
        height={10 - strokeWidth}
      />

      {/* Service lines, 6.95m either side of the net */}
      <line x1="3.05" y1="0" x2="3.05" y2="10" />
      <line x1="16.95" y1="0" x2="16.95" y2="10" />

      {/* Centre service lines, service line to back wall */}
      <line x1="0" y1="5" x2="3.05" y2="5" />
      <line x1="16.95" y1="5" x2="20" y2="5" />

      {/* Net */}
      {showNet ? (
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="10"
          strokeWidth={strokeWidth * 1.4}
          strokeDasharray="0.26 0.16"
        />
      ) : null}
    </svg>
  );
}

/**
 * The court laid back in perspective, fading out as it recedes. Used as the
 * hero backdrop in place of the old flat grid.
 */
export function CourtHorizon({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute -bottom-[14%] left-1/2 w-[210%] max-w-none -translate-x-1/2 sm:w-[135%]"
        style={{
          perspective: "900px",
          perspectiveOrigin: "50% 0%",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 42%, transparent 76%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 42%, transparent 76%)",
        }}
      >
        <div
          className="text-accent"
          style={{ transform: "rotateX(64deg)", transformOrigin: "50% 100%" }}
        >
          <PadelCourt
            className="w-full opacity-35"
            strokeWidth={0.05}
            showNet
          />
        </div>
      </div>
    </div>
  );
}
