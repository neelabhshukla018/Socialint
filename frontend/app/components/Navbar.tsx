"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, Menu, X, ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-5 z-50 mx-auto max-w-5xl px-4">
      <nav className="relative flex items-center justify-between rounded-full border border-zinc-200/90 bg-white/85 backdrop-blur-md px-6 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.05)] transition-all">
        {/* LEFT 2 LINKS */}
        <div className="hidden md:flex items-center gap-7">
          <a
            href="#features"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Features
          </a>
          <a
            href="#radar"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Radar
          </a>
        </div>

        {/* LOGO IN MIDDLE */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition group-hover:bg-cyan-600">
            <Activity size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg tracking-tight text-zinc-900 leading-none">
              SocialInt
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase -mt-0.5">
              Intelligence
            </span>
          </div>
        </Link>

        {/* RIGHT 2 LINKS + GET STARTED */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#solutions"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Use Cases
          </a>
          <a
            href="#workflow"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#privacy"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Privacy
          </a>

          <SignUpButton mode="modal">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 active:scale-95 transition"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </SignUpButton>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-2 md:hidden">
          <SignUpButton mode="modal">
            <button
              type="button"
              className="rounded-full bg-zinc-950 px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              Register
            </button>
          </SignUpButton>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-700 hover:text-zinc-950 rounded-lg"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl md:hidden flex flex-col gap-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950 py-1"
          >
            Features
          </a>
          <a
            href="#radar"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950 py-1 flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live Radar
          </a>
          <a
            href="#solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950 py-1"
          >
            Use Cases
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950 py-1"
          >
            How it Works
          </a>
          <a
            href="#privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950 py-1"
          >
            Privacy Policy
          </a>
        </div>
      )}
    </header>
  );
}
