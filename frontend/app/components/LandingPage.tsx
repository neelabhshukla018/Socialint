"use client";

import React from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  MessageSquare,
  Network,
  Radio,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

// Components
import Navbar from "./Navbar";
import { SparklesCore } from "./ui/sparkles";
import { FlipWords } from "./ui/flip-words";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { WobbleCard } from "./ui/wobble-card";
import { CardContainer, CardBody, CardItem } from "./ui/card-3d";
import { PRCommandCenter3D } from "./PRCommandCenter3D";

export default function LandingPage() {
  const targetWords = [
    "Your Brand",
    "PR Clients",
    "Key Executives",
    "Product Launches",
    "Public Figures",
  ];

  const intelligenceFeeds = [
    {
      badge: "Crisis Avoided",
      badgeColor: "text-emerald-700 border-emerald-200 bg-emerald-50",
      title: "Reddit thread flagging checkout bug was spotted within 18 minutes",
      detail: "Product team patched before morning traffic spike",
      source: "Reddit (r/technology)",
      time: "14m ago",
      sentiment: "positive" as const,
    },
    {
      badge: "Sentiment Shift",
      badgeColor: "text-sky-700 border-sky-200 bg-sky-50",
      title: "Customer sentiment turned +34% positive after transparent pricing update",
      detail: "2,400+ organic tweets analyzed across 3 hours",
      source: "X (Twitter)",
      time: "32m ago",
      sentiment: "positive" as const,
    },
    {
      badge: "Early Anomaly",
      badgeColor: "text-rose-700 border-rose-200 bg-rose-50",
      title: "Coordinated bot copy-paste comments detected on brand Instagram post",
      detail: "Filtered spam network • Real fan sentiment remains steady",
      source: "Instagram API",
      time: "1h ago",
      sentiment: "warning" as const,
    },
    {
      badge: "Creator Reach",
      badgeColor: "text-indigo-700 border-indigo-200 bg-indigo-50",
      title: "Tech YouTuber with 650k subscribers published an unprompted positive review",
      detail: "Driving 4.2x referral lift in community forums",
      source: "YouTube & Threads",
      time: "2h ago",
      sentiment: "positive" as const,
    },
    {
      badge: "Regional Pulse",
      badgeColor: "text-amber-700 border-amber-200 bg-amber-50",
      title: "Localized shipping delay feedback noticed across UK customer accounts",
      detail: "Support team alerted to issue proactively",
      source: "Support Mentions",
      time: "3h ago",
      sentiment: "warning" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-cyan-500/20 selection:text-cyan-900 overflow-x-hidden">
      {/* NAVBAR: LOGO IN MIDDLE, 2 LINKS LEFT, 2 LINKS RIGHT */}
      <Navbar />

      {/* ================================================== */}
      {/* HERO SECTION: LIGHT THEME WITH GRID BACKGROUND      */}
      {/* ================================================== */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-grid-slate-light border-b border-zinc-200/80">
        {/* Soft Radial Gradients for Light Theme */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-radial from-cyan-400/10 via-sky-300/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-40 right-10 h-[350px] w-[350px] rounded-full bg-indigo-300/10 blur-3xl" />

        {/* Ambient Canvas Sparkles (Subtle blue particles in light mode) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <SparklesCore
            id="hero-sparkles-light"
            background="transparent"
            minSize={0.5}
            maxSize={1.8}
            particleDensity={30}
            particleColor="#0284c7"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 shadow-sm mb-7">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-700">
              Real-Time Social Listening &amp; PR Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] text-zinc-950 max-w-5xl">
            Know what people say about
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              <FlipWords words={targetWords} />
            </span>
            <br />
            <span className="text-zinc-400">before small issues spread.</span>
          </h1>

          {/* Subheading (Clear, grounded, human copy) */}
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600">
            Public sentiment can shift in minutes on X, Reddit, and TikTok.
            SocialInt continuously listens across social networks so PR and marketing teams
            can catch complaints early, measure real sentiment, and act before small sparks become headlines.
          </p>

          {/* CTA Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <SignUpButton mode="modal">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 active:scale-98 transition"
              >
                <span>Start Monitoring Free</span>
                <ArrowRight size={16} />
              </button>
            </SignUpButton>

            <a
              href="#radar"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:border-zinc-300 shadow-sm transition"
            >
              <Radio size={16} className="text-cyan-600" />
              <span>See Live Demo</span>
            </a>
          </div>

          {/* 3D Holographic PR Command Center */}
          <div id="radar" className="w-full mt-14 scroll-mt-24">
            <PRCommandCenter3D />
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* INFINITE MOVING CARDS: REAL SOCIAL SIGNALS         */}
      {/* ================================================== */}
      <section className="relative py-8 border-b border-zinc-200/80 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-500">
              Live Monitored Feed
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            {"// Real-Time Social Signals Across Platforms"}
          </span>
        </div>

        <InfiniteMovingCards
          items={intelligenceFeeds}
          direction="left"
          speed="normal"
        />
      </section>

      {/* ================================================== */}
      {/* THE PROBLEM: 3D CARDS IN LIGHT MODE                */}
      {/* ================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-slate-light rounded-3xl my-8 border border-zinc-200/70">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
            The PR Challenge
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
            Public perception moves faster than manual monitoring.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            A single viral complaint or misunderstood announcement can circulate to hundreds
            of thousands of people before your communications team starts their morning standup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Problem Card 1 */}
          <CardContainer className="w-full">
            <CardBody className="bg-white border border-zinc-200/90 rounded-2xl p-7 relative shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-zinc-300 transition-all">
              <CardItem translateZ={30} className="w-fit p-3 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-100 mb-6">
                <MessageSquare size={22} />
              </CardItem>
              <CardItem translateZ={40} className="font-display text-xl text-zinc-900">
                Thousands of Comments Daily
              </CardItem>
              <CardItem translateZ={25} className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Reading replies, quote tweets, Reddit comments, and community threads by hand
                is physically impossible. Real complaints get lost in the volume.
              </CardItem>
              <CardItem translateZ={45} className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Coverage: 5+ Platforms</span>
                <span className="text-rose-600 font-semibold">Overwhelming</span>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Problem Card 2 */}
          <CardContainer className="w-full">
            <CardBody className="bg-white border border-zinc-200/90 rounded-2xl p-7 relative shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-zinc-300 transition-all">
              <CardItem translateZ={30} className="w-fit p-3 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 mb-6">
                <TrendingUp size={22} />
              </CardItem>
              <CardItem translateZ={40} className="font-display text-xl text-zinc-900">
                Viral Spread in Minutes
              </CardItem>
              <CardItem translateZ={25} className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Recommendation algorithms reward high-emotion posts. An unanswered customer grievance
                can reach 50,000 views within an hour of posting.
              </CardItem>
              <CardItem translateZ={45} className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Speed: Under 60 Mins</span>
                <span className="text-amber-600 font-semibold">Rapid Escalation</span>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Problem Card 3 */}
          <CardContainer className="w-full">
            <CardBody className="bg-white border border-zinc-200/90 rounded-2xl p-7 relative shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-zinc-300 transition-all">
              <CardItem translateZ={30} className="w-fit p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 mb-6">
                <ShieldAlert size={22} />
              </CardItem>
              <CardItem translateZ={40} className="font-display text-xl text-zinc-900">
                Crises Start Quietly
              </CardItem>
              <CardItem translateZ={25} className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Backlash rarely begins on the front page. It brews in niche subreddits or reply chains
                hours before spreading to mainstream media outlets.
              </CardItem>
              <CardItem translateZ={45} className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Lead Time: 2 - 8 Hours</span>
                <span className="text-emerald-600 font-semibold">Catchable Early</span>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </section>

      {/* ================================================== */}
      {/* FEATURES: ACETERNITY BENTO GRID (LIGHT MODE)       */}
      {/* ================================================== */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
            Core Features
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
            Everything your team needs to understand social conversations.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            Move beyond simple follower counts. Get clear visibility into what audiences think,
            how discussions evolve, and who is leading the conversation.
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          {/* Bento Item 1: Sentiment Tracking Curve */}
          <BentoGridItem
            className="md:col-span-2"
            title="Accurate Sentiment Tracking Over Time"
            description="Measure whether discussions are positive, negative, or neutral. Detect sudden sentiment drops the moment a customer issue or news story breaks."
            header={
              <div className="h-44 w-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50/50 border border-zinc-200/80 p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-zinc-600 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-cyan-600" />
                    WEEKLY BRAND SENTIMENT CURVE
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    +78% Positive Ratio
                  </span>
                </div>
                {/* Clean smooth waveform */}
                <svg className="w-full h-24 stroke-cyan-600 fill-cyan-500/10" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path
                    d="M 0 60 Q 60 25, 120 45 T 220 30 T 320 65 T 400 20 L 400 100 L 0 100 Z"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                  <span>Monday</span>
                  <span>Feature Launch</span>
                  <span>Brief Dip (Solved)</span>
                  <span>Today</span>
                </div>
              </div>
            }
            icon={<Brain className="h-5 w-5 text-cyan-600" />}
          />

          {/* Bento Item 2: Volume Anomaly Spikes */}
          <BentoGridItem
            className="md:col-span-1"
            title="Real-Time Volume & Spike Alerts"
            description="Receive immediate notifications via Slack or email when conversation volume spikes abnormally around your brand."
            header={
              <div className="h-44 w-full rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-zinc-200/80 p-5 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200 mb-2 shadow-sm">
                    <TrendingUp size={24} />
                  </div>
                  <p className="text-2xl font-bold font-mono text-zinc-950">3.8x Surge</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Notification triggered in 45s</p>
                </div>
              </div>
            }
            icon={<Activity className="h-5 w-5 text-cyan-600" />}
          />

          {/* Bento Item 3: Audience Understanding */}
          <BentoGridItem
            className="md:col-span-1"
            title="Audience Demographics & Interests"
            description="Know who is participating in the conversation: loyal customers, industry journalists, casual users, or bot networks."
            header={
              <div className="h-44 w-full rounded-2xl bg-white border border-zinc-200/80 p-5 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Verified Customers</span>
                      <span className="text-cyan-700 font-mono">62%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-600 rounded-full w-[62%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Industry Media &amp; Press</span>
                      <span className="text-indigo-700 font-mono">24%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[24%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">General Public</span>
                      <span className="text-emerald-700 font-mono">14%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full w-[14%]" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">Profile analysis across all platforms</p>
              </div>
            }
            icon={<Users className="h-5 w-5 text-cyan-600" />}
          />

          {/* Bento Item 4: Key Opinion Leader Identification */}
          <BentoGridItem
            className="md:col-span-2"
            title="Influential Voice & Creator Detection"
            description="Discover which creators, journalists, and accounts have the follower reach and authority to shape public perception around your company."
            header={
              <div className="h-44 w-full rounded-2xl bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 border border-zinc-200/80 p-5 flex items-center justify-around">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-2 border-cyan-600 bg-cyan-50 flex items-center justify-center text-cyan-800 font-bold text-xs shadow-sm">
                      Tech Press
                    </div>
                    <span className="text-[11px] font-medium text-zinc-600 mt-1.5">380k Reach</span>
                  </div>

                  <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-600 to-indigo-600 relative">
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-cyan-600" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full border-2 border-indigo-600 bg-indigo-50 flex items-center justify-center text-indigo-800 font-bold text-xs shadow-sm">
                      Brand
                    </div>
                    <span className="text-[11px] font-medium text-zinc-600 mt-1.5">Central Hub</span>
                  </div>

                  <div className="h-0.5 w-16 bg-gradient-to-r from-indigo-600 to-emerald-600 relative">
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center text-emerald-800 font-bold text-xs shadow-sm">
                      Top Creator
                    </div>
                    <span className="text-[11px] font-medium text-zinc-600 mt-1.5">520k Reach</span>
                  </div>
                </div>
              </div>
            }
            icon={<Network className="h-5 w-5 text-cyan-600" />}
          />
        </BentoGrid>
      </section>

      {/* ================================================== */}
      {/* HOW IT WORKS: CLEAR 4-STEP WORKFLOW                */}
      {/* ================================================== */}
      <section id="workflow" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 border-t border-zinc-200/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
            Simple Workflow
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
            How SocialInt Works in Four Steps
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            Set up monitoring in minutes and get continuous clarity on your public reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
              STEP 01
            </span>
            <h4 className="font-display text-lg text-zinc-900 mt-4">Connect Platforms</h4>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              Add your brand handles, targeted keywords, hashtags, and competitor names across X, Reddit, Instagram, and YouTube.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
              STEP 02
            </span>
            <h4 className="font-display text-lg text-zinc-900 mt-4">Collect &amp; Filter</h4>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              SocialInt streams posts, comments, and video reactions, automatically filtering bot spam and irrelevant noise.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
              STEP 03
            </span>
            <h4 className="font-display text-lg text-zinc-900 mt-4">Analyze Sentiment</h4>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              Understand real human tone, identify emerging complaints, and measure whether perception is improving or declining.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition border-l-4 border-l-cyan-600">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              STEP 04
            </span>
            <h4 className="font-display text-lg text-zinc-900 mt-4">Take Action</h4>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              Equip your PR and support teams with instant alerts, accurate context, and factual talking points to resolve issues fast.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* USE CASES: WOBBLE CARDS IN LIGHT THEME            */}
      {/* ================================================== */}
      <section id="solutions" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
            Who It&apos;s For
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
            Built for modern brands and communications teams.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            Whether managing a global consumer brand, a fast-growing startup, or high-profile public figures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wobble 1: Brands & Enterprises */}
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 min-h-[280px] bg-gradient-to-br from-white to-sky-50/60"
          >
            <div className="max-w-md">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700">
                Brands &amp; Enterprises
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-zinc-900 mt-2">
                Protect customer trust and brand reputation.
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Catch product bugs, viral customer feedback, and delivery delays the moment they begin trending on Reddit and X.
              </p>
              <div className="mt-5 flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-sky-200 bg-sky-50 text-sky-800">
                  Customer Sentiment Tracking
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-zinc-200 bg-white text-zinc-700">
                  Anomaly Alerts
                </span>
              </div>
            </div>
          </WobbleCard>

          {/* Wobble 2: Athletes & Public Figures */}
          <WobbleCard containerClassName="col-span-1 min-h-[280px] bg-gradient-to-br from-white to-indigo-50/60">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-indigo-700">
              High-Profile Individuals
            </span>
            <h3 className="text-xl font-display text-zinc-900 mt-2">
              Athletes &amp; Creators
            </h3>
            <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed">
              Understand fan reactions to performances, interviews, and major announcements across social video platforms.
            </p>
            <p className="mt-4 text-xs font-mono font-bold text-emerald-700">
              ✓ Fan sentiment breakdown
            </p>
          </WobbleCard>

          {/* Wobble 3: PR Agencies */}
          <WobbleCard containerClassName="col-span-1 min-h-[280px] bg-gradient-to-br from-white to-emerald-50/60">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-700">
              Agencies &amp; Consultants
            </span>
            <h3 className="text-xl font-display text-zinc-900 mt-2">
              PR &amp; Comms Agencies
            </h3>
            <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed">
              Manage reputation for multiple client accounts in one dashboard with clean, exportable weekly executive reports.
            </p>
            <p className="mt-4 text-xs font-mono font-bold text-cyan-700">
              ✓ Multi-client workspace
            </p>
          </WobbleCard>

          {/* Wobble 4: Product Launches & Events */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[280px] bg-gradient-to-br from-white to-slate-50">
            <div className="max-w-md">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-600">
                Campaign Intelligence
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-zinc-900 mt-2">
                Measure reactions to launches and campaigns.
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Track how sentiment compares before, during, and after major marketing launches, keynote presentations, and events.
              </p>
            </div>
          </WobbleCard>
        </div>
      </section>

      {/* ================================================== */}
      {/* FINAL CTA: CLEAN LIGHT THEME WITH ILLUMINATION     */}
      {/* ================================================== */}
      <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/80 bg-grid-slate-light">
        <div className="max-w-4xl mx-auto text-center rounded-3xl border border-zinc-200 bg-white p-10 sm:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
          {/* Subtle illumination halo */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-cyan-400/15 blur-2xl" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-md mb-6 relative z-10">
            <Activity size={26} className="text-cyan-400 stroke-[2.5]" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight relative z-10">
            Stop reacting to PR problems after they happen.
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-zinc-600 leading-relaxed relative z-10">
            Start listening across social platforms today and protect your brand reputation with early awareness.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
            <SignUpButton mode="modal">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-zinc-950 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 active:scale-98 transition"
              >
                <span>Get Started Instantly</span>
                <ArrowRight size={16} />
              </button>
            </SignUpButton>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-500 relative z-10">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-emerald-600" /> Free to start
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-emerald-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-emerald-600" /> Real-time alerts
            </span>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* FOOTER: CLEAN LIGHT THEME                          */}
      {/* ================================================== */}
      <footer className="border-t border-zinc-200/80 bg-white py-12 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
              <Activity size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="font-display text-base text-zinc-900 tracking-wide">
                SocialInt
              </p>
              <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                Social Listening &amp; PR Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <a href="#features" className="hover:text-zinc-950 transition-colors">Features</a>
            <a href="#radar" className="hover:text-zinc-950 transition-colors">Live Radar</a>
            <a href="#solutions" className="hover:text-zinc-950 transition-colors">Use Cases</a>
            <a href="#workflow" className="hover:text-zinc-950 transition-colors">Workflow</a>
          </div>

          <p className="text-xs text-zinc-500">
            Designed &amp; developed by{" "}
            <a
              href="https://neel-xdev-ipu2.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-700 transition hover:text-cyan-800 hover:underline"
            >
              Neelabh
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}