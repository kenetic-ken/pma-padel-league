import { cn } from "@/lib/cn";

/**
 * Standard page masthead: small tracked eyebrow, big Bebas title, optional
 * supporting line. Replaces the per-page hardcoded 4rem headings.
 */
export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  sub?: React.ReactNode;
  /** Right-aligned controls, e.g. a season switcher. */
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 sm:mb-10", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-2 text-eyebrow font-medium text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-display text-fg">{title}</h1>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {sub ? (
        <p className="mt-3 max-w-2xl text-sm text-fg-muted">{sub}</p>
      ) : null}
    </header>
  );
}
