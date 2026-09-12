"use client";

import React, { useState, useEffect } from "react";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "./ui/card-3d";
import {
  Activity,
  ArrowUpRight,
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

export function PRCommandCenter3D() {
  const [pulseAngle, setPulseAngle] = useState(0);
  const [activeAlert, setActiveAlert] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Completely static on mobile: no interval or rotation timer
    if (isMobile) return;
    const interval = setInterval(() => {
      setPulseAngle((prev) => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isMobile]);

  // Aligned with SocialInt's actual platform data: Instagram, Facebook, Reddit, X, YouTube
  const alertFeeds = [
    {
      source: "Instagram Reel Analysis",
      text: "Viral review reel reached 84k views & 1.2k comments • Audience tone: Highly supportive",
      sentiment: "Positive 92%",
      status: "High Engagement",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      source: "X (Twitter) Conversation",
      text: "Customer inquiry thread regarding shipping times analyzed • 0 viral crisis escalation",
      sentiment: "Neutral 74%",
      status: "Monitored Signal",
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      source: "Reddit r/technology",
      text: "Community discussion thread analyzed in 18s • Bot spam filtered, real user sentiment steady",
      sentiment: "Positive 84%",
      status: "Stable Sentiment",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      source: "Facebook & YouTube",
      text: "Creator unprompted video review drove positive referral lift across product forums",
      sentiment: "Positive 89%",
      status: "Organic Reach Surge",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto px-0 sm:px-2 overflow-hidden sm:overflow-visible">
      {/* ======================================================= */}
      {/* AMBIENT BACKGROUND LIGHT                                */}
      {/* On mobile: Purely static soft ambient light             */}
      {/* On desktop: Subtle animated glowing light               */}
      {/* ======================================================= */}
      <div className="pointer-events-none absolute -inset-1 sm:-inset-4 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-[#457B9D]/20 via-emerald-400/15 to-sky-400/15 blur-xl sm:blur-3xl opacity-75 md:animate-pulse-slow -z-10" />
      <div 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full bg-radial from-[#457B9D]/25 via-emerald-500/10 to-transparent blur-2xl sm:blur-3xl -z-10 md:animate-pulse"
        style={{ animationDuration: "4.5s" }}
      />

      <CardContainer containerClassName="w-full py-1 sm:py-4 p-0 sm:p-2" className="w-full max-w-full">
        <CardBody className="relative w-full rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white/95 p-3.5 sm:p-6 lg:p-8 shadow-sm sm:shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all overflow-hidden">
          
          {/* Top Telemetry Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3.5 sm:pb-5 gap-2.5 sm:gap-3.5">
            <CardItem translateZ={isMobile ? 0 : 25} className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
                <span className="hidden md:inline-flex md:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#457B9D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#457B9D]"></span>
              </div>
              <div className="min-w-0">
                <p className="font-display text-xs sm:text-base text-zinc-900 tracking-wide truncate">
                  Live Brand Radar &amp; Post Intelligence
                </p>
                <p className="text-[9px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-wider truncate">
                  Instagram, Facebook, Reddit, X &amp; YouTube
                </p>
              </div>
            </CardItem>

            <CardItem
              translateZ={isMobile ? 0 : 35}
              className="self-start sm:self-auto flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 sm:px-3.5 py-1 text-[10px] sm:text-xs text-emerald-700 font-semibold shadow-xs shrink-0"
            >
              <ShieldCheck size={13} className="shrink-0 text-emerald-600 sm:w-3.5 sm:h-3.5" />
              <span>Normal (+84% Positive)</span>
            </CardItem>
          </div>

          {/* Center Grid: Radar Screen + Signal Intelligence */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
            {/* Radar Screen Area (Compact & responsive on mobile) */}
            <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-center justify-center relative w-full">
              <CardItem
                translateZ={isMobile ? 0 : 50}
                className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full border border-slate-800 bg-[#090d16] flex items-center justify-center shadow-lg sm:shadow-xl overflow-hidden shrink-0"
              >
                {/* Concentric rings */}
                <div className="absolute inset-3 sm:inset-4 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-8 sm:inset-12 rounded-full border border-cyan-500/20 border-dashed" />
                <div className="absolute inset-14 sm:inset-20 rounded-full border border-cyan-500/15" />

                {/* Crosshairs */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20" />

                {/* Sweep Beam: only on desktop; completely static on mobile */}
                {!isMobile ? (
                  <div
                    className="absolute inset-0 rounded-full origin-center pointer-events-none"
                    style={{
                      transform: `rotate(${pulseAngle}deg)`,
                      background:
                        "conic-gradient(from 0deg, rgba(69, 123, 157, 0.5) 0deg, rgba(6, 182, 212, 0.15) 40deg, transparent 80deg)",
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 rounded-full bg-radial from-[#457B9D]/20 via-transparent to-transparent pointer-events-none" />
                )}

                {/* Signal Blip 1: static on mobile, animated on desktop */}
                <div className="absolute top-[28%] left-[62%] flex items-center justify-center">
                  <span className="hidden md:inline-flex md:animate-ping absolute h-3.5 w-3.5 rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                </div>

                {/* Signal Blip 2 */}
                <div className="absolute bottom-[35%] left-[26%] flex items-center justify-center">
                  <span className="relative h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
                </div>

                {/* Signal Blip 3 */}
                <div className="absolute top-[62%] right-[24%] flex items-center justify-center">
                  <span className="relative h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#457B9D] shadow-[0_0_8px_#457B9D]"></span>
                </div>

                {/* Center Beacon */}
                <div className="relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-950 border border-[#457B9D]/60 shadow-[0_0_15px_rgba(69,123,157,0.7)]">
                  <Radio size={14} className="text-cyan-300 md:animate-pulse sm:w-4 sm:h-4" />
                </div>
              </CardItem>

              {/* Radar Status Indicators */}
              <CardItem
                translateZ={isMobile ? 0 : 60}
                className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[9px] sm:text-[11px] font-mono text-zinc-500 w-full"
              >
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Positive: 84%
                </span>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#457B9D]" />
                  Signals: 12.4k
                </span>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Risk: None
                </span>
              </CardItem>
            </div>

            {/* Right Column: Real-World Social Mentions & Signal Feed */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-2 sm:space-y-2.5 w-full">
              <CardItem translateZ={isMobile ? 0 : 30} className="w-full">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <p className="text-[10px] sm:text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">
                    Live Analyzed Post Signals
                  </p>
                  <span className="text-[9px] sm:text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Auto-Streaming
                  </span>
                </div>
              </CardItem>

              {alertFeeds.map((feed, idx) => (
                <CardItem
                  key={idx}
                  translateZ={isMobile ? 0 : 40 + idx * 8}
                  className="w-full"
                >
                  <div
                    onClick={() => setActiveAlert(idx)}
                    className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                      activeAlert === idx
                        ? "border-[#457B9D] bg-sky-50/40 shadow-xs"
                        : "border-zinc-200/80 bg-zinc-50/60 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1 gap-2">
                      <span className="font-bold text-zinc-800 truncate">
                        {feed.source}
                      </span>
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-medium border shrink-0 ${feed.badgeColor}`}
                      >
                        {feed.sentiment}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-700 font-medium leading-snug line-clamp-2 sm:line-clamp-none">
                      {feed.text}
                    </p>
                    <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[9px] sm:text-[11px] text-zinc-500">
                      <span className="font-medium text-zinc-600 truncate mr-2">{feed.status}</span>
                      <span className="text-[#457B9D] font-semibold flex items-center gap-0.5 hover:underline shrink-0">
                        View Analysis <ArrowUpRight size={11} />
                      </span>
                    </div>
                  </div>
                </CardItem>
              ))}

              <CardItem
                translateZ={isMobile ? 0 : 50}
                className="pt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500"
              >
                <div className="flex items-center gap-1.5 text-zinc-700 font-medium truncate">
                  <Zap size={12} className="text-[#457B9D] shrink-0" />
                  <span className="truncate">AI Sentiment: ~1.8s</span>
                </div>
                <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400 shrink-0">Gemini 2.5 Flash</span>
              </CardItem>
            </div>
          </div>

          {/* Bottom Metrics Bar */}
          <div className="mt-5 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-zinc-100">
            <CardItem translateZ={isMobile ? 0 : 30} className="rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 p-2.5 sm:p-3.5 min-w-0">
              <p className="text-[9px] sm:text-[11px] font-mono uppercase text-zinc-500 font-medium truncate">Sentiment</p>
              <p className="text-base sm:text-xl font-bold text-emerald-600 mt-0.5 sm:mt-1 flex items-center gap-1">
                84% <TrendingUp size={14} />
              </p>
              <p className="text-[9px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">↑ 12% this week</p>
            </CardItem>

            <CardItem translateZ={isMobile ? 0 : 40} className="rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 p-2.5 sm:p-3.5 min-w-0">
              <p className="text-[9px] sm:text-[11px] font-mono uppercase text-zinc-500 font-medium truncate">Signals</p>
              <p className="text-base sm:text-xl font-bold text-zinc-900 mt-0.5 sm:mt-1 flex items-center gap-1">
                12.4k <Activity size={14} className="text-[#457B9D]" />
              </p>
              <p className="text-[9px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">Posts &amp; comments</p>
            </CardItem>

            <CardItem translateZ={isMobile ? 0 : 50} className="rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 p-2.5 sm:p-3.5 min-w-0">
              <p className="text-[9px] sm:text-[11px] font-mono uppercase text-zinc-500 font-medium truncate">Crisis Risk</p>
              <p className="text-base sm:text-xl font-bold text-emerald-600 mt-0.5 sm:mt-1">LOW</p>
              <p className="text-[9px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">0 anomalies</p>
            </CardItem>

            <CardItem translateZ={isMobile ? 0 : 60} className="rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 p-2.5 sm:p-3.5 min-w-0">
              <p className="text-[9px] sm:text-[11px] font-mono uppercase text-zinc-500 font-medium truncate">Confidence</p>
              <p className="text-base sm:text-xl font-bold text-[#457B9D] mt-0.5 sm:mt-1 flex items-center gap-1">
                96% <Sparkles size={13} className="text-[#457B9D]" />
              </p>
              <p className="text-[9px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">Verified AI tone</p>
            </CardItem>
          </div>

        </CardBody>
      </CardContainer>
    </div>
  );
}
