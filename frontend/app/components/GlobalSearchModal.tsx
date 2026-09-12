"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Command,
  Database,
  FileText,
  Hash,
  Layers,
  Moon,
  Network,
  Search,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Pages" | "Topics" | "Actions";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  href?: string;
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

  // Global Escape keydown listener
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Build searchable items catalogue
  const allItems: SearchItem[] = useMemo(
    () => [
      // Navigation Pages
      {
        id: "page-dashboard",
        title: "Dashboard",
        subtitle: "Real-time workspace overview & key metrics",
        category: "Pages",
        icon: Activity,
        href: "/",
      },
      {
        id: "page-analytics",
        title: "Analytics",
        subtitle: "Engagement breakdown, conversation activity & platform reach",
        category: "Pages",
        icon: BarChart3,
        href: "/analytics",
      },
      {
        id: "page-posts-analysis",
        title: "Posts Analysis",
        subtitle: "AI-driven sentiment, comment extraction & engagement scraper",
        category: "Pages",
        icon: Sparkles,
        href: "/posts-analysis",
      },
      {
        id: "page-trends",
        title: "Trends & Topics",
        subtitle: "Fast-growing narratives, velocity scores & monitored hashtags",
        category: "Pages",
        icon: TrendingUp,
        href: "/trends",
      },
      {
        id: "page-audience",
        title: "Audience Insights",
        subtitle: "Audience demographics, cohort clusters & emotional sentiment",
        category: "Pages",
        icon: Users,
        href: "/audience",
      },
      {
        id: "page-influence",
        title: "Influence Network",
        subtitle: "Key opinion leaders, citation graphs & node relationships",
        category: "Pages",
        icon: Network,
        href: "/influence",
      },
      {
        id: "page-reports",
        title: "Reports & Intelligence",
        subtitle: "Executive briefs, digests & downloadable PDF/CSV exports",
        category: "Pages",
        icon: FileText,
        href: "/reports",
      },
      {
        id: "page-data-sources",
        title: "Data Sources",
        subtitle: "Manage connections to X, Telegram, Instagram & YouTube",
        category: "Pages",
        icon: Database,
        href: "/data-sources",
      },
      {
        id: "page-settings",
        title: "Settings",
        subtitle: "Profile configuration, appearance theme & notification rules",
        category: "Pages",
        icon: Settings,
        href: "/settings",
      },

      // Topics & Hashtags
      {
        id: "topic-performance",
        title: "#Performance",
        subtitle: "Fastest rising sports narrative (+320% viral velocity)",
        category: "Topics",
        icon: Hash,
        badge: "+320%",
        href: "/trends",
      },
      {
        id: "topic-upcoming-match",
        title: "#UpcomingMatch",
        subtitle: "Match preview discussions & audience momentum (+184%)",
        category: "Topics",
        icon: Hash,
        badge: "+184%",
        href: "/trends",
      },
      {
        id: "topic-team-selection",
        title: "#TeamSelection",
        subtitle: "Lineup analysis & community fan sentiment (+126%)",
        category: "Topics",
        icon: Hash,
        badge: "+126%",
        href: "/trends",
      },
      {
        id: "topic-captaincy",
        title: "#Captaincy",
        subtitle: "Leadership narrative & verified commentator reach (+89%)",
        category: "Topics",
        icon: Hash,
        badge: "+89%",
        href: "/trends",
      },

      // Quick Actions
      {
        id: "action-analyze-post",
        title: "Analyze a Public Post",
        subtitle: "Paste an Instagram URL to run Apify and Gemini AI extraction",
        category: "Actions",
        icon: Sparkles,
        href: "/posts-analysis",
      },
      {
        id: "action-toggle-theme",
        title: `Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`,
        subtitle: `Currently in ${resolvedTheme === "dark" ? "Dark" : "Light"} theme`,
        category: "Actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        action: () => toggleTheme(),
      },
      {
        id: "action-export-report",
        title: "Download Intelligence Report",
        subtitle: "Export executive PDF summary or raw sentiment CSV",
        category: "Actions",
        icon: FileText,
        href: "/reports",
      },
      {
        id: "action-add-source",
        title: "Connect New Social Source",
        subtitle: "Add public profiles or hashtags for continuous tracking",
        category: "Actions",
        icon: Database,
        href: "/data-sources",
      },
    ],
    [resolvedTheme, toggleTheme]
  );

  // Filter items according to search query
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return allItems;

    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.subtitle.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed)
    );
  }, [allItems, query]);

  // Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Ensure selected index stays in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedElement = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Execute selected item
  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search SocialInt"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-14 sm:pt-20 md:pt-24 px-3 sm:px-4 pb-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-xl sm:max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#090d16] text-zinc-900 dark:text-zinc-100 shadow-2xl transition-all duration-200 z-10">
        {/* Search Header Input */}
        <div className="relative flex items-center border-b border-zinc-100 dark:border-zinc-800/80 px-4 py-3.5">
          <Search className="h-5 w-5 text-[#457B9D] shrink-0 mr-3" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, topics, actions or type #hashtag..."
            className="h-9 w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-2 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            title="Escape to close"
            aria-label="Close search"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <span>ESC</span>
            <X size={13} className="opacity-70" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/60 px-4 py-2 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs">
            <span className="text-[11px] text-zinc-400 font-medium mr-1">
              Suggestions:
            </span>
            {["Analytics", "#Performance", "Posts Analysis", "Reports"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-2 py-0.5 text-[11px] text-zinc-600 dark:text-zinc-300 hover:border-[#457B9D] hover:text-[#457B9D] dark:hover:text-sky-400 transition"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        )}

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[60vh] sm:max-h-[380px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Try searching for a different keyword, page name, or hashtag.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.id}
                    data-index={index}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      isSelected
                        ? "bg-[#457B9D]/10 dark:bg-[#457B9D]/20 text-[#457B9D] dark:text-sky-300"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                          isSelected
                            ? "border-[#457B9D]/40 bg-[#457B9D] text-white"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`truncate text-sm font-semibold ${
                              isSelected
                                ? "text-zinc-950 dark:text-white"
                                : "text-zinc-900 dark:text-zinc-200"
                            }`}
                          >
                            {item.title}
                          </p>

                          <span
                            className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                              item.category === "Pages"
                                ? "border-sky-200 dark:border-sky-900/50 text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40"
                                : item.category === "Topics"
                                ? "border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                                : "border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40"
                            }`}
                          >
                            {item.category}
                          </span>

                          {item.badge && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={15}
                      className={`shrink-0 transition-transform ${
                        isSelected
                          ? "translate-x-0.5 text-[#457B9D] dark:text-sky-400"
                          : "opacity-0 group-hover:opacity-100 text-zinc-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 px-4 py-2.5 bg-zinc-50/70 dark:bg-zinc-900/50 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              to select
            </span>
          </div>

          <span className="font-mono text-[10px] text-zinc-400">
            {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
