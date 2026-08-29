"use client";

import {
  Activity,
  ArrowRight,
  Brain,
  MessageSquare,
  Network,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { SignUpButton } from "@clerk/nextjs";

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
              <h1 className="font-display text-lg tracking-wide">
                SocialInt
              </h1>

              <p className="font-display text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                Social Intelligence
              </p>
            </div>

          </div>


          {/* CTA */}

          <SignUpButton mode="modal">
            <button
              type="button"
              className="
                rounded-xl
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-zinc-200
              "
            >
              Get Started
            </button>
          </SignUpButton>

        </div>
      </header>


      {/* ================================================== */}
      {/* HERO                                               */}
      {/* ================================================== */}

      <section className="relative overflow-hidden">

        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-20
            h-96
            w-96
            -translate-x-1/2
            rounded-full
            bg-cyan-500/[0.025]
            blur-3xl
          "
        />

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">

          <div className="mx-auto max-w-5xl text-center">

            {/* Badge */}

            <div
              className="
                mx-auto
                mb-7
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-zinc-800
                bg-zinc-900/70
                px-4
                py-2
              "
            >

              <span className="text-xs font-medium text-cyan-400">
                AI-powered PR & social intelligence
              </span>

            </div>


            {/* Main heading */}

            <h2 className="font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">

              Know what people are saying

              <span className="block text-zinc-500">
                before it becomes a problem.
              </span>

            </h2>


            {/* Description */}

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">

              Public perception can change in minutes.
              SocialInt helps PR teams, brands, companies,
              athletes, creators and public figures understand
              conversations, measure sentiment, discover emerging
              narratives and identify influential voices across
              social platforms.

            </p>


            {/* CTA */}

            <div className="mt-9 flex justify-center">

              <SignUpButton mode="modal">

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-zinc-200
                  "
                >
                  Start monitoring

                  <ArrowRight size={16} />

                </button>

              </SignUpButton>

            </div>

          </div>


          {/* ================================================== */}
          {/* PR PROBLEM                                        */}
          {/* ================================================== */}

          <div className="mx-auto mt-28 max-w-5xl">

            <div className="mb-10 text-center">

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                The problem
              </p>

              <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                Public perception moves faster than PR teams.
              </h3>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
                A post can go viral, sentiment can shift and a
                narrative can spread across communities before a
                team has enough information to understand what is
                actually happening.
              </p>

            </div>


            <div className="grid gap-4 md:grid-cols-3">

              <ProblemCard
                icon={MessageSquare}
                title="Too much conversation"
                description="Thousands of posts, replies and comments can appear across multiple platforms every day."
              />

              <ProblemCard
                icon={TrendingUp}
                title="Trends change quickly"
                description="A small conversation can suddenly become a major public narrative."
              />

              <ProblemCard
                icon={ShieldAlert}
                title="Crises start quietly"
                description="Negative sentiment often grows before it becomes visible as a major PR issue."
              />

            </div>

          </div>


          {/* ================================================== */}
          {/* WHAT SOCIALINTEL DOES                             */}
          {/* ================================================== */}

          <div className="mx-auto mt-32 max-w-6xl">

            <div className="text-center">

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                Meet SocialInt
              </p>

              <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                From social noise to PR intelligence.
              </h3>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
                SocialInt brings multiple dimensions of social
                intelligence into one platform so teams can understand
                the complete picture instead of looking at isolated metrics.
              </p>

            </div>            {/* ================================================== */}
            {/* FEATURE CARDS                                      */}
            {/* ================================================== */}

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <FeatureCard
                icon={Brain}
                number="01"
                title="Sentiment Intelligence"
                description="Understand whether conversations are positive, negative or neutral and detect how public sentiment changes over time."
              />

              <FeatureCard
                icon={TrendingUp}
                number="02"
                title="Trend Detection"
                description="Identify emerging topics, keywords and narratives before they become dominant conversations."
              />

              <FeatureCard
                icon={Users}
                number="03"
                title="Audience Intelligence"
                description="Understand aggregate audience characteristics, interests, languages and behavioral patterns."
              />

              <FeatureCard
                icon={Network}
                number="04"
                title="Influence Analysis"
                description="Discover influential voices and understand how information and sentiment move through communities."
              />

            </div>

          </div>


          {/* ================================================== */}
          {/* HOW IT WORKS                                      */}
          {/* ================================================== */}

          <div className="mx-auto mt-32 max-w-5xl">

            <div className="text-center">

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                How it works
              </p>

              <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                One workflow. Complete social visibility.
              </h3>

            </div>


            <div className="mt-12 grid gap-4 md:grid-cols-4">

              <Step
                number="01"
                title="Connect"
                description="Connect authorized social data sources."
              />

              <Step
                number="02"
                title="Collect"
                description="Build a time-stamped stream of posts, comments and interactions."
              />

              <Step
                number="03"
                title="Analyze"
                description="AI analyzes sentiment, topics, audience signals and networks."
              />

              <Step
                number="04"
                title="Act"
                description="Use the insights to make faster and better PR decisions."
              />

            </div>

          </div>


          {/* ================================================== */}
          {/* PR USE CASES                                      */}
          {/* ================================================== */}

          <div className="mx-auto mt-32 max-w-6xl">

            <div className="mb-10">

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                Built for modern PR
              </p>

              <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                From brands to public figures.
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
                SocialInt can be used wherever public perception,
                reputation and online conversations matter.
              </p>

            </div>


            <div className="grid gap-4 md:grid-cols-2">

              <UseCase
                icon={Target}
                title="Brands & Companies"
                description="Track brand reputation, campaign reactions, customer sentiment and emerging issues."
              />

              <UseCase
                icon={Users}
                title="Athletes & Public Figures"
                description="Understand how fans and audiences react to performances, announcements and public events."
              />

              <UseCase
                icon={MessageSquare}
                title="PR & Communications Teams"
                description="Monitor conversations, identify narratives and detect potential reputation risks."
              />

              <UseCase
                icon={Zap}
                title="Campaigns & Events"
                description="Measure public reaction and discover which topics are gaining momentum around a campaign or event."
              />

            </div>

          </div>


          {/* ================================================== */}
          {/* INSIGHT EXAMPLE                                  */}
          {/* ================================================== */}

          <div className="mx-auto mt-32 max-w-5xl">

            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50">

              {/* Header */}

              <div className="border-b border-zinc-800 p-6 sm:p-8">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-widest text-zinc-600">
                      Example intelligence
                    </p>

                    <h3 className="mt-2 font-display text-xl sm:text-2xl">
                      Detect the story behind the numbers.
                    </h3>

                  </div>


                  <div className="hidden rounded-xl bg-zinc-800 p-3 sm:block">

                    <Activity
                      size={20}
                      className="text-cyan-400"
                    />

                  </div>

                </div>

              </div>


              {/* Insight cards */}

              <div className="grid gap-px bg-zinc-800 md:grid-cols-3">

                <Insight
                  label="Sentiment"
                  value="Negative"
                  detail="↑ 44% in the last 6 hours"
                />

                <Insight
                  label="Emerging narrative"
                  value="Performance"
                  detail="42.8K mentions"
                />

                <Insight
                  label="Influence"
                  value="12 key voices"
                  detail="Driving 68% of conversation"
                />

              </div>


              {/* Explanation */}

              <div className="border-t border-zinc-800 p-6 sm:p-8">

                <p className="text-sm leading-7 text-zinc-400">

                  Instead of only seeing that negative sentiment
                  increased, a PR team can investigate the narrative,
                  identify the voices driving it and understand how
                  the conversation is spreading.

                </p>

              </div>

            </div>

          </div>          {/* ================================================== */}
          {/* FINAL CTA                                         */}
          {/* ================================================== */}

          <div className="mx-auto mt-32 max-w-4xl text-center">

            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">

              <Activity
                size={21}
                className="text-cyan-400"
              />

            </div>


            <h3 className="font-display text-3xl tracking-tight sm:text-5xl">

              Don't just monitor the conversation.

              <span className="block text-zinc-500">
                Understand it.
              </span>

            </h3>


            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-500">
              Start building a clearer picture of public perception,
              emerging narratives and audience behavior.
            </p>


            <div className="mt-8">

              <SignUpButton mode="modal">

                <button
                  type="button"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-zinc-200
                  "
                >
                  Get Started

                  <ArrowRight size={16} />

                </button>

              </SignUpButton>

            </div>

          </div>


          {/* ================================================== */}
          {/* FOOTER                                            */}
          {/* ================================================== */}

          <footer className="mx-25 mt-28 max-w-9xl border-t border-zinc-800 pt-3">

            <div className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="font-display text-sm">
                  SocialInt
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  AI-powered social intelligence.
                </p>

              </div>


              <p className="text-[15px] text-zinc-500">

                <span className="mx-1 text-red-700">
                  •
                </span>

                Designed & developed by{" "}

                <a
                  href="https://neel-xdev-ipu2.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-semibold
                    text-cyan-400
                    transition
                    hover:text-cyan-300
                    hover:underline
                  "
                >
                  Neelabh
                </a>

              </p>

            </div>

          </footer>

        </div>

      </section>

    </main>
  );
}


