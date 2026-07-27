import type { Metadata } from "next";
import Link from "next/link";
import { EmptyCourt } from "@/components/graphics/EmptyCourt";
import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import { MatchRow } from "@/components/ui/MatchRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoundAnchor, RoundJumpNav } from "@/components/ui/RoundJumpNav";
import {
  currentSeason,
  formatLongDate,
  playedRounds,
  seasonStart,
} from "@/data/seasons";
import { getResults } from "@/lib/results";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Results",
  description: `Match results for the PMA Tuesday Padel League ${currentSeason.label}.`,
};

export default async function ResultsPage() {
  const season = currentSeason;
  const results = await getResults();
  const rounds = playedRounds(season, results);
  const start = seasonStart(season);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.venue}`}
        title="Results"
        sub="Most recent round first. Columns are the three set scores, then sets won."
      />

      {rounds.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <EmptyCourt className="mb-8" />
          <p className="font-display text-title text-fg-muted">
            No results yet
          </p>
          <p className="mt-2 text-sm text-fg-subtle">
            {start
              ? `${season.label} kicks off ${formatLongDate(start)}.`
              : "Fixtures to be announced."}
          </p>
          <Link
            href="/schedule"
            className="mt-6 inline-block rounded-chip bg-accent px-5 py-2.5 text-label font-semibold text-accent-ink uppercase"
          >
            See the schedule
          </Link>
        </Card>
      ) : (
        <>
          <RoundJumpNav rounds={rounds.map((r) => r.round)} />
          <div className="space-y-5">
            {rounds.map((round) => {
              const played = round.matches.filter((m) => results[m.id]);

              return (
                <Card key={round.round} as="section">
                  <RoundAnchor round={round.round} />
                  <CardHeader
                    title={`Round ${round.round}`}
                    meta={formatLongDate(round.date)}
                  />
                  <CardRows>
                    {played.map((match) => (
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
        </>
      )}

      <p className="mt-6 text-xs text-fg-subtle">
        League points = sets won. A 3–0 win earns 3 points, a 2–1 win earns 2 to
        the winner and 1 to the loser.
      </p>
    </div>
  );
}
