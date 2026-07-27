import type { Round, Team } from "./types";

export const season1Teams: Team[] = [
  { id: 1, name: "Lobsters", players: "Damon & Scott" },
  { id: 2, name: "Singkenken", players: "Ken, Niko & Federico" },
  { id: 3, name: "Padel to the Metal", players: "Troy & Fab" },
  { id: 4, name: "The B Team", players: "JB & Dave" },
  { id: 5, name: "The Silver Nagas", players: "Rick & Mehdi" },
  { id: 6, name: "Island Storm", players: "Tim & Adam & Todd" },
  { id: 7, name: "Eight Eyes", players: "Justin & Ben" },
  { id: 8, name: "Court Jesters", players: "Phil & Adam" },
];

/** Match ids are the historic Season 1 form — results in KV are keyed by these. */
export const season1Schedule: Round[] = [
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
      { id: "r3m1", home: 1, away: 6, time: "7:30pm" },
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
