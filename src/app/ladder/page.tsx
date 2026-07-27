import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { computeLadder, formatRatio } from "@/data/ladder";
import { currentSeason, isSeasonFinished, teamById } from "@/data/seasons";
import type { LadderEntry } from "@/data/types";
import { getResults } from "@/lib/results";
import { cn } from "@/lib/cn";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ladder",
  description: `Standings for the PMA Tuesday Padel League ${currentSeason.label}.`,
};

export default async function LadderPage() {
  const season = currentSeason;
  const results = await getResults();
  const ladder = computeLadder(season.schedule, season.teams, results);
  const finished = isSeasonFinished(season);
  const anyPlayed = ladder.some((e) => e.played > 0);
  const champion = finished && anyPlayed ? ladder[0] : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.venue}`}
        title={finished ? "Final ladder" : "Ladder"}
        sub="Points are sets won. Teams level on points are split by games won per game lost."
      />

      {champion ? (
        <Card accent className="mb-6 px-5 py-5 sm:px-6">
          <p className="text-eyebrow font-medium text-accent uppercase">
            {season.label} champion
          </p>
          <p className="font-display mt-1.5 text-3xl text-fg">
            {teamById(season, champion.teamId)?.name ??
              `Team ${champion.teamId}`}
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            {teamById(season, champion.teamId)?.players} ·{" "}
            <span className="nums">{champion.points}</span> points from{" "}
            <span className="nums">{champion.played}</span> matches
          </p>
        </Card>
      ) : null}

      <Card className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            {season.label} standings, ordered by league points
          </caption>
          <thead>
            <tr className="bg-surface-raised">
              <Th className="w-10 text-center">#</Th>
              <Th>Team</Th>
              <Th className="w-11 text-center">P</Th>
              <Th className="hidden w-20 text-center md:table-cell">Sets W</Th>
              <Th className="hidden w-20 text-center md:table-cell">Sets L</Th>
              <Th className="hidden w-24 text-center lg:table-cell">Games W</Th>
              <Th className="hidden w-24 text-center lg:table-cell">Games L</Th>
              <Th className="hidden w-16 text-center sm:table-cell">Ratio</Th>
              <Th className="w-14 text-center">Pts</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {ladder.map((entry, index) => (
              <LadderRow
                key={entry.teamId}
                entry={entry}
                rank={index + 1}
                seasonFinished={finished}
                name={
                  teamById(season, entry.teamId)?.name ?? `Team ${entry.teamId}`
                }
                players={teamById(season, entry.teamId)?.players}
              />
            ))}
          </tbody>
        </table>
      </Card>

      {!anyPlayed ? (
        <p className="mt-4 text-sm text-fg-subtle">
          No matches played yet — the ladder fills in as results come in.
        </p>
      ) : null}

      <p className="mt-4 text-xs text-fg-subtle">
        P = matches played · Ratio = games won ÷ games lost (the tiebreaker) ·
        Pts = league points
      </p>
    </div>
  );
}

function LadderRow({
  entry,
  rank,
  name,
  players,
  seasonFinished,
}: {
  entry: LadderEntry;
  rank: number;
  name: string;
  players?: string;
  seasonFinished: boolean;
}) {
  const unplayed = entry.played === 0;
  const isTop2 = rank <= 2 && !unplayed;
  const dash = <span className="text-fg-subtle">—</span>;

  return (
    <tr className={cn(rank % 2 === 0 && "bg-surface-inset/40")}>
      <Td className="text-center">
        <span
          className={cn(
            "font-display nums text-xl leading-none",
            isTop2
              ? "text-accent"
              : rank <= 3 && !unplayed
                ? "text-fg"
                : "text-fg-muted",
          )}
        >
          {rank}
        </span>
      </Td>
      <Td>
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-[0.9375rem] leading-tight",
                isTop2 ? "font-semibold text-fg" : "text-fg",
              )}
            >
              {name}
            </p>
            {players ? (
              <p className="mt-0.5 truncate text-xs text-fg-subtle">
                {players}
              </p>
            ) : null}
          </div>
          {/* Wrapper, not the Badge itself: `hidden` on the Badge loses to its
              own `inline-flex` in Tailwind's display-utility order. */}
          <span className="hidden sm:inline">
            {rank === 1 && seasonFinished && !unplayed ? (
              <Badge>Champion</Badge>
            ) : isTop2 ? (
              <Badge variant="outline">Top</Badge>
            ) : null}
          </span>
        </div>
      </Td>
      <Td className="text-center text-fg-muted">
        {unplayed ? dash : entry.played}
      </Td>
      <Td className="hidden text-center text-fg-muted md:table-cell">
        {unplayed ? dash : entry.setsWon}
      </Td>
      <Td className="hidden text-center text-fg-muted md:table-cell">
        {unplayed ? dash : entry.setsLost}
      </Td>
      <Td className="hidden text-center text-fg-muted lg:table-cell">
        {unplayed ? dash : entry.gamesWon}
      </Td>
      <Td className="hidden text-center text-fg-muted lg:table-cell">
        {unplayed ? dash : entry.gamesLost}
      </Td>
      <Td className="hidden text-center text-fg-muted sm:table-cell">
        {formatRatio(entry)}
      </Td>
      <Td className="text-center">
        <span
          className={cn(
            "font-display nums inline-block min-w-8 rounded-[3px] px-1.5 py-0.5 text-lg leading-tight",
            isTop2 ? "bg-accent text-accent-ink" : "bg-surface-raised text-fg",
          )}
        >
          {unplayed ? "–" : entry.points}
        </span>
      </Td>
    </tr>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-2 py-3 text-label font-semibold whitespace-nowrap text-fg-subtle uppercase first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "nums px-2 py-3.5 text-sm first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5",
        className,
      )}
    >
      {children}
    </td>
  );
}
