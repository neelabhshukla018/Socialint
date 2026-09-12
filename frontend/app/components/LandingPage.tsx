"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  EyeOff,
  FileText,
  Globe,
  Lock,
  MessageSquare,
  Network,
  Radio,
  ShieldAlert,
  ShieldCheck,
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
  const [activePolicyTab, setActivePolicyTab] = React.useState(0);

  const targetWords = [
    "Your Brand",
    "PR Clients",
    "Key Executives",
    "Product Launches",
    "Public Figures",
  ];

  const policyTabs = [
    {
      id: "public-ingestion",
      title: "Public Ingestion",
      badge: "Ethical Collection",
      headline: "Strictly Public Social Content — Zero Private Intrusion",
      content:
        "SocialInt is architected to exclusively collect and analyze publicly accessible social media posts, comments, captions, and thread metrics across supported channels (X/Twitter, Reddit, Instagram, YouTube, and Facebook). We operate strictly in compliance with public web standards and Apify scraping governance.",
      points: [
        "Zero access to private profiles, gated direct messages (DMs), or closed channels.",
        "Respects platform rate limits, robots.txt, and public API data boundaries.",
        "Automatic caching mechanisms prevent redundant requests to platform endpoints.",
        "Users can submit specific public URLs for on-demand sentiment evaluation without bulk scraping.",
      ],
    },
    {
      id: "ai-privacy",
      title: "Google Gemini AI",
      badge: "Zero Model Training",
      headline: "Enterprise AI Isolation — Your Signals Never Train Models",
      content:
        "All sentiment classifications, emotion breakdowns, and trend detection algorithms leverage enterprise instances of Google Gemini via official developer APIs. Data sent for inference is strictly ephemeral and bounded by enterprise confidentiality.",
      points: [
        "Google Gemini API agreements guarantee prompt data is not used to train public models.",
        "No customer data or social monitoring keywords are retained in model weights or public corpora.",
        "Input text is stripped of irrelevant metadata before sentiment vector calculation.",
        "Cryptographic token isolation ensures multi-tenant separation across client workspaces.",
      ],
    },
    {
      id: "subprocessors",
      title: "Cloud Infrastructure",
      badge: "Zero-Trust Stack",
      headline: "Industry-Standard Subprocessors & Data Encryption",
      content:
        "We partner only with SOC 2, ISO 27001, and GDPR-compliant infrastructure providers to power SocialInt's end-to-end services.",
      points: [
        "Clerk: Multi-factor authentication, salted password hashing, and encrypted JWT tokens.",
        "Neon / PostgreSQL: Database storage protected with TLS 1.3 in transit and AES-256 at rest.",
        "Apify: Enterprise-grade headless scraping cluster adhering to ethical web crawling standards.",
        "Google Cloud Platform: Secure AI compute environment with isolated VPC processing.",
      ],
    },
    {
      id: "ownership-gdpr",
      title: "Ownership & GDPR",
      badge: "User Rights",
      headline: "Complete Ownership, Instant Export, and Right to Erasure",
      content:
        "You retain 100% intellectual property and ownership rights over every report, sentiment digest, query dictionary, and trend analysis generated in your workspace. We never sell or license customer datasets.",
      points: [
        "Export your historical intelligence in JSON, CSV, or formatted PDF anytime.",
        "GDPR Article 17 (Right to be Forgotten) & CCPA §1798 compliance honored automatically.",
        "Instant permanent account wipe: purges all stored query history, reports, and tokens.",
        "Zero sale, barter, or sharing of user queries with third-party ad networks or data brokers.",
      ],
    },
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
          <div className="inline-flex items-center gap-2 rounded-50 border border-zinc-200 bg-red px-4 py-1.5 shadow-sm mb-7">
          
            <span className="text-xs font-semibold text-zinc-700">
              Real-Time Social Listening &amp; PR Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.12] text-zinc-950 max-w-5xl">
            {/* Line 1: Animated text */}
            <span className="inline-block">
              {"Know what people say about".split(" ").map((word, i) => (
                <motion.span
                  key={word + i}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.2, 0.65, 0.3, 0.9],
                  }}
                  className="inline-block mr-[0.25em] last:mr-0 text-zinc-950"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <br />
            {/* Line 2: Animated Flip Words */}
            <span className="inline-block my-1 sm:my-2">
              <FlipWords
                words={targetWords}
                className="font-extrabold text-[#457B9D] tracking-tight"
              />
            </span>
            <br />
            {/* Line 3: Animated text */}
            <span className="inline-block">
              {"before small issues spread.".split(" ").map((word, i) => (
                <motion.span
                  key={word + i}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.45,
                    delay: 0.45 + i * 0.08,
                    ease: [0.2, 0.65, 0.3, 0.9],
                  }}
                  className="inline-block mr-[0.25em] last:mr-0 text-zinc-500 font-medium"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subheading (Clear, grounded, human copy) */}
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600">
            Public sentiment moves fast. SocialInt moves faster.
