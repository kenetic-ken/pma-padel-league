export interface Match {
  id: string;
  home: number;
  away: number;
  time?: string;
}

export interface Round {
  round: number;
  date: string;
  matches: Match[];
}

export const schedule: Round[] = [
  {
    round: 1,
    date: "2026-05-26",
    matches: [
      { id: "r1m1", home: 1, away: 3 },
      { id: "r1m2", home: 4, away: 2 },
      { id: "r1m3", home: 5, away: 8 },
      { id: "r1m4", home: 6, away: 7, time: "7:00pm" },
    ],
  },
  {
    round: 2,
    date: "2026-06-02",
    matches: [
      { id: "r2m1", home: 1, away: 7 },
      { id: "r2m2", home: 8, away: 6 },
      { id: "r2m3", home: 2, away: 5 },
      { id: "r2m4", home: 3, away: 4 },
    ],
  },
  {
    round: 3,
    date: "2026-06-09",
    matches: [
      { id: "r3m1", home: 1, away: 6 },
      { id: "r3m2", home: 7, away: 5 },
      { id: "r3m3", home: 8, away: 4 },
      { id: "r3m4", home: 2, away: 3 },
    ],
  },
  {
    round: 4,
    date: "2026-06-16",
    matches: [
      { id: "r4m1", home: 1, away: 5 },
      { id: "r4m2", home: 6, away: 4 },
      { id: "r4m3", home: 7, away: 3 },
      { id: "r4m4", home: 8, away: 2 },
    ],
  },
  {
    round: 5,
    date: "2026-06-23",
    matches: [
      { id: "r5m1", home: 1, away: 4 },
      { id: "r5m2", home: 5, away: 3 },
      { id: "r5m3", home: 6, away: 2 },
      { id: "r5m4", home: 7, away: 8 },
    ],
  },
  {
    round: 6,
    date: "2026-06-30",
    matches: [
      { id: "r6m1", home: 1, away: 8 },
      { id: "r6m2", home: 2, away: 7 },
      { id: "r6m3", home: 3, away: 6 },
      { id: "r6m4", home: 4, away: 5 },
    ],
  },
  {
    round: 7,
    date: "2026-07-07",
    matches: [
      { id: "r7m1", home: 1, away: 2 },
      { id: "r7m2", home: 3, away: 8 },
      { id: "r7m3", home: 4, away: 7 },
      { id: "r7m4", home: 5, away: 6 },
    ],
  },
];

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
  points: number;
}

export function computeLadder(results: ResultsMap): LadderEntry[] {
  const map: Record<number, LadderEntry> = {};

  // Initialize all 8 teams
  for (let i = 1; i <= 8; i++) {
    map[i] = { teamId: i, played: 0, setsWon: 0, setsLost: 0, points: 0 };
  }

  for (const round of schedule) {
    for (const match of round.matches) {
      const result = results[match.id];
      if (!result) continue;

      let homeSetsWon = 0;
      let awaySetsWon = 0;

      for (const set of result.sets) {
        if (set.home > set.away) homeSetsWon++;
        else if (set.away > set.home) awaySetsWon++;
      }

      map[match.home].played++;
      map[match.away].played++;
      map[match.home].setsWon += homeSetsWon;
      map[match.home].setsLost += awaySetsWon;
      map[match.away].setsWon += awaySetsWon;
      map[match.away].setsLost += homeSetsWon;
      map[match.home].points += homeSetsWon;
      map[match.away].points += awaySetsWon;
    }
  }

  return Object.values(map).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aRatio = a.played > 0 ? a.setsWon / a.played : 0;
    const bRatio = b.played > 0 ? b.setsWon / b.played : 0;
    return bRatio - aRatio;
  });
}
