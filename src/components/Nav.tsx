"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/schedule", label: "Schedule" },
  { href: "/ladder", label: "Ladder" },
  { href: "/results", label: "Results" },
  { href: "/rules", label: "Rules" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-50 border-b border-line/70 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-2xl leading-none tracking-[0.06em] text-accent"
        >
          PMA Padel
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-chip px-3 py-2 text-label font-semibold uppercase transition-colors",
                isActive(link.href)
                  ? "text-accent"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="ml-2 rounded-chip px-2 py-2 text-label font-semibold text-fg-subtle uppercase transition-colors hover:text-fg-muted"
          >
            Admin
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 flex size-11 items-center justify-center rounded-block text-fg-muted transition-colors hover:text-fg md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg
            aria-hidden
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-line/70 bg-canvas md:hidden"
        >
          <div className="mx-auto flex max-w-5xl flex-col px-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-block px-4 py-3 text-label font-semibold uppercase",
                  isActive(link.href) ? "text-accent" : "text-fg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-block px-4 py-3 text-label font-semibold text-fg-subtle uppercase"
            >
              Admin
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
