"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  Flame,
  Hash,
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

type Trend = {
  id: number;
  name: string;
  category: string;
  mentions: string;
  growth: string;
  sentiment: "positive" | "negative" | "neutral";
  momentum: number;
  posts: string;
  reach: string;
  description: string;
  platforms: string[];
};

const trends: Trend[] = [
  {
    id: 1,
    name: "#Performance",
    category: "Sports",
    mentions: "42.8K",
    growth: "+320%",
    sentiment: "positive",
    momentum: 94,
    posts: "18.4K",
    reach: "3.2M",
    description:
      "Conversation around recent performance is dominating the current discussion. Positive reactions are driving most of the engagement.",
    platforms: ["X", "Instagram", "Telegram"],
  },
  {
    id: 2,
    name: "#UpcomingMatch",
    category: "Events",
    mentions: "31.4K",
    growth: "+184%",
    sentiment: "neutral",
    momentum: 87,
    posts: "13.2K",
    reach: "2.6M",
    description:
      "Anticipation is building around the upcoming event schedule. Neutral discussion focused on ticketing and schedules.",
    platforms: ["X", "Telegram"],
  },
  {
    id: 3,
    name: "#TeamSelection",
    category: "Sports",
    mentions: "18.7K",
    growth: "+126%",
    sentiment: "negative",
    momentum: 76,
    posts: "7.9K",
    reach: "1.4M",
    description:
      "Debate regarding lineup changes and squad selection. Mixed-to-critical opinions regarding leadership decisions.",
    platforms: ["X", "Instagram"],
  },
  {
    id: 4,
    name: "#Captaincy",
    category: "Sports",
    mentions: "12.3K",
    growth: "+89%",
    sentiment: "neutral",
    momentum: 68,
    posts: "5.1K",
    reach: "980K",
    description:
      "Discussions surrounding strategy and match leadership decisions across sports commentary channels.",
    platforms: ["X"],
  },
  {
    id: 5,
    name: "#PressConference",
    category: "Events",
    mentions: "9.8K",
    growth: "+64%",
    sentiment: "positive",
    momentum: 61,
    posts: "3.9K",
    reach: "760K",
    description:
      "Reactions to statements made during the recent media availability. Fans responded positively to transparency.",
    platforms: ["YouTube", "X"],
  },
  {
    id: 6,
    name: "#BrandPartnership",
    category: "Entertainment",
    mentions: "7.4K",
    growth: "+48%",
    sentiment: "positive",
    momentum: 55,
    posts: "2.8K",
    reach: "610K",
    description:
      "Audience engagement regarding commercial partnerships, sponsorship announcements and collaborative endorsements.",
    platforms: ["Instagram"],
  },
];

const categories = [
  "All",
  "Sports",
  "Events",
  "Entertainment",
];

