"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/src/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 0.5,
        delay: stagger(0.1),
      }
    );
  }, [animate, duration, filter]);

  const renderWords = () => {
    return (
      <motion.span ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
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
