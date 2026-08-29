"use client";

import {
  Activity,
  ArrowRight,
  Brain,
  Network,
  TrendingUp,
  Users,
} from "lucide-react";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* ================================================== */}
      {/* NAVBAR                                             */}
      {/* ================================================== */}

      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
              <Activity
                size={21}
                className="text-black"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                SocialIntel
              </h1>

              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                Social Intelligence
              </p>
            </div>

          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">

            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Get Started
              </button>
            </SignUpButton>

          </div>

        </div>
      </header>


      {/* ================================================== */}
      {/* HERO                                               */}
      {/* ================================================== */}

      <section className="relative overflow-hidden">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-20 sm:px-8">

          <div className="w-full">

            {/* Badge */}
            <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3.5 py-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-zinc-400">
                AI-powered social intelligence
              </span>

            </div>


            {/* Main heading */}
            <div className="mx-auto max-w-5xl text-center">

              <h2 className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">

                Understand what the
                <span className="block text-zinc-500">
                  world is saying.
                </span>

              </h2>

              <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                SocialIntel transforms social conversations into
                actionable intelligence. Monitor sentiment,
                discover emerging trends, understand audiences,
                and map influence across connected platforms.
              </p>


              {/* CTA */}
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

                <SignUpButton mode="modal">

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Get Started

                    <ArrowRight size={16} />

                  </button>

                </SignUpButton>


                <SignInButton mode="modal">

                  <button
                    type="button"
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
                  >
                    Sign in
                  </button>

                </SignInButton>

              </div>

            </div>


            {/* ================================================== */}
            {/* FEATURES                                           */}
            {/* ================================================== */}

            <div className="mx-auto mt-24 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <FeatureCard
                icon={Brain}
                title="Sentiment"
                description="Understand how audiences feel and detect changes in public opinion."
              />

              <FeatureCard
                icon={TrendingUp}
                title="Trends"
                description="Identify emerging topics and conversations as they start gaining momentum."
              />

              <FeatureCard
                icon={Users}
                title="Audience"
                description="Discover aggregate audience characteristics, interests and behavior."
              />

              <FeatureCard
                icon={Network}
                title="Influence"
                description="Map relationships and identify influential voices within conversations."
              />

            </div>


            {/* ================================================== */}
            {/* PLATFORM STRIP                                    */}
            {/* ================================================== */}

            <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 sm:flex-row">

              <div>

                <p className="text-xs font-medium text-zinc-300">
                  Connect your social platforms
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  Analyze authorized and publicly available social data.
                </p>

              </div>

              <div className="flex items-center gap-2">

                <PlatformBadge label="X" />

                <PlatformBadge label="Telegram" />

                <PlatformBadge label="Instagram" />

                <PlatformBadge label="Facebook" />

              </div>

            </div>


            {/* Bottom text */}
            <p className="mx-auto mt-10 max-w-xl text-center text-[11px] leading-5 text-zinc-600">
              Built to help brands, public figures and organizations
              understand conversations, audiences and influence
              across social media.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}


/* ================================================== */
/* FEATURE CARD                                       */
/* ================================================== */

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition duration-200 hover:border-zinc-700 hover:bg-zinc-900/70">

      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 transition group-hover:bg-zinc-700">

        <Icon
          size={18}
          className="text-zinc-300"
        />

      </div>

      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {description}
      </p>

    </div>
  );
}


/* ================================================== */
/* PLATFORM BADGE                                    */
/* ================================================== */

function PlatformBadge({
  label,
}: {
  label: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[10px] font-medium text-zinc-500">
      {label}
    </div>
  );
}