"use client";

import { cn } from "@/src/lib/utils";
import React from "react";

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number).fill(true);
  return (
    <>
      {meteors.map((_el, idx) => {
        const top = Math.floor(pseudoRandom(idx * 4 + 1) * 100) + "%";
        const left = Math.floor(pseudoRandom(idx * 4 + 2) * 100) + "%";
        const delay = (pseudoRandom(idx * 4 + 3) * 0.6 + 0.2).toFixed(2) + "s";
        const duration = Math.floor(pseudoRandom(idx * 4 + 4) * 7 + 3) + "s";

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor pointer-events-none absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-400 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
              "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#06b6d4] before:to-transparent",
              className
            )}
            style={{
              top,
              left,
              animationDelay: delay,
              animationDuration: duration,
            }}
          ></span>
        );
      })}
    </>
  );
};
