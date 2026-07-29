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
  /** True when the team hasn't settled on a name yet. */
  nameProvisional?: boolean;
}

export interface Match {
  /**
   * Globally unique across every season — results are stored in a single flat
   * KV map keyed by this id, so ids must never collide between seasons.
   * Season 1 uses the historic `r1m1` form; later seasons are prefixed
   * (`s2d1r1m1` — season 2, division 1, round 1, match 1).
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
  /** Empty while the fixtures are still to be announced. */
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

/**
 * How league points are awarded. Fixed per season, because changing it would
 * silently rewrite the recorded history of seasons already played.
 *
 * - `sets` — Season 1: one point per set won.
 * - `sets-plus-win` — Season 2: one point per set won, plus one for taking the
 *   match. Four points are on the table in every fixture.
 */
export type ScoringRule = "sets" | "sets-plus-win";

/**
 * A division within a season. Each runs its own round robin, at its own venue,
 * and has its own ladder.
 */
export interface Division {
  slug: string;
  name: string;
  /** 1 is the highest division. */
  tier: number;
  /** One line on what the division is. */
  blurb: string;
  /** Where this division plays its regular-season matches. */
  venue: string;
  /** What teams in this division are playing for. */
  goals: string[];
  /**
   * Team ids in seed order, empty until the qualifier sorts them.
   * Seed order matters: the qualifier finish carries into the division.
   */
  teamIds: number[];
  /** Fixtures, empty until the divisions are known. */
  schedule: Round[];
}

/** A one-off qualifying event that seeds the divisions. */
export interface Qualifier {
  name: string;
  date: string;
  /** e.g. "5:00pm – 8:00pm" */
  time: string;
  venue: string;
  courts: number;
  format: string;
  /** Bullet facts about how the night runs. */
  facts: string[];
  /** What qualification produces. */
  outcomes: string[];
  /** Caveats worth stating plainly. */
  note?: string;
}

/**
 * A finals fixture defined by ladder position rather than by team — so it can
 * be published before the regular season has decided who plays in it.
 */
export interface FinalsFixture {
  id: string;
  home: string;
  away: string;
  /** What is at stake. */
  prize?: string;
}

export interface FinalsGroup {
  title: string;
  note?: string;
  fixtures: FinalsFixture[];
}

export interface FinalsNight {
  name: string;
  date: string;
  intro: string;
  groups: FinalsGroup[];
}
