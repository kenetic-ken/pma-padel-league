import type { Division, FinalsNight, Qualifier, Round, Team } from "./types";

/* ============================================================================
   SEASON 2 — the expanded PMA.

   Sixteen teams. One qualifier night sorts them into two divisions, each of
   which then plays its own seven-round round robin at its own venue, before a
   single finals night decides the champions and who moves between divisions.

   The qualifier was played on 4 August and both divisions are now seeded.

   Still outstanding:
   - Silver Foxes fixtures.
   ============================================================================ */

export const season2Teams: Team[] = [
  { id: 1, name: "Eight Eyes", players: "Ben & Justin" },
  { id: 2, name: "Singkenken", players: "Ken & Niko" },
  { id: 3, name: "Island Storm", players: "Tim, Todd & Adam" },
  // "TBD" is the team's actual name, not a placeholder — hence no
  // `nameProvisional`. The Steve here and the Steve on Wild Cards are two
  // different people.
  { id: 4, name: "TBD", players: "Steve & Alexander" },
  { id: 5, name: "Kopi Krem", players: "Mehdi & Olivier" },
  { id: 6, name: "Shake n Bake", players: "Fab & Dave" },
  { id: 7, name: "The Feds", players: "Federico & Federico" },
  { id: 8, name: "Lobsters", players: "Scott & Damon" },
  { id: 9, name: "Vamos", players: "Hally & Phil" },
  { id: 10, name: "Slappers", players: "Jason & Alejandro" },
  { id: 11, name: "Rickochet", players: "Warrick & Rick" },
  { id: 12, name: "Gin & Tonic", players: "JB & Markus" },
  { id: 13, name: "Komodo Crew", players: "Mitch & Levent" },
  { id: 14, name: "Kiss My Ace", players: "Rod & James" },
  { id: 15, name: "Persian Power", players: "Arman & Behzad" },
  { id: 16, name: "Wild Cards", players: "Marcus & Steve" },
];

export const season2Qualifier: Qualifier = {
  name: "PMA Division Qualifier",
  date: "2026-08-04",
  time: "5:00pm – 8:00pm",
  venue: "Paradise Padel",
  courts: 5,
  format: "Random Team Americano",
  facts: [
    "16 teams",
    "10 matches per team",
    "24 total points played in every match",
    "Every point scored contributes to your qualifier score",
  ],
  outcomes: [
    "Top 8 teams qualify for the Silver Devils",
    "Remaining 8 teams qualify for the Silver Foxes",
  ],
  note: "Qualifier points do not carry into the regular season.",
};

/**
 * The season calendar — the nights the league plays on. Fixtures live on each
 * division, so `matches` stays empty here; this is the shared date spine the
 * two divisions hang off, and the fallback a division without a published draw
 * renders as "fixtures to be announced".
 */
export const season2Schedule: Round[] = [
  { round: 1, date: "2026-08-11", matches: [] },
  { round: 2, date: "2026-08-18", matches: [] },
  { round: 3, date: "2026-08-25", matches: [] },
  { round: 4, date: "2026-09-01", matches: [] },
  { round: 5, date: "2026-09-08", matches: [] },
  { round: 6, date: "2026-09-15", matches: [] },
  { round: 7, date: "2026-09-22", matches: [] },
];

/* -- Silver Devils fixtures ------------------------------------------------
   A full round robin: 28 matches, every team meeting every other once.
   Round 1 is played away at Tap Padel and Paradise; rounds 2-7 are at
   Holywings. Rounds 5-7 spill onto the Thursday, so those matches carry their
   own date.
   -------------------------------------------------------------------------- */
