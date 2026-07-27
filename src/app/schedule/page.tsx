import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import { MatchRow } from "@/components/ui/MatchRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoundAnchor, RoundJumpNav } from "@/components/ui/RoundJumpNav";
import {
  activeRound,
  currentSeason,
  formatRoundDate,
  isSeasonFinished,
} from "@/data/seasons";
import { getResults } from "@/lib/results";
import { cn } from "@/lib/cn";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Schedule",
  description: `Full fixture list for the PMA Tuesday Padel League ${currentSeason.label}.`,
};

export default async function SchedulePage() {
  const season = currentSeason;
  const results = await getResults();
  const current = activeRound(season);
  const finished = isSeasonFinished(season);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.venue}`}
        title="Schedule"
        sub={`${season.matchDay} from ${season.defaultTime}. ${season.schedule.length} rounds, ${season.teams.length} teams — every team plays each other once.`}
      />

      <RoundJumpNav
        rounds={season.schedule.map((r) => r.round)}
        highlight={current?.round}
      />

      {finished ? (
        <p className="mb-8 rounded-panel bg-surface px-5 py-4 text-sm text-fg-muted">
          {season.label} is complete — every round has been played. See the{" "}
          <a
            href="/ladder"
            className="text-accent underline-offset-2 hover:underline"
          >
            final ladder
          </a>
          .
        </p>
      ) : null}

      <div className="space-y-5">
        {season.schedule.map((round) => {
          const isCurrent = round.round === current?.round;
          const isPast = current ? round.round < current.round : true;

          return (
            <Card
              key={round.round}
              as="section"
              accent={isCurrent}
              className={cn(isPast && !isCurrent && "opacity-80")}
            >
              <RoundAnchor round={round.round} />
              <CardHeader
                accent={isCurrent}
                title={
                  <span className="flex items-center gap-2.5">
                    Round {round.round}
                    {isCurrent ? <Badge>Next up</Badge> : null}
                  </span>
                }
                meta={formatRoundDate(round.date)}
              />
              <CardRows>
                {round.matches.map((match) => (
                  <MatchRow
                    key={match.id}
                    season={season}
                    match={match}
                    result={results[match.id]}
                  />
                ))}
              </CardRows>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
