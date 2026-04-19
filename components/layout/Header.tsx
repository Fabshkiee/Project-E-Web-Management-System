"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// ============================================================
// NAV LINKS — Edit labels and hrefs here
// ============================================================
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Trainers", href: "#trainers" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // ============================================================
    // HEADER WRAPPER — Background color and font set here
    // ============================================================
    <header
      className="relative w-full bg-land-bg border-b border-land-border"
      style={{ fontFamily: "var(--font-space), sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* ── LOGO + BRAND NAME ── */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <Image
            src="/assets/proje_logo.svg"
            alt="Project-E Gym Logo"
            width={28}
            height={26}
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
            className="px-4 py-1.5 border border-white/25 text-white text-sm font-bold rounded bg-land-card-hover hover:bg-white hover:text-land-bg transition-all duration-200 tracking-wide"
          >
            Member Login
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
      {menuOpen && (
        <div className="md:hidden bg-land-bg border-t border-land-border">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#A1A1AA] hover:text-white text-sm font-normal tracking-wide transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          {/* ── MOBILE LOGIN BUTTON ── */}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="self-start px-4 py-1.5 border border-white/25 text-white text-sm font-bold rounded bg-land-card-hover hover:bg-white hover:text-land-bg transition-all duration-200 tracking-wide"
          >
            Member Login
          </Link>
        </div>
      )}
    </header>
  );
}
