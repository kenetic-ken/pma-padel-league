import { currentSeason } from "@/data/seasons";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line/70 py-10">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="text-sm text-fg-muted">
          Good games. Good people. Good banter.
        </p>
        <p className="mt-1 text-xs text-fg-subtle">
          PMA Padel League · {currentSeason.label} · {currentSeason.matchDay}
        </p>
      </div>
    </footer>
  );
}
