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

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useTheme } from "../context/ThemeContext";

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
  const { resolvedTheme } = useTheme();
  const [range, setRange] = useState("7d");
  const [metric, setMetric] = useState<"mentions" | "engagement">("mentions");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const chartData = range === "7d" ? weeklyData : monthlyData;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080b12] bg-grid-dashboard text-zinc-900 dark:text-zinc-100 selection:bg-[#457B9D]/20 transition-colors duration-150">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="lg:ml-[270px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <div className="px-4 py-5 sm:px-8 sm:py-8 max-w-6xl mx-auto overflow-x-hidden">
          <div className="space-y-6 sm:space-y-8">
            {/* ================================================== */}
            {/* HEADER                                             */}
            {/* ================================================== */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center sm:items-start">
                <div className="mb-1.5 sm:mb-2 flex items-center justify-center sm:justify-start gap-2">
                  <BarChart3 size={16} className="text-[#457B9D]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#457B9D]">
                    Intelligence
                  </span>
                </div>
                <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-white text-center sm:text-left">
                  Analytics
                </h1>
                <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 text-center sm:text-left mx-auto sm:mx-0">
                  Understand how conversations are evolving, where engagement is coming from, and what is driving audience sentiment.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Live update
                </div>

                <select
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 shadow-xs outline-none transition focus:border-[#457B9D]"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>
            </div>

            {/* ================================================== */}
            {/* KEY STATS                                          */}
            {/* ================================================== */}
            <section className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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

            {/* ================================================== */}
            {/* ACTIVITY & SENTIMENT CHARTS                        */}
            {/* ================================================== */}
            <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.7fr_1fr]">
              {/* Activity Chart */}
              <section className="rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xs">
                <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Conversation activity
                    </h2>
                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      Track conversation volume and engagement over time.
                    </p>
                  </div>

                  <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 p-1 self-start">
                    <button
                      type="button"
                      onClick={() => setMetric("mentions")}
                      className={`rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold transition ${
                        metric === "mentions"
                          ? "bg-[#457B9D] text-white shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      Mentions
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetric("engagement")}
                      className={`rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold transition ${
                        metric === "engagement"
                          ? "bg-[#457B9D] text-white shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      Engagement
                    </button>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 h-[240px] sm:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#457B9D" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#457B9D" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid stroke={resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"} strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: resolvedTheme === "dark" ? "#a1a1aa" : "#71717a", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: resolvedTheme === "dark" ? "#a1a1aa" : "#71717a", fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: resolvedTheme === "dark" ? "#090d16" : "#ffffff",
                          border: resolvedTheme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e4e4e7",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          color: resolvedTheme === "dark" ? "#f4f4f5" : "#18181b",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={metric}
                        stroke="#457B9D"
                        strokeWidth={2.5}
                        fill="url(#activityGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Sentiment Distribution */}
              <section className="rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xs">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Sentiment distribution
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    Overall audience sentiment balance.
                  </p>
                </div>

                <div className="relative mt-4 h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={4}
                        stroke="none"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#457B9D" />
                        <Cell fill="#f43f5e" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: resolvedTheme === "dark" ? "#090d16" : "#ffffff",
                          border: resolvedTheme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e4e4e7",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          color: resolvedTheme === "dark" ? "#f4f4f5" : "#18181b",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                        68.4%
                      </p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Positive
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <SentimentRow label="Positive" value="68%" color="bg-emerald-500" />
                  <SentimentRow label="Neutral" value="18%" color="bg-[#457B9D]" />
                  <SentimentRow label="Negative" value="14%" color="bg-rose-500" />
                </div>
              </section>
            </div>

            {/* ================================================== */}
            {/* PLATFORMS & TOPICS                                 */}
            {/* ================================================== */}
            <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
              {/* Platform performance */}
              <section className="rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xs">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Platform performance
                  </h2>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    Compare conversation volume across monitored channels.
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 h-[240px] sm:h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke={resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"} strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: resolvedTheme === "dark" ? "#a1a1aa" : "#71717a", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: resolvedTheme === "dark" ? "#a1a1aa" : "#71717a", fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={{ fill: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(69, 123, 157, 0.06)" }}
                        contentStyle={{
                          backgroundColor: resolvedTheme === "dark" ? "#090d16" : "#ffffff",
                          border: resolvedTheme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e4e4e7",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          color: resolvedTheme === "dark" ? "#f4f4f5" : "#18181b",
                        }}
                      />
                      <Bar dataKey="mentions" fill="#457B9D" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Topics */}
              <section className="rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Fastest growing topics
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      Narratives gaining momentum.
                    </p>
                  </div>
                  <TrendingUp size={20} className="text-emerald-500" />
                </div>

                <div className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {topics.map((topic, index) => (
                    <div key={topic.name} className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {topic.name}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {topic.mentions} mentions
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {topic.growth}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ================================================== */}
            {/* KEY INSIGHTS & ENGINE STATUS                       */}
            {/* ================================================== */}
            <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                  <Zap size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Key AI insights
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    Automated signals extracted from recent mentions.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Insight
                  icon={TrendingUp}
                  title="Positive sentiment surge"
                  text="Positive conversations increased 6.2% across verified and creator accounts."
                  positive
                />
                <Insight
                  icon={ArrowUpRight}
                  title="Performance narrative leading"
                  text="Performance-related discussions have the highest share of voice this cycle."
                  positive
                />
                <Insight
                  icon={TrendingDown}
                  title="Negative mentions down"
                  text="Critical sentiment decelerated significantly following the latest PR release."
                />
                <Insight
                  icon={Users}
                  title="High creator amplification"
                  text="Top 5% influencers generated 42% of total reach and cross-platform reshares."
                  positive
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
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
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 shadow-xs transition duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
          <Icon size={18} />
        </div>

        <span className="flex items-center gap-1 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <ArrowUpRight size={13} />
          {change}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </p>

      <p className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
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
      <div className="mb-1.5 flex items-center justify-between text-xs sm:text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-400">
          {label}
        </span>
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: value }}
        />
      </div>
    </div>
  );
}

/* ================================================== */
/* INSIGHT CARD                                       */
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
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/40 p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/70">
      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
            positive
              ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
              : "border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
          }`}
        >
          <Icon size={15} />
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}