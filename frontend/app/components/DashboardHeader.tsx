"use client";

import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import {
  Show,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import ThemeToggle from "./ThemeToggle";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-20
        flex
        h-20
        items-center
        justify-between
        border-b
        border-zinc-200/80
        dark:border-zinc-800/80
        bg-white/80
        dark:bg-[#080b12]/80
        px-4
        backdrop-blur-xl
        sm:px-8
        transition-colors
        duration-150
      "
    >
      {/* ================================================== */}
      {/* LEFT: HAMBURGER (MOBILE) + WORKSPACE TITLE         */}
      {/* ================================================== */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white lg:hidden transition"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#457B9D]" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Workspace
            </p>
          </div>
          <h2 className="font-display text-lg sm:text-xl tracking-tight text-zinc-950 dark:text-white mt-0.5">
            Social Intelligence
          </h2>
        </div>
      </div>

      {/* ================================================== */}
      {/* RIGHT: ACTIONS                                     */}
      {/* ================================================== */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className="
            hidden
            rounded-xl
            border
            border-zinc-200
            dark:border-zinc-800
            bg-white
            dark:bg-zinc-900
            p-2.5
            text-zinc-600
            dark:text-zinc-400
            shadow-xs
            transition-all
            duration-200
            hover:border-zinc-300
            dark:hover:border-zinc-700
            hover:bg-zinc-100/80
            dark:hover:bg-zinc-800
            hover:text-zinc-950
            dark:hover:text-white
            sm:block
          "
        >
          <Search size={18} strokeWidth={1.8} />
        </button>

        {/* Theme Toggle (Light / Dark Mode) */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            rounded-xl
            border
            border-zinc-200
            dark:border-zinc-800
            bg-white
            dark:bg-zinc-900
            p-2.5
            text-zinc-600
            dark:text-zinc-400
            shadow-xs
            transition-all
            duration-200
            hover:border-zinc-300
            dark:hover:border-zinc-700
            hover:bg-zinc-100/80
            dark:hover:bg-zinc-800
            hover:text-zinc-950
            dark:hover:text-white
          "
        >
          <Bell size={18} strokeWidth={1.8} />
          {/* Notification red dot */}
          <span
            className="
              absolute
              right-2
              top-2
              h-1.5
              w-1.5
              rounded-full
              bg-rose-500
              shadow-[0_0_8px_rgba(244,63,94,0.6)]
            "
          />
        </button>

        {/* Signed Out Fallback */}
        <Show when="signed-out">
          <SignUpButton mode="modal">
            <button
              type="button"
              className="
                rounded-xl
                bg-zinc-950
                dark:bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                dark:text-zinc-950
                shadow-xs
                transition-all
                duration-200
                hover:bg-zinc-800
                dark:hover:bg-zinc-200
                sm:px-5
                sm:text-sm
              "
            >
              Get Started
            </button>
          </SignUpButton>
        </Show>

        {/* Signed In User Profile */}
        <Show when="signed-in">
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox:
                  "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 shadow-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition",
                userButtonOuterIdentifier:
                  "text-xs font-semibold text-zinc-800 dark:text-zinc-200 sm:text-sm",
                userButtonAvatarBox:
                  "h-7 w-7 sm:h-8 sm:w-8",
                userButtonTrigger:
                  "rounded-xl focus:shadow-none",
                userButtonPopoverCard:
                  "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xl",
              },
            }}
          />
        </Show>
      </div>
    </header>
  );
}