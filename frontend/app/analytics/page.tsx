"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


/* ================================================== */
/* DATA                                               */
/* ================================================== */

const weeklyData = [
  {
    day: "Mon",
    mentions: 8200,
    engagement: 52000,
    positive: 62,
    negative: 18,
  },
  {
    day: "Tue",
    mentions: 9800,
    engagement: 61000,
    positive: 65,
    negative: 16,
  },
  {
    day: "Wed",
    mentions: 7600,
    engagement: 48000,
    positive: 59,
    negative: 24,
  },
  {
    day: "Thu",
    mentions: 11200,
    engagement: 72000,
    positive: 54,
    negative: 29,
  },
  {
    day: "Fri",
    mentions: 13400,
    engagement: 89000,
    positive: 68,
    negative: 18,
  },
  {
    day: "Sat",
    mentions: 15800,
    engagement: 104000,
    positive: 72,
    negative: 15,
  },
  {
    day: "Sun",
    mentions: 14900,
    engagement: 97000,
    positive: 69,
    negative: 17,
  },
];


const monthlyData = [
  {
    day: "Week 1",
    mentions: 42000,
    engagement: 280000,
    positive: 61,
    negative: 20,
  },
  {
    day: "Week 2",
    mentions: 51000,
    engagement: 340000,
    positive: 64,
    negative: 18,
  },
  {
    day: "Week 3",
    mentions: 47000,
    engagement: 315000,
    positive: 58,
    negative: 23,
  },
  {
    day: "Week 4",
    mentions: 68000,
    engagement: 460000,
    positive: 69,
    negative: 16,
  },
];


const sentimentData = [
  {
    name: "Positive",
    value: 68,
  },
  {
    name: "Neutral",
    value: 18,
  },
  {
    name: "Negative",
    value: 14,
  },
];


const platformData = [
  {
    name: "X",
    mentions: 48200,
    engagement: 1820000,
  },
  {
    name: "Telegram",
    mentions: 27600,
    engagement: 940000,
  },
  {
    name: "Instagram",
    mentions: 19400,
    engagement: 720000,
  },
  {
    name: "YouTube",
    mentions: 10800,
    engagement: 510000,
  },
];


const topics = [
  {
    name: "Performance",
    mentions: "42.8K",
    growth: "+320%",
  },
  {
    name: "Upcoming Match",
    mentions: "31.4K",
    growth: "+184%",
  },
  {
    name: "Team Selection",
    mentions: "18.7K",
    growth: "+126%",
  },
  {
    name: "Captaincy",
    mentions: "12.3K",
    growth: "+89%",
  },
];


/* ================================================== */
/* PAGE                                               */
/* ================================================== */

