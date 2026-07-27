import type { Metadata } from "next";
import {
  BallIcon,
  CalendarIcon,
  CourtIcon,
  PaddleIcon,
  ScaleIcon,
  SparkIcon,
  TrophyIcon,
} from "@/components/graphics/icons";
import { PadelCourt } from "@/components/graphics/PadelCourt";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  currentSeason,
  formatLongDate,
  seasonEnd,
  seasonStart,
} from "@/data/seasons";

export const metadata: Metadata = {
  title: "Rules",
  description: `Format, scoring and etiquette for the PMA Tuesday Padel League ${currentSeason.label}.`,
};

export default function RulesPage() {
  const season = currentSeason;
  const start = seasonStart(season);
  const end = seasonEnd(season);
  const dates =
    start && end
      ? `${formatLongDate(start)} – ${formatLongDate(end)}`
      : undefined;

  const sections: {
    title: string;
    Icon: (props: {
      className?: string;
      strokeWidth?: number;
    }) => React.ReactElement;
    items: string[];
  }[] = [
    {
      title: "Format",
      Icon: CalendarIcon,
      items: [
        dates
          ? `${season.label}: ${dates}`
          : `${season.label} dates to be confirmed`,
        `${season.teams.length} teams, ${season.schedule.length}-week round robin — every team plays each other once`,
        `${season.matchDay} at ${season.defaultTime} · 120-minute slot · arrive 10 minutes early`,
      ],
    },
    {
      title: "Scoring",
      Icon: CourtIcon,
      items: [
        "Three full sets, standard padel scoring",
        "Maximum two deuces per game",
        "Third deuce is a golden point — sudden death",
      ],
    },
    {
      title: "League points",
      Icon: TrophyIcon,
      items: [
        "Win a set, win one league point",
        "3–0 win = 3 points to the winner, 0 to the loser",
        "2–1 win = 2 points to the winner, 1 to the loser",
        "Every set counts — never give up",
      ],
    },
    {
      title: "Ladder tiebreaker",
      Icon: ScaleIcon,
      items: [
        "Primary: total league points (sets won)",
        "Secondary: games won ÷ games lost",
        "Then: head-to-head result",
      ],
    },
    {
      title: "Substitutes",
      Icon: PaddleIcon,
      items: [
        "Subs allowed from the PMA community",
        "Keep it fair — no ringers",
        "Let the league know ahead of time",
      ],
    },
    {
      title: "Balls",
      Icon: BallIcon,
      items: [
        "New or fairly new balls every match",
        "Split the cost between both teams",
        "Each team brings three balls minimum",
      ],
    },
    {
      title: "The vibe",
      Icon: SparkIcon,
      items: [
        "Competitive, social and fun — this is silver level",
        "No egos. Good sportsmanship always",
        "Celebrate great shots, even your opponent's",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.venue}`}
        title="Rules"
        sub="Everything you need to know before Tuesday."
      />

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
            Play hard. Stay humble. Have fun.
          </p>
          <p className="mt-2 text-sm text-fg-muted">
            This league is about getting better together. Good games, good vibes
            — see you Tuesday.
          </p>
        </div>
      </Card>
    </div>
  );
}
