"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CornerDownLeft,
  Database,
  FileText,
  Layers,
  LayoutDashboard,
  Moon,
  Network,
  PlusCircle,
  Search,
  Settings,
  Sun,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

interface PageNavigationItem {
  id: string;
  name: string;
  description: string;
  href?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  section?: string;
  action?: () => void;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: GlobalSearchModalProps) {
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Global Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (query) {
          setQuery("");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose, query]);

  // Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  // Clean list of application pages to navigate to
  const pages: PageNavigationItem[] = useMemo(
    () => [
      {
        id: "nav-dashboard",
        name: "Dashboard",
        description: "Overview of workspace metrics and key statistics",
        href: "/",
        icon: LayoutDashboard,
        section: "Main Pages",
      },
      {
        id: "nav-analytics",
        name: "Analytics",
        description: "Engagement, audience reach, and platform performance",
        href: "/analytics",
        icon: BarChart3,
        section: "Main Pages",
      },
      {
        id: "nav-posts-analysis",
        name: "Posts Analysis",
        description: "View analyzed posts, audience comments, and details",
        href: "/posts-analysis",
        icon: Layers,
        section: "Main Pages",
      },
      {
        id: "nav-trends",
        name: "Trends & Topics",
        description: "Trending hashtags, narratives, and momentum",
        href: "/trends",
        icon: TrendingUp,
        section: "Main Pages",
      },
      {
        id: "nav-audience",
        name: "Audience Insights",
        description: "Audience demographics, cohort clusters, and segments",
        href: "/audience",
        icon: Users,
        section: "Main Pages",
      },
      {
        id: "nav-influence",
        name: "Influence Network",
        description: "Key accounts, opinion leaders, and network graphs",
        href: "/influence",
        icon: Network,
        section: "Main Pages",
      },
      {
        id: "nav-reports",
        name: "Reports",
        description: "Saved workspace reports, summaries, and exports",
        href: "/reports",
        icon: FileText,
        section: "Main Pages",
      },
      {
        id: "nav-data-sources",
        name: "Data Sources",
        description: "Manage connected platforms and media accounts",
        href: "/data-sources",
        icon: Database,
        section: "Configuration",
      },
      {
        id: "nav-settings",
        name: "Settings",
        description: "Workspace preferences, profile, and notifications",
        href: "/settings",
        icon: Settings,
        section: "Configuration",
      },
      {
        id: "nav-create-profile",
        name: "Create Profile",
        description: "Set up a new brand or topic monitoring profile",
        href: "/create-profile",
        icon: PlusCircle,
        section: "Configuration",
      },
      {
        id: "action-theme",
        name: `Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`,
        description: `Toggle display theme (currently ${resolvedTheme === "dark" ? "Dark" : "Light"})`,
        icon: resolvedTheme === "dark" ? Sun : Moon,
        section: "Quick Actions",
        action: () => toggleTheme(),
      },
    ],
    [resolvedTheme, toggleTheme]
  );

  // Filter pages cleanly based on simple search query
  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [pages, query]);

  // Execute selection
  const handleSelect = (item: PageNavigationItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredPages.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredPages.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredPages[selectedIndex]) {
        handleSelect(filteredPages[selectedIndex]);
      }
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Go to page"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] text-zinc-900 dark:text-zinc-100 shadow-2xl transition-all duration-150 z-10 flex flex-col">
        {/* Simple Search Input */}
        <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 bg-white dark:bg-[#0c1017]">
          <Search size={18} className="text-zinc-400 dark:text-zinc-500 mr-3 shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Go to page (e.g. Analytics, Reports, Settings)..."
            className="w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              title="Clear input"
              className="p-1 mr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
            >
              <X size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            title="Press ESC to close"
            className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
        >
          {filteredPages.length === 0 ? (
            <div className="py-10 text-center px-4">
              <Search className="mx-auto h-7 w-7 text-zinc-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                No pages found matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Try searching for Dashboard, Analytics, Trends, Audience, Reports, or Settings.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredPages.map((page, index) => {
                const Icon = page.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={page.id}
                    data-index={index}
                    type="button"
                    onClick={() => handleSelect(page)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-[#457B9D]/10 dark:bg-[#457B9D]/20 text-[#457B9D] dark:text-sky-300"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                          isSelected
                            ? "border-[#457B9D]/40 bg-[#457B9D] text-white"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isSelected
                              ? "text-zinc-950 dark:text-white"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {page.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {page.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-white/80 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                          <span>Open</span>
                          <CornerDownLeft size={10} />
                        </span>
                      )}
                      <ArrowRight
                        size={15}
                        className={`transition-transform ${
                          isSelected
                            ? "translate-x-0.5 text-[#457B9D] dark:text-sky-400 opacity-100"
                            : "opacity-0 group-hover:opacity-100 text-zinc-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Clean, Simple Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 px-4 py-2 bg-zinc-50/70 dark:bg-zinc-900/50 text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              <span>select</span>
            </span>
          </div>

          <span className="font-mono text-[10px]">
            {filteredPages.length} {filteredPages.length === 1 ? "page" : "pages"}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