<br />
SocialInt uses AI to analyze conversations across social platforms, uncover sentiment and emerging trends, and surface the signals that matter—so PR and marketing teams can respond faster and make smarter decisions.


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
    <div className="h-44 sm:h-44 w-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50/50 border border-zinc-200/80 p-3 sm:p-5 flex flex-col justify-between relative overflow-hidden">

      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[9px] sm:text-xs font-mono">
        <span className="flex items-center gap-2 text-zinc-600 font-semibold min-w-0">
          <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-600" />
          <span className="truncate">
            WEEKLY BRAND SENTIMENT CURVE
          </span>
        </span>

        <span className="self-start sm:self-auto whitespace-nowrap text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          +78% Positive Ratio
        </span>
      </div>

      {/* Chart */}
      <div className="w-full h-20 sm:h-24">
        <svg
          className="w-full h-full stroke-cyan-600 fill-cyan-500/10"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 60 Q 60 25, 120 45 T 220 30 T 320 65 T 400 20 L 400 100 L 0 100 Z"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Bottom Labels */}
      <div className="grid grid-cols-4 gap-1 text-[8px] sm:text-[11px] font-mono text-zinc-500">
        <span className="truncate text-left">
          Monday
        </span>

        <span className="truncate text-center">
          Feature Launch
        </span>

        <span className="truncate text-center">
          Brief Dip
        </span>

        <span className="truncate text-right">
          Today
        </span>
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
  title="Instant AI Social Post Analysis"
  description="Paste a public social media post URL and let SocialInt analyze its sentiment, tone, emotions, key topics, and overall audience reaction in seconds."
  header={
    <div className="h-44 w-full rounded-2xl bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 border border-zinc-200/80 p-4 sm:p-5 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl">
        {/* URL Input */}
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
          <div className="flex-1 min-w-0 px-2">
            <p className="text-[9px] sm:text-[10px] font-mono text-zinc-400 truncate">
              social.com/post/your-post-url...
            </p>
          </div>

          <div className="shrink-0 rounded-lg bg-cyan-600 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
            Analyze
          </div>
        </div>

        {/* Analysis Result */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-2.5 sm:p-3 shadow-sm">
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Sentiment
            </p>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-700">
              Positive
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-2.5 sm:p-3 shadow-sm">
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Tone
            </p>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-indigo-700">
              Supportive
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-2.5 sm:p-3 shadow-sm">
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Confidence
            </p>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-cyan-700">
              94%
            </p>
          </div>
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
      Analyze any social post in seconds and keep every insight organized in your account.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition">
      <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
        STEP 01
      </span>
      <h4 className="font-display text-lg text-zinc-900 mt-4">Create Your Account</h4>
      <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
        Sign in to SocialInt and access your personal workspace for analyzing and managing your social insights.
      </p>
    </div>

    <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition">
      <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
        STEP 02
      </span>
      <h4 className="font-display text-lg text-zinc-900 mt-4">Paste a Post URL</h4>
      <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
        Copy the URL of a social media post from a supported platform and paste it into SocialInt.
      </p>
    </div>

    <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition">
      <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
        STEP 03
      </span>
      <h4 className="font-display text-lg text-zinc-900 mt-4">Analyze with AI</h4>
      <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
        Click Analyze and let SocialInt process the post to uncover sentiment, tone, key insights, and important signals.
      </p>
    </div>

    <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition border-l-4 border-l-cyan-600">
      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        STEP 04
      </span>
      <h4 className="font-display text-lg text-zinc-900 mt-4">View &amp; Save Results</h4>
      <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
        Get your analysis instantly and automatically save it to your account history so you can revisit your insights anytime.
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
                Catch product bugs, viral customer feedback, and delivery delays the moment they begin trending on Instagram,Facebook,Reddit,X & many more
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
      {/* PRIVACY & POLICY: ACETERNITY LIGHT THEME SECTION   */}
      {/* ================================================== */}
      <section id="privacy" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 border-t border-zinc-200/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 mb-4 shadow-xs">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              Privacy &amp; Data Governance
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
            Built for Intelligence. Designed for Privacy.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            SocialInt is built on strict data boundaries, ethical public collection, and enterprise AI safety.
            We only analyze public discussions—never private communications.
          </p>
        </div>

        {/* TRUST BADGES STRIP */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs">
            <Globe size={13} className="text-[#457B9D]" /> Public Data Only
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs">
            <Cpu size={13} className="text-indigo-600" /> Zero AI Model Training
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs">
            <Lock size={13} className="text-emerald-600" /> AES-256 &amp; TLS 1.3 Encryption
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs">
            <ShieldCheck size={13} className="text-cyan-600" /> GDPR &amp; CCPA Ready
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs">
            <EyeOff size={13} className="text-amber-600" /> Automated PII Masking
          </span>
        </div>

        {/* BENTO GRID: 6 CORE PRIVACY PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50/80 px-2 py-0.5 rounded-md border border-cyan-200/60">
                  Ethical Collection
                </span>
              </div>
              <h3 className="font-display text-lg text-zinc-900">
                100% Public Data Ingestion
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                SocialInt strictly monitors public posts, open forum discussions, and publicly posted creator content. We never access private direct messages (DMs), closed communities, or bypass account authentication.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-500">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Apify Scraper Ethics Aligned</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
                  <Cpu size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-200/60">
                  Google Gemini
                </span>
              </div>
              <h3 className="font-display text-lg text-zinc-900">
                Zero AI Model Training
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Your monitored brand terms, queries, and analyzed posts are processed through secure enterprise AI endpoints. Your confidential queries and brand signals are never fed into public foundation models.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-500">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Enterprise API Confidentiality</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <Database size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  Full Control
                </span>
              </div>
              <h3 className="font-display text-lg text-zinc-900">
                Total Data Ownership
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                You retain 100% intellectual ownership of all your generated reports, saved post analyses, sentiment graphs, and alerts. Export your raw data or trigger complete account purging with a single click.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-500">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Instant CSV / JSON / PDF Export</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50/80 px-2 py-0.5 rounded-md border border-sky-200/60">
                  Clerk Auth
                </span>
              </div>
              <h3 className="font-display text-lg text-zinc-900">
                Zero-Trust Authentication
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Identity and access control are handled by Clerk with salted hashing, encrypted session tokens, and OAuth SSO. SocialInt never has access to or stores your personal social network passwords.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-500">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Token Isolation &amp; MFA Enabled</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                  <EyeOff size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                  Privacy Shield
                </span>
              </div>
              <h3 className="font-display text-lg text-zinc-900">
                Automated PII Redaction
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Our ingestion pipelines automatically detect and mask sensitive personally identifiable information (such as personal phone numbers, physical addresses, and email IDs) before generating aggregate sentiment metrics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-500">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Privacy-by-Design Architecture</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50/80 px-2 py-0.5 rounded-md border border-rose-200/60">
                  No Ad Networks
                </span>
              </div>
              <h3 className="font-display text-lg text-zinc-900">
                Zero Data Brokering
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                SocialInt is a purely customer-funded SaaS platform. We do not sell, rent, broker, or trade your analytical data, client names, or search queries to ad brokers, data resellers, or external marketing networks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-500">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>100% Independent SaaS Model</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE DEEP DIVE: ACETERNITY TABBED POLICY EXPLORER */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-100">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#457B9D]">
                Detailed Policy Framework
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-zinc-950 mt-1">
                Explore Our Complete Privacy Commitments
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Version 2.4</span>
              <span>•</span>
              <span>Updated September 2026</span>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6">
            {policyTabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePolicyTab(index)}
                className={`flex flex-col text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  activePolicyTab === index
                    ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                    : "border-zinc-200 bg-slate-50/50 text-zinc-700 hover:bg-zinc-100/70"
                }`}
              >
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                    activePolicyTab === index ? "text-cyan-300" : "text-zinc-400"
                  }`}
                >
                  {tab.badge}
                </span>
                <span className="font-semibold mt-1 truncate">{tab.title}</span>
              </button>
            ))}
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="mt-8 rounded-2xl bg-slate-50/70 border border-zinc-200/80 p-6 sm:p-8">
            <div className="max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#457B9D] font-bold">
                {policyTabs[activePolicyTab].badge}
              </span>
              <h4 className="font-display text-xl sm:text-2xl text-zinc-950 mt-1.5">
                {policyTabs[activePolicyTab].headline}
              </h4>
              <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {policyTabs[activePolicyTab].content}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {policyTabs[activePolicyTab].points.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-start gap-2.5 rounded-xl bg-white border border-zinc-200/80 p-3 shadow-xs text-xs text-zinc-700 leading-relaxed"
                  >
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRIVACY CONTACT & SUMMARY FOOTER */}
          <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>
              Have specific data privacy questions or need a custom Data Processing Agreement (DPA)?
            </p>
            <a
              href="mailto:supportsocialint@gmail.com"
              className="inline-flex items-center gap-1.5 font-semibold text-[#457B9D] hover:underline"
            >
              Contact Data Protection Office &rarr;
            </a>
          </div>
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
     
<footer className="border-t border-zinc-200/80 bg-white py-12 px-4 sm:px-10">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
        <Activity size={18} className="stroke-[2.5]" />
      </div>

      <div>
        <p className="font-display text-base text-zinc-900 tracking-wide">
          SocialInt
        </p>
        <p className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-zinc-400">
          Social Listening &amp; PR Intelligence
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 md:flex-nowrap">
      <a href="#features" className="hover:text-zinc-950 transition-colors">
        Features
      </a>

      <a href="#radar" className="hover:text-zinc-950 transition-colors">
        Live Radar
      </a>

      <a href="#solutions" className="hover:text-zinc-950 transition-colors">
        Use Cases
      </a>

      <a href="#workflow" className="hover:text-zinc-950 transition-colors">
        Workflow
      </a>

      <a href="#privacy" className="hover:text-zinc-950 transition-colors">
        Privacy Policy
      </a>
    </div>

    <p className="text-[11px] sm:text-xs text-zinc-500 text-center md:text-left">
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