"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  Hash,
  LayoutDashboard,
  MessageSquare,
  Network,
  Search,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import {
  Show,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sentimentData = [
  { day: "Mon", positive: 62, negative: 18, neutral: 20 },
  { day: "Tue", positive: 65, negative: 16, neutral: 19 },
  { day: "Wed", positive: 59, negative: 24, neutral: 17 },
  { day: "Thu", positive: 54, negative: 29, neutral: 17 },
  { day: "Fri", positive: 68, negative: 18, neutral: 14 },
  { day: "Sat", positive: 72, negative: 15, neutral: 13 },
  { day: "Sun", positive: 69, negative: 17, neutral: 14 },
];

const trendingTopics = [
  {
    name: "#Performance",
    growth: "+320%",
    mentions: "42.8K",
  },
  {
    name: "#UpcomingMatch",
    growth: "+184%",
    mentions: "31.4K",
  },
  {
    name: "#TeamSelection",
    growth: "+126%",
    mentions: "18.7K",
  },
  {
    name: "#Captaincy",
    growth: "+89%",
    mentions: "12.3K",
  },
];

const activities = [
  {
    type: "positive",
    text: "Amazing performance today 🔥",
    source: "X",
    time: "2 min ago",
  },
  {
    type: "negative",
    text: "He needs to improve his batting.",
    source: "X",
    time: "8 min ago",
  },
  {
    type: "neutral",
    text: "Match starts at 7 PM tomorrow.",
    source: "Telegram",
    time: "14 min ago",
  },
  {
    type: "positive",
    text: "One of the best players in the team.",
    source: "X",
    time: "21 min ago",
  },
];

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  positive = true,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-zinc-800 p-2.5">
          <Icon
            size={19}
            className="text-zinc-300"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={
            positive
              ? "text-emerald-400"
              : "text-red-400"
          }
        >
          {change}
        </span>

        <span className="text-zinc-500">
          vs last 7 days
        </span>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-zinc-800 px-6">
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Activity
                size={20}
                className="text-black"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-white">
                SocialInt
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Social Intelligence
              </p>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">

          <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
            Workspace
          </p>

          <div className="space-y-1">

            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              active
            />

            <NavItem
              icon={Activity}
              label="Analytics"
            />

            <NavItem
              icon={MessageSquare}
              label="Posts Analysis"
            />

            <NavItem
              icon={TrendingUp}
              label="Trends & Topics"
            />

            <NavItem
              icon={Users}
              label="Audience Insights"
            />

            <NavItem
              icon={Network}
              label="Influence Network"
            />

          </div>

          <p className="mb-3 mt-8 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
            Management
          </p>

          <div className="space-y-1">

            <NavItem
              icon={FileText}
              label="Reports"
            />

            <NavItem
              icon={Settings}
              label="Settings"
            />

          </div>

        </nav>

        {/* Data source status */}
        <div className="border-t border-zinc-800 p-4">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-zinc-300">
                Data collection active
              </span>

            </div>

            <p className="mt-2 text-[11px] leading-5 text-zinc-500">
              X and Telegram are currently connected.
            </p>

            <button className="mt-3 text-xs font-medium text-white hover:text-zinc-300">
              Manage sources →
            </button>

          </div>

        </div>

      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >
      <Icon size={18} />

      <span>
        {label}
      </span>
    </button>
  );
}

