import { setsWon } from "@/data/ladder";
import type { Season } from "@/data/seasons";
import { teamById } from "@/data/seasons";
import type { Match, MatchResult } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * One fixture, played or not.
 *
 * The two teams stack vertically with right-aligned numeric columns, so the
 * layout holds together from 320px up — the previous three-column
 * home / score / away flex row squeezed team names into three cramped lines on
 * a phone.
 */
export function MatchRow({
  season,
  match,
  result,
  showPlayers = true,
  className,
}: {
  season: Season;
  match: Match;
  result?: MatchResult;
  showPlayers?: boolean;
  className?: string;
}) {
  const home = teamById(season, match.home);
  const away = teamById(season, match.away);
  const homeName = home?.name ?? `Team ${match.home}`;
  const awayName = away?.name ?? `Team ${match.away}`;
  const time = match.time ?? season.defaultTime;

  const tally = result ? setsWon(result) : undefined;
  const homeWon = tally ? tally.home > tally.away : false;
  const awayWon = tally ? tally.away > tally.home : false;

  const label = result
    ? `${homeName} ${tally!.home}, ${awayName} ${tally!.away}`
    : `${homeName} versus ${awayName}, ${time}`;

  return (
    <article
      aria-label={label}
      className={cn("px-4 py-3.5 sm:px-5", className)}
    >
      <div
        className="grid items-center gap-x-2 gap-y-2.5 sm:gap-x-3"
        style={{
          gridTemplateColumns: result
            ? "minmax(0,1fr) repeat(3, 1.625rem) 2.25rem"
            : "minmax(0,1fr) auto",
        }}
      >
        <TeamCell
          name={homeName}
          players={showPlayers ? home?.players : undefined}
          won={homeWon}
          decided={Boolean(result)}
        />
        {result ? (
          <>
            {result.sets.map((set, i) => (
              <SetCell key={i} value={set.home} won={set.home > set.away} />
            ))}
            <TotalCell value={tally!.home} won={homeWon} />
          </>
        ) : (
          <FixtureMeta time={time} />
        )}

        <TeamCell
          name={awayName}
          players={showPlayers ? away?.players : undefined}
          won={awayWon}
          decided={Boolean(result)}
        />
        {result ? (
          <>
            {result.sets.map((set, i) => (
              <SetCell key={i} value={set.away} won={set.away > set.home} />
            ))}
            <TotalCell value={tally!.away} won={awayWon} />
          </>
        ) : null}
      </div>
    </article>
  );
}

function TeamCell({
  name,
  players,
  won,
  decided,
}: {
  name: string;
  players?: string;
  won: boolean;
  decided: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span
        aria-hidden
        className={cn(
          "mt-1 h-4 w-0.5 shrink-0 rounded-full",
          won ? "bg-accent" : "bg-transparent",
        )}
      />
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-[0.9375rem] leading-tight",
            won
              ? "font-semibold text-fg"
              : decided
                ? "text-fg-muted"
                : "text-fg",
          )}
        >
          {name}
        </p>
        {players ? (
          <p className="mt-0.5 truncate text-xs text-fg-subtle">{players}</p>
        ) : null}
      </div>
    </div>
  );
}

function SetCell({ value, won }: { value: number; won: boolean }) {
  return (
    <span
      className={cn(
        "nums rounded-[3px] py-1 text-center text-sm tabular-nums",
        won ? "text-fg" : "text-fg-subtle",
      )}
    >
      {value}
    </span>
  );
}

function TotalCell({ value, won }: { value: number; won: boolean }) {
  return (
    <span
      className={cn(
        "nums font-display rounded-[3px] py-0.5 text-center text-xl leading-none",
        won ? "bg-accent text-accent-ink" : "bg-surface-raised text-fg-muted",
      )}
    >
      {value}
    </span>
  );
}

/** Right-hand block for an unplayed fixture: spans both team rows. */
function FixtureMeta({ time }: { time: string }) {
  return (
    <div
      className="flex flex-col items-end justify-center gap-1 self-stretch"
      style={{ gridRow: "span 2" }}
    >
      <span className="text-label font-medium text-fg-subtle uppercase">
        vs
      </span>
      <span className="nums text-xs text-fg-muted">{time}</span>
    </div>
  );
}
