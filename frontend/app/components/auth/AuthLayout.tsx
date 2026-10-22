"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-white dark:bg-[#080b12] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ======================================================== */}
      {/* LEFT COLUMN: BRAND & LIVE INTELLIGENCE SHOWCASE (Desktop) */}
      {/* ======================================================== */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between overflow-hidden bg-zinc-950 text-white p-10 xl:p-14 border-r border-zinc-850">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />

          {/* Radial Ambient Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4F7A9A]/25 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-[#365874]/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Top: Logo & System Status */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 shadow-lg shadow-white/10 group-hover:shadow-cyan-400/25 transition-all">
              <Activity size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl tracking-tight text-white leading-none">
                SocialInt
              </span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                Intelligence Engine
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Intelligence Active
          </div>
        </div>

        {/* Center: Main Pitch & Floating Live Intelligence Cards */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-md mb-6">
            <Sparkles size={13} className="text-[#7496AF]" />
            <span>AI-Powered Narrative Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-5">
            Turn social chaos into{" "}
            <span className="bg-gradient-to-r from-[#7496AF] via-sky-300 to-white bg-clip-text text-transparent">
              predictive clarity.
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
            Continuous cross-platform sentiment tracking, anomaly radar, and AI trend forecasting. Make informed brand decisions before headlines happen.
          </p>

          {/* Interactive Micro Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live Sentiment Card */}
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4.5 backdrop-blur-xl shadow-xl hover:border-zinc-700/80 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <TrendingUp size={15} />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">Sentiment Score</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +14.2%
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                94.8<span className="text-sm font-normal text-zinc-400">/100</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-400 h-full w-[78%]" />
                <div className="bg-amber-400 h-full w-[16%]" />
                <div className="bg-rose-400 h-full w-[6%]" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-2 font-mono">
                <span>78% Positive</span>
                <span>16% Neutral</span>
                <span>6% Critical</span>
              </div>
            </div>

            {/* Live Viral Velocity Card */}
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4.5 backdrop-blur-xl shadow-xl hover:border-zinc-700/80 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#4F7A9A]/20 text-[#7496AF]">
                    <Zap size={15} />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">Velocity Radar</span>
                </div>
                <span className="text-[11px] font-mono text-[#7496AF] bg-[#4F7A9A]/15 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <div className="text-sm font-semibold text-white mb-1 truncate">
                #BrandEvolution2026
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight mb-2">
                Spike detected across Reddit & X within the last 12 minutes.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 size={12} />
                <span>Zero brand safety violations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Social Proof & Metrics */}
        <div className="relative z-10 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-base font-bold text-white font-mono">10M+</div>
              <div className="text-[11px] text-zinc-400">Posts Analyzed Daily</div>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <div className="text-base font-bold text-white font-mono">99.4%</div>
              <div className="text-[11px] text-zinc-400">Classification Accuracy</div>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <div className="text-base font-bold text-white font-mono">&lt;45ms</div>
              <div className="text-[11px] text-zinc-400">Inference Latency</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck size={14} className="text-[#7496AF]" />
            <span>SOC-2 Ready · 256-bit Encrypted</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM                       */}
      {/* ======================================================== */}
      <div className="flex-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between min-h-screen p-5 sm:p-8 lg:p-12 relative overflow-y-auto">
        {/* Subtle Ambient Glow for Form Side */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4F7A9A]/10 dark:bg-[#4F7A9A]/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Controls: Back Link + Theme Toggle */}
        <div className="w-full flex items-center justify-between pb-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back to SocialInt</span>
          </Link>

          {/* Theme Toggle Button */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden flex flex-col items-center text-center my-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md">
              <Activity size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-2xl tracking-tight text-zinc-900 dark:text-white">
              SocialInt
            </span>
          </Link>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            {isSignIn ? "Welcome back" : "Get started with SocialInt"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
            {isSignIn
              ? "Sign in to access your real-time social intelligence dashboard"
              : "Create your account to unlock AI sentiment and audience insights"}
          </p>
        </div>

        {/* Centered Auth Card Container */}
        <div className="my-auto w-full flex items-center justify-center py-4">
          <div className="w-full max-w-[440px] relative">
            {/* Ambient card back-glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#4F7A9A]/20 via-[#7496AF]/15 to-transparent blur-xl pointer-events-none" />
            <div className="relative z-10 w-full flex justify-center">
              {children}
            </div>
          </div>
        </div>

        {/* Bottom Trust & Legal Footer */}
        <div className="w-full pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <span>© 2026 SocialInt Technologies. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Privacy Policy
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Terms of Service
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
