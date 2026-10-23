"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Network,
  Radio,
  Send,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
  LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSettings } from "@/src/lib/settingsStore";
import { useSocl } from "../context/SoclContext";


export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
  hideOnMobile?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const PROMPT_PREVIEWS = [
  "How to handle a PR crisis?",
  "Explain sentiment score",
  "How to analyze a post?",
  "Where to download PDF reports?",
  "What is topic velocity?",
];

const navLinks: NavGroup[] = [
  {
    group: "Workspace",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/analytics", icon: Activity, label: "Analytics" },
      { href: "/posts-analysis", icon: MessageSquare, label: "Posts Analysis" },
      { href: "/trends", icon: TrendingUp, label: "Trends & Topics" },
      { href: "/audience", icon: Users, label: "Audience Insights" },
      { href: "/influence", icon: Network, label: "Influence Network", hideOnMobile: true },
    ],
  },
  {
    group: "Management",
    items: [
      { href: "/data-sources", icon: Radio, label: "Data Sources" },
      { href: "/create-profile", icon: SlidersHorizontal, label: "Monitoring Profiles" },
      { href: "/reports", icon: FileText, label: "Reports" },
      { href: "/settings", icon: Settings, label: "Settings" },
      { href: "/help", icon: HelpCircle, label: "Help & Contact Us" },
    ],
  },
];

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { openSocl } = useSocl();
  const [sidebarPrompt, setSidebarPrompt] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Determine if collapsed mode is active (via prop or workspace compactView setting)
  const isCompact = isCollapsed || settings.compactView;

  // Cycle prompts one by one inside the box
  useEffect(() => {
    if (isInputFocused || sidebarPrompt.trim().length > 0) return;
    const timer = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % PROMPT_PREVIEWS.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [isInputFocused, sidebarPrompt]);

  const handleSidebarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const promptToSend = sidebarPrompt.trim() || PROMPT_PREVIEWS[promptIndex];
    if (!promptToSend) return;
    setSidebarPrompt("");
    onClose?.();
    openSocl(promptToSend);
  };

  const handlePrevPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptIndex((prev) => (prev - 1 + PROMPT_PREVIEWS.length) % PROMPT_PREVIEWS.length);
  };

  const handleNextPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptIndex((prev) => (prev + 1) % PROMPT_PREVIEWS.length);
  };

  const getFilteredNavLinks = (isMobile: boolean): NavGroup[] => {
    return navLinks.map((group) => ({
      ...group,
      items: isMobile ? group.items.filter((item) => !item.hideOnMobile) : group.items,
    }));
  };

  const renderSidebarContent = (isMobile = false) => {
    const currentNavLinks = getFilteredNavLinks(isMobile);
    const compactMode = !isMobile && isCompact;

    return (
      <div className="flex h-full flex-col bg-white dark:bg-[#0c1017] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 select-none">
        {/* ================================================== */}
        {/* LOGO HEADER                                        */}
        {/* ================================================== */}
        <div
          className={`relative flex h-16 sm:h-20 shrink-0 items-center border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-200 ${
            compactMode ? "justify-center px-2" : "justify-between px-5 sm:px-6"
          }`}
        >
          <Link
            href="/"
            onClick={onClose}
            title="SocialInt"
            className="relative z-10 flex items-center gap-3 group transition-transform duration-150 hover:scale-[1.01]"
          >
            {/* Logo Icon Badge with Black Backlight Halo & Pronounced Shadow */}
            <div className="relative">
              {/* Black Halo / Backlight behind Icon Badge */}
              <div className="absolute -inset-1.5 rounded-2xl bg-black/25 dark:bg-black/80 blur-md opacity-90 group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 pointer-events-none" />

              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white border border-black/15 dark:border-zinc-800 shadow-[0_5px_18px_rgba(0,0,0,0.28),0_2px_4px_rgba(0,0,0,0.18)] dark:shadow-[0_5px_22px_rgba(0,0,0,0.95)] transition-all duration-200 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.38)] dark:group-hover:shadow-[0_8px_30px_rgba(0,0,0,1)] group-hover:scale-[1.02]">
                <Activity size={19} className="stroke-[2.4]" />
              </div>
            </div>

            {/* Logo Typography */}
            {!compactMode && (
              <span className="font-display text-[26px] tracking-tight text-black dark:text-white leading-none">
                SocialInt
              </span>
            )}
          </Link>

          {/* Mobile Close Button */}
          {onClose && isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ================================================== */}
        {/* NAVIGATION LINKS                                   */}
        {/* ================================================== */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-2.5 sm:px-3 py-3 sm:py-3.5 space-y-3.5 sm:space-y-4 no-scrollbar">
          {currentNavLinks.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Group Section Header */}
              {!compactMode ? (
                <p className="px-2.5 pb-1 pt-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                  {group.group}
                </p>
              ) : (
                <div className="my-1.5 mx-auto h-[1px] w-6 bg-zinc-200 dark:bg-zinc-800" />
              )}

              {/* Items in Group */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/help" &&
                      (pathname?.startsWith("/help") || pathname === "/contact"));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      title={item.label}
                      className={`group relative flex w-full items-center rounded-xl transition-all duration-150 ${
                        compactMode
                          ? "justify-center p-2.5"
                          : "gap-2.5 px-3 py-2 sm:py-2.5"
                      } ${
                        isActive
                          ? "bg-[#457B9D]/10 text-zinc-900 dark:bg-[#457B9D]/15 dark:text-white font-semibold border border-[#457B9D]/20 dark:border-[#457B9D]/30 shadow-xs shadow-[#457B9D]/5 dark:shadow-[#457B9D]/10"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 hover:text-zinc-950 dark:hover:text-zinc-100 border border-transparent"
                      }`}
                    >
                      {/* Active Left Accent Pill Indicator */}
                      {isActive && (
                        <span
                          className={`absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                            compactMode
                              ? "h-5 w-1 -left-0.5 bg-[#457B9D] dark:bg-[#7bb5d4]"
                              : "h-4 w-[3px] bg-[#457B9D] dark:bg-[#7bb5d4]"
                          }`}
                        />
                      )}

                      {/* Nav Icon */}
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className={`shrink-0 transition-colors duration-150 ${
                          isActive
                            ? "text-[#457B9D] dark:text-[#7bb5d4]"
                            : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                        }`}
                      />

                      {/* Nav Label */}
                      {!compactMode && (
                        <span
                          className={`text-[13px] tracking-tight flex-1 truncate transition-colors duration-150 ${
                            isActive
                              ? "font-semibold text-zinc-950 dark:text-white"
                              : "font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}

                      {/* Badge if present */}
                      {!compactMode && item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 transition-colors ${
                            isActive
                              ? "bg-[#457B9D]/15 text-[#457B9D] dark:bg-[#457B9D]/25 dark:text-[#7bb5d4] border border-[#457B9D]/30"
                              : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/60"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Compact Mode Tooltip (on hover) */}
                      {compactMode && (
                        <div className="absolute left-full ml-2.5 hidden group-hover:flex items-center rounded-lg bg-zinc-900 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-white shadow-lg whitespace-nowrap z-50 pointer-events-none">
                          {item.label}
                          {item.badge && (
                            <span className="ml-1.5 text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2 rounded text-zinc-100">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ================================================== */}
        {/* SOCL COPILOT FOOTER CARD                           */}
        {/* ================================================== */}
        {!compactMode ? (
          <div className="shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/80 p-2.5 sm:p-3 bg-zinc-50/60 dark:bg-[#090d14]/70 transition-colors">
            <div className="rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#111726] p-2.5 shadow-2xs space-y-2 transition-colors">
              {/* Header */}
              <div
                onClick={() => {
                  onClose?.();
                  openSocl();
                }}
                className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition group"
              >
                <div className="relative h-6 w-6 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  <Image
                    src="/socl-astronaut.png"
                    alt="SOCL"
                    width={24}
                    height={24}
                    className="h-full w-full object-cover animate-float-astronaut"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-display text-xs tracking-tight text-zinc-950 dark:text-zinc-100 leading-none block">
                    SOCL
                  </span>
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                    AI PR &amp; Intelligence Copilot
                  </span>
                </div>
                <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-200 transition-colors flex items-center gap-0.5">
                  Open &rarr;
                </span>
              </div>

              {/* Unified Input Box with Prompts Inside One by One */}
              <form onSubmit={handleSidebarSubmit} className="relative">
                <div className="flex items-center rounded-lg border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/90 dark:bg-[#161f30] px-2 py-1.5 focus-within:border-[#457B9D]/80 dark:focus-within:border-[#457B9D]/80 focus-within:ring-1 focus-within:ring-[#457B9D]/20 focus-within:bg-white dark:focus-within:bg-[#161f30] transition-all duration-150">
                  {/* Input text / rotating prompt */}
                  <div className="relative flex-1 min-w-0 h-5 flex items-center overflow-hidden">
                    <input
                      type="text"
                      value={sidebarPrompt}
                      onChange={(e) => setSidebarPrompt(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      className="w-full bg-transparent text-[11px] text-zinc-900 dark:text-zinc-100 focus:outline-hidden relative z-10"
                    />

                    {/* Prompt inside the box one by one when input is empty */}
                    {!sidebarPrompt && (
                      <div
                        onClick={() => {
                          setSidebarPrompt(PROMPT_PREVIEWS[promptIndex]);
                        }}
                        className="absolute inset-0 flex items-center cursor-pointer select-none"
                        title="Click to edit or send this prompt"
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={promptIndex}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            transition={{ duration: 0.18 }}
                            className="truncate text-[11px] text-zinc-500 dark:text-zinc-400"
                          >
                            {PROMPT_PREVIEWS[promptIndex]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Controls inside the box: Previous / Next prompt + Send button */}
                  <div className="flex items-center gap-0.5 shrink-0 ml-1.5 relative z-20">
                    <button
                      type="button"
                      onClick={handlePrevPrompt}
                      title="Previous prompt"
                      aria-label="Previous prompt"
                      className="flex h-5 w-4 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                      <ChevronLeft size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPrompt}
                      title="Next prompt"
                      aria-label="Next prompt"
                      className="flex h-5 w-4 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                      <ChevronRight size={11} />
                    </button>
                    <button
                      type="submit"
                      title="Send prompt"
                      aria-label="Send prompt"
                      className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-[#457B9D] dark:hover:bg-[#386785] hover:bg-zinc-800 transition cursor-pointer ml-0.5 shadow-2xs"
                    >
                      <Send size={10} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Compact mode footer button */
          <div className="shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/80 p-2.5 flex justify-center bg-zinc-50/60 dark:bg-[#090d14]/70">
            <button
              type="button"
              onClick={() => {
                onClose?.();
                openSocl();
              }}
              title="Open SOCL AI Copilot"
              aria-label="Open SOCL AI Copilot"
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111726] shadow-2xs hover:border-[#457B9D]/60 transition"
            >
              <Image
                src="/socl-astronaut.png"
                alt="SOCL"
                width={24}
                height={24}
                className="h-6 w-6 object-cover animate-float-astronaut"
              />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ================================================== */}
      {/* DESKTOP FIXED SIDEBAR                              */}
      {/* ================================================== */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen overflow-hidden border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md lg:block transition-all duration-200 ${
          isCompact ? "w-[72px]" : "w-[270px]"
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* ================================================== */}
      {/* MOBILE BACKDROP & DRAWER                           */}
      {/* ================================================== */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-zinc-950/50 dark:bg-black/70 backdrop-blur-xs"
              onClick={onClose}
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 h-full w-[285px] max-w-[85vw] shadow-2xl z-10 border-r border-zinc-200/90 dark:border-zinc-800/90"
            >
              {renderSidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}