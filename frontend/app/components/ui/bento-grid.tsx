"use client";

import { cn } from "@/src/lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento transition duration-300 p-6 bg-white dark:bg-[#0d111a]/85 border border-zinc-200/90 dark:border-zinc-800/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)] hover:border-zinc-300 dark:hover:border-zinc-700 justify-between flex flex-col space-y-4 relative overflow-hidden backdrop-blur-xs",
        className
      )}
    >
      {/* Subtle corner glow on hover */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl transition-opacity duration-300 opacity-0 group-hover/bento:opacity-100" />

      {header}

      <div className="group-hover/bento:translate-x-0.5 transition duration-200">
        <div className="flex items-center gap-2.5 mb-2">
          {icon}
          <div className="font-display text-base text-zinc-900 dark:text-zinc-100">
            {title}
          </div>
        </div>
        <div className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
