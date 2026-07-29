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

/**
 * Absolute-URL base for metadata (OG images, canonical links).
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` follows the project's production domain
 * automatically, so this starts pointing at the custom domain the moment one is
 * attached — no code change needed.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

const title = `PMA Padel League — ${currentSeason.label}`;
const description = `${currentSeason.tagline} ${currentSeason.teamCount} teams across ${currentSeason.divisions?.length ?? 1} division${(currentSeason.divisions?.length ?? 1) === 1 ? "" : "s"} at ${currentSeason.venue}, ${currentSeason.matchDay}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · PMA Padel League",
  },
  description,
  openGraph: {
    title,
    description,
    siteName: "PMA Padel League",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
