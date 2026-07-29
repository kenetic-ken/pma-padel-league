/**
 * Kept as a stable entry point.
 *
 * `src/app/api/results/route.ts` imports `ResultsMap` and `MatchResult` from
 * here, and that file is deliberately not modified — so this module must keep
 * re-exporting them under the same names.
 *
 * New code should import from `@/data/types`, `@/data/ladder` or
 * `@/data/seasons` directly.
 */

export type {
  LadderEntry,
  Match,
  MatchResult,
  ResultsMap,
  Round,
  SetScore,
  Team,
} from "./types";

export { computeLadder, formatRatio, gamesRatio, setsWon } from "./ladder";

/** Season 1 schedule, kept for backwards compatibility. */
export { season1Schedule as schedule } from "./season-1";
