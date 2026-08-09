import type { Metadata } from "next";
import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import { LadderTable } from "@/components/ui/LadderTable";
import { MatchRow } from "@/components/ui/MatchRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedTabs, type Segment } from "@/components/ui/SegmentedTabs";
import { computeLadder } from "@/data/ladder";
import {
  archivedSeasons,
  formatLongDate,
  playedRounds,
  seasonEnd,
  seasonStart,
  teamById,
} from "@/data/seasons";
import { getResults } from "@/lib/results";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Final ladders and results from previous PMA Padel League seasons.",
};

export default async function ArchivePage() {
  const results = await getResults();

  if (archivedSeasons.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader title="Archive" sub="No completed seasons yet." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="Past seasons"
        title="Archive"
        sub="Final ladders and every result, kept as they finished."
      />

      <div className="space-y-14">
        {archivedSeasons.map((season) => {
          const ladder = computeLadder(
            season.schedule,
            season.teams,
            results,
            season.scoring,
          );
          const champion = ladder.find((e) => e.played > 0)
            ? ladder[0]
            : undefined;
          const rounds = playedRounds(season.schedule, results);
          const start = seasonStart(season);
          const end = seasonEnd(season);

          const segments: Segment[] = [
            {
              id: `${season.slug}-ladder`,
              label: "Final ladder",
              content: (
                <LadderTable
                  ladder={ladder}
                  teams={season.teams}
                  meta={{ highlightTo: 2, championBadge: true }}
                />
              ),
            },
          ];

          if (rounds.length > 0) {
            segments.push({
              id: `${season.slug}-results`,
              label: "All results",
              content: (
                <div className="space-y-4">
                  {rounds.map((round) => (
                    <Card key={round.round} as="section">
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
              ),
            });
          }

          return (
            <section key={season.slug}>
              <div className="mb-4">
                <h2 className="font-display text-3xl text-fg">
                  {season.label}
                </h2>
                <p className="mt-1 text-sm text-fg-muted">
                  {season.venue}
                  {start && end
                    ? ` · ${formatLongDate(start)} – ${formatLongDate(end)}`
                    : null}
                  {` · ${season.teams.length} teams`}
                </p>
              </div>

              {champion ? (
                <Card accent className="mb-5 px-5 py-5 sm:px-6">
                  <p className="text-eyebrow font-medium text-accent uppercase">
                    Champion
                  </p>
                  <p className="font-display mt-1.5 text-2xl text-fg">
                    {teamById(season, champion.teamId)?.name}
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">
                    {teamById(season, champion.teamId)?.players} ·{" "}
                    <span className="nums">{champion.points}</span> points from{" "}
                    <span className="nums">{champion.played}</span> matches
                  </p>
                </Card>
              ) : null}

              <SegmentedTabs segments={segments} />

              <p className="mt-3 text-xs text-fg-subtle">
                {season.scoring === "sets"
                  ? "Scored under the Season 1 system: one ladder point per set won."
                  : "One ladder point per set won, plus one for the match winner."}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
