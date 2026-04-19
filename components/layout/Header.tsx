"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// ============================================================
// NAV LINKS — Edit labels and hrefs here
// ============================================================
const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Trainers", href: "/#trainers" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // ============================================================
    // HEADER WRAPPER — Background color and font set here
    // ============================================================
    <header
      className="sticky top-0 w-full bg-land-bg/95 backdrop-blur-md border-b border-land-border z-50"
      style={{ fontFamily: "var(--font-space), sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* ── LOGO + BRAND NAME ── */}
        <Link
          href="/#hero"
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById("hero");
            if (element) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2.5 group select-none"
        >
          <Image
            src="/assets/proje_logo.svg"
            alt="Project-E Gym Logo"
            width={28}
            height={26}
            style={{ height: "auto" }}
            priority
          />
          <span className="text-white font-semibold text-lg tracking-wide group-hover:text-gray-200 transition-colors duration-200">
            Project-E Gym
          </span>
        </Link>

        {/* ── DESKTOP NAV LINKS — Centered ── */}
        <nav
          className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => {
                // If it's an anchor link on the current page, handle it smoothly
                if (link.href.startsWith("/#")) {
                  e.preventDefault();
                  const id = link.href.substring(2);
                  const element = document.getElementById(id);
                  if (element) {
                    const offset = 80; // Account for sticky header
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }
              }}
              className="text-[#A1A1AA] hover:text-white text-sm font-normal tracking-wide transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── MEMBER LOGIN BUTTON — Far right, desktop only ── */}
        <div className="hidden md:flex items-center">
          <Link
            href="/login"
            className="px-4 py-1.5 border border-white/25 text-white text-sm font-bold rounded bg-land-card-hover hover:bg-white/10 transition-all duration-200 tracking-wide"
          >
            Member Portal
          </Link>
        </div>

        {/* ── MOBILE HAMBURGER BUTTON ── */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      <div
        className={`md:hidden absolute top-14 left-0 w-full bg-land-bg border-b border-land-border transition-all duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className="flex flex-col gap-6 px-6 py-8">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMenuOpen(false);
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    const id = link.href.substring(2);
                    const element = document.getElementById(id);
                    if (element) {
                      const offset = 80;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                  }
                }}
                className="text-[#A1A1AA] hover:text-white text-lg font-medium tracking-wide transition-colors duration-200 py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-land-border">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white text-sm font-bold rounded-lg bg-land-card-hover hover:bg-white/10 transition-all duration-200 tracking-wide w-full max-w-[200px]"
            >
              Member Portal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