export default function TrendsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("momentum");
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredTrends = useMemo(() => {
    let result = trends;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((t) => t.category === category);
    }

    return [...result].sort((a, b) => {
      if (sort === "growth") {
        return parseInt(b.growth) - parseInt(a.growth);
      }
      if (sort === "mentions") {
        return parseFloat(b.mentions) - parseFloat(a.mentions);
      }
      return b.momentum - a.momentum;
    });
  }, [search, category, sort]);

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
                  <TrendingUp size={16} className="text-[#457B9D]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#457B9D]">
                    Conversation Intelligence
                  </span>
                </div>
                <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-white text-center sm:text-left">
                  Trends & Topics
                </h1>
                <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 text-center sm:text-left mx-auto sm:mx-0">
                  Discover fast-growing conversations, identify emerging narratives, and monitor audience momentum in real time.
                </p>
              </div>

              {/* Status and Source Action Button */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Tracking live trends
                </div>

                <Link
                  href="/data-sources"
                  className="flex items-center justify-center gap-1.5 rounded-full bg-[#457B9D] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#386785] active:scale-98 transition shrink-0"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add source</span>
                </Link>
              </div>
            </div>

            {/* ================================================== */}
            {/* OVERVIEW STATS                                    */}
            {/* ================================================== */}
            <section className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <TrendStat
                icon={Flame}
                title="Active trends"
                value="42"
                change="+18.4%"
              />
              <TrendStat
                icon={TrendingUp}
                title="Rising topics"
                value="18"
                change="+26.7%"
              />
              <TrendStat
                icon={MessageSquare}
                title="Trend mentions"
                value="125.4K"
                change="+21.3%"
              />
              <TrendStat
                icon={Users}
                title="Estimated reach"
                value="14.8M"
                change="+16.9%"
              />
            </section>

            {/* ================================================== */}
            {/* SEARCH & FILTERS                                  */}
            {/* ================================================== */}
            <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-3.5 sm:p-4 shadow-xs">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search topics, hashtags, or keywords..."
                    className="h-10 sm:h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 pl-10 sm:pl-11 pr-4 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 focus:border-[#457B9D] focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none w-full sm:w-auto">
                    {categories.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                          category === item
                            ? "bg-[#457B9D] text-white shadow-xs"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="relative shrink-0 w-full sm:w-auto">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      className="h-10 w-full sm:w-auto appearance-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 pr-9 text-xs font-medium text-zinc-800 dark:text-zinc-200 shadow-xs outline-none focus:border-[#457B9D]"
                    >
                      <option value="momentum">Highest momentum</option>
                      <option value="growth">Fastest growth</option>
                      <option value="mentions">Most mentions</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================== */}
            {/* MAIN GRID                                          */}
            {/* ================================================== */}
            <div className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">
              {/* Trend List */}
              <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Trending now
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {filteredTrends.length} topics currently monitored
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                    <Hash size={16} />
                  </div>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredTrends.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                      <Search size={28} className="mx-auto text-zinc-300 dark:text-zinc-600" />
                      <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        No topics found
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Try modifying your keyword search or category filter.
                      </p>
                    </div>
                  ) : (
                    filteredTrends.map((trend, index) => (
                      <TrendRow
                        key={trend.id}
                        trend={trend}
                        rank={index + 1}
                        onClick={() => setSelectedTrend(trend)}
                      />
                    ))
                  )}
                </div>
              </section>

              {/* Right Side Cards */}
              <div className="space-y-6">
                {/* Highlight card */}
                <section className="rounded-3xl border border-[#457B9D]/30 bg-[#457B9D]/5 dark:bg-[#457B9D]/10 p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Flame size={19} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#457B9D] dark:text-sky-400">
                        Fastest rising narrative
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold text-zinc-950 dark:text-white">
                        #Performance
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-4xl font-black text-zinc-950 dark:text-white">
                          94
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          momentum score
                        </p>
                      </div>

                      <span className="flex items-center gap-1 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <ArrowUpRight size={13} />
                        +320%
                      </span>
                    </div>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div className="h-full w-[94%] rounded-full bg-[#457B9D]" />
                    </div>

                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      This topic is outpacing all other active narratives. Positive fan sentiment and verified endorsements are driving high viral velocity.
                    </p>
                  </div>
                </section>

                {/* Narrative spotlight */}
                <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        Emerging narrative
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Signal detection
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Strong cross-pollination between X sports commentary and Instagram highlights is creating an amplified feedback loop.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================================================== */}
      {/* DETAIL MODAL                                       */}
      {/* ================================================== */}
      {selectedTrend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-xs"
          onClick={() => setSelectedTrend(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl sm:p-7 text-zinc-900 dark:text-zinc-100"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#457B9D] dark:text-sky-400">
                  Topic Analysis
                </span>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl tracking-tight text-zinc-950 dark:text-white font-bold">
                  {selectedTrend.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Category: {selectedTrend.category}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTrend(null)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Close
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {selectedTrend.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Detail label="Mentions" value={selectedTrend.mentions} />
              <Detail label="Growth" value={selectedTrend.growth} />
              <Detail label="Posts" value={selectedTrend.posts} />
              <Detail label="Reach" value={selectedTrend.reach} />
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Momentum score
                </span>
                <span className="text-sm font-bold text-zinc-950 dark:text-white">
                  {selectedTrend.momentum}/100
                </span>
              </div>

              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full rounded-full bg-[#457B9D]"
                  style={{ width: `${selectedTrend.momentum}%` }}
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Active platforms
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {selectedTrend.platforms.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================== */
/* TREND STAT CARD                                    */
/* ================================================== */

function TrendStat({
  icon: Icon,
  title,
  value,
  change,
}: {
  icon: typeof Flame;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 shadow-xs transition hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md">
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
    </div>
  );
}

/* ================================================== */
/* TREND ROW                                          */
/* ================================================== */

function TrendRow({
  trend,
  rank,
  onClick,
}: {
  trend: Trend;
  rank: number;
  onClick: () => void;
}) {
  const sentimentBadges = {
    positive: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    negative: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    neutral: "bg-blue-50 dark:bg-blue-950/40 text-[#457B9D] dark:text-sky-400 border-blue-200 dark:border-blue-900/50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 sm:gap-4 px-3.5 py-3 sm:px-6 sm:py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
    >
      <span className="w-5 sm:w-6 shrink-0 text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500">
        {String(rank).padStart(2, "0")}
      </span>

      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 sm:flex">
        <Hash size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#457B9D] transition truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
            {trend.name}
          </p>
          <span className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
            {trend.category}
          </span>
          {/* Mobile growth pill */}
          <span className="inline-flex sm:hidden items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {trend.growth}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
          <span>{trend.mentions} mentions</span>
          <span>•</span>
          <span className="hidden xs:inline">{trend.posts} posts •</span>
          <span>{trend.reach} reach</span>
        </div>
      </div>

      <span
        className={`hidden rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize md:block ${
          sentimentBadges[trend.sentiment]
        }`}
      >
        {trend.sentiment}
      </span>

      <div className="hidden text-right sm:block">
        <div className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight size={14} />
          {trend.growth}
        </div>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold">
          growth
        </p>
      </div>

      <ArrowUpRight
        size={16}
        className="shrink-0 text-zinc-400 transition group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
      />
    </button>
  );
}

/* ================================================== */
/* DETAIL STAT BOX                                    */
/* ================================================== */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-3">
      <p className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-zinc-950 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}