"use client";

import { cn } from "@/src/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    badge: string;
    badgeColor: string;
    title: string;
    detail: string;
    source: string;
    time: string;
    sentiment: "positive" | "negative" | "warning";
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    function getDirection() {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "forwards"
          );
        } else {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "reverse"
          );
        }
      }
    }

    function getSpeed() {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "25s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    }

    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-marquee-left",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[340px] max-w-full relative rounded-2xl border border-zinc-200/90 bg-white/95 backdrop-blur-md px-5 py-4 shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={cn(
                  "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border",
                  item.badgeColor
                )}
              >
                {item.badge}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">{item.time}</span>
            </div>

            <p className="text-xs font-semibold text-zinc-800 line-clamp-2 leading-relaxed">
              {item.title}
            </p>

            <p className="mt-2.5 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>{item.detail}</span>
              <span className="text-zinc-400 font-mono text-[10px] font-medium">
                {item.source}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
