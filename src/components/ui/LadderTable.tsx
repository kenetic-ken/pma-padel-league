import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatRatio } from "@/data/ladder";
import type { LadderEntry, Team } from "@/data/types";
import { cn } from "@/lib/cn";

export interface LadderRowMeta {
  /** Rank ranges that get the accent treatment, e.g. championship places. */
  highlightTo?: number;
  /** Rank ranges shown as at-risk, e.g. relegation playoff places. */
  dangerFrom?: number;
  /** Badge on the top row when the season is over. */
  championBadge?: boolean;
}

/**
 * The standings table. Shared by the live ladder and the season archive so the
 * two can't drift apart.
 *
 * Columns drop away as the viewport narrows: games at `lg`, sets at `md`, ratio
 * at `sm`. Rank, team, played and points survive to 320px.
 */
export function LadderTable({
  ladder,
  teams,
  meta = {},
}: {
  ladder: LadderEntry[];
  teams: Team[];
  meta?: LadderRowMeta;
}) {
  const byId = new Map(teams.map((t) => [t.id, t]));

  return (
    <Card className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
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
          {ladder.map((entry, index) => {
            const team = byId.get(entry.teamId);
            return (
              <Row
                key={entry.teamId}
                entry={entry}
                rank={index + 1}
                total={ladder.length}
                name={team?.name ?? `Team ${entry.teamId}`}
                players={team?.players}
                provisional={team?.nameProvisional}
                meta={meta}
              />
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function Row({
  entry,
  rank,
  total,
  name,
  players,
  provisional,
  meta,
}: {
  entry: LadderEntry;
  rank: number;
  total: number;
  name: string;
  players?: string;
  provisional?: boolean;
  meta: LadderRowMeta;
}) {
  const unplayed = entry.played === 0;
  const highlightTo = meta.highlightTo ?? 2;
  const isHighlighted = rank <= highlightTo && !unplayed;
  const isDanger = Boolean(
    meta.dangerFrom && rank >= meta.dangerFrom && rank <= total && !unplayed,
  );
  const dash = <span className="text-fg-subtle">—</span>;

  return (
    <tr className={cn(rank % 2 === 0 && "bg-surface-inset/40")}>
      <Td className="text-center">
        <span
          className={cn(
            "font-display nums text-xl leading-none",
            isHighlighted
              ? "text-accent"
              : isDanger
                ? "text-fg-muted"
                : "text-fg",
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
                isHighlighted ? "font-semibold text-fg" : "text-fg",
              )}
            >
              {name}
              {provisional ? (
                <span className="ml-1.5 text-xs text-fg-subtle">
                  (name TBC)
                </span>
              ) : null}
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
            {rank === 1 && meta.championBadge && !unplayed ? (
              <Badge>Champion</Badge>
            ) : isHighlighted ? (
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
            isHighlighted
              ? "bg-accent text-accent-ink"
              : "bg-surface-raised text-fg",
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