export default function AnalyticsPage() {
  const [range, setRange] =
    useState<"7d" | "30d">("7d");

  const [metric, setMetric] =
    useState<"mentions" | "engagement">(
      "mentions"
    );


  const chartData =
    range === "7d"
      ? weeklyData
      : monthlyData;


  const totalMentions = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum + item.mentions,
      0
    );
  }, [chartData]);


  const totalEngagement = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum + item.engagement,
      0
    );
  }, [chartData]);


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">


      {/* ================================================== */}
      {/* BACKGROUND                                         */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div
          className="
            absolute
            left-[30%]
            top-[5%]
            h-[500px]
            w-[650px]
            rounded-full
            bg-blue-500/[0.035]
            blur-[120px]
            animate-analytics-glow
          "
        />

        <div
          className="
            absolute
            right-[-150px]
            top-[40%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-500/[0.025]
            blur-[120px]
            animate-analytics-glow-two
          "
        />

      </div>


      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">

        <div className="flex h-20 items-center justify-between px-5 sm:px-8">

          <div>

            <div className="mb-1.5 flex items-center gap-2">

              <BarChart3
                size={16}
                className="text-blue-400"
              />

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                Intelligence
              </span>

            </div>


            <h1 className="font-display text-3xl tracking-wide text-white sm:text-4xl">
              Analytics
            </h1>

          </div>


          {/* Range selector */}

          <div className="relative">

            <select
              value={range}
              onChange={(event) =>
                setRange(
                  event.target.value as
                    | "7d"
                    | "30d"
                )
              }
              className="
                appearance-none
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                py-2.5
                pl-4
                pr-10
                text-sm
                font-medium
                text-zinc-300
                outline-none
                transition
                hover:bg-white/[0.06]
                focus:border-blue-500/40
              "
            >

              <option
                value="7d"
                className="bg-[#0b0f18]"
              >
                Last 7 days
              </option>

              <option
                value="30d"
                className="bg-[#0b0f18]"
              >
                Last 30 days
              </option>

            </select>


            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

          </div>

        </div>

      </header>


      {/* ================================================== */}
      {/* CONTENT                                            */}
      {/* ================================================== */}

      <div className="relative z-10 px-5 py-7 sm:px-8 sm:py-8">


        {/* ================================================== */}
        {/* INTRO                                              */}
        {/* ================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
                Audience performance
              </h2>

              <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-400">
                Understand how conversations are evolving,
                where engagement is coming from and what is
                driving audience sentiment.
              </p>

            </div>


            <div className="flex items-center gap-2 text-sm text-zinc-500">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              Data updated 2 min ago

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* OVERVIEW CARDS                                     */}
        {/* ================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


          <AnalyticsCard
            icon={MessageSquare}
            title="Total mentions"
            value={
              range === "7d"
                ? "90.9K"
                : "208K"
            }
            change="+18.4%"
            description="vs previous period"
            positive
          />


          <AnalyticsCard
            icon={Users}
            title="Reach"
            value="8.42M"
            change="+12.8%"
            description="estimated audience"
            positive
          />


          <AnalyticsCard
            icon={Zap}
            title="Engagement"
            value={
              range === "7d"
                ? "523K"
                : "1.39M"
            }
            change="+24.7%"
            description="total interactions"
            positive
          />


          <AnalyticsCard
            icon={Activity}
            title="Sentiment"
            value="68.4%"
            change="+6.2%"
            description="positive conversations"
            positive
          />

        </section>


        {/* ================================================== */}
        {/* MAIN CHART + SENTIMENT                            */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">


          {/* ================================================== */}
          {/* ACTIVITY CHART                                     */}
          {/* ================================================== */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Conversation activity
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Track conversation volume and engagement over time.
                </p>

              </div>


              {/* Metric switch */}

              <div className="flex rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">

                <button
                  type="button"
                  onClick={() =>
                    setMetric("mentions")
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    metric === "mentions"
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  Mentions
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setMetric(
                      "engagement"
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    metric === "engagement"
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  Engagement
                </button>

              </div>

            </div>


            <div className="mt-8 h-[350px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 0,
                  }}
                >

                  <defs>

                    <linearGradient
                      id="analyticsArea"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#60a5fa"
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="100%"
                        stopColor="#60a5fa"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    stroke="#202733"
                    strokeDasharray="3 3"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#71717a",
                      fontSize: 12,
                    }}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#71717a",
                      fontSize: 12,
                    }}
                  />


                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#10151f",
                      border:
                        "1px solid #303746",
                      borderRadius:
                        "14px",
                      color: "#fff",
                    }}
                    labelStyle={{
                      color: "#a1a1aa",
                      marginBottom: 5,
                    }}
                  />


                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    fill="url(#analyticsArea)"
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      stroke: "#0b0f18",
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>


            {/* Summary */}

            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.06] pt-5">

              <div>

                <p className="text-xs text-zinc-500">
                  Period total
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {metric ===
                  "mentions"
                    ? totalMentions.toLocaleString()
                    : `${(
                        totalEngagement /
                        1000
                      ).toFixed(0)}K`}
                </p>

              </div>


              <div>

                <p className="text-xs text-zinc-500">
                  Daily average
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {metric ===
                  "mentions"
                    ? Math.round(
                        totalMentions /
                          chartData.length
                      ).toLocaleString()
                    : `${Math.round(
                        totalEngagement /
                          chartData.length /
                          1000
                      )}K`}
                </p>

              </div>


              <div className="flex items-center gap-2 text-xs text-emerald-400">

                <ArrowUpRight size={14} />

                Trending upward

              </div>

            </div>

          </section>


          {/* ================================================== */}
          {/* SENTIMENT                                         */}
          {/* ================================================== */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div>

              <h3 className="text-lg font-semibold text-white">
                Sentiment distribution
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Overall audience reaction.
              </p>

            </div>


            <div className="relative mt-5 h-[270px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={78}
                    outerRadius={105}
                    paddingAngle={3}
                    stroke="none"
                  >

                    <Cell
                      fill="#34d399"
                    />

                    <Cell
                      fill="#71717a"
                    />

                    <Cell
                      fill="#f87171"
                    />

                  </Pie>


                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#10151f",
                      border:
                        "1px solid #303746",
                      borderRadius:
                        "12px",
                      color: "#fff",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>


              {/* Center */}

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  {/* Number remains normal font */}

                  <p className="text-4xl font-semibold tracking-tight text-white">
                    68.4%
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Positive

                  </p>

                </div>

              </div>

            </div>


            <div className="space-y-3">

              <SentimentRow
                label="Positive"
                value="68%"
                className="bg-emerald-400"
              />

              <SentimentRow
                label="Neutral"
                value="18%"
                className="bg-zinc-500"
              />

              <SentimentRow
                label="Negative"
                value="14%"
                className="bg-red-400"
              />

            </div>

          </section>

        </section>


        {/* ================================================== */}
        {/* PLATFORM ANALYSIS                                  */}
        {/* ================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <h3 className="text-lg font-semibold text-white">
                Platform performance
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Compare conversation activity across connected platforms.
              </p>

            </div>

            <span className="text-xs text-zinc-600">
              Last {range === "7d" ? "7" : "30"} days
            </span>

          </div>


          <div className="mt-7 h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={platformData}
                barGap={12}
                margin={{
                  top: 5,
                  right: 5,
                  left: -15,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  stroke="#202733"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#a1a1aa",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#71717a",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(255,255,255,0.025)",
                  }}
                  contentStyle={{
                    backgroundColor:
                      "#10151f",
                    border:
                      "1px solid #303746",
                    borderRadius:
                      "12px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="mentions"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                  fill="#60a5fa"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {platformData.map(
              (platform) => (
                <div
                  key={platform.name}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:bg-white/[0.045]"
                >

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-zinc-300">
                      {platform.name}
                    </p>

                    <ArrowUpRight
                      size={15}
                      className="text-zinc-600"
                    />

                  </div>

                  <p className="mt-3 text-2xl font-semibold text-white">
                    {(
                      platform.mentions /
                      1000
                    ).toFixed(1)}
                    K
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    mentions
                  </p>

                </div>
              )
            )}

          </div>

        </section>


        {/* ================================================== */}
        {/* TOPICS + INSIGHTS                                  */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-2">


          {/* Topics */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Fastest growing topics
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Conversations gaining momentum.
                </p>

              </div>

              <TrendingUp
                size={19}
                className="text-emerald-400"
              />

            </div>


            <div className="mt-6 divide-y divide-white/[0.06]">

              {topics.map(
                (topic, index) => (

                  <div
                    key={topic.name}
                    className="flex items-center justify-between py-4"
                  >

                    <div className="flex items-center gap-4">

                      <span className="text-sm font-medium text-zinc-600">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>


                      <div>

                        <p className="text-sm font-semibold text-zinc-200">
                          {topic.name}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {topic.mentions} mentions
                        </p>

                      </div>

                    </div>


                    <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                      {topic.growth}
                    </span>

                  </div>

                )
              )}

            </div>

          </section>


          {/* Insights */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                <Zap
                  size={18}
                  className="text-blue-400"
                />

              </div>


              <div>

                <h3 className="text-lg font-semibold text-white">
                  Key insights
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  What changed in your audience.
                </p>

              </div>

            </div>


            <div className="mt-6 space-y-3">


              <Insight
                icon={TrendingUp}
                title="Positive sentiment increased"
                text="Positive conversations are up 6.2% compared with the previous period."
                positive
              />


              <Insight
                icon={ArrowUpRight}
                title="Performance is trending"
                text="Performance-related conversations generated the highest growth this period."
                positive
              />


              <Insight
                icon={TrendingDown}
                title="Negative discussion slowed"
                text="Negative sentiment dropped after the latest performance update."
              />


              <Insight
                icon={Users}
                title="Creator influence increased"
                text="Influencer accounts are contributing more to overall conversation reach."
                positive
              />

            </div>

          </section>

        </section>


        {/* ================================================== */}
        {/* BOTTOM STATUS                                      */}
        {/* ================================================== */}

        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">

                <Activity
                  size={16}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-sm font-medium text-zinc-200">
                  Analytics engine active
                </p>

                <p className="mt-0.5 text-xs text-zinc-500">
                  All connected sources are being analyzed.
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-emerald-400">
                Processing live
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* ================================================== */}
      {/* ANIMATION                                          */}
      {/* ================================================== */}

      <style jsx>{`

        @keyframes analyticsGlow {

          0%,
          100% {
            transform: translate(0, 0)
              scale(1);
          }

          50% {
            transform: translate(70px, 35px)
              scale(1.12);
          }

        }


        @keyframes analyticsGlowTwo {

          0%,
          100% {
            transform: translate(0, 0)
              scale(1);
          }

          50% {
            transform: translate(-60px, -30px)
              scale(1.15);
          }

        }


        .animate-analytics-glow {
          animation:
            analyticsGlow
            12s
            ease-in-out
            infinite;
        }


        .animate-analytics-glow-two {
          animation:
            analyticsGlowTwo
            15s
            ease-in-out
            infinite;
        }


        @media (
          prefers-reduced-motion: reduce
        ) {

          .animate-analytics-glow,
          .animate-analytics-glow-two {
            animation: none;
          }

        }

      `}</style>

    </main>
  );
}


/* ================================================== */
/* ANALYTICS CARD                                     */
/* ================================================== */

function AnalyticsCard({
  icon: Icon,
  title,
  value,
  change,
  description,
  positive = false,
}: {
  icon: typeof Activity;
  title: string;
  value: string;
  change: string;
  description: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.13] hover:bg-white/[0.045]">

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.07]">

          <Icon
            size={18}
            className="text-blue-400"
          />

        </div>


        {positive && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">

            <ArrowUpRight size={14} />

            {change}

          </div>
        )}

      </div>


      <p className="mt-5 text-sm font-medium text-zinc-400">
        {title}
      </p>


      {/* Numbers deliberately use normal UI font */}

      <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>


      <p className="mt-2 text-xs text-zinc-500">
        {description}
      </p>

    </div>
  );
}


/* ================================================== */
/* SENTIMENT ROW                                      */
/* ================================================== */

function SentimentRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  const numericValue =
    parseInt(value);


  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          {label}
        </span>

        {/* Number stays normal font */}

        <span className="text-sm font-medium text-zinc-200">
          {value}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width:
              `${numericValue}%`,
          }}
        />

      </div>

    </div>
  );
}


/* ================================================== */
/* INSIGHT                                            */
/* ================================================== */

function Insight({
  icon: Icon,
  title,
  text,
  positive = false,
}: {
  icon: typeof TrendingUp;
  title: string;
  text: string;
  positive?: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.1] hover:bg-white/[0.035]">

      <div className="flex gap-3">

        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            positive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >

          <Icon size={15} />

        </div>


        <div>

          <p className="text-sm font-semibold text-zinc-200">
            {title}
          </p>

          <p className="mt-1.5 text-sm leading-6 text-zinc-500">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}