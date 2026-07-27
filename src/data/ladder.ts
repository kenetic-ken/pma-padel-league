import type { LadderEntry, ResultsMap, Round, Team } from "./types";

/**
 * League points = sets won. Tiebreaker = games won / games lost ratio.
 *
 * This is the original Season 1 scoring logic, unchanged in behaviour — it now
 * takes the rounds and teams as arguments so it can be reused per season.
 */
export function computeLadder(
  rounds: Round[],
  teams: Team[],
  results: ResultsMap,
): LadderEntry[] {
  const map = new Map<number, LadderEntry>();

  for (const team of teams) {
    map.set(team.id, {
      teamId: team.id,
      played: 0,
      setsWon: 0,
      setsLost: 0,
      gamesWon: 0,
      gamesLost: 0,
      points: 0,
    });
  }

  for (const round of rounds) {
    for (const match of round.matches) {
      const result = results[match.id];
      if (!result) continue;

      const home = map.get(match.home);
      const away = map.get(match.away);
      if (!home || !away) continue;

      let homeSetsWon = 0;
      let awaySetsWon = 0;
      let homeGames = 0;
      let awayGames = 0;

      for (const set of result.sets) {
        if (set.home > set.away) homeSetsWon++;
        else if (set.away > set.home) awaySetsWon++;
        homeGames += set.home;
        awayGames += set.away;
      }

      home.played++;
      away.played++;
      home.setsWon += homeSetsWon;
      home.setsLost += awaySetsWon;
      away.setsWon += awaySetsWon;
      away.setsLost += homeSetsWon;
      home.gamesWon += homeGames;
      home.gamesLost += awayGames;
      away.gamesWon += awayGames;
      away.gamesLost += homeGames;
      home.points += homeSetsWon;
      away.points += awaySetsWon;
    }
  }

  return [...map.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return gamesRatio(b) - gamesRatio(a);
  });
}

/** Games won per game lost. Infinity when a team has yet to drop a game. */
export function gamesRatio(entry: LadderEntry): number {
  if (entry.gamesLost === 0) return entry.gamesWon > 0 ? Infinity : 0;
  return entry.gamesWon / entry.gamesLost;
}

/** Display form of {@link gamesRatio}: "—" before any games, "∞" when unbeaten. */
export function formatRatio(entry: LadderEntry): string {
  if (entry.gamesWon === 0 && entry.gamesLost === 0) return "—";
  if (entry.gamesLost === 0) return "∞";
  return (entry.gamesWon / entry.gamesLost).toFixed(2);
}

/** Sets won by each side of a completed match. */
export function setsWon(result: { sets: { home: number; away: number }[] }) {
  let home = 0;
  let away = 0;
  for (const set of result.sets) {
    if (set.home > set.away) home++;
    else if (set.away > set.home) away++;
  }
  return { home, away };
}
