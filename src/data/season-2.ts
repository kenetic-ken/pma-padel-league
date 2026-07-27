import type { Round, Team } from "./types";

/* ============================================================================
   SEASON 2 — not published yet.
   ============================================================================

   To bring Season 2 live, do three things:

   1. Fill in `season2Teams` below (ids start at 1 again — team ids are scoped
      to their season).
   2. Fill in `season2Schedule` below. IMPORTANT: every match id must start
      with the `s2` prefix, e.g. `s2r1m1`. Results for every season share a
      single KV map keyed by match id, so an unprefixed id would collide with
      Season 1 and overwrite its history.
   3. In `seasons.ts`, change Season 2's `status` from `"draft"` to
      `"upcoming"` (or `"live"` once round 1 is played).

   Nothing else needs changing — the nav season switcher, ladder, schedule and
   results pages all read from the season registry.
   ============================================================================ */

export const season2Teams: Team[] = [
  // { id: 1, name: "", players: "" },
];

export const season2Schedule: Round[] = [
  // {
  //   round: 1,
  //   date: "2026-09-01",
  //   matches: [
  //     { id: "s2r1m1", home: 1, away: 2 },
  //   ],
  // },
];
