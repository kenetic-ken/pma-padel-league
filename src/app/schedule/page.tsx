import type { Metadata } from "next";
import { CourtIcon, TrophyIcon } from "@/components/graphics/icons";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import { FinalsBracket } from "@/components/ui/FinalsBracket";
import { MatchRow } from "@/components/ui/MatchRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoundAnchor, RoundJumpNav } from "@/components/ui/RoundJumpNav";
import {
  activeRound,
  currentSeason,
  formatRoundDate,
  formatWeekdayLong,
  isSeasonFinished,
} from "@/data/seasons";
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
  const current = activeRound(season);
  const finished = isSeasonFinished(season);
  const { qualifier, finals, divisions } = season;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={`${season.label} · ${season.matchDay}`}
        title="Schedule"
        sub={`${season.schedule.length} rounds of round-robin${divisions ? " in each division" : ""}, ${season.bookingMinutes}-minute court bookings. Arrive at least 10 minutes early and be ready to start on time.`}
      />

      {/* ------------------------------------------------------- Qualifier */}
      {qualifier ? (
        <Card accent className="mb-8">
          <CardHeader
            accent
            title={
              <span className="flex flex-wrap items-center gap-2.5">
                {qualifier.name}
                <Badge>Season opener</Badge>
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
                  How it runs
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {qualifier.facts.map((fact) => (
                    <Bullet key={fact}>{fact}</Bullet>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-label font-semibold text-fg-subtle uppercase">
                  What it decides
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
      ) : null}

      {/* --------------------------------------------- Division venue key */}
      {divisions ? (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {divisions.map((division) => (
            <div
              key={division.slug}
              className="flex items-center gap-3 rounded-panel bg-surface px-4 py-3.5"
            >
              <CourtIcon className="size-5 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] leading-tight text-fg">
                  {division.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-fg-subtle">
                  Plays at {division.venue}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* ---------------------------------------------------- Regular season */}
      <h2 className="font-display mb-3 text-title text-fg-muted">
        Regular season
      </h2>

      <RoundJumpNav
        rounds={season.schedule.map((r) => r.round)}
        highlight={current?.round}
      />

      {finished ? (
        <p className="mb-8 rounded-panel bg-surface px-5 py-4 text-sm text-fg-muted">
          {season.label} is complete — every round has been played.
        </p>
      ) : null}

      <div className="space-y-5">
        {season.schedule.map((round) => {
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
              {pending ? (
                <p className="px-4 py-4 text-sm text-fg-subtle sm:px-5">
                  Fixtures to be announced — they follow from the qualifier
                  seeding.
                </p>
              ) : (
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
              )}
            </Card>
          );
        })}
      </div>

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
