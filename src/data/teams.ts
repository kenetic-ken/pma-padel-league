/**
 * Kept as a stable entry point for Season 1 team lookups.
 *
 * New code should use the season-scoped helpers in `@/data/seasons`
 * (`teamById(season, id)` / `teamName(season, id)`) so it works across seasons.
 */

import { season1Teams } from "./season-1";
import type { Team } from "./types";

export type { Team };

export const teams: Team[] = season1Teams;

export function getTeamById(id: number): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function getTeamName(id: number): string {
  const team = getTeamById(id);
  return team ? `${team.name} (${team.players})` : `Team ${id}`;
}
