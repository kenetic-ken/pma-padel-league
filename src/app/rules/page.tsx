export default function RulesPage() {
  const sections = [
    {
      icon: "📅",
      title: "FORMAT",
      items: [
        "Season 1: 26 May – 14 July 2026",
        "8 teams, 7-week round robin — every team plays each other once",
        "Tuesdays at 5:30pm · 120-minute slot · Arrive 10 mins early",
      ],
    },
    {
      icon: "🎾",
      title: "SCORING",
      items: [
        "Play 3 full sets, standard padel scoring",
        "Maximum 2 deuces per game",
        "3rd deuce = golden point (sudden death)",
      ],
    },
    {
      icon: "🏆",
      title: "LEAGUE POINTS",
      items: [
        "Win a set = 1 league point",
        "3–0 win = 3 pts for you, 0 for opponent",
        "2–1 win = 2 pts for winner, 1 pt for loser",
        "Every set counts — never give up!",
      ],
    },
    {
      icon: "📊",
      title: "LADDER TIEBREAKER",
      items: [
        "Primary: Total league points (sets won)",
        "Secondary: Sets won ÷ sets played ratio",
        "Further: Head-to-head result",
      ],
    },
    {
      icon: "🔄",
      title: "SUBSTITUTES",
      items: [
        "Subs allowed from the PMA community",
        "Keep it fair — don't bring ringers",
        "Let the league know ahead of time",
      ],
    },
    {
      icon: "🎱",
      title: "BALLS",
      items: [
        "Use new or fairly-new balls each match",
        "Split the cost between both teams",
        "Each team brings 3 balls minimum",
      ],
    },
    {
      icon: "✨",
      title: "THE VIBE",
      items: [
        "Competitive, social, and fun — this is silver level",
        "No egos. Good sportsmanship always.",
        "Celebrate great shots, even your opponent's",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
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
          RULES
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            style={{
              backgroundColor: "#111",
              border: "1px solid #222",
              borderRadius: "4px",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.4rem" }}>{section.icon}</span>
              <h2
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "1.4rem",
                  color: "#BFFF00",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                {section.title}
              </h2>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {section.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    paddingLeft: "12px",
                    position: "relative",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "#BFFF00",
                      fontWeight: 700,
                    }}
                  >
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Spirit callout */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem 2rem",
          border: "1px solid #BFFF00",
          borderRadius: "4px",
          backgroundColor: "#0d1a00",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "1.8rem",
            color: "#BFFF00",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          PLAY HARD. STAY HUMBLE. HAVE FUN.
        </p>
        <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
          This league is about getting better together. Good games, good vibes, see you Tuesday 🎾
        </p>
      </div>
    </div>
  );
}
