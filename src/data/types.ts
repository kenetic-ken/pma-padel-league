/**
 * Shared league types.
 *
 * These live in their own module so that both the season data files and
 * `@/data/schedule` (which the results API imports from) can depend on them
 * without a circular import.
 */

export interface Team {
  id: number;
  name: string;
  /** Free-text roster, e.g. "Damon & Scott". */
  players: string;
}

export interface Match {
  /**
   * Globally unique across every season — results are stored in a single flat
   * KV map keyed by this id, so ids must never collide between seasons.
   * Season 1 uses the historic `r1m1` form; later seasons are prefixed (`s2r1m1`).
   */
  id: string;
  home: number;
  away: number;
  /** Court time, when it differs from the season default. */
  time?: string;
}

export interface Round {
  round: number;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  matches: Match[];
}

export interface SetScore {
  home: number;
  away: number;
}

export interface MatchResult {
  matchId: string;
  sets: [SetScore, SetScore, SetScore];
}

export type ResultsMap = Record<string, MatchResult>;

export interface LadderEntry {
  teamId: number;
  played: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  points: number;
}