const devilsSchedule: Round[] = [
  {
    round: 1,
    date: "2026-08-11",
    matches: [
      { id: "s2d1r1m1", home: 1, away: 10, venue: "Tap Padel" },
      { id: "s2d1r1m2", home: 3, away: 2, venue: "Tap Padel" },
      { id: "s2d1r1m3", home: 8, away: 6, venue: "Paradise Padel" },
      { id: "s2d1r1m4", home: 7, away: 16, venue: "Tap Padel" },
    ],
  },
  {
    round: 2,
    date: "2026-08-18",
    matches: [
      { id: "s2d1r2m1", home: 1, away: 16 },
      { id: "s2d1r2m2", home: 3, away: 6 },
      { id: "s2d1r2m3", home: 8, away: 7 },
      { id: "s2d1r2m4", home: 2, away: 10 },
    ],
  },
  {
    round: 3,
    date: "2026-08-25",
    matches: [
      { id: "s2d1r3m1", home: 1, away: 6 },
      { id: "s2d1r3m2", home: 3, away: 16 },
      { id: "s2d1r3m3", home: 8, away: 10 },
      { id: "s2d1r3m4", home: 2, away: 7 },
    ],
  },
  {
    round: 4,
    date: "2026-09-01",
    matches: [
      { id: "s2d1r4m1", home: 1, away: 7 },
      { id: "s2d1r4m2", home: 3, away: 10 },
      { id: "s2d1r4m3", home: 8, away: 2 },
      { id: "s2d1r4m4", home: 6, away: 16 },
    ],
  },
  {
    round: 5,
    date: "2026-09-08",
    matches: [
      { id: "s2d1r5m1", home: 8, away: 16 },
      { id: "s2d1r5m2", home: 6, away: 2 },
      { id: "s2d1r5m3", home: 10, away: 7 },
      { id: "s2d1r5m4", home: 1, away: 3, date: "2026-09-10" },
    ],
  },
  {
    round: 6,
    date: "2026-09-15",
    matches: [
      { id: "s2d1r6m1", home: 6, away: 10 },
      { id: "s2d1r6m2", home: 2, away: 16 },
      { id: "s2d1r6m3", home: 1, away: 8, date: "2026-09-17" },
      { id: "s2d1r6m4", home: 3, away: 7, date: "2026-09-17" },
    ],
  },
  {
    round: 7,
    date: "2026-09-22",
    matches: [
      { id: "s2d1r7m1", home: 6, away: 7 },
      { id: "s2d1r7m2", home: 10, away: 16 },
      { id: "s2d1r7m3", home: 1, away: 2, date: "2026-09-24" },
      { id: "s2d1r7m4", home: 3, away: 8, date: "2026-09-24" },
    ],
  },
];

export const season2Divisions: Division[] = [
  {
    slug: "silver-devils",
    name: "Silver Devils",
    tier: 1,
    blurb: "The higher Silver division.",
    venue: "Holywings",
    goals: [
      "Win the Silver Devils Championship",
      "Avoid the relegation playoffs",
    ],
    teamIds: [1, 3, 8, 6, 2, 10, 7, 16],
    schedule: devilsSchedule,
  },
  {
    slug: "silver-foxes",
    name: "Silver Foxes",
    tier: 2,
    blurb: "The developing Silver division.",
    venue: "Paradise Padel",
    goals: ["Earn promotion to the Silver Devils"],
    teamIds: [4, 5, 9, 11, 12, 13, 14, 15],
    schedule: [],
  },
];

/**
 * Finals fixtures are written in terms of ladder position, not team, so the
 * whole night can be published before the regular season decides who plays in
 * it. Each slot resolves itself as the ladders settle.
 */
export const season2Finals: FinalsNight = {
  name: "PMA Finals Night",
  date: "2026-09-29",
  intro:
    "The regular season decides who qualifies. Finals Night decides the champions — and who is promoted and relegated between the divisions.",
  groups: [
    {
      title: "Silver Devils Championship",
      fixtures: [
        {
          id: "s2f-devils-final",
          home: "Silver Devils 1st",
          away: "Silver Devils 2nd",
          prize: "Winner becomes Silver Devils Champion",
        },
      ],
    },
    {
      title: "Third Place Playoff",
      note: "Bragging rights are important.",
      fixtures: [
        {
          id: "s2f-devils-third",
          home: "Silver Devils 3rd",
          away: "Silver Devils 4th",
        },
      ],
    },
    {
      title: "Promotion / Relegation Playoffs",
      note: "Winners play in the Silver Devils next season. Losers play in the Silver Foxes.",
      fixtures: [
        {
          id: "s2f-promo-1",
          home: "Silver Foxes 1st",
          away: "Silver Devils 8th",
        },
        {
          id: "s2f-promo-2",
          home: "Silver Foxes 2nd",
          away: "Silver Devils 7th",
        },
      ],
    },
    {
      title: "Fifth Place Playoff",
      note: "Because nobody likes finishing sixth.",
      fixtures: [
        {
          id: "s2f-devils-fifth",
          home: "Silver Devils 5th",
          away: "Silver Devils 6th",
        },
      ],
    },
    {
      title: "Silver Foxes Placement Matches",
      note: "Every team gets one final match to finish the season.",
      fixtures: [
        {
          id: "s2f-foxes-third",
          home: "Silver Foxes 3rd",
          away: "Silver Foxes 4th",
        },
        {
          id: "s2f-foxes-fifth",
          home: "Silver Foxes 5th",
          away: "Silver Foxes 6th",
        },
        {
          id: "s2f-foxes-seventh",
          home: "Silver Foxes 7th",
          away: "Silver Foxes 8th",
        },
      ],
    },
  ],
};
