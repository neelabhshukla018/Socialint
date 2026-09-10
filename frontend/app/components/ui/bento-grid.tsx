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
        "row-span-1 rounded-2xl group/bento transition duration-300 p-6 bg-white border border-zinc-200/90 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)] hover:border-zinc-300 justify-between flex flex-col space-y-4 relative overflow-hidden",
        className
      )}
    >
      {/* Subtle corner glow on hover */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition-opacity duration-300 opacity-0 group-hover/bento:opacity-100" />

      {header}

      <div className="group-hover/bento:translate-x-0.5 transition duration-200">
        <div className="flex items-center gap-2.5 mb-2">
          {icon}
          <div className="font-display text-base text-zinc-900">
            {title}
          </div>
        </div>
        <div className="text-zinc-600 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
