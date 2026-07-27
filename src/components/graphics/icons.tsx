/**
 * Line icons drawn to a shared spec: 24x24 viewBox, 1.5 stroke, round caps,
 * `currentColor`. They replace the emoji the pages used to lean on, which
 * rendered differently on every device and sat oddly against Bebas headings.
 */

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function Svg({
  children,
  className,
  strokeWidth = 1.5,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Court seen from above — used for the match-format card. */
export function CourtIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="5.5" width="20" height="13" rx="1" />
      <path d="M12 5.5v13" strokeDasharray="1.6 1.2" />
      <path d="M6.4 5.5v13M17.6 5.5v13" />
      <path d="M2 12h4.4M17.6 12H22" />
    </Svg>
  );
}

/** Three ascending bars — used for the points card. */
export function PointsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20V13.5M12 20V7M20 20v-9.5" />
      <path d="M2.5 20h19" />
    </Svg>
  );
}

/** A padel ball with its curved seam, plus motion arcs. */
export function BallIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="13.5" r="6.5" />
      <path d="M5.4 9.4c2.6.5 4.4 2.6 4.6 5.3M15.7 9.5c-2.1 1.5-3 4-2.4 6.6" />
      <path d="M17.8 6.2c.9-.9 2-1.6 3.2-2M18.6 3.2c.4 1 .6 2.1.6 3.2" />
    </Svg>
  );
}

/** Location marker — used for the venue card. */
export function PinIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21.5s7-5.7 7-11.1A7 7 0 0 0 5 10.4c0 5.4 7 11.1 7 11.1Z" />
      <circle cx="12" cy="10.1" r="2.5" />
    </Svg>
  );
}

/** Calendar — used for the schedule/format section on the rules page. */
export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="15" rx="2" />
      <path d="M3 10.5h18M8 3.5v4M16 3.5v4" />
    </Svg>
  );
}

/** Trophy — used for the champion / league-points contexts. */
export function TrophyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 4.5h10v4a5 5 0 0 1-10 0v-4Z" />
      <path d="M7 6H4.5v1.5A3 3 0 0 0 7.5 10.5M17 6h2.5v1.5a3 3 0 0 1-3 3" />
      <path d="M12 13.5V17M8.5 20h7" />
    </Svg>
  );
}

/** Two paddles crossed — used for substitutes / squad contexts. */
export function PaddleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.2 3.6a4.6 4.6 0 0 1 0 9.2 4.6 4.6 0 0 1 0-9.2Z" />
      <path d="M9.2 12.8v7.6" />
      <path d="M15.5 20.4V9.2" />
      <path d="M15.5 9.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
    </Svg>
  );
}

/** Ratio / tiebreaker glyph. */
export function ScaleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4v16M5 8h14" />
      <path d="M5 8 2.5 13.5a2.75 2.75 0 0 0 5 0L5 8ZM19 8l-2.5 5.5a2.75 2.75 0 0 0 5 0L19 8Z" />
    </Svg>
  );
}

/** Spark — used for the vibe / etiquette contexts. */
export function SparkIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5l1.9 5.7 5.7 1.9-5.7 1.9L12 17.7l-1.9-5.7L4.4 10l5.7-1.9L12 2.5Z" />
      <path d="M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </Svg>
  );
}
