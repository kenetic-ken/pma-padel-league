import Image from "next/image";
import Link from "next/link";
import {
  BallIcon,
  CalendarIcon,
  CourtIcon,
  PointsIcon,
  SparkIcon,
  TrophyIcon,
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
  divisionTeams,
  divisionsAssigned,
  divisionsWithFixtures,
  formatRoundDate,
  formatShortDate,
  formatWeekdayLong,
  isSeasonFinished,
  latestPlayedRound,
  nextUnplayedRound,
  roundsFor,
  seasonEnd,
  seasonStart,
} from "@/data/seasons";
import type { Round } from "@/data/types";
import { getResults } from "@/lib/results";
import { cn } from "@/lib/cn";

export const revalidate = 60;

export default async function HomePage() {
  const season = currentSeason;
  const results = await getResults();
  const finished = isSeasonFinished(season);
  const assigned = divisionsAssigned(season);
  const { qualifier, finals, divisions } = season;

  const start = seasonStart(season);
  const end = seasonEnd(season);

  /*
   * A divisional season has no single "next round" — each division runs its
   * own draw. Where fixtures are published per division, the snapshot stacks a
   * card per division; otherwise it falls back to the season calendar.
   */
  const withFixtures = divisionsWithFixtures(season);
  const sources: {
    key: string;
    label?: string;
    venue?: string;
    rounds: Round[];
  }[] =
    withFixtures.length > 0
      ? withFixtures.map((d) => ({
          key: d.slug,
          label: d.name,
          venue: d.venue,
          rounds: d.schedule,
        }))
      : [{ key: season.slug, rounds: season.schedule }];

  const nextRounds = finished
    ? []
    : sources.flatMap((source) => {
        const round = nextUnplayedRound(source.rounds, results);
        return round ? [{ ...source, round }] : [];
      });

  const lastRounds = sources.flatMap((source) => {
    const round = latestPlayedRound(source.rounds, results);
    return round ? [{ ...source, round }] : [];
  });

  const segments: Segment[] = [];

  if (nextRounds.length > 0) {
    segments.push({
      id: "next",
      label: "Next up",
      content: (
        <div className="space-y-4">
          {nextRounds.map((source) => (
            <Card key={source.key} accent>
              <CardHeader
                accent
                title={`${source.label ? `${source.label} · ` : ""}Round ${source.round.round}`}
                meta={formatRoundDate(source.round.date)}
              />
              <CardRows>
                {source.round.matches.map((match) => (
                  <MatchRow
                    key={match.id}
                    season={season}
                    match={match}
                    result={results[match.id]}
                    roundDate={source.round.date}
                    defaultVenue={source.venue}
                  />
                ))}
              </CardRows>
            </Card>
          ))}
        </div>
      ),
    });
  }

  if (lastRounds.length > 0) {
    segments.push({
      id: "results",
      label: "Latest results",
      content: (
        <div className="space-y-4">
          {lastRounds.map((source) => (
            <Card key={source.key}>
              <CardHeader
                title={`${source.label ? `${source.label} · ` : ""}Round ${source.round.round}`}
                meta={formatRoundDate(source.round.date)}
              />
              <CardRows>
                {source.round.matches
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

  // Once divisions exist and are populated, show the top of each ladder.
  if (divisions && assigned) {
    for (const division of divisions) {
      const teams = divisionTeams(season, division);
      const ladder = computeLadder(
        roundsFor(season, division),
        teams,
        results,
        season.scoring,
      );
      if (!ladder.some((e) => e.played > 0)) continue;
      segments.push({
        id: division.slug,
        label: division.name,
        content: (
          <Card>
            <CardHeader title={division.name} meta="Top 4" />
            <CardRows>
              {ladder.slice(0, 4).map((entry, index) => {
                const team = teams.find((t) => t.id === entry.teamId);
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
                        {team?.name}
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

          <h1 className="mt-6 flex justify-center">
            <span className="sr-only">PMA Padel League</span>
            <Image
              src="/brand/pma-badge.png"
              alt=""
              width={720}
              height={720}
              preload
              className="h-auto w-[min(78vw,26rem)]"
            />
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg leading-snug text-fg">
            {season.tagline}
          </p>
          <p className="mt-3 text-eyebrow font-medium text-fg-muted uppercase">
            {season.venue} · {season.matchDay}
          </p>

          <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-y-7 sm:max-w-2xl sm:grid-cols-4">
            <StatTile value={season.teamCount} label="Teams" />
            <StatTile
              value={divisions ? divisions.length : 1}
              label="Divisions"
            />
            {start ? (
              <StatTile value={formatShortDate(start)} label="Qualifier" />
            ) : null}
            {end ? (
              <StatTile value={formatShortDate(end)} label="Finals night" />
            ) : null}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/schedule"
              className="rounded-chip bg-accent px-6 py-3 text-label font-semibold text-accent-ink uppercase transition-opacity hover:opacity-90"
            >
              See schedule
            </Link>
            <Link
              href="/rules"
              className="rounded-chip px-6 py-3 text-label font-semibold text-accent uppercase ring-1 ring-accent/50 ring-inset transition-colors hover:bg-accent/10"
            >
              Read the rules
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Season structure */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display mb-4 text-title text-fg-muted">
          The season
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {qualifier ? (
            <StageCard
              Icon={CalendarIcon}
              eyebrow={formatWeekdayLong(qualifier.date)}
              title={qualifier.name}
              body={
                assigned
                  ? `${qualifier.format} at ${qualifier.venue}, ${qualifier.courts} courts. All ${season.teamCount} teams played 10 matches — the top 8 went to the Silver Devils, the rest to the Silver Foxes. Played and done.`
                  : `${qualifier.format} at ${qualifier.venue}, ${qualifier.courts} courts. All ${season.teamCount} teams play 10 matches — the top 8 go to the Silver Devils, the rest to the Silver Foxes.`
              }
            />
          ) : null}
          <StageCard
            Icon={CourtIcon}
            eyebrow={`${season.schedule.length} rounds`}
            title="Regular season"
            body={`Each division plays a ${season.schedule.length}-round round robin${divisions ? `. ${divisions.map((d) => `${d.name} at ${d.venue}`).join(", ")}` : ""}.`}
          />
          {finals ? (
            <StageCard
              Icon={TrophyIcon}
              eyebrow={formatWeekdayLong(finals.date)}
              title={finals.name}
              body="Championship, third-place and fifth-place playoffs, promotion and relegation, and a placement match for every Silver Foxes team."
            />
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------- Divisions */}
      {divisions ? (
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
          <h2 className="font-display mb-4 text-title text-fg-muted">
            Two divisions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {divisions.map((division) => (
              <Card key={division.slug} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-title text-accent">
                    {division.name}
                  </h3>
                  <Badge variant="muted">{division.venue}</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {division.blurb} Eight teams over {season.schedule.length}{" "}
                  regular-season rounds.
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
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Snapshot */}
      {segments.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
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
          {formatCards(season.bookingMinutes).map((card) => (
            <Card key={card.title} className="relative overflow-hidden p-5">
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

function StageCard({
  Icon,
  eyebrow,
  title,
  body,
}: {
  Icon: (props: {
    className?: string;
    strokeWidth?: number;
  }) => React.ReactElement;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Card className="p-5">
      <Icon className="size-6 text-accent" />
      <p className="mt-3.5 text-label font-semibold text-fg-subtle uppercase">
        {eyebrow}
      </p>
      <h3 className="font-display mt-1 text-title text-accent">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
    </Card>
  );
}

function formatCards(bookingMinutes: number) {
  return [
    {
      title: "3 set format",
      Icon: CourtIcon,
      body: `${bookingMinutes}-minute bookings, three sets. Standard padel scoring — two deuces played normally, then the third deuce is a Golden Point.`,
    },
    {
      title: "4 points a match",
      Icon: PointsIcon,
      body: "One ladder point for each set, plus one for the match winner. Winning the match matters. Every set matters.",
    },
    {
      title: "Shootout 15",
      Icon: BallIcon,
      body: "Under about 30 minutes left before the third set? Play first to 15, win by 2. It counts as the third set.",
    },
    {
      title: "No dickheads",
      Icon: SparkIcon,
      body: "Competitive, social, fun — mostly older Silver-level players. Leave the ego at the door. Nobody's getting scouted.",
    },
  ];
}
