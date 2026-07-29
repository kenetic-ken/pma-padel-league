import { Card, CardHeader, CardRows } from "@/components/ui/Card";
import type { FinalsGroup } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Finals fixtures written in terms of ladder position, so the whole night can
 * be published before the regular season has decided who plays in it.
 */
export function FinalsBracket({
  groups,
  className,
}: {
  groups: FinalsGroup[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {groups.map((group) => (
        <Card key={group.title} as="section">
          <CardHeader
            title={group.title}
            meta={
              group.fixtures.length > 1
                ? `${group.fixtures.length} matches`
                : undefined
            }
          />
          {group.note ? (
            <p className="border-b border-line/60 px-4 py-2.5 text-xs text-fg-subtle sm:px-5">
              {group.note}
            </p>
          ) : null}
          <CardRows>
            {group.fixtures.map((fixture) => (
              <div key={fixture.id} className="px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-3">
                  <p className="min-w-0 flex-1 text-right text-[0.9375rem] leading-tight text-fg">
                    {fixture.home}
                  </p>
                  <span className="text-label shrink-0 font-semibold text-fg-subtle uppercase">
                    vs
                  </span>
                  <p className="min-w-0 flex-1 text-[0.9375rem] leading-tight text-fg">
                    {fixture.away}
                  </p>
                </div>
                {fixture.prize ? (
                  <p className="mt-2 text-center text-xs text-accent">
                    {fixture.prize}
                  </p>
                ) : null}
              </div>
            ))}
          </CardRows>
        </Card>
      ))}
    </div>
  );
}
