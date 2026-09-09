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
  TrendingUp,
  Zap,
} from "lucide-react";

export function PRCommandCenter3D() {
  const [pulseAngle, setPulseAngle] = useState(0);
  const [activeAlert, setActiveAlert] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAngle((prev) => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const alertFeeds = [
    {
      source: "Reddit r/technology",
      text: "Outage discussion thread picked up 340 comments in 25 minutes",
      sentiment: "Negative 68%",
      status: "Early Surge Flagged",
      badgeColor: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      source: "X (Twitter)",
      text: "Tech journalist with 420k followers asked for statement on update",
      sentiment: "Neutral / Inquiry",
      status: "Response Drafted",
      badgeColor: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      source: "Instagram & TikTok",
      text: "Unboxing review video trending in tech categories with strong praise",
      sentiment: "Positive 89%",
      status: "Organic Reach Surge",
      badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <CardContainer containerClassName="w-full py-4" className="w-full max-w-4xl">
      <CardBody className="relative w-full rounded-3xl border border-zinc-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all">
        {/* Top telemetry bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-100 pb-5 gap-4">
          <CardItem
            translateZ={25}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </div>
            <div>
              <p className="font-display text-base text-zinc-900 tracking-wide">
                Live Brand Radar &amp; Social Pulse
              </p>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                Monitoring X, Reddit, TikTok, YouTube &amp; Press
              </p>
            </div>
          </CardItem>

          <CardItem
            translateZ={35}
            className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs text-emerald-700 font-semibold"
          >
            <ShieldCheck size={15} />
            <span>Brand Health: Normal (No active crisis)</span>
          </CardItem>
        </div>

        {/* Center Grid: Radar Screen + Signal Intelligence */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Circular 3D Radar Screen (High contrast cyber lens) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <CardItem
              translateZ={55}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-slate-800 bg-[#090d16] flex items-center justify-center shadow-xl overflow-hidden"
            >
              {/* Concentric rings */}
              <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-12 rounded-full border border-cyan-500/20 border-dashed" />
              <div className="absolute inset-20 rounded-full border border-cyan-500/15" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20" />

              {/* Rotating Radar Sweep Beam */}
              <div
                className="absolute inset-0 rounded-full origin-center pointer-events-none"
                style={{
                  transform: `rotate(${pulseAngle}deg)`,
                  background:
                    "conic-gradient(from 0deg, rgba(6, 182, 212, 0.45) 0deg, rgba(6, 182, 212, 0.05) 45deg, transparent 90deg)",
                }}
              />

              {/* Blip 1 (Critical threat detected) */}
              <div className="absolute top-[28%] left-[62%] flex items-center justify-center">
                <span className="animate-ping absolute h-4 w-4 rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]"></span>
              </div>

              {/* Blip 2 (Viral positive post) */}
              <div className="absolute bottom-[35%] left-[26%] flex items-center justify-center">
                <span className="animate-ping absolute h-3 w-3 rounded-full bg-emerald-500 opacity-60"></span>
                <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
              </div>

              {/* Blip 3 (Influence Node) */}
              <div className="absolute top-[60%] right-[22%] flex items-center justify-center">
                <span className="relative h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
              </div>

              {/* Center Beacon */}
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                <Radio size={16} className="text-cyan-300 animate-pulse" />
              </div>
            </CardItem>

            {/* Radar status pills */}
            <CardItem
              translateZ={70}
              className="mt-4 flex items-center justify-center gap-4 text-[11px] font-mono text-zinc-500"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Negative Threads: 1
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Positive Surges: 3
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                Active Mentions: 4,820
              </span>
            </CardItem>
          </div>

          {/* Right column: Real-World Social Mentions */}
          <div className="lg:col-span-5 space-y-3">
            <CardItem translateZ={40}>
              <p className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-500 mb-2">
                Recent Detected Conversations
              </p>
            </CardItem>

            {alertFeeds.map((feed, idx) => (
              <CardItem
                key={idx}
                translateZ={45 + idx * 12}
                className="w-full"
              >
                <div
                  onClick={() => setActiveAlert(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    activeAlert === idx
                      ? "border-cyan-500 bg-cyan-50/40 shadow-sm"
                      : "border-zinc-200/80 bg-zinc-50/60 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-zinc-800">
                      {feed.source}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${feed.badgeColor}`}
                    >
                      {feed.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 font-medium leading-snug">
                    {feed.text}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="font-medium text-zinc-600">{feed.status}</span>
                    <span className="text-cyan-700 font-semibold flex items-center gap-0.5">
                      Review Thread <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </CardItem>
            ))}

            <CardItem
              translateZ={80}
              className="pt-2 flex items-center justify-between text-xs text-zinc-500"
            >
              <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                <Zap size={14} className="text-cyan-600" />
                <span>Detection Speed: Under 2 seconds</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-400">Sync: Realtime</span>
            </CardItem>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-100">
          <CardItem translateZ={35} className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3.5">
            <p className="text-[11px] font-mono uppercase text-zinc-500 font-medium">Overall Sentiment</p>
            <p className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1">
              78% <TrendingUp size={16} />
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">↑ 8% this week</p>
          </CardItem>

          <CardItem translateZ={45} className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3.5">
            <p className="text-[11px] font-mono uppercase text-zinc-500 font-medium">Mention Volume</p>
            <p className="text-xl font-bold text-zinc-900 mt-1 flex items-center gap-1">
              4.8k <Activity size={16} className="text-cyan-600" />
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Posts &amp; comments today</p>
          </CardItem>

          <CardItem translateZ={55} className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3.5">
            <p className="text-[11px] font-mono uppercase text-zinc-500 font-medium">Crisis Risk</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">LOW</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">No virality anomalies</p>
          </CardItem>

          <CardItem translateZ={65} className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3.5">
            <p className="text-[11px] font-mono uppercase text-zinc-500 font-medium">Influential Voices</p>
            <p className="text-xl font-bold text-cyan-700 mt-1">18</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Journalists &amp; creators</p>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
