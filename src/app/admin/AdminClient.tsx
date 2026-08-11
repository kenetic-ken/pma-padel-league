"use client";

import { useMemo, useState } from "react";
import type { Division, MatchResult, ResultsMap, SetScore } from "@/data/types";
import { currentSeason, roundsFor, teamById } from "@/data/seasons";
import { parseResultLines } from "@/lib/parse-results";

/**
 * Score entry for the current season.
 *
 * This screen used to read `@/data/schedule`, which is a back-compat re-export
 * of the *Season 1* fixtures — so once Season 2 started it listed the wrong
 * rounds and the wrong teams, and there was no way to record a real result. It
 * now reads `currentSeason` and, when the season has divisions, each division's
 * own draw.
 *
 * `/api/results` is deliberately untouched: it takes `{ matchId, sets }` and
 * writes to a single KV key, so nothing here needs to change on that side.
 */
export default function AdminClient() {
  const season = currentSeason;
  const divisions = season.divisions ?? [];

  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [results, setResults] = useState<ResultsMap>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form state
  const [divisionSlug, setDivisionSlug] = useState(divisions[0]?.slug ?? "");
  const [selectedRound, setSelectedRound] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [sets, setSets] = useState<SetScore[]>([
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
  ]);

  // Bulk paste
  const [bulkText, setBulkText] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const parsed = useMemo(
    () => parseResultLines(bulkText, season, results),
    [bulkText, season, results],
  );
  const ready = parsed.filter((p) => !p.error);

  const division: Division | undefined =
    divisions.find((d) => d.slug === divisionSlug) ?? divisions[0];
  const rounds = roundsFor(season, division);
  const currentRound = rounds.find((r) => r.round === selectedRound);
  const match = currentRound?.matches.find((m) => m.id === selectedMatch);

  /** "Eight Eyes (Ben & Justin)" — full enough to tell two similar teams apart. */
  function label(id: number) {
    const team = teamById(season, id);
    return team ? `${team.name} (${team.players})` : `Team ${id}`;
  }

  async function loadResults() {
    try {
      const res = await fetch("/api/results");
      setResults(await res.json());
    } catch {
      setMessage("Failed to load results");
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // GET is unauthenticated, so this only loads the current state — a wrong
    // password isn't rejected until the first save.
    setAuthenticated(true);
    await loadResults();
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMatch) return;

    setLoading(true);
    setMessage("");

    const payload: MatchResult = {
      matchId: selectedMatch,
      sets: sets as [SetScore, SetScore, SetScore],
    };

    const res = await fetch("/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage("✅ Result saved!");
      await loadResults();
      setSelectedMatch("");
      setSets([
        { home: 0, away: 0 },
        { home: 0, away: 0 },
        { home: 0, away: 0 },
      ]);
    } else {
      const err = await res.json();
      setMessage(`❌ Error: ${err.error}`);
    }
    setLoading(false);
  }

  async function handleBulkSave() {
    setBulkBusy(true);
    setBulkMessage("");

    let saved = 0;
    const failures: string[] = [];

    // Sequential rather than parallel: the API read-modify-writes one KV key,
    // so concurrent saves would race and drop results.
    for (const line of ready) {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ matchId: line.matchId, sets: line.sets }),
      });
      if (res.ok) saved++;
      else failures.push(`${line.homeName} v ${line.awayName}`);
    }

    await loadResults();
    setBulkBusy(false);
    if (failures.length === 0) {
      setBulkMessage(`✅ Saved ${saved} result${saved === 1 ? "" : "s"}`);
      setBulkText("");
    } else {
      setBulkMessage(
        `⚠️ Saved ${saved}, failed ${failures.length}: ${failures.join(", ")}. Check the password.`,
      );
    }
  }

  async function handleDelete(matchId: string) {
    if (!confirm("Delete this result?")) return;
    setLoading(true);
    const res = await fetch(`/api/results?matchId=${matchId}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setMessage("✅ Result deleted");
      await loadResults();
    } else {
      setMessage("❌ Failed to delete");
    }
    setLoading(false);
  }

  const inputStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "4px",
    width: "100%",
    fontSize: "0.9rem",
  };

  const btnStyle: React.CSSProperties = {
    backgroundColor: "#BFFF00",
    color: "#0d0d0d",
    fontFamily: "var(--font-bebas)",
    fontSize: "1rem",
    letterSpacing: "0.1em",
    padding: "10px 24px",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#9ca3af",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    marginBottom: "6px",
  };

  if (!authenticated) {
    return (
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label style={{ ...labelStyle, fontSize: "0.8rem" }}>
              ADMIN PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "CHECKING..." : "ENTER"}
          </button>
        </form>
        {message && (
          <p
            style={{
              color: "#ef4444",
              marginTop: "1rem",
              fontSize: "0.85rem",
            }}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* --------------------------------------------------- Paste a batch */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "2rem",
            color: "#BFFF00",
            marginBottom: "0.5rem",
          }}
        >
          PASTE RESULTS
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.8rem",
            marginBottom: "1rem",
            maxWidth: "640px",
          }}
        >
          One match per line, however you write them —{" "}
          <span style={{ color: "#9ca3af" }}>
            Wild cards got over the Feds 6-0 3-6 6-2
          </span>
          . Winner first is fine; the scores get turned round to match the
          fixture. Nothing saves until you press the button.
        </p>

        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={8}
          spellCheck={false}
          placeholder={
            "Vamos vs Ricochet 7-5, 6-0, 5-7\nEight eyes beat slappers 6-1, 6-2, 6-3"
          }
          style={{
            ...inputStyle,
            maxWidth: "640px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "0.8rem",
            lineHeight: 1.7,
            resize: "vertical",
          }}
        />

        {parsed.length > 0 && (
          <div style={{ marginTop: "1rem", maxWidth: "640px" }}>
            {parsed.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  borderLeft: `2px solid ${p.error ? "#ef4444" : "#BFFF00"}`,
                  backgroundColor: "#111",
                  marginBottom: "4px",
                  fontSize: "0.8rem",
                }}
              >
                {p.error ? (
                  <>
                    <div style={{ color: "#ef4444" }}>{p.error}</div>
                    <div
                      style={{
                        color: "#555",
                        fontSize: "0.75rem",
                        marginTop: "2px",
                      }}
                    >
                      {p.raw}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: "#d1d5db" }}>
                      {p.homeName}{" "}
                      <span style={{ color: "#BFFF00" }}>
                        {p.sets!.map((s) => `${s.home}-${s.away}`).join("  ")}
                      </span>{" "}
                      {p.awayName}
                    </div>
                    <div
                      style={{
                        color: "#555",
                        fontSize: "0.75rem",
                        marginTop: "2px",
                      }}
                    >
                      {p.divisionName ? `${p.divisionName} · ` : ""}Round{" "}
                      {p.round}
                      {p.flipped ? (
                        <span style={{ color: "#9ca3af" }}>
                          {" "}
                          · turned round to match the fixture
                        </span>
                      ) : null}
                      {p.overwrites ? (
                        <span style={{ color: "#f59e0b" }}>
                          {" "}
                          · replaces an existing result
                        </span>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleBulkSave}
          style={{ ...btnStyle, marginTop: "1rem" }}
          disabled={bulkBusy || ready.length === 0}
        >
          {bulkBusy
            ? "SAVING..."
            : `SAVE ${ready.length} RESULT${ready.length === 1 ? "" : "S"}`}
        </button>

        {bulkMessage && (
          <p
            style={{
              fontSize: "0.85rem",
              marginTop: "0.75rem",
              color: bulkMessage.startsWith("✅") ? "#BFFF00" : "#f59e0b",
            }}
          >
            {bulkMessage}
          </p>
        )}
      </section>

      {/* ------------------------------------------------- Enter a result */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "2rem",
            color: "#BFFF00",
            marginBottom: "0.5rem",
          }}
        >
          ENTER RESULT
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.8rem",
            marginBottom: "1.5rem",
          }}
        >
          {season.label} &middot; scores are entered from the home team&rsquo;s
          side, in the order shown under each box.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          style={{ maxWidth: "600px" }}
        >
          {divisions.length > 0 && (
            <div>
              <label style={labelStyle}>DIVISION</label>
              <select
                value={division?.slug ?? ""}
                onChange={(e) => {
                  setDivisionSlug(e.target.value);
                  setSelectedMatch("");
                }}
                style={inputStyle}
              >
                {divisions.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} — {d.venue}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle}>ROUND</label>
            <select
              value={selectedRound}
              onChange={(e) => {
                setSelectedRound(Number(e.target.value));
                setSelectedMatch("");
              }}
              style={inputStyle}
            >
              {rounds.map((r) => (
                <option key={r.round} value={r.round}>
                  Round {r.round} — {r.date}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>MATCH</label>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">Select match...</option>
              {currentRound?.matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {label(m.home)} vs {label(m.away)}
                  {results[m.id] ? " ✓" : ""}
                </option>
              ))}
            </select>
            {currentRound && currentRound.matches.length === 0 && (
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  marginTop: "6px",
                }}
              >
                No fixtures published for this round yet.
              </p>
            )}
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: "12px" }}>
              SET SCORES (home – away)
            </label>
            <div className="space-y-3">
              {sets.map((set, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      color: "#555",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      minWidth: "50px",
                    }}
                  >
                    SET {i + 1}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flex: 1,
                    }}
                  >
                    {match && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          textAlign: "right",
                          flex: 1,
                        }}
                      >
                        {label(match.home)}
                      </span>
                    )}
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={set.home}
                      onChange={(e) => {
                        const updated = [...sets];
                        updated[i] = { ...set, home: Number(e.target.value) };
                        setSets(updated);
                      }}
                      style={{
                        ...inputStyle,
                        width: "60px",
                        textAlign: "center",
                      }}
                    />
                    <span style={{ color: "#555" }}>–</span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={set.away}
                      onChange={(e) => {
                        const updated = [...sets];
                        updated[i] = { ...set, away: Number(e.target.value) };
                        setSets(updated);
                      }}
                      style={{
                        ...inputStyle,
                        width: "60px",
                        textAlign: "center",
                      }}
                    />
                    {match && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          flex: 1,
                        }}
                      >
                        {label(match.away)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{ color: "#555", fontSize: "0.75rem", marginTop: "10px" }}
            >
              A Shootout 15 third set goes in as played — e.g. 15–11.
            </p>
          </div>

          <button
            type="submit"
            style={btnStyle}
            disabled={loading || !selectedMatch}
          >
            {loading ? "SAVING..." : "SAVE RESULT"}
          </button>

          {message && (
            <p
              style={{
                fontSize: "0.85rem",
                color: message.startsWith("✅") ? "#BFFF00" : "#ef4444",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </section>

      {/* --------------------------------------------------- What's saved */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "2rem",
            color: "#fff",
            marginBottom: "1.5rem",
          }}
        >
          EXISTING RESULTS
        </h2>
        {Object.keys(results).length === 0 ? (
          <p style={{ color: "#555" }}>No results entered yet.</p>
        ) : (
          <div className="space-y-8">
            {(divisions.length > 0 ? divisions : [undefined]).map((d, di) => {
              const divisionRounds = roundsFor(season, d);
              const anyPlayed = divisionRounds.some((r) =>
                r.matches.some((m) => results[m.id]),
              );
              if (!anyPlayed) return null;

              return (
                <div key={d?.slug ?? di}>
                  {d && (
                    <h3
                      style={{
                        fontFamily: "var(--font-bebas)",
                        color: "#BFFF00",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {d.name.toUpperCase()}
                    </h3>
                  )}
                  <div className="space-y-4">
                    {divisionRounds.map((round) => {
                      const played = round.matches.filter((m) => results[m.id]);
                      if (played.length === 0) return null;
                      return (
                        <div
                          key={round.round}
                          style={{
                            border: "1px solid #222",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#111",
                              padding: "10px 16px",
                              borderBottom: "1px solid #222",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-bebas)",
                                color: "#fff",
                              }}
                            >
                              ROUND {round.round}
                            </span>
                          </div>
                          {played.map((m) => {
                            const result = results[m.id]!;
                            let h = 0;
                            let a = 0;
                            for (const s of result.sets) {
                              if (s.home > s.away) h++;
                              else if (s.away > s.home) a++;
                            }
                            return (
                              <div
                                key={m.id}
                                style={{
                                  padding: "12px 16px",
                                  borderBottom: "1px solid #1a1a1a",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color: "#d1d5db",
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {label(m.home)}{" "}
                                    <span style={{ color: "#BFFF00" }}>
                                      {h}–{a}
                                    </span>{" "}
                                    {label(m.away)}
                                  </span>
                                  <div
                                    style={{
                                      fontSize: "0.7rem",
                                      color: "#555",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {result.sets
                                      .map((s) => `${s.home}-${s.away}`)
                                      .join("  ")}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDelete(m.id)}
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "1px solid #444",
                                    color: "#ef4444",
                                    padding: "4px 12px",
                                    borderRadius: "2px",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  DELETE
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
