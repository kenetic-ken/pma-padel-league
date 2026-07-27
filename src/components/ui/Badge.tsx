import { cn } from "@/lib/cn";

type Variant = "accent" | "live" | "outline" | "muted";

const variants: Record<Variant, string> = {
  accent: "bg-accent text-accent-ink",
  live: "bg-live/15 text-live ring-1 ring-live/40 ring-inset",
  outline: "text-accent ring-1 ring-accent/50 ring-inset",
  muted: "bg-surface-raised text-fg-muted",
};

export function Badge({
  children,
  variant = "accent",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-chip px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.14em] uppercase",
        variants[variant],
        className,
      )}
    >
      {variant === "live" ? (
        <span aria-hidden className="size-1.5 rounded-full bg-live" />
      ) : null}
      {children}
    </span>
  );
}
