import { season1Schedule, season1Teams } from "./season-1";
import {
  season2Divisions,
  season2Finals,
  season2Qualifier,
  season2Schedule,
  season2Teams,
} from "./season-2";
import type {
  Division,
  FinalsNight,
  Match,
  Qualifier,
  ResultsMap,
  Round,
  ScoringRule,
  Team,
} from "./types";

export type SeasonStatus = "draft" | "upcoming" | "live" | "completed";

export interface Season {
  /** URL slug, e.g. "season-1". */
  slug: string;
  number: number;
  /** Display label, e.g. "Season 1". */
  label: string;
  status: SeasonStatus;
  /** One-line statement of what the season is about. */
  tagline: string;
  /**
   * Where matches are played. For a season with divisions this is a summary —
   * each division carries its own venue.
   */
  venue: string;
  /** Weekday matches are played on, e.g. "Tuesdays". */
  matchDay: string;
  /** Default first-match time; individual matches can override it. */
  defaultTime: string;
  /** Court booking length in minutes. */
  bookingMinutes: number;
  /**
   * How many teams the season actually has. Stated explicitly because the
   * roster array can be short while a team is still unnamed — counting it
   * would understate the league.
   */
  teamCount: number;
  /** How league points are awarded. Fixed per season. */
  scoring: ScoringRule;
  teams: Team[];
  /**
   * The season calendar. For a single-division season this holds the fixtures;
   * for a divisional season the rounds carry dates only and each division holds
   * its own fixtures.
   */
  schedule: Round[];
  /** Present when the season splits into divisions. */
  divisions?: Division[];
  /** Present when a qualifying event seeds the divisions. */
  qualifier?: Qualifier;
  /** Present when the season ends in a finals night. */
  finals?: FinalsNight;
}

export const seasons: Season[] = [
  {
    slug: "season-1",
    number: 1,
    label: "Season 1",
    status: "completed",
    tagline: "Eight teams, seven rounds, one ladder.",
    venue: "Canggu Padel",
    matchDay: "Tuesdays",
    defaultTime: "5:30pm",
    bookingMinutes: 120,
    teamCount: 8,
    scoring: "sets",
    teams: season1Teams,
    schedule: season1Schedule,
  },
  {
    slug: "season-2",
    number: 2,
    label: "Season 2",
    status: "upcoming",
    tagline: "Competitive matches. Good banter. No dickheads.",
    venue: "Paradise Padel & Holywings",
    matchDay: "Tuesdays",
    defaultTime: "5:30pm",
    bookingMinutes: 90,
    teamCount: 16,
    scoring: "sets-plus-win",
    teams: season2Teams,
    schedule: season2Schedule,
    divisions: season2Divisions,
    qualifier: season2Qualifier,
    finals: season2Finals,
  },
];

/** Seasons with something worth showing. Drafts are hidden entirely. */
export const publishedSeasons: Season[] = seasons.filter(
  (s) => s.status !== "draft",
);

/**
 * The season the site defaults to: the live one if there is one, otherwise the
 * most recent published season.
 */
export const currentSeason: Season =
  publishedSeasons.find((s) => s.status === "live") ??
  publishedSeasons[publishedSeasons.length - 1] ??
  seasons[0];

/** Completed seasons, most recent first. */
export const archivedSeasons: Season[] = publishedSeasons
  .filter((s) => s.status === "completed")
  .reverse();

export function getSeason(slug?: string): Season {
  if (!slug) return currentSeason;
  return publishedSeasons.find((s) => s.slug === slug) ?? currentSeason;
}

/* -- Season-scoped helpers ------------------------------------------------- */

export function teamById(season: Season, id: number): Team | undefined {
  return season.teams.find((t) => t.id === id);
}

export function teamName(season: Season, id: number): string {
  return teamById(season, id)?.name ?? `Team ${id}`;
}

/** Teams belonging to a division, in seed order. */
export function divisionTeams(season: Season, division: Division): Team[] {
  return division.teamIds
    .map((id) => teamById(season, id))
    .filter((t): t is Team => Boolean(t));
}

/** True once the qualifier has sorted teams into their divisions. */
export function divisionsAssigned(season: Season): boolean {
  return Boolean(season.divisions?.every((d) => d.teamIds.length > 0));
}

export function seasonStart(season: Season): string | undefined {
  return season.qualifier?.date ?? season.schedule[0]?.date;
}

export function seasonEnd(season: Season): string | undefined {
  return (
    season.finals?.date ?? season.schedule[season.schedule.length - 1]?.date
  );
}

export function allMatches(season: Season): Match[] {
  const divisional = (season.divisions ?? []).flatMap((d) =>
    d.schedule.flatMap((r) => r.matches),
  );
  return [...season.schedule.flatMap((r) => r.matches), ...divisional];
}

/** True when no fixtures exist anywhere in the season yet. */
export function fixturesPending(season: Season): boolean {
  return allMatches(season).length === 0;
}

/**
 * The round the season is "on".
 *
 * Returns the first round not yet in the past. Once every round has been
 * played this returns `undefined` — which is what tells the UI the season is
 * finished, rather than pinning "CURRENT" to the final round forever.
 */
export function activeRound(
  season: Season,
  today = new Date(),
): Round | undefined {
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  return season.schedule.find((round) => parseDate(round.date) >= startOfDay);
}

/** True when every round, and any finals night, is in the past. */
export function isSeasonFinished(season: Season, today = new Date()): boolean {
  if (season.schedule.length === 0) return false;
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  if (season.finals && parseDate(season.finals.date) >= startOfDay)
    return false;
  return activeRound(season, today) === undefined;
}

/** Rounds for a division if it has its own fixtures, else the season calendar. */
export function roundsFor(season: Season, division?: Division): Round[] {
  if (division && division.schedule.length > 0) return division.schedule;
  return season.schedule;
}

/** The next round with at least one match still missing a result. */
export function nextUnplayedRound(
  season: Season,
  results: ResultsMap,
): Round | undefined {
  return season.schedule.find(
    (round) =>
      round.matches.length > 0 &&
      round.matches.some((match) => !results[match.id]),
  );
}

/** Most recent round with at least one result, latest first. */
export function latestPlayedRound(
  season: Season,
  results: ResultsMap,
): Round | undefined {
  return [...season.schedule]
    .reverse()
    .find((round) => round.matches.some((match) => results[match.id]));
}

/** Rounds that have at least one result, most recent first. */
export function playedRounds(season: Season, results: ResultsMap): Round[] {
  return [...season.schedule]
    .reverse()
    .filter((round) => round.matches.some((match) => results[match.id]));
}

/** Parses a `YYYY-MM-DD` league date as local midnight. */
export function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

export function formatRoundDate(date: string): string {
  return parseDate(date).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatLongDate(date: string): string {
  return parseDate(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(date: string): string {
  return parseDate(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

export function formatWeekdayLong(date: string): string {
  return parseDate(date).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
