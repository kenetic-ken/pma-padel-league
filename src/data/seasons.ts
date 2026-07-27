import { season1Schedule, season1Teams } from "./season-1";
import { season2Schedule, season2Teams } from "./season-2";
import type { Match, ResultsMap, Round, Team } from "./types";

export type SeasonStatus = "draft" | "upcoming" | "live" | "completed";

export interface Season {
  /** URL slug, e.g. "season-1". */
  slug: string;
  number: number;
  /** Display label, e.g. "Season 1". */
  label: string;
  status: SeasonStatus;
  venue: string;
  /** Weekday matches are played on, e.g. "Tuesdays". */
  matchDay: string;
  /** Default first-match time; individual matches can override it. */
  defaultTime: string;
  teams: Team[];
  schedule: Round[];
}

export const seasons: Season[] = [
  {
    slug: "season-1",
    number: 1,
    label: "Season 1",
    status: "completed",
    venue: "Canggu Padel",
    matchDay: "Tuesdays",
    defaultTime: "5:30pm",
    teams: season1Teams,
    schedule: season1Schedule,
  },
  {
    slug: "season-2",
    number: 2,
    label: "Season 2",
    // Flip to "upcoming" once season-2.ts is filled in. See that file.
    status: "draft",
    venue: "Canggu Padel",
    matchDay: "Tuesdays",
    defaultTime: "5:30pm",
    teams: season2Teams,
    schedule: season2Schedule,
  },
];

/** Seasons with data worth showing. Drafts are hidden from the site entirely. */
export const publishedSeasons: Season[] = seasons.filter(
  (s) => s.status !== "draft" && s.schedule.length > 0,
);

/**
 * The season the site defaults to: the live one if there is one, otherwise the
 * most recent published season.
 */
export const currentSeason: Season =
  publishedSeasons.find((s) => s.status === "live") ??
  publishedSeasons[publishedSeasons.length - 1] ??
  seasons[0];

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

export function seasonStart(season: Season): string | undefined {
  return season.schedule[0]?.date;
}

export function seasonEnd(season: Season): string | undefined {
  return season.schedule[season.schedule.length - 1]?.date;
}

export function allMatches(season: Season): Match[] {
  return season.schedule.flatMap((r) => r.matches);
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

/** True when every round has a date in the past. */
export function isSeasonFinished(season: Season, today = new Date()): boolean {
  if (season.schedule.length === 0) return false;
  return activeRound(season, today) === undefined;
}

/** The next round with at least one match still missing a result. */
export function nextUnplayedRound(
  season: Season,
  results: ResultsMap,
): Round | undefined {
  return season.schedule.find((round) =>
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
