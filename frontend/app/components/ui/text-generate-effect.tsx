"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/src/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0,
  staggerDelay = 0.08,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
  staggerDelay?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = (words || "").split(/\s+/).filter(Boolean);

  useEffect(() => {
    if (!scope.current || wordsArray.length === 0) return;
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration || 0.5,
        delay: stagger(staggerDelay, { startDelay: delay }),
      }
    );
  }, [scope, animate, words, duration, filter, delay, staggerDelay, wordsArray.length]);

  if (!words) return null;

  const renderWords = () => {
    return (
      <motion.span key={words} ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={`${word}-${idx}`}
              className="inline-block opacity-0 mr-[0.25em] last:mr-0"
              style={{
                filter: filter ? "blur(8px)" : "none",
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.span>
    );
  };

  return (
    <span className={cn("inline-block", className)}>
      {renderWords()}
    </span>
  );
};
