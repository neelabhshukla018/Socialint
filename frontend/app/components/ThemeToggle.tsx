"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400 shadow-xs opacity-60 ${className}`}
        aria-label="Toggle theme"
      >
        <Sun size={18} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition duration-200 active:scale-95 ${
        showLabel ? "px-3 py-2 text-xs font-semibold" : "h-10 w-10 justify-center"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun
            size={16}
            strokeWidth={2}
            className="text-amber-400 transition-transform duration-300 group-hover:rotate-45 sm:size-[18px]"
          />
        ) : (
          <Moon
            size={16}
            strokeWidth={2}
            className="text-[#457B9D] transition-transform duration-300 group-hover:-rotate-12 sm:size-[18px]"
          />
        )}
      </div>

      {showLabel && (
        <span className="capitalize">
          {theme === "SYSTEM" ? "System" : isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
