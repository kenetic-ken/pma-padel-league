import Link from "next/link";
import {
  BallIcon,
  CourtIcon,
  PinIcon,
  PointsIcon,
} from "@/components/graphics/icons";
import { CourtHorizon } from "@/components/graphics/PadelCourt";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import { MatchRow } from "@/components/ui/MatchRow";
import { SegmentedTabs, type Segment } from "@/components/ui/SegmentedTabs";
import { StatTile } from "@/components/ui/StatTile";
import { computeLadder } from "@/data/ladder";
import {
  currentSeason,
  formatRoundDate,
  formatShortDate,
  isSeasonFinished,
  latestPlayedRound,
  nextUnplayedRound,
  seasonEnd,
  seasonStart,
  teamById,
} from "@/data/seasons";
import { getResults } from "@/lib/results";
import { cn } from "@/lib/cn";

export const revalidate = 60;

export default async function HomePage() {
  const season = currentSeason;
  const results = await getResults();
  const finished = isSeasonFinished(season);
  const ladder = computeLadder(season.schedule, season.teams, results);
  const anyPlayed = ladder.some((e) => e.played > 0);

  const nextRound = finished ? undefined : nextUnplayedRound(season, results);
  const lastRound = latestPlayedRound(season, results);
  const start = seasonStart(season);
  const end = seasonEnd(season);

  const segments: Segment[] = [];

  if (nextRound) {
    segments.push({
      id: "next",
      label: "Next up",
      content: (
        <Card accent>
          <CardHeader
            accent
            title={`Round ${nextRound.round}`}
            meta={formatRoundDate(nextRound.date)}
          />
          <CardRows>
            {nextRound.matches.map((match) => (
              <MatchRow
                key={match.id}
                season={season}
                match={match}
                result={results[match.id]}
              />
            ))}
          </CardRows>
        </Card>
      ),
    });
  }

  if (lastRound) {
    segments.push({
      id: "results",
      label: "Latest results",
      content: (
        <Card>
          <CardHeader
            title={`Round ${lastRound.round}`}
            meta={formatRoundDate(lastRound.date)}
          />
          <CardRows>
            {lastRound.matches
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
      ),
    });
  }

  if (anyPlayed) {
    segments.push({
      id: "ladder",
      label: finished ? "Final four" : "Top four",
      content: (
        <Card>
          <CardHeader
            title={finished ? "Final ladder" : "Ladder"}
            meta="Top 4"
          />
          <CardRows>
            {ladder.slice(0, 4).map((entry, index) => {
              const team = teamById(season, entry.teamId);
              return (
                <div
                  key={entry.teamId}
                  className="flex items-center gap-3 px-4 py-3 sm:px-5"
                >
                  <span
                    className={cn(
                      "font-display nums w-6 text-center text-xl leading-none",
                      index < 2 ? "text-accent" : "text-fg-muted",
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] leading-tight text-fg">
                      {team?.name ?? `Team ${entry.teamId}`}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-fg-subtle">
                      {team?.players}
                    </p>
                  </div>
                  <span className="nums text-xs text-fg-subtle">
                    {entry.played}P
                  </span>
                  <span
                    className={cn(
                      "font-display nums min-w-8 rounded-[3px] px-1.5 py-0.5 text-center text-lg leading-tight",
                      index < 2
                        ? "bg-accent text-accent-ink"
                        : "bg-surface-raised text-fg",
                    )}
                  >
                    {entry.points}
                  </span>
                </div>
              );
            })}
          </CardRows>
        </Card>
      ),
    });
  }

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-line/60">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_115%,rgba(191,255,0,0.13),transparent_62%)]"
        />
        <CourtHorizon />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <Badge variant={finished ? "muted" : "accent"}>
            {finished ? `${season.label} complete` : season.label}
          </Badge>

          <h1 className="font-display mt-5 text-hero text-fg">
            PMA
            <br />
            <span className="text-accent">Tuesday</span>
            <br />
            League
          </h1>

          <p className="mt-5 text-eyebrow font-medium text-fg-muted uppercase">
            {season.venue} · {season.matchDay} · {season.defaultTime}
          </p>

          <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-y-7 sm:max-w-2xl sm:grid-cols-4">
            <StatTile value={season.teams.length} label="Teams" />
            <StatTile value={season.schedule.length} label="Rounds" />
            {start ? (
              <StatTile value={formatShortDate(start)} label="Season start" />
            ) : null}
            {end ? (
              <StatTile value={formatShortDate(end)} label="Season end" />
            ) : null}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/ladder"
              className="rounded-chip bg-accent px-6 py-3 text-label font-semibold text-accent-ink uppercase transition-opacity hover:opacity-90"
            >
              {finished ? "Final ladder" : "View ladder"}
            </Link>
            <Link
              href="/schedule"
              className="rounded-chip px-6 py-3 text-label font-semibold text-accent uppercase ring-1 ring-accent/50 ring-inset transition-colors hover:bg-accent/10"
            >
              See schedule
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Snapshot */}
      {segments.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-display mb-4 text-title text-fg-muted">
            The league right now
          </h2>
          <SegmentedTabs segments={segments} />
        </section>
      ) : null}

      {/* -------------------------------------------------------------- Format */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="font-display mb-4 text-title text-fg-muted">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formatCards.map((card) => (
            <Card key={card.title} className="relative overflow-hidden p-5">
              {/* Oversized watermark of the card's own glyph */}
              <card.Icon
                className="absolute -top-4 -right-5 size-28 text-accent/[0.055]"
                strokeWidth={1}
              />
              <card.Icon className="size-6 text-accent" />
              <h3 className="font-display mt-3.5 text-title text-accent">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {card.body}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

const formatCards = [
  {
    title: "3 set format",
    Icon: CourtIcon,
    body: "Three full sets, standard padel scoring. Maximum two deuces per game — the third deuce is a golden point.",
  },
  {
    title: "Points system",
    Icon: PointsIcon,
    body: "Win a set, win a league point. A 3–0 win earns 3 points; a 2–1 win earns 2 to the winner and 1 to the loser. Every set counts.",
  },
  {
    title: "Good vibes",
    Icon: BallIcon,
    body: "Silver level play. Competitive, social, fun. No egos — just good padel with mates.",
  },
  {
    title: "Canggu Padel",
    Icon: PinIcon,
    body: "All matches at Canggu Padel every Tuesday. First match at 5:30pm, second at 7:00pm.",
  },
];
