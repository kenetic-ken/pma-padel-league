import { schedule, ResultsMap } from "@/data/schedule";
import { getTeamName } from "@/data/teams";
import { kv } from "@vercel/kv";

async function getResults(): Promise<ResultsMap> {
  try {
    return (await kv.get<ResultsMap>("results")) ?? {};
  } catch {
    return {};
  }
}

export const revalidate = 60;

export default async function ResultsPage() {
  const results = await getResults();

  const completedRounds = schedule.filter((r) =>
    r.matches.some((m) => results[m.id])
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p style={{ color: "#BFFF00", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }} className="mb-2">
          Season 1 · 2026
        </p>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "4rem", letterSpacing: "0.02em", lineHeight: 1 }}>
          RESULTS
        </h1>
      </div>

      {completedRounds.length === 0 ? (
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "4px",
            padding: "3rem",
            textAlign: "center",
            color: "#555",
          }}
        >
          <p style={{ fontFamily: "var(--font-bebas)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            NO RESULTS YET
          </p>
          <p style={{ fontSize: "0.9rem" }}>Season kicks off Tuesday 26 May 2026</p>
        </div>
      ) : (
        <div className="space-y-8">
          {[...completedRounds].reverse().map((round) => {
            const playedMatches = round.matches.filter((m) => results[m.id]);

            return (
              <div key={round.round} style={{ border: "1px solid #222", borderRadius: "4px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ backgroundColor: "#111", borderBottom: "1px solid #222", padding: "12px 20px" }}>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.5rem", color: "#fff" }}>
                    ROUND {round.round}
                  </span>
                  <span style={{ color: "#555", fontSize: "0.85rem", marginLeft: "12px" }}>
                    {new Date(round.date + "T00:00:00").toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Matches */}
                {playedMatches.map((match, idx) => {
                  const result = results[match.id]!;
                  let homeSets = 0, awaySets = 0;
                  for (const s of result.sets) {
                    if (s.home > s.away) homeSets++;
                    else if (s.away > s.home) awaySets++;
                  }
                  const homeWon = homeSets > awaySets;
                  const awayWon = awaySets > homeSets;

                  return (
                    <div
                      key={match.id}
                      style={{
                        padding: "16px 20px",
                        borderBottom: idx < playedMatches.length - 1 ? "1px solid #1a1a1a" : "none",
                      }}
                    >
                      {/* Teams + score */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                        <div style={{ flex: 1, textAlign: "right" }}>
                          <span style={{ color: homeWon ? "#fff" : "#6b7280", fontWeight: homeWon ? 600 : 400, fontSize: "0.95rem" }}>
                            {getTeamName(match.home)}
                          </span>
                        </div>

                        <div style={{ textAlign: "center", minWidth: "100px" }}>
                          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#BFFF00", lineHeight: 1 }}>
                            {homeSets} – {awaySets}
                          </span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <span style={{ color: awayWon ? "#fff" : "#6b7280", fontWeight: awayWon ? 600 : 400, fontSize: "0.95rem" }}>
                            {getTeamName(match.away)}
                          </span>
                        </div>
                      </div>

                      {/* Set breakdown */}
                      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                        {result.sets.map((s, i) => (
                          <div key={i} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: "2px" }}>SET {i + 1}</div>
                            <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                              <span style={{ color: s.home > s.away ? "#d1d5db" : "#555" }}>{s.home}</span>
                              <span style={{ color: "#444", margin: "0 4px" }}>–</span>
                              <span style={{ color: s.away > s.home ? "#d1d5db" : "#555" }}>{s.away}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Points earned */}
                      <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
                        <span style={{ fontSize: "0.65rem", color: "#555", letterSpacing: "0.1em" }}>
                          {getTeamName(match.home)}: {homeSets} pts · {getTeamName(match.away)}: {awaySets} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
