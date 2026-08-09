import type { Metadata } from "next";
import { TrophyIcon } from "@/components/graphics/icons";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import { FinalsBracket } from "@/components/ui/FinalsBracket";
import { MatchRow } from "@/components/ui/MatchRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoundAnchor, RoundJumpNav } from "@/components/ui/RoundJumpNav";
import { SegmentedTabs, type Segment } from "@/components/ui/SegmentedTabs";
import type { Season } from "@/data/seasons";
import {
  activeRound,
  currentSeason,
  divisionsAssigned,
  formatRoundDate,
  formatWeekdayLong,
  isSeasonFinished,
  roundsFor,
} from "@/data/seasons";
import type { Division, ResultsMap, Round } from "@/data/types";
import { getResults } from "@/lib/results";
import { cn } from "@/lib/cn";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Schedule",
  description: `Fixtures and key dates for the PMA Padel League ${currentSeason.label}.`,
};

export default async function SchedulePage() {
  const season = currentSeason;
  const results = await getResults();
  const finished = isSeasonFinished(season);
  const assigned = divisionsAssigned(season);
  const { qualifier, finals, divisions } = season;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.matchDay}`}
        title="Schedule"
        sub={`${season.schedule.length} rounds of round-robin${divisions ? " in each division" : ""}, ${season.bookingMinutes}-minute court bookings. Arrive at least 10 minutes early and be ready to start on time.`}
      />

      {/* ------------------------------------------------------- Qualifier */}
      {qualifier ? <QualifierCard season={season} /> : null}

      {/* ---------------------------------------------------- Regular season */}
      <h2 className="font-display mb-3 text-title text-fg-muted">
        Regular season
      </h2>

      {finished ? (
        <p className="mb-6 rounded-panel bg-surface px-5 py-4 text-sm text-fg-muted">
          {season.label} is complete — every round has been played.
        </p>
      ) : null}

      {divisions && assigned ? (
        <SegmentedTabs
          segments={divisions.map((division): Segment => ({
            id: division.slug,
            label: division.name,
            content: (
              <DivisionRounds
                season={season}
                division={division}
                results={results}
              />
            ),
          }))}
        />
      ) : (
        <>
          <RoundJumpNav
            rounds={season.schedule.map((r) => r.round)}
            highlight={activeRound(season.schedule)?.round}
          />
          <RoundCards
            season={season}
            rounds={season.schedule}
            results={results}
          />
        </>
      )}

      {/* ------------------------------------------------------------ Finals */}
      {finals ? (
        <section className="mt-14">
          <div className="mb-3 flex items-center gap-2.5">
            <TrophyIcon className="size-6 shrink-0 text-accent" />
            <h2 className="font-display text-title text-fg">{finals.name}</h2>
          </div>
          <p className="mb-1 text-eyebrow font-medium text-accent uppercase">
            {formatWeekdayLong(finals.date)}
          </p>
          <p className="mb-6 max-w-2xl text-sm text-fg-muted">{finals.intro}</p>
          <FinalsBracket groups={finals.groups} />
        </section>
      ) : null}
    </div>
  );
}

/* -- Division panel --------------------------------------------------------- */

function DivisionRounds({
  season,
  division,
  results,
}: {
  season: Season;
  division: Division;
  results: ResultsMap;
}) {
  const rounds = roundsFor(season, division);
  const published = division.schedule.length > 0;

  return (
    <>
      <p className="mb-3 text-sm text-fg-muted">
        {division.blurb} Home venue {division.venue}
        {published
          ? " — a match only shows a venue or date of its own when it differs."
          : "."}
      </p>

      <RoundJumpNav
        rounds={rounds.map((r) => r.round)}
        highlight={activeRound(rounds)?.round}
        prefix={division.slug}
        label={`Jump to round — ${division.name}`}
      />

      <RoundCards
        season={season}
        rounds={rounds}
        results={results}
        prefix={division.slug}
        defaultVenue={division.venue}
      />
    </>
  );
}

/* -- Round list ------------------------------------------------------------- */

function RoundCards({
  season,
  rounds,
  results,
  prefix,
  defaultVenue,
}: {
  season: Season;
  rounds: Round[];
  results: ResultsMap;
  prefix?: string;
  defaultVenue?: string;
}) {
  const current = activeRound(rounds);

  return (
    <div className="space-y-5">
      {rounds.map((round) => {
        const isCurrent = round.round === current?.round;
        const isPast = current ? round.round < current.round : true;
        const pending = round.matches.length === 0;

        return (
          <Card
            key={round.round}
            as="section"
            accent={isCurrent}
            className={cn(isPast && !isCurrent && "opacity-80")}
          >
            <RoundAnchor round={round.round} prefix={prefix} />
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
            {pending ? (
              <p className="px-4 py-4 text-sm text-fg-subtle sm:px-5">
                Fixtures to be announced.
              </p>
            ) : (
              <CardRows>
                {round.matches.map((match) => (
                  <MatchRow
                    key={match.id}
                    season={season}
                    match={match}
                    result={results[match.id]}
                    roundDate={round.date}
                    defaultVenue={defaultVenue}
                  />
                ))}
              </CardRows>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* -- Qualifier -------------------------------------------------------------- */

function QualifierCard({ season }: { season: Season }) {
  const qualifier = season.qualifier;
  if (!qualifier) return null;
  const decided = divisionsAssigned(season);

  return (
    <Card accent={!decided} className="mb-8">
      <CardHeader
        accent={!decided}
        title={
          <span className="flex flex-wrap items-center gap-2.5">
            {qualifier.name}
            <Badge variant={decided ? "muted" : "accent"}>
              {decided ? "Complete" : "Season opener"}
            </Badge>
          </span>
        }
        meta={formatWeekdayLong(qualifier.date)}
      />
      <div className="px-4 py-5 sm:px-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
          <span>{qualifier.venue}</span>
          <span className="nums">{qualifier.time}</span>
          <span className="nums">{qualifier.courts} courts</span>
          <span>{qualifier.format}</span>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-label font-semibold text-fg-subtle uppercase">
              {decided ? "How it ran" : "How it runs"}
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {qualifier.facts.map((fact) => (
                <Bullet key={fact}>{fact}</Bullet>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-label font-semibold text-fg-subtle uppercase">
              {decided ? "What it decided" : "What it decides"}
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {qualifier.outcomes.map((outcome) => (
                <Bullet key={outcome}>{outcome}</Bullet>
              ))}
            </ul>
          </div>
        </div>

        {qualifier.note ? (
          <p className="mt-5 text-xs text-fg-subtle">{qualifier.note}</p>
        ) : null}
      </div>
    </Card>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-4 text-sm leading-relaxed text-fg-muted">
      <span
        aria-hidden
        className="absolute top-2.5 left-0 size-1 rounded-full bg-accent"
      />
      {children}
    </li>
  );
}
