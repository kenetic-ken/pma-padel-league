"use client";

import { useState, useEffect } from "react";
import { schedule, ResultsMap, MatchResult, SetScore } from "@/data/schedule";
import { getTeamName } from "@/data/teams";

export default function AdminClient() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [results, setResults] = useState<ResultsMap>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form state
  const [selectedRound, setSelectedRound] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [sets, setSets] = useState<SetScore[]>([
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
  ]);

  async function loadResults(pw: string) {
    try {
      const res = await fetch("/api/results");
      const data = await res.json();
      setResults(data);
    } catch {
      setMessage("Failed to load results");
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Quick auth check
    const res = await fetch("/api/results", {
      headers: { "x-admin-password": password },
    });
    // GET doesn't need auth, just test with a known state
    setAuthenticated(true);
    await loadResults(password);
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
      await loadResults(password);
      setSets([{ home: 0, away: 0 }, { home: 0, away: 0 }, { home: 0, away: 0 }]);
    } else {
      const err = await res.json();
      setMessage(`❌ Error: ${err.error}`);
    }
    setLoading(false);
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
      await loadResults(password);
    } else {
      setMessage("❌ Failed to delete");
    }
    setLoading(false);
  }

  const currentRound = schedule.find((r) => r.round === selectedRound);
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

  if (!authenticated) {
    return (
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label style={{ display: "block", color: "#9ca3af", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "6px" }}>
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
        {message && <p style={{ color: "#ef4444", marginTop: "1rem", fontSize: "0.85rem" }}>{message}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Enter Result */}
      <section>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#BFFF00", marginBottom: "1.5rem" }}>
          ENTER RESULT
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6" style={{ maxWidth: "600px" }}>
          {/* Round select */}
          <div>
            <label style={{ display: "block", color: "#9ca3af", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "6px" }}>
              ROUND
            </label>
            <select
              value={selectedRound}
              onChange={(e) => { setSelectedRound(Number(e.target.value)); setSelectedMatch(""); }}
              style={inputStyle}
            >
              {schedule.map((r) => (
                <option key={r.round} value={r.round}>
                  Round {r.round} — {r.date}
                </option>
              ))}
            </select>
          </div>

          {/* Match select */}
          <div>
            <label style={{ display: "block", color: "#9ca3af", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "6px" }}>
              MATCH
            </label>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">Select match...</option>
              {currentRound?.matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {getTeamName(m.home)} vs {getTeamName(m.away)}
                  {results[m.id] ? " ✓" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Sets */}
          <div>
            <label style={{ display: "block", color: "#9ca3af", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "12px" }}>
              SET SCORES (home – away)
            </label>
            <div className="space-y-3">
              {sets.map((set, i) => {
                const match = currentRound?.matches.find((m) => m.id === selectedMatch);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "0.1em", minWidth: "50px" }}>
                      SET {i + 1}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                      {match && (
                        <span style={{ fontSize: "0.8rem", color: "#6b7280", textAlign: "right", flex: 1 }}>
                          {getTeamName(match.home)}
                        </span>
                      )}
                      <input
                        type="number"
                        min={0}
                        max={7}
                        value={set.home}
                        onChange={(e) => {
                          const updated = [...sets];
                          updated[i] = { ...set, home: Number(e.target.value) };
                          setSets(updated);
                        }}
                        style={{ ...inputStyle, width: "60px", textAlign: "center" }}
                      />
                      <span style={{ color: "#555" }}>–</span>
                      <input
                        type="number"
                        min={0}
                        max={7}
                        value={set.away}
                        onChange={(e) => {
                          const updated = [...sets];
                          updated[i] = { ...set, away: Number(e.target.value) };
                          setSets(updated);
                        }}
                        style={{ ...inputStyle, width: "60px", textAlign: "center" }}
                      />
                      {match && (
                        <span style={{ fontSize: "0.8rem", color: "#6b7280", flex: 1 }}>
                          {getTeamName(match.away)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" style={btnStyle} disabled={loading || !selectedMatch}>
            {loading ? "SAVING..." : "SAVE RESULT"}
          </button>

          {message && (
            <p style={{ fontSize: "0.85rem", color: message.startsWith("✅") ? "#BFFF00" : "#ef4444" }}>
              {message}
            </p>
          )}
        </form>
      </section>

      {/* Existing results */}
      <section>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#fff", marginBottom: "1.5rem" }}>
          EXISTING RESULTS
        </h2>
        {Object.keys(results).length === 0 ? (
          <p style={{ color: "#555" }}>No results entered yet.</p>
        ) : (
          <div className="space-y-4">
            {schedule.map((round) => {
              const played = round.matches.filter((m) => results[m.id]);
              if (played.length === 0) return null;
              return (
                <div key={round.round} style={{ border: "1px solid #222", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ backgroundColor: "#111", padding: "10px 16px", borderBottom: "1px solid #222" }}>
                    <span style={{ fontFamily: "var(--font-bebas)", color: "#fff" }}>ROUND {round.round}</span>
                  </div>
                  {played.map((match) => {
                    const result = results[match.id]!;
                    let h = 0, a = 0;
                    for (const s of result.sets) {
                      if (s.home > s.away) h++;
                      else if (s.away > s.home) a++;
                    }
                    return (
                      <div key={match.id} style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
                            {getTeamName(match.home)} <span style={{ color: "#BFFF00" }}>{h}–{a}</span> {getTeamName(match.away)}
                          </span>
                          <div style={{ fontSize: "0.7rem", color: "#555", marginTop: "2px" }}>
                            {result.sets.map((s, i) => `${s.home}-${s.away}`).join("  ")}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(match.id)}
                          style={{ backgroundColor: "transparent", border: "1px solid #444", color: "#ef4444", padding: "4px 12px", borderRadius: "2px", cursor: "pointer", fontSize: "0.75rem" }}
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
        )}
      </section>
    </div>
  );
}
