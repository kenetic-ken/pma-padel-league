import { cn } from "@/lib/cn";

/**
 * A raised panel on the near-black canvas. Depth comes from the surface step,
 * not from a border — matching the broadcast padel UI this design follows.
 */
export function Card({
  children,
  className,
  accent = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Tints the panel and gives it a lime edge — for the live/current item. */
  accent?: boolean;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "overflow-hidden rounded-panel",
        accent
          ? "bg-accent-wash ring-1 ring-accent-edge ring-inset"
          : "bg-surface",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Small uppercase strip at the top of a Card. */
export function CardHeader({
  title,
  meta,
  accent = false,
  className,
}: {
  title: React.ReactNode;
  /** Right-aligned secondary content, e.g. a date. */
  meta?: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 sm:px-5",
        accent ? "bg-accent-edge/40" : "bg-surface-raised",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <h2
          className={cn(
            "font-display truncate text-title",
            accent ? "text-accent" : "text-fg",
          )}
        >
          {title}
        </h2>
      </div>
      {meta ? (
        <div className="text-xs text-fg-muted nums shrink-0">{meta}</div>
      ) : null}
    </div>
  );
}

/** Divider-separated body for stacked rows inside a Card. */
export function CardRows({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-line/60", className)}>{children}</div>
  );
}
