import { ResultsMap, computeLadder } from "@/data/schedule";
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

export default async function LadderPage() {
  const results = await getResults();
  const ladder = computeLadder(results);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Page header */}
      <div className="mb-12">
        <p
          style={{ color: "#BFFF00", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          className="mb-2"
        >
          Season 1 · 2026
        </p>
        <h1
          style={{ fontFamily: "var(--font-bebas)", fontSize: "4rem", letterSpacing: "0.02em", lineHeight: 1 }}
        >
          LADDER
        </h1>
      </div>

      {/* Table */}
      <div
        style={{ border: "1px solid #222", borderRadius: "4px", overflow: "hidden" }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#111",
            borderBottom: "1px solid #222",
            display: "grid",
            gridTemplateColumns: "48px 1fr 72px 90px 90px 72px",
            padding: "12px 20px",
          }}
        >
          {["#", "TEAM", "P", "Sets W", "Sets L", "PTS"].map((h) => (
            <div
              key={h}
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "#666",
                fontWeight: 600,
                textAlign: h === "TEAM" ? "left" : "center",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {ladder.map((entry, index) => {
          const rank = index + 1;
          const isTop2 = rank <= 2;
          const isTop3 = rank <= 3;
          const accentColor = isTop2 ? "#BFFF00" : isTop3 ? "#888" : "#fff";

          return (
            <div
              key={entry.teamId}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 72px 90px 90px 72px",
                padding: "16px 20px",
                borderBottom: index < ladder.length - 1 ? "1px solid #1a1a1a" : "none",
                backgroundColor: index % 2 === 0 ? "#0d0d0d" : "#0f0f0f",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "1.4rem",
                  color: accentColor,
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {rank}
              </div>
              <div style={{ fontWeight: isTop2 ? 600 : 400, color: isTop2 ? "#fff" : "#d1d5db" }}>
                {getTeamName(entry.teamId)}
                {isTop2 && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      backgroundColor: "#BFFF00",
                      color: "#0d0d0d",
                      padding: "1px 6px",
                      borderRadius: "2px",
                      verticalAlign: "middle",
                    }}
                  >
                    TOP
                  </span>
                )}
              </div>
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                {entry.played === 0 ? "—" : entry.played}
              </div>
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                {entry.played === 0 ? "—" : entry.setsWon}
              </div>
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                {entry.played === 0 ? "—" : entry.setsLost}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-bebas)",
                  fontSize: "1.3rem",
                  color: accentColor,
                  lineHeight: 1,
                }}
              >
                {entry.played === 0 ? "—" : entry.points}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-gray-600" style={{ letterSpacing: "0.05em" }}>
        PTS = sets won · Tiebreaker: sets won / played ratio
      </p>
    </div>
  );
}
