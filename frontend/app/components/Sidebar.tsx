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
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/src/lib/settingsStore";
import { useSocl } from "../context/SoclContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  href: string;
  icon: any;
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

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { settings, updateSettings } = useSettings();
  const { openSocl } = useSocl();
  const [sidebarPrompt, setSidebarPrompt] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

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

    return (
      <div className="flex h-full flex-col bg-white dark:bg-[#0d111a] transition-colors duration-150">
        {/* ================================================== */}
        {/* LOGO BANNER                                        */}
        {/* ================================================== */}
        <div className="relative flex h-16 sm:h-20 shrink-0 items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 px-5 sm:px-6">
          <Link
            href="/"
            onClick={onClose}
            className="relative z-10 flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition group-hover:bg-zinc-800 dark:group-hover:bg-zinc-700">
              <Activity size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[25px] tracking-tight text-zinc-900 dark:text-white leading-none">
                SocialInt
              </span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase -mt-0.5 truncate max-w-[150px]" title={settings.workspaceName}>
                {settings.workspaceName || "PR & Intelligence"}
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-white lg:hidden cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ================================================== */}
        {/* NAVIGATION                                         */}
        {/* ================================================== */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:py-5 space-y-5 sm:space-y-6">
          {currentNavLinks.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                {group.group}
              </p>
              <div className="space-y-1">
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
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                        isActive
                          ? "bg-[#457B9D] text-white font-medium shadow-xs shadow-[#457B9D]/20"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className={
                          isActive
                            ? "text-white shrink-0"
                            : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 shrink-0"
                        }
                      />
                      <span className="text-[13px] font-medium tracking-tight flex-1 truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                            isActive
                              ? "bg-white/25 text-white"
                              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ================================================== */}
        {/* SOCL PROMPT PREVIEW (PROMPTS INSIDE BOX ONE BY ONE)*/}
        {/* ================================================== */}
        <div className="shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/80 p-2.5 bg-zinc-50/60 dark:bg-[#0b0f17]">
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#111723] p-2.5 shadow-2xs space-y-2">
            {/* Header */}
            <div
              onClick={() => {
                onClose?.();
                openSocl();
              }}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition group"
            >
              <div className="relative h-6 w-6 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                <img
                  src="/socl-astronaut.png"
                  alt="SOCL"
                  className="h-full w-full object-cover animate-float-astronaut"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-display text-xs tracking-tight text-zinc-950 dark:text-zinc-100 leading-none block">
                  SOCL
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                  Your AI Copilot
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition">
                Open &rarr;
              </span>
            </div>

            {/* Unified Input Box with Prompts Inside One by One */}
            <form onSubmit={handleSidebarSubmit} className="relative">
              <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#161d2d] px-2 py-1.5 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition">
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
                    className="flex h-5 w-4 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                  >
                    <ChevronLeft size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPrompt}
                    title="Next prompt"
                    aria-label="Next prompt"
                    className="flex h-5 w-4 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                  >
                    <ChevronRight size={11} />
                  </button>
                  <button
                    type="submit"
                    title="Send prompt"
                    aria-label="Send prompt"
                    className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition cursor-pointer ml-0.5"
                  >
                    <Send size={10} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[270px] overflow-hidden border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-[#0d111a]/95 backdrop-blur-md lg:block transition-colors duration-150">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs"
              onClick={onClose}
            />
            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 h-full w-[285px] max-w-[85vw] shadow-2xl z-10"
            >
              {renderSidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}