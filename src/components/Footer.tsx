import { currentSeason } from "@/data/seasons";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line/70 py-10">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="text-sm text-fg-muted">Powered by good vibes 🎾</p>
        <p className="mt-1 text-xs text-fg-subtle">
          PMA Tuesday Padel League · {currentSeason.label} ·{" "}
          {currentSeason.venue}
        </p>
      </div>
    </footer>
  );
}
