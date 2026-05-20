import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PMA Tuesday Padel League – Season 1",
  description: "PMA Tuesday Padel League – 8 teams, 7 rounds, Season 1 (May–July 2026)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0d0d0d", color: "#ffffff", minHeight: "100vh" }}>
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
