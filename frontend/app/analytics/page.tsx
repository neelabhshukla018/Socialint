"use client";

import { useState } from "react";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
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


const weeklyData = [
  { day: "Mon", mentions: 8200, engagement: 52000 },
  { day: "Tue", mentions: 9800, engagement: 61000 },
  { day: "Wed", mentions: 7600, engagement: 48000 },
  { day: "Thu", mentions: 11200, engagement: 72000 },
  { day: "Fri", mentions: 13400, engagement: 89000 },
  { day: "Sat", mentions: 15800, engagement: 104000 },
  { day: "Sun", mentions: 14900, engagement: 97000 },
];


const monthlyData = [
  { day: "Week 1", mentions: 42000, engagement: 280000 },
  { day: "Week 2", mentions: 51000, engagement: 340000 },
  { day: "Week 3", mentions: 47000, engagement: 315000 },
  { day: "Week 4", mentions: 68000, engagement: 460000 },
];


const sentimentData = [
  { name: "Positive", value: 68 },
  { name: "Neutral", value: 18 },
  { name: "Negative", value: 14 },
];


const platformData = [
  { name: "X", mentions: 48200 },
  { name: "Telegram", mentions: 27600 },
  { name: "Instagram", mentions: 19400 },
  { name: "YouTube", mentions: 10800 },
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


export default function AnalyticsPage() {
  const [range, setRange] = useState("7d");
  const [metric, setMetric] = useState("mentions");

  const chartData =
    range === "7d"
      ? weeklyData
      : monthlyData;


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">

      {/* Background */}

      <div className="pointer-events-none absolute inset-0">

        <div className="analytics-glow analytics-glow-one" />

        <div className="analytics-glow analytics-glow-two" />

      </div>


      {/* Header */}

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


          <select
            value={range}
            onChange={(event) =>
              setRange(event.target.value)
            }
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-300 outline-none transition hover:bg-white/[0.07]"
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

        </div>

      </header>


      {/* Content */}

      <div className="relative z-10 px-5 py-8 sm:px-8">


        {/* Introduction */}

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


        {/* Statistics */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <AnalyticsCard
            icon={MessageSquare}
            title="Total mentions"
            value="90.9K"
            change="+18.4%"
            description="vs previous period"
          />


          <AnalyticsCard
            icon={Users}
            title="Audience reach"
            value="8.42M"
            change="+12.8%"
            description="estimated audience"
          />


          <AnalyticsCard
            icon={Zap}
            title="Engagement"
            value="523K"
            change="+24.7%"
            description="total interactions"
          />


          <AnalyticsCard
            icon={Activity}
            title="Positive sentiment"
            value="68.4%"
            change="+6.2%"
            description="positive conversations"
          />

        </section>


        {/* Main analytics */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">


          {/* Activity */}

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
                    setMetric("engagement")
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

                <AreaChart data={chartData}>

                  <defs>

                    <linearGradient
                      id="activityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#60a5fa"
                        stopOpacity={0.2}
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
                      backgroundColor: "#10151f",
                      border: "1px solid #303746",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />


                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    fill="url(#activityGradient)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </section>


          {/* Sentiment */}

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

                    <Cell fill="#34d399" />

                    <Cell fill="#71717a" />

                    <Cell fill="#f87171" />

                  </Pie>


                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#10151f",
                      border: "1px solid #303746",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>


              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <p className="text-4xl font-semibold text-white">
                    68.4%
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Positive
                  </p>

                </div>

              </div>

            </div>


            <div className="space-y-4">

              <SentimentRow
                label="Positive"
                value="68%"
                color="bg-emerald-400"
              />

              <SentimentRow
                label="Neutral"
                value="18%"
                color="bg-zinc-500"
              />

              <SentimentRow
                label="Negative"
                value="14%"
                color="bg-red-400"
              />

            </div>

          </section>

        </section>


        {/* Platform performance */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

          <div>

            <h3 className="text-lg font-semibold text-white">
              Platform performance
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Compare conversation activity across connected platforms.
            </p>

          </div>


          <div className="mt-7 h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={platformData}>

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
                    backgroundColor: "#10151f",
                    border: "1px solid #303746",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="mentions"
                  fill="#60a5fa"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* Topics */}

        <section className="mt-6 grid gap-6 xl:grid-cols-2">


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
                        {String(index + 1).padStart(2, "0")}
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


        {/* Status */}

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

                <p className="mt-1 text-xs text-zinc-500">
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


      {/* Animation */}

      <style jsx>{`
        .analytics-glow {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(100px);
        }

        .analytics-glow-one {
          width: 600px;
          height: 300px;
          left: 30%;
          top: 100px;
          background: rgba(59, 130, 246, 0.035);
          animation: analyticsMoveOne 12s ease-in-out infinite;
        }

        .analytics-glow-two {
          width: 450px;
          height: 250px;
          right: -100px;
          top: 50%;
          background: rgba(139, 92, 246, 0.03);
          animation: analyticsMoveTwo 15s ease-in-out infinite;
        }

        @keyframes analyticsMoveOne {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(70px, 35px) scale(1.12);
          }
        }

        @keyframes analyticsMoveTwo {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-60px, -30px) scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .analytics-glow {
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
}: {
  icon: typeof Activity;
  title: string;
  value: string;
  change: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:border-white/[0.14] hover:bg-white/[0.045]">

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.07]">

          <Icon
            size={18}
            className="text-blue-400"
          />

        </div>


        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">

          <ArrowUpRight size={14} />

          {change}

        </span>

      </div>


      <p className="mt-5 text-sm font-medium text-zinc-400">
        {title}
      </p>


      {/* Normal UI font — not Keania */}

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
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          {label}
        </span>

        <span className="text-sm font-medium text-zinc-200">
          {value}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: value,
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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.1] hover:bg-white/[0.035]">

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