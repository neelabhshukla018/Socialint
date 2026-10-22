"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Menu, X, ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Threshold of 25px: when scrolled down, navbar shrinks; when at top, it expands
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky z-50 mx-auto w-full px-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isScrolled
          ? "top-2.5 sm:top-3 max-w-3xl lg:max-w-4xl"
          : "top-5 max-w-5xl lg:max-w-6xl"
      )}
    >
      <nav
        className={cn(
          "relative flex items-center justify-between rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled
            ? "py-2 px-5 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_45px_-8px_rgba(15,23,42,0.22),0_8px_18px_-4px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8),0_8px_18px_-4px_rgba(0,0,0,0.5)]"
            : "py-3 px-6 sm:px-7 bg-white/92 dark:bg-zinc-950/85 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800/90 shadow-[0_14px_34px_-6px_rgba(15,23,42,0.18),0_4px_12px_-2px_rgba(15,23,42,0.10)] dark:shadow-[0_14px_34px_-6px_rgba(0,0,0,0.7),0_4px_12px_-2px_rgba(0,0,0,0.4)]"
        )}
      >
        {/* LEFT 2 LINKS */}
        <div
          className={cn(
            "hidden md:flex items-center transition-all duration-300",
            isScrolled ? "gap-5 lg:gap-6" : "gap-7 lg:gap-8"
          )}
        >
          <a
            href="#features"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#privacy"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Privacy
          </a>
        </div>

        {/* LOGO IN MIDDLE */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition-all duration-300 group-hover:bg-cyan-600",
              isScrolled ? "h-7 w-7 rounded-lg" : "h-8 w-8 rounded-xl"
            )}
          >
            <Activity
              size={isScrolled ? 15 : 18}
              className="stroke-[2.5] transition-all duration-300"
            />
          </div>
          <div className="flex flex-col transition-all duration-300">
            <span
              className={cn(
                "font-display tracking-tight text-zinc-900 dark:text-white leading-none transition-all duration-300",
                isScrolled ? "text-base" : "text-lg"
              )}
            >
              SocialInt
            </span>
            <span
              className={cn(
                "font-mono tracking-widest text-zinc-400 uppercase transition-all duration-300",
                isScrolled
                  ? "text-[0px] h-0 opacity-0 overflow-hidden -mt-0"
                  : "text-[9px] h-auto opacity-100 -mt-0.5"
              )}
            >
              Intelligence
            </span>
          </div>
        </Link>

        {/* RIGHT 2 LINKS + GET STARTED */}
        <div
          className={cn(
            "hidden md:flex items-center transition-all duration-300",
            isScrolled ? "gap-5 lg:gap-6" : "gap-6 lg:gap-7"
          )}
        >
          <a
            href="#solutions"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Use Cases
          </a>
          <a
            href="#workflow"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            How it Works
          </a>

          <SignUpButton mode="modal">
            <button
              type="button"
              className={cn(
                "inline-flex items-center rounded-full bg-zinc-950 text-white shadow-sm hover:bg-zinc-800 active:scale-95 transition-all duration-300 font-semibold",
                isScrolled
                  ? "px-3.5 py-1.5 text-xs gap-1"
                  : "px-4.5 py-2 text-xs gap-1.5"
              )}
            >
              <span>Get Started</span>
              <ArrowRight size={isScrolled ? 12 : 13} className="transition-all duration-300" />
            </button>
          </SignUpButton>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-2 md:hidden">
          <SignUpButton mode="modal">
            <button
              type="button"
              className={cn(
                "rounded-full bg-zinc-950 text-white font-semibold transition-all duration-300",
                isScrolled ? "px-3 py-1.5 text-xs" : "px-3.5 py-1.5 text-xs"
              )}
            >
              Register
            </button>
          </SignUpButton>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mt-2 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-4 shadow-xl md:hidden flex flex-col gap-3"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white py-1"
            >
              Features
            </a>
            <a
              href="#privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white py-1"
            >
              Privacy Policy
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white py-1"
            >
              Use Cases
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white py-1"
            >
              How it Works
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
