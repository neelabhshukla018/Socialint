"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { Activity } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-white/[0.12] rounded-full dark:bg-zinc-950/80 bg-zinc-900/80 backdrop-blur-md shadow-[0px_2px_12px_rgba(0,0,0,0.5)] z-[5000] px-6 py-2.5 items-center justify-between space-x-6",
          className
        )}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <Activity size={16} className="text-black stroke-[2.5]" />
          </div>
          <span className="font-display text-sm tracking-wide text-white">
            SocialInt
          </span>
        </Link>

        {/* Links */}
        <div className="hidden sm:flex items-center space-x-5">
          {navItems.map((navItem, idx: number) => (
            <a
              key={`link-${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-zinc-400 items-center flex space-x-1 hover:text-white transition-colors text-xs font-medium"
              )}
            >
              <span>{navItem.name}</span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <SignUpButton mode="modal">
          <button
            type="button"
            className="border text-xs font-semibold relative border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 px-4 py-1.5 rounded-full hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
          >
            <span>Get Started</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent h-px" />
          </button>
        </SignUpButton>
      </motion.div>
    </AnimatePresence>
  );
};
