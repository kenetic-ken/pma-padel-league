import type { Metadata } from "next";
import {
  BallIcon,
  CalendarIcon,
  CourtIcon,
  PaddleIcon,
  PointsIcon,
  ScaleIcon,
  SparkIcon,
  TrophyIcon,
} from "@/components/graphics/icons";
import { PadelCourt } from "@/components/graphics/PadelCourt";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { currentSeason, formatLongDate } from "@/data/seasons";

export const metadata: Metadata = {
  title: "Rules",
  description: `Format, scoring and culture for the PMA Padel League ${currentSeason.label}.`,
};

type IconComponent = (props: {
  className?: string;
  strokeWidth?: number;
}) => React.ReactElement;

export default function RulesPage() {
  const season = currentSeason;
  const { qualifier, finals, divisions } = season;

  const sections: {
    title: string;
    Icon: IconComponent;
    items: string[];
  }[] = [
    {
      title: "Match format",
      Icon: CalendarIcon,
      items: [
        `${season.bookingMinutes}-minute court bookings`,
        "Arrive at least 10 minutes early",
        "Be ready to start at the scheduled match time",
        "Matches are played over three sets",
      ],
    },
    {
      title: "Scoring",
      Icon: CourtIcon,
      items: [
        "Standard padel scoring",
        "Two deuces are played normally",
        "At the third deuce, the next point is Golden Point",
        "The receiving team chooses the receiving side",
      ],
    },
    {
      title: "Shootout 15",
      Icon: BallIcon,
      items: [
        "If roughly under 30 minutes remain before the third set begins, play a Shootout 15",
        "First to 15 points, win by 2",
        "Counts as the third set",
        "Standard tie-break serving rotation",
        "Use common sense — the objective is to finish inside the booking",
      ],
    },
    {
      title: "Ladder points",
      Icon: PointsIcon,
      items: [
        "Each match is worth 4 ladder points",
        "1 point for each set, and an extra point for the match winner",
        "Winning the match matters. Every set matters",
      ],
    },
    {
      title: "Ladder tiebreaker",
      Icon: ScaleIcon,
      items: [
        "Primary: total ladder points",
        "Secondary: games won ÷ games lost",
        "Then: head-to-head result",
      ],
    },
    {
      title: "Substitutes",
      Icon: PaddleIcon,
      items: [
        "Teams organise their own substitutes",
        "Subs should come from the PMA community",
        "Keep substitutions fair",
        "No Gold-level ringers",
      ],
    },
    {
      title: "PMA culture",
      Icon: SparkIcon,
      items: [
        "Competitive, social and fun",
        "Primarily for older Silver-level players",
        "Good games. Good people. Good banter",
        "Leave the ego at the door. No dickheads",
        "Nobody's getting scouted",
      ],
    },
    {
      title: "Fair play",
      Icon: TrophyIcon,
      items: [
        "If in doubt, replay the point",
        "Life's too short to argue over social padel",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.matchDay}`}
        title="Rules"
        sub="Everything you need to know before Tuesday."
      />

      {/* ------------------------------------------------- Season structure */}
      <Card className="mb-6 p-5 sm:p-6">
        <h2 className="font-display text-title text-accent">
          How the season works
        </h2>
        <ol className="mt-4 space-y-4">
          {qualifier ? (
            <Step
              n={1}
              title={qualifier.name}
              meta={`${formatLongDate(qualifier.date)} · ${qualifier.venue}`}
            >
              {qualifier.format} across {qualifier.courts} courts. All{" "}
              {season.teamCount} teams play 10 matches. The top 8 qualify for
              the Silver Devils, the remaining 8 for the Silver Foxes.{" "}
              {qualifier.note ? (
                <span className="text-fg-subtle">{qualifier.note}</span>
              ) : null}
            </Step>
          ) : null}
          <Step
            n={qualifier ? 2 : 1}
            title="Regular season"
            meta={`${season.schedule.length} rounds${divisions ? " per division" : ""}`}
          >
            Each division plays a {season.schedule.length}-round round robin.
            {divisions
              ? ` ${divisions.map((d) => `${d.name} at ${d.venue}`).join(", ")}.`
              : null}
          </Step>
          {finals ? (
            <Step
              n={qualifier ? 3 : 2}
              title={finals.name}
              meta={formatLongDate(finals.date)}
            >
              {finals.intro}
            </Step>
          ) : null}
        </ol>
      </Card>

      {/* ------------------------------------------------------- Divisions */}
      {divisions ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {divisions.map((division) => (
            <Card key={division.slug} className="p-5">
              <h2 className="font-display text-title text-accent">
                {division.name}
              </h2>
              <p className="mt-1.5 text-sm text-fg-muted">
                {division.blurb} Eight teams over {season.schedule.length}{" "}
                regular-season rounds, at {division.venue}.
              </p>
              <p className="mt-4 text-label font-semibold text-fg-subtle uppercase">
                The goal
              </p>
              <ul className="mt-2 space-y-1.5">
                {division.goals.map((goal) => (
                  <li
                    key={goal}
                    className="relative pl-4 text-sm leading-relaxed text-fg-muted"
                  >
                    <span
                      aria-hidden
                      className="absolute top-2.5 left-0 size-1 rounded-full bg-accent"
                    />
                    {goal}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : null}

      {/* ----------------------------------------------------- Rule cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="p-5">
            <div className="flex items-center gap-2.5">
              <section.Icon className="size-5 shrink-0 text-accent" />
              <h2 className="font-display text-title text-accent">
                {section.title}
              </h2>
            </div>
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="relative pl-4 text-sm leading-relaxed text-fg-muted"
                >
                  <span
                    aria-hidden
                    className="absolute top-2.5 left-0 size-1 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card
        accent
        className="relative mt-6 overflow-hidden px-6 py-9 text-center"
      >
        <PadelCourt
          className="absolute top-1/2 left-1/2 w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2 text-accent/[0.07]"
          strokeWidth={0.045}
        />
        <div className="relative">
          <p className="font-display text-2xl text-accent sm:text-3xl">
            Good games. Good people. Good banter.
          </p>
          <p className="mt-2 text-sm text-fg-muted">
            If in doubt, replay the point. Life&rsquo;s too short to argue over
            social padel.
          </p>
        </div>
      </Card>
    </div>
  );
}

function Step({
  n,
  title,
  meta,
  children,
}: {
  n: number;
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="font-display nums flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-lg leading-none text-accent-ink">
        {n}
      </span>
      <div className="min-w-0 pt-1">
        <p className="text-[0.9375rem] leading-tight font-semibold text-fg">
          {title}
        </p>
        {meta ? (
          <p className="mt-1 text-label font-medium text-fg-subtle uppercase">
            {meta}
          </p>
        ) : null}
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{children}</p>
      </div>
    </li>
  );
}
