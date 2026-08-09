import type { Metadata } from "next";
import Link from "next/link";
import { EmptyCourt } from "@/components/graphics/EmptyCourt";
import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import { MatchRow } from "@/components/ui/MatchRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoundAnchor, RoundJumpNav } from "@/components/ui/RoundJumpNav";
import { SegmentedTabs, type Segment } from "@/components/ui/SegmentedTabs";
import type { Season } from "@/data/seasons";
import {
  currentSeason,
  divisionsAssigned,
  divisionsWithFixtures,
  formatLongDate,
  fixturesPending,
  playedRounds,
  roundsFor,
  seasonStart,
} from "@/data/seasons";
import type { ResultsMap, Round } from "@/data/types";
import { getResults } from "@/lib/results";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Results",
  description: `Match results for the PMA Padel League ${currentSeason.label}.`,
};

export default async function ResultsPage() {
  const season = currentSeason;
  const results = await getResults();
  const divisions = season.divisions ?? [];
  const withFixtures = divisionsWithFixtures(season);

  // Every division's played rounds, or the season calendar's when the season
  // runs a single draw.
  const anyPlayed =
    withFixtures.length > 0
      ? withFixtures.some((d) => playedRounds(d.schedule, results).length > 0)
      : playedRounds(season.schedule, results).length > 0;

  // Before the qualifier the season "starts" at the qualifier; once it has been
  // played, the date people care about is the first round of real fixtures.
  const start = divisionsAssigned(season)
    ? (season.schedule[0]?.date ?? seasonStart(season))
    : seasonStart(season);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.venue}`}
        title="Results"
        sub="Most recent round first. Columns are the three set scores, then sets won."
      />

      {!anyPlayed ? (
        <Card className="px-6 py-14 text-center">
          <EmptyCourt className="mb-8" />
          <p className="font-display text-title text-fg-muted">
            No results yet
          </p>
          <p className="mt-2 text-sm text-fg-subtle">
            {start
              ? `First results land after Round 1 on ${formatLongDate(start)}.`
              : "Fixtures to be announced."}
            {fixturesPending(season)
              ? " Round fixtures follow the qualifier seeding."
              : null}
          </p>
          <Link
            href="/schedule"
            className="mt-6 inline-block rounded-chip bg-accent px-5 py-2.5 text-label font-semibold text-accent-ink uppercase"
          >
            See the schedule
          </Link>
        </Card>
      ) : divisions.length > 0 ? (
        <SegmentedTabs
          segments={divisions.map((division): Segment => ({
            id: division.slug,
            label: division.name,
            content: (
              <ResultRounds
                season={season}
                results={results}
                rounds={roundsFor(season, division)}
                prefix={division.slug}
              />
            ),
          }))}
        />
      ) : (
        <ResultRounds
          season={season}
          results={results}
          rounds={season.schedule}
        />
      )}

      <p className="mt-6 text-xs text-fg-subtle">
        {season.scoring === "sets-plus-win"
          ? "Ladder points = one per set won, plus one for the match winner. Every match is worth four."
          : "Ladder points = sets won. A 3–0 win earns 3 points, a 2–1 win earns 2 to the winner and 1 to the loser."}
      </p>
    </div>
  );
}

function ResultRounds({
  season,
  results,
  rounds,
  prefix,
}: {
  season: Season;
  results: ResultsMap;
  rounds: Round[];
  prefix?: string;
}) {
  const played = playedRounds(rounds, results);

  if (played.length === 0) {
    return (
      <p className="rounded-panel bg-surface px-5 py-4 text-sm text-fg-muted">
        No results in yet.
      </p>
    );
  }

  return (
    <>
      <RoundJumpNav rounds={played.map((r) => r.round)} prefix={prefix} />
      <div className="space-y-5">
        {played.map((round) => (
          <Card key={round.round} as="section">
            <RoundAnchor round={round.round} prefix={prefix} />
            <CardHeader
              title={`Round ${round.round}`}
              meta={formatLongDate(round.date)}
            />
            <CardRows>
              {round.matches
                .filter((m) => results[m.id])
                .map((match) => (
                  <MatchRow
                    key={match.id}
                    season={season}
                    match={match}
                    result={results[match.id]}
                  />
                ))}
            </CardRows>
          </Card>
        ))}
      </div>
    </>
  );
}
