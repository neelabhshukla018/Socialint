"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Menu,
  Radio,
  Search,
} from "lucide-react";

import {
  Show,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import ThemeToggle from "./ThemeToggle";
import GlobalSearchModal from "./GlobalSearchModal";
import NotificationPopover from "./NotificationPopover";
import { useNotifications } from "../context/NotificationContext";
import { getActiveProfile, type MonitoringProfile } from "@/src/lib/monitoringStore";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<MonitoringProfile | null>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    setActiveProfile(getActiveProfile());
  }, []);

  // Global keyboard shortcut (Cmd+K / Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement?.tagName || "").toUpperCase()
        )
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        sm:h-20
        items-center
        justify-between
        border-b
        border-zinc-200/80
        dark:border-zinc-800/80
        bg-white/80
        dark:bg-[#080b12]/80
        px-4
        sm:px-8
        backdrop-blur-xl
        transition-colors
        duration-150
        max-w-full
      "
    >
      {/* ================================================== */}
      {/* LEFT: HAMBURGER (MOBILE) + WORKSPACE TITLE + PROFILE CHIP */}
      {/* ================================================== */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white lg:hidden transition"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        )}

        <div className="min-w-0 flex items-center gap-3">
          <div>
            <h2 className="lg:hidden font-display text-xl xs:text-2xl tracking-tight text-zinc-950 dark:text-white mt-0.5 truncate">
              SocialInt
            </h2>
            <h2 className="hidden lg:block font-display text-2xl tracking-tight text-zinc-950 dark:text-white mt-0.5">
              Workspace
            </h2>
          </div>

          {/* Active Profile Pill Link */}
          {activeProfile && (
            <Link
              href="/create-profile"
              title="Click to switch or change monitoring profile"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:border-[#457B9D]/60 hover:bg-white dark:hover:bg-zinc-800 transition group"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#457B9D]/15 text-[#457B9D] font-bold text-[10px]">
                {activeProfile.name ? activeProfile.name.slice(0, 2).toUpperCase() : "SI"}
              </div>
              <span className="truncate max-w-[120px] font-medium text-zinc-900 dark:text-zinc-100">
                {activeProfile.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-[#457B9D] transition">
                Change &rarr;
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* RIGHT: ACTIONS                                     */}
      {/* ================================================== */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Search Bar Trigger */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Open search command palette"
          className="
            hidden
            md:flex
            items-center
            gap-2.5
            h-10
            w-48
            lg:w-64
            rounded-xl
            border
            border-zinc-200
            dark:border-zinc-800
            bg-zinc-50/80
            dark:bg-zinc-900/80
            px-3
            text-left
            text-xs
            text-zinc-400
            dark:text-zinc-500
            shadow-xs
            transition-all
            duration-200
            hover:border-[#457B9D]/60
            hover:bg-white
            dark:hover:bg-zinc-900
            hover:text-zinc-700
            dark:hover:text-zinc-300
          "
        >
          <Search size={15} className="text-[#457B9D] shrink-0" />
          <span className="truncate flex-1">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Search Mobile Button */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="
            flex
            md:hidden
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-zinc-200
            dark:border-zinc-800
            bg-white
            dark:bg-zinc-900
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
          <Search size={16} strokeWidth={1.8} />
        </button>

        {/* Theme Toggle (Light / Dark Mode) */}
        <ThemeToggle className="!h-9 !w-9 sm:!h-10 sm:!w-10" />

        {/* Notifications Button & Popover */}
        <div className="relative">
          <button
            ref={bellButtonRef}
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Open notifications"
            className={`
              relative
              flex
              h-9
              w-9
              sm:h-10
              sm:w-10
              items-center
              justify-center
              rounded-xl
              border
              transition-all
              duration-200
              ${
                notificationsOpen
                  ? "border-[#457B9D] bg-[#457B9D]/10 text-[#457B9D]"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/80 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
              }
              shadow-xs
            `}
          >
            <Bell size={16} strokeWidth={1.8} className="sm:size-[18px]" />
            {/* Notification unread badge */}
            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-rose-500
                  text-[10px]
                  font-mono
                  font-bold
                  text-white
                  shadow-[0_0_8px_rgba(244,63,94,0.6)]
                "
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          <NotificationPopover
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            triggerRef={bellButtonRef}
          />
        </div>

        {/* Signed Out Fallback */}
        <Show when="signed-out">
          <SignUpButton mode="modal">
            <button
              type="button"
              className="
                rounded-xl
                bg-zinc-950
                dark:bg-white
                px-3
                py-2
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
                sm:py-2.5
                sm:text-sm
              "
            >
              Get Started
            </button>
          </SignUpButton>
        </Show>

        {/* Signed In User Profile */}
        <Show when="signed-in">
          <div className="flex items-center">
            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonBox:
                    "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 sm:px-2.5 sm:py-1.5 shadow-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex items-center gap-2",
                  userButtonOuterIdentifier:
                    "hidden sm:inline-block text-xs font-semibold text-zinc-800 dark:text-zinc-200 sm:text-sm max-w-[120px] truncate",
                  userButtonAvatarBox:
                    "h-7 w-7 sm:h-8 sm:w-8",
                  userButtonTrigger:
                    "rounded-xl focus:shadow-none",
                  userButtonPopoverCard:
                    "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xl",
                },
              }}
            />
          </div>
        </Show>
      </div>

      {/* Global Command Palette / Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}