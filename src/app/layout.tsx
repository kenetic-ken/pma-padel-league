import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { currentSeason } from "@/data/seasons";

// Self-hosted so there is no external font request and no layout shift.
const bebas = localFont({
  src: "./fonts/bebas-neue-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-bebas",
});

const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `PMA Tuesday Padel League — ${currentSeason.label}`,
    template: "%s · PMA Tuesday Padel League",
  },
  description: `PMA Tuesday Padel League at ${currentSeason.venue} — ${currentSeason.teams.length} teams, ${currentSeason.schedule.length} rounds, ${currentSeason.label}.`,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-canvas text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-chip focus:bg-accent focus:px-4 focus:py-2 focus:text-label focus:font-semibold focus:tracking-widest focus:text-accent-ink focus:uppercase"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
