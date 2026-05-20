"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/schedule", label: "Schedule" },
  { href: "/ladder", label: "Ladder" },
  { href: "/results", label: "Results" },
  { href: "/rules", label: "Rules" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{ backgroundColor: "#0d0d0d", borderBottom: "1px solid #222" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            style={{ fontFamily: "var(--font-bebas)", color: "#BFFF00", fontSize: "1.6rem", letterSpacing: "0.05em" }}
          >
            PMA PADEL
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
                style={{ letterSpacing: "0.12em" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors ml-2"
              title="Admin"
            >
              ⚙
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: "1px solid #222", backgroundColor: "#0d0d0d" }} className="md:hidden">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setOpen(false)} className="text-xs text-gray-600">
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
