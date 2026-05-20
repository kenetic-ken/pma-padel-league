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

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

export default async function SchedulePage() {
  const results = await getResults();

  // Determine current round
  const today = new Date();
  let currentRound = 1;
  for (const round of schedule) {
    const roundDate = new Date(round.date + "T00:00:00");
    if (roundDate <= today) currentRound = round.round;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p style={{ color: "#BFFF00", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }} className="mb-2">
          Season 1 · 2026
        </p>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "4rem", letterSpacing: "0.02em", lineHeight: 1 }}>
          SCHEDULE
        </h1>
      </div>

      <div className="space-y-8">
        {schedule.map((round) => {
          const isCurrent = round.round === currentRound;
          const isPast = round.round < currentRound;

          return (
            <div
              key={round.round}
              style={{
                border: isCurrent ? "1px solid #BFFF00" : "1px solid #222",
                borderRadius: "4px",
                overflow: "hidden",
                opacity: isPast ? 0.7 : 1,
              }}
            >
              {/* Round header */}
              <div
                style={{
                  backgroundColor: isCurrent ? "#0d1a00" : "#111",
                  borderBottom: isCurrent ? "1px solid #BFFF00" : "1px solid #222",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.5rem", color: isCurrent ? "#BFFF00" : "#fff" }}>
                    ROUND {round.round}
                  </span>
                  {isCurrent && (
                    <span
                      style={{
                        backgroundColor: "#BFFF00",
                        color: "#0d0d0d",
                        fontSize: "0.6rem",
                        letterSpacing: "0.15em",
                        padding: "2px 8px",
                        borderRadius: "2px",
                        fontWeight: 700,
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  {formatDate(round.date)}
                </span>
              </div>

              {/* Matches */}
              <div>
                {round.matches.map((match, idx) => {
                  const result = results[match.id];
                  let homeSets = 0, awaySets = 0;
                  if (result) {
                    for (const s of result.sets) {
                      if (s.home > s.away) homeSets++;
                      else if (s.away > s.home) awaySets++;
                    }
                  }

                  return (
                    <div
                      key={match.id}
                      style={{
                        padding: "14px 20px",
                        borderBottom: idx < round.matches.length - 1 ? "1px solid #1a1a1a" : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {/* Home team */}
                      <div style={{ flex: 1, textAlign: "right", color: result && homeSets > awaySets ? "#fff" : "#9ca3af", fontWeight: result && homeSets > awaySets ? 600 : 400 }}>
                        {getTeamName(match.home)}
                      </div>

                      {/* Score / VS */}
                      <div style={{ textAlign: "center", minWidth: "80px" }}>
                        {result ? (
                          <div>
                            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.4rem", color: "#BFFF00", lineHeight: 1 }}>
                              {homeSets} – {awaySets}
                            </div>
                            <div style={{ fontSize: "0.65rem", color: "#555", marginTop: "2px" }}>
                              {result.sets.map((s, i) => `${s.home}-${s.away}`).join(" ")}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "#444", fontSize: "0.9rem", letterSpacing: "0.1em" }}>VS</span>
                        )}
                      </div>

                      {/* Away team */}
                      <div style={{ flex: 1, color: result && awaySets > homeSets ? "#fff" : "#9ca3af", fontWeight: result && awaySets > homeSets ? 600 : 400 }}>
                        {getTeamName(match.away)}
                      </div>

                      {/* Points badges */}
                      {result && (
                        <div style={{ display: "flex", gap: "4px", minWidth: "80px", justifyContent: "flex-end" }}>
                          <span style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.05em" }}>
                            {homeSets}pts / {awaySets}pts
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