export default function Home() {

    const { user } = useUser();

  const firstName = user?.firstName || user?.username || "there";

  const hour = new Date().getHours();

const greeting =
  hour < 12
    ? "Good morning"
    : hour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      <Sidebar />

      {/* Main */}
      <main className="lg:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-zinc-800 bg-[#09090b]/90 px-5 backdrop-blur-xl sm:px-8">

          <div>
            <p className="text-xs text-zinc-500">
              Workspace
            </p>

            <h2 className="text-lg font-semibold text-white">
              Social Intelligence
            </h2>
          </div>

          <div className="flex items-center gap-3">

            {/* Search */}
            <button className="hidden rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 hover:text-white sm:block">
              <Search size={18} />
            </button>

            {/* Notifications */}
            <button className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 hover:text-white">
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>

            {/* Clerk Authentication */}

            {/* Logged out */}
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200">
                  Get Started
                </button>
              </SignUpButton>
            </Show>

            {/* Logged in */}
            <Show when="signed-in">
              <UserButton
                showName
                appearance={{
                  elements: {
                    userButtonBox:
                      "rounded-xl border border-zinc-800 bg-zinc-900 text-white px-3 py-2",

                    userButtonOuterIdentifier:
                      "text-sm font-medium text-zinc-300",

                    userButtonTrigger:
                      "focus:shadow-none",
                  },
                }}
              />
            </Show>

          </div>

        </header>

        <div className="p-5 sm:p-8">

          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium uppercase tracking-widest text-emerald-400">
                  Live monitoring
                </span>

              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {greeting}, {firstName}.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Monitor audience sentiment, emerging narratives
                and influence across your connected social platforms.
              </p>

            </div>

            <button className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">

              <Zap size={16} />

              Add data source

            </button>

          </div>

          {/* Monitoring profile */}
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold">
                SI
              </div>

              <div>

                <p className="text-sm font-medium text-white">
                  Monitoring: Public Figure
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  X · Telegram · Updated 2 minutes ago
                </p>

              </div>

            </div>

            <button className="text-xs text-zinc-400 hover:text-white">
              Change profile
            </button>

          </div>

          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Posts analyzed"
              value="125.4K"
              change="+18.4%"
              icon={FileText}
            />

            <StatCard
              title="Total engagement"
              value="4.82M"
              change="+24.7%"
              icon={BarChart3}
            />

            <StatCard
              title="Positive sentiment"
              value="68.4%"
              change="+6.2%"
              icon={TrendingUp}
            />

            <StatCard
              title="Active alerts"
              value="12"
              change="+3 today"
              icon={AlertTriangle}
              positive={false}
            />

          </div>

          {/* Chart + Alert */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">

            {/* Sentiment Chart */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                <div>

                  <h3 className="font-semibold text-white">
                    Sentiment over time
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Audience sentiment across the last 7 days
                  </p>

                </div>

                <div className="flex items-center gap-4 text-xs">

                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Positive
                  </span>

                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    Negative
                  </span>

                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-zinc-500" />
                    Neutral
                  </span>

                </div>

              </div>

              <div className="mt-6 h-[300px] w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart data={sentimentData}>

                    <defs>

                      <linearGradient
                        id="positiveGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#34d399"
                          stopOpacity={0.2}
                        />

                        <stop
                          offset="100%"
                          stopColor="#34d399"
                          stopOpacity={0}
                        />

                      </linearGradient>

                      <linearGradient
                        id="negativeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#f87171"
                          stopOpacity={0.15}
                        />

                        <stop
                          offset="100%"
                          stopColor="#f87171"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>

                    <CartesianGrid
                      stroke="#27272a"
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#71717a",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#71717a",
                        fontSize: 11,
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="positive"
                      stroke="#34d399"
                      strokeWidth={2}
                      fill="url(#positiveGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="negative"
                      stroke="#f87171"
                      strokeWidth={2}
                      fill="url(#negativeGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* Emerging Issue */}
            <section className="rounded-2xl border border-red-900/40 bg-red-950/10 p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <div className="rounded-lg bg-red-500/10 p-2 text-red-400">
                  <AlertTriangle size={18} />
                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    Emerging issue
                  </h3>

                  <p className="text-xs text-zinc-500">
                    Detected 18 minutes ago
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <p className="text-sm leading-6 text-zinc-300">

                  Negative sentiment around{" "}

                  <span className="font-medium text-white">
                    recent performance
                  </span>{" "}

                  has increased by{" "}

                  <span className="font-semibold text-red-400">
                    44%
                  </span>{" "}

                  in the last 6 hours.

                </p>

              </div>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">

                <p className="text-xs text-zinc-500">
                  Primary narrative
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  Performance & selection
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">

                  <div className="h-full w-[72%] rounded-full bg-red-400" />

                </div>

                <div className="mt-2 flex justify-between text-[11px] text-zinc-500">

                  <span>
                    Conversation volume
                  </span>

                  <span>
                    72%
                  </span>

                </div>

              </div>

              <button className="mt-5 w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white">
                View detailed analysis
              </button>

            </section>

          </div>

          {/* Bottom section */}
          <div className="mt-6 grid gap-6 xl:grid-cols-2">

            {/* Trending Topics */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold text-white">
                    Trending topics
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Fastest growing conversations
                  </p>

                </div>

                <div className="rounded-lg bg-zinc-800 p-2 text-zinc-400">
                  <Hash size={17} />
                </div>

              </div>

              <div className="mt-5 divide-y divide-zinc-800">

                {trendingTopics.map(
                  (topic, index) => (

                    <div
                      key={topic.name}
                      className="flex items-center justify-between py-4"
                    >

                      <div className="flex items-center gap-3">

                        <span className="text-xs text-zinc-600">
                          0{index + 1}
                        </span>

                        <div>

                          <p className="text-sm font-medium text-zinc-200">
                            {topic.name}
                          </p>

                          <p className="mt-1 text-[11px] text-zinc-500">
                            {topic.mentions} mentions
                          </p>

                        </div>

                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                        {topic.growth}
                      </span>

                    </div>

                  )
                )}

              </div>

            </section>

            {/* Recent Activity */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold text-white">
                    Recent activity
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Latest analyzed conversations
                  </p>

                </div>

                <MessageSquare
                  size={18}
                  className="text-zinc-500"
                />

              </div>

              <div className="mt-5 space-y-1">

                {activities.map(
                  (activity, index) => (

                    <div
                      key={index}
                      className="flex gap-3 rounded-xl p-3 hover:bg-zinc-800/50"
                    >

                      <div
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          activity.type === "positive"
                            ? "bg-emerald-400"
                            : activity.type === "negative"
                              ? "bg-red-400"
                              : "bg-zinc-500"
                        }`}
                      />

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm text-zinc-300">
                          {activity.text}
                        </p>

                        <div className="mt-1 flex gap-2 text-[11px] text-zinc-600">

                          <span>
                            {activity.source}
                          </span>

                          <span>
                            •
                          </span>

                          <span>
                            {activity.time}
                          </span>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col justify-between gap-2 border-t border-zinc-800 pt-5 text-[11px] text-zinc-600 sm:flex-row">

            <span>
              Socialint · Social Intelligence Platform
            </span>

            <span>
              Data last updated 2 minutes ago
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}