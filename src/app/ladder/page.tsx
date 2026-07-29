import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LadderTable } from "@/components/ui/LadderTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedTabs, type Segment } from "@/components/ui/SegmentedTabs";
import { TeamList } from "@/components/ui/TeamList";
import { computeLadder } from "@/data/ladder";
import {
  currentSeason,
  divisionTeams,
  divisionsAssigned,
  formatLongDate,
  isSeasonFinished,
  roundsFor,
  teamById,
} from "@/data/seasons";
import { getResults } from "@/lib/results";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ladder",
  description: `Standings for the PMA Padel League ${currentSeason.label}.`,
};

export default async function LadderPage() {
  const season = currentSeason;
  const results = await getResults();
  const finished = isSeasonFinished(season);
  const assigned = divisionsAssigned(season);

  /* ---- Divisional season, divisions not yet decided --------------------- */
  if (season.divisions && !assigned) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow={`${season.label} · ${season.matchDay}`}
          title="Ladder"
          sub={
            season.qualifier
              ? `Two ladders open once the ${season.qualifier.name} sorts the field on ${formatLongDate(season.qualifier.date)}. Top eight go to the Silver Devils, the rest to the Silver Foxes.`
              : "Ladders open once the divisions are set."
          }
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {season.divisions.map((division) => (
            <Card key={division.slug} className="p-5">
              <h2 className="font-display text-title text-accent">
                {division.name}
              </h2>
              <p className="mt-1.5 text-sm text-fg-muted">{division.blurb}</p>
              <p className="mt-3 text-label font-semibold text-fg-subtle uppercase">
                {division.venue}
              </p>
              <ul className="mt-3 space-y-1.5">
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

        <TeamList
          teams={season.teams}
          title={`${season.label} field`}
          meta={`${season.teamCount} teams`}
          expected={season.teamCount}
        />

        <ArchiveLink />
      </div>
    );
  }

  /* ---- Divisional season, ladders live --------------------------------- */
  if (season.divisions && assigned) {
    const segments: Segment[] = season.divisions.map((division) => {
      const teams = divisionTeams(season, division);
      const ladder = computeLadder(
        roundsFor(season, division),
        teams,
        results,
        season.scoring,
      );
      return {
        id: division.slug,
        label: division.name,
        content: (
          <>
            <p className="mb-3 text-sm text-fg-muted">
              {division.blurb} Plays at {division.venue}.
            </p>
            <LadderTable
              ladder={ladder}
              teams={teams}
              meta={{
                highlightTo: 2,
                dangerFrom: division.tier === 1 ? 7 : undefined,
                championBadge: finished,
              }}
            />
          </>
        ),
      };
    });

    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow={`${season.label} · ${season.matchDay}`}
          title={finished ? "Final ladders" : "Ladders"}
          sub={scoringNote(season.scoring)}
        />
        <SegmentedTabs segments={segments} />
        <p className="mt-4 text-xs text-fg-subtle">
          P = matches played · Ratio = games won ÷ games lost (the tiebreaker) ·
          Pts = ladder points. Top two in the Silver Devils contest the
          championship; seventh and eighth face the promotion playoffs.
        </p>
        <ArchiveLink />
      </div>
    );
  }

  /* ---- Single-ladder season -------------------------------------------- */
  const ladder = computeLadder(
    season.schedule,
    season.teams,
    results,
    season.scoring,
  );
  const anyPlayed = ladder.some((e) => e.played > 0);
  const champion = finished && anyPlayed ? ladder[0] : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.venue}`}
        title={finished ? "Final ladder" : "Ladder"}
        sub={scoringNote(season.scoring)}
      />

      {champion ? (
        <Card accent className="mb-6 px-5 py-5 sm:px-6">
          <p className="text-eyebrow font-medium text-accent uppercase">
            {season.label} champion
          </p>
          <p className="font-display mt-1.5 text-3xl text-fg">
            {teamById(season, champion.teamId)?.name}
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            {teamById(season, champion.teamId)?.players} ·{" "}
            <span className="nums">{champion.points}</span> points from{" "}
            <span className="nums">{champion.played}</span> matches
          </p>
        </Card>
      ) : null}

      <LadderTable
        ladder={ladder}
        teams={season.teams}
        meta={{ highlightTo: 2, championBadge: finished }}
      />

      {!anyPlayed ? (
        <p className="mt-4 text-sm text-fg-subtle">
          No matches played yet — the ladder fills in as results come in.
        </p>
      ) : null}

      <p className="mt-4 text-xs text-fg-subtle">
        P = matches played · Ratio = games won ÷ games lost (the tiebreaker) ·
        Pts = ladder points
      </p>
      <ArchiveLink />
    </div>
  );
}

function scoringNote(scoring: string) {
  return scoring === "sets-plus-win"
    ? "Every match is worth four ladder points: one for each set, plus one for the match winner. Teams level on points are split by games won per game lost."
    : "Points are sets won. Teams level on points are split by games won per game lost.";
}

function ArchiveLink() {
  return (
    <p className="mt-8 text-sm text-fg-muted">
      Looking for a previous season?{" "}
      <Link
        href="/archive"
        className="text-accent underline-offset-2 hover:underline"
      >
        See the archive
      </Link>
      .
    </p>
  );
}