/* ================================================== */
/* PROBLEM CARD                                       */
/* ================================================== */

function ProblemCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-6
        transition
        hover:border-zinc-700
        hover:bg-zinc-900/60
      "
    >

      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">

        <Icon
          size={18}
          className="text-zinc-300"
        />

      </div>


      <h4 className="font-display text-sm">
        {title}
      </h4>


      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {description}
      </p>

    </div>
  );
}


/* ================================================== */
/* FEATURE CARD                                       */
/* ================================================== */

function FeatureCard({
  icon: Icon,
  number,
  title,
  description,
}: {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-6
        transition
        duration-200
        hover:border-zinc-700
        hover:bg-zinc-900/70
      "
    >

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">

          <Icon
            size={18}
            className="text-zinc-300"
          />

        </div>


        {/* Number stays normal font */}

        <span className="text-[10px] font-medium tracking-widest text-zinc-700">
          {number}
        </span>

      </div>


      <h4 className="mt-6 font-display text-sm">
        {title}
      </h4>


      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {description}
      </p>

    </div>
  );
}


/* ================================================== */
/* HOW IT WORKS STEP                                  */
/* ================================================== */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        relative
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-5
      "
    >

      {/* Number stays normal font */}

      <span className="text-[10px] font-semibold tracking-widest text-cyan-400">
        {number}
      </span>


      <h4 className="mt-4 font-display text-sm">
        {title}
      </h4>


      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {description}
      </p>

    </div>
  );
}


/* ================================================== */
/* USE CASE                                           */
/* ================================================== */

function UseCase({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        gap-4
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-6
        transition
        hover:border-zinc-700
        hover:bg-zinc-900/60
      "
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800">

        <Icon
          size={18}
          className="text-zinc-300"
        />

      </div>


      <div>

        <h4 className="font-display text-sm">
          {title}
        </h4>


        <p className="mt-2 text-xs leading-5 text-zinc-500">
          {description}
        </p>

      </div>

    </div>
  );
}


/* ================================================== */
/* INSIGHT                                            */
/* ================================================== */

function Insight({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="bg-zinc-950 p-6">

      <p className="text-[10px] uppercase tracking-widest text-zinc-600">
        {label}
      </p>


      {/* Keep insight values in normal font */}

      <p className="mt-3 text-lg font-semibold">
        {value}
      </p>


      <p className="mt-1 text-xs text-zinc-500">
        {detail}
      </p>

    </div>
  );
}