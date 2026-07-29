import { cn } from "@/lib/cn";

export function StatTile({
  value,
  label,
  className,
}: {
  value: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <div className="font-display nums text-stat leading-none text-accent">
        {value}
      </div>
      <div className="mt-1.5 text-label font-medium text-fg-muted uppercase">
        {label}
      </div>
    </div>
  );
}
