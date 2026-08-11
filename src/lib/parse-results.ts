import type { Match, ResultsMap, Round, SetScore } from "@/data/types";
import type { Season } from "@/data/seasons";
import { roundsFor } from "@/data/seasons";

/**
 * Turns the way results actually arrive — a block of WhatsApp text — into
 * saveable results.
 *
 * Ken sends lines like "Wild cards got over the Feds 6-0 3-6 6-2": winner
 * first, team names loose, separators inconsistent, sets sometimes comma
 * separated and sometimes not. The admin form wanted the *home* team first and
 * one match at a time, which meant flipping scores by hand — the step most
 * likely to put a wrong score on the site.
 *
 * So this parser resolves names fuzzily, finds the fixture, and flips the sets
 * itself when the line is written away-team-first. Nothing is saved until the
 * parse is shown back and confirmed.
 */

export interface ParsedLine {
  raw: string;
  /** Set when the line resolved to a real fixture. */
  matchId?: string;
  sets?: [SetScore, SetScore, SetScore];
  /** Fixture orientation, for display. */
  homeName?: string;
  awayName?: string;
  divisionName?: string;
  round?: number;
  /** True when the line was written away-team-first and the sets were flipped. */
  flipped?: boolean;
  /** True when a result for this fixture already exists. */
  overwrites?: boolean;
  /** Set when the line could not be used. */
  error?: string;
}

/** Words people put between two team names. Longest first — "v" must lose to "vs". */
const SEPARATORS = [
  "defeated",
  "def.",
  "def",
  "got over",
  "went over",
  "beat",
  "bt",
  "versus",
  "vs.",
  "vs",
  "v.",
  "v",
];

const SCORE = /(\d{1,2})\s*[-–—:]\s*(\d{1,2})/g;

/** Lowercase, strip anything that isn't a letter or digit. "Gin & Tonic" → "gintonic". */
function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * Best team for a loosely-written name.
 *
 * Tiered rather than scored, so a near-exact match always beats a fuzzy one:
 * exact, then prefix ("Persian" → Persian Power), then containment, then a
 * small edit distance ("Ricochet" → Rickochet). Returns undefined when two
 * teams tie, rather than guessing.
 */
export function matchTeam(
  input: string,
  teams: { id: number; name: string }[],
): number | undefined {
  const q = normalise(input);
  if (!q) return undefined;

  const tiers: ((t: { name: string }) => boolean)[] = [
    (t) => normalise(t.name) === q,
    (t) => normalise(t.name).startsWith(q) || q.startsWith(normalise(t.name)),
    (t) => normalise(t.name).includes(q) || q.includes(normalise(t.name)),
    (t) => levenshtein(normalise(t.name), q) <= 2,
  ];

  for (const test of tiers) {
    const hits = teams.filter(test);
    if (hits.length === 1) return hits[0].id;
    if (hits.length > 1) return undefined; // ambiguous — don't guess
  }
  return undefined;
}

/** Every fixture in the season, with the division and round it belongs to. */
function allFixtures(
  season: Season,
): { match: Match; round: Round; divisionName?: string }[] {
  const divisions = season.divisions ?? [];
  if (divisions.length === 0) {
    return season.schedule.flatMap((round) =>
      round.matches.map((match) => ({ match, round })),
    );
  }
  return divisions.flatMap((d) =>
    roundsFor(season, d).flatMap((round) =>
      round.matches.map((match) => ({
        match,
        round,
        divisionName: d.name,
      })),
    ),
  );
}

export function parseResultLines(
  text: string,
  season: Season,
  results: ResultsMap = {},
): ParsedLine[] {
  const teams = season.teams;
  const fixtures = allFixtures(season);

  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((raw): ParsedLine => {
      // Sets first: everything before the first score is the team text.
      SCORE.lastIndex = 0;
      const scores = [...raw.matchAll(SCORE)];
      if (scores.length !== 3) {
        return {
          raw,
          error:
            scores.length === 0
              ? "No set scores found"
              : `Found ${scores.length} set scores, expected 3`,
        };
      }

      const teamText = raw.slice(0, scores[0].index).trim();
      if (!teamText) return { raw, error: "No team names found" };

      // Split on the first separator word that appears.
      let left = "";
      let right = "";
      for (const sep of SEPARATORS) {
        const re = new RegExp(
          `\\s${sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s`,
          "i",
        );
        const m = re.exec(teamText);
        if (m) {
          left = teamText.slice(0, m.index);
          right = teamText.slice(m.index + m[0].length);
          break;
        }
      }
      if (!left || !right) {
        return { raw, error: "Couldn't tell the two teams apart" };
      }

      const leftId = matchTeam(left, teams);
      const rightId = matchTeam(right, teams);
      if (leftId === undefined)
        return { raw, error: `Unknown team "${left.trim()}"` };
      if (rightId === undefined)
        return { raw, error: `Unknown team "${right.trim()}"` };
      if (leftId === rightId)
        return { raw, error: "Both names matched the same team" };

      const found = fixtures.filter(
        (f) =>
          (f.match.home === leftId && f.match.away === rightId) ||
          (f.match.home === rightId && f.match.away === leftId),
      );
      if (found.length === 0)
        return { raw, error: "These two teams don't have a fixture" };
      if (found.length > 1)
        return { raw, error: "More than one fixture between these teams" };

      const { match, round, divisionName } = found[0];
      // The line names the winner (or whoever) first; the fixture decides which
      // way round the numbers go.
      const flipped = match.home === rightId;

      const sets = scores.map(([, a, b]) => {
        const first = Number(a);
        const second = Number(b);
        return flipped
          ? { home: second, away: first }
          : { home: first, away: second };
      }) as [SetScore, SetScore, SetScore];

      const homeTeam = teams.find((t) => t.id === match.home);
      const awayTeam = teams.find((t) => t.id === match.away);

      return {
        raw,
        matchId: match.id,
        sets,
        homeName: homeTeam?.name,
        awayName: awayTeam?.name,
        divisionName,
        round: round.round,
        flipped,
        overwrites: Boolean(results[match.id]),
      };
    });
}
