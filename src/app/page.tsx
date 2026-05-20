import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#0d0d0d" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d0d0d 0%, #111111 40%, #0d1a00 100%)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Court grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #BFFF00 1px, transparent 1px),
              linear-gradient(to bottom, #BFFF00 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Season badge */}
          <div className="inline-block mb-6">
            <span
              style={{
                backgroundColor: "#BFFF00",
                color: "#0d0d0d",
                fontFamily: "var(--font-bebas)",
                fontSize: "0.9rem",
                letterSpacing: "0.2em",
                padding: "4px 16px",
                borderRadius: "2px",
              }}
            >
              SEASON 1
            </span>
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4rem, 12vw, 9rem)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: "#ffffff",
              marginBottom: "1.5rem",
            }}
          >
            PMA<br />
            <span style={{ color: "#BFFF00" }}>TUESDAY</span><br />
            LEAGUE
          </h1>

          {/* Sub-headline */}
          <p
            className="text-gray-300 mb-10"
            style={{ fontSize: "1.1rem", letterSpacing: "0.2em", fontWeight: 300 }}
          >
            TUESDAYS · 5:30PM · SEASON 1
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mb-12 flex-wrap">
            {[
              { value: "8", label: "Teams" },
              { value: "7", label: "Rounds" },
              { value: "26 May", label: "Season Start" },
              { value: "14 Jul", label: "Season End" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "2.5rem",
                    color: "#BFFF00",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-gray-400 mt-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/ladder"
              style={{
                backgroundColor: "#BFFF00",
                color: "#0d0d0d",
                fontFamily: "var(--font-bebas)",
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
                padding: "12px 36px",
                textDecoration: "none",
                display: "inline-block",
                borderRadius: "2px",
              }}
            >
              VIEW LADDER
            </Link>
            <Link
              href="/schedule"
              style={{
                border: "1px solid #BFFF00",
                color: "#BFFF00",
                fontFamily: "var(--font-bebas)",
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
                padding: "12px 36px",
                textDecoration: "none",
                display: "inline-block",
                borderRadius: "2px",
                backgroundColor: "transparent",
              }}
            >
              SEE SCHEDULE
            </Link>
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎾",
              title: "3 SET FORMAT",
              body: "Play 3 full sets with standard padel scoring. Max 2 deuces — 3rd deuce is a golden point.",
            },
            {
              icon: "🏆",
              title: "POINTS SYSTEM",
              body: "Win a set = 1 league point. 3-0 win earns 3 pts. Every set matters — fight to the end.",
            },
            {
              icon: "⚡",
              title: "GOOD VIBES",
              body: "Silver level play. Competitive, social, fun. No egos. Just premium padel with mates.",
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: "4px",
                padding: "2rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "1.5rem",
                  color: "#BFFF00",
                  marginBottom: "0.75rem",
                  letterSpacing: "0.05em",
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: "#9ca3af", lineHeight: 1.6, fontSize: "0.9rem" }}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
