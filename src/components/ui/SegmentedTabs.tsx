"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export interface Segment {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * Pill-track tab control, as used on broadcast padel sites to switch between
 * live / results / upcoming inside a single card.
 */
export function SegmentedTabs({
  segments,
  initial,
  className,
}: {
  segments: Segment[];
  initial?: string;
  className?: string;
}) {
  const base = useId();
  const [active, setActive] = useState(initial ?? segments[0]?.id);

  if (segments.length === 0) return null;

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="View"
        className="flex gap-1 rounded-block bg-surface-inset p-1"
      >
        {segments.map((segment) => {
          const selected = segment.id === active;
          return (
            <button
              key={segment.id}
              role="tab"
              type="button"
              id={`${base}-tab-${segment.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${segment.id}`}
              onClick={() => setActive(segment.id)}
              className={cn(
                "flex-1 rounded-[6px] px-3 py-2 text-label font-semibold uppercase transition-colors",
                selected
                  ? "bg-surface-raised text-fg"
                  : "text-fg-subtle hover:text-fg-muted",
              )}
            >
              {segment.label}
            </button>
          );
        })}
      </div>

      {segments.map((segment) => (
        <div
          key={segment.id}
          role="tabpanel"
          id={`${base}-panel-${segment.id}`}
          aria-labelledby={`${base}-tab-${segment.id}`}
          hidden={segment.id !== active}
          className="mt-3"
        >
          {segment.content}
        </div>
      ))}
    </div>
  );
}
