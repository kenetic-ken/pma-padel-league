import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import type { Team } from "@/data/types";

/**
 * The season's field, for use before a qualifier has sorted teams into
 * divisions — at which point the ladder takes over.
 */
export function TeamList({
  teams,
  title,
  meta,
  expected,
}: {
  teams: Team[];
  title: string;
  meta?: React.ReactNode;
  /** Renders empty slots up to this count, so a short roster reads as pending. */
  expected?: number;
}) {
  const missing = Math.max(0, (expected ?? teams.length) - teams.length);

  return (
    <Card as="section">
      <CardHeader title={title} meta={meta} />
      <CardRows>
        {teams.map((team, index) => (
          <div
            key={team.id}
            className="flex items-center gap-3.5 px-4 py-3 sm:px-5"
          >
            <span className="font-display nums w-6 shrink-0 text-center text-lg leading-none text-fg-subtle">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] leading-tight text-fg">
                {team.name}
                {team.nameProvisional ? (
                  <span className="ml-1.5 text-xs text-fg-subtle">
                    (name TBC)
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 truncate text-xs text-fg-subtle">
                {team.players}
              </p>
            </div>
          </div>
        ))}

        {Array.from({ length: missing }, (_, i) => (
          <div
            key={`pending-${i}`}
            className="flex items-center gap-3.5 px-4 py-3 sm:px-5"
          >
            <span className="font-display nums w-6 shrink-0 text-center text-lg leading-none text-fg-subtle/50">
              {teams.length + i + 1}
            </span>
            <p className="text-[0.9375rem] leading-tight text-fg-subtle">
              Team to be confirmed
            </p>
          </div>
        ))}
      </CardRows>
    </Card>
  );
}
