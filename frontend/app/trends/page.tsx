"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Flame,
  Hash,
  MessageSquare,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";


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
      "Audience attention is increasing ahead of the upcoming match, with most conversations focused on timing, expectations and team announcements.",
    platforms: ["X", "Telegram"],
  },
  {
    id: 3,
    name: "#TeamSelection",
    category: "Discussion",
    mentions: "18.7K",
    growth: "+126%",
    sentiment: "negative",
    momentum: 79,
    posts: "8.9K",
    reach: "1.8M",
    description:
      "Team selection is generating mixed reactions, with negative sentiment increasing around player choices and expected lineups.",
    platforms: ["X", "Instagram"],
  },
  {
    id: 4,
    name: "#Captaincy",
    category: "Leadership",
    mentions: "12.3K",
    growth: "+89%",
    sentiment: "positive",
    momentum: 71,
    posts: "5.4K",
    reach: "1.2M",
    description:
      "Discussion around captaincy remains mostly positive, particularly around recent tactical decisions.",
    platforms: ["X", "Telegram"],
  },
  {
    id: 5,
    name: "#Batting",
    category: "Performance",
    mentions: "9.8K",
    growth: "+64%",
    sentiment: "negative",
    momentum: 63,
    posts: "4.2K",
    reach: "940K",
    description:
      "Batting consistency is receiving increased attention following recent performances.",
    platforms: ["X", "Instagram"],
  },
  {
    id: 6,
    name: "#TeamIndia",
    category: "Community",
    mentions: "8.4K",
    growth: "+52%",
    sentiment: "positive",
    momentum: 58,
    posts: "3.7K",
    reach: "810K",
    description:
      "General community conversation continues to grow across multiple social platforms.",
    platforms: ["X", "Instagram", "Telegram"],
  },
];


const categories = [
  "All",
  "Sports",
  "Events",
  "Discussion",
  "Leadership",
  "Performance",
  "Community",
];


export default function TrendsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("momentum");
  const [selectedTrend, setSelectedTrend] =
    useState<Trend | null>(null);


  const filteredTrends = useMemo(() => {
    const result = trends.filter((trend) => {
      const matchesSearch =
        trend.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        trend.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        trend.category === category;

      return matchesSearch && matchesCategory;
    });


    if (sort === "growth") {
      return [...result].sort(
        (a, b) =>
          parseInt(b.growth) -
          parseInt(a.growth)
      );
    }


    if (sort === "mentions") {
      return [...result].sort(
        (a, b) =>
          parseFloat(
            b.mentions.replace("K", "")
          ) -
          parseFloat(
            a.mentions.replace("K", "")
          )
      );
    }


    return [...result].sort(
      (a, b) => b.momentum - a.momentum
    );
  }, [search, category, sort]);


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">


      {/* ================================================== */}
      {/* BACKGROUND                                         */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="trends-glow trends-glow-one" />

        <div className="trends-glow trends-glow-two" />

      </div>


      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">

        <div className="flex h-20 items-center justify-between px-5 sm:px-8">

          <div>

            <div className="mb-1.5 flex items-center gap-2">

              <TrendingUp
                size={16}
                className="text-blue-400"
              />

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                Conversation intelligence
              </span>

            </div>


            <h1 className="font-display text-3xl tracking-wide text-white sm:text-4xl">
              Trends & Topics
            </h1>

          </div>


          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            Tracking live trends

          </div>

        </div>

      </header>


      {/* ================================================== */}
      {/* CONTENT                                            */}
      {/* ================================================== */}

      <div className="relative z-10 px-5 py-8 sm:px-8">


        {/* INTRO */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
                What is gaining attention?
              </h2>


              <p className="mt-2 max-w-3xl text-base leading-7 text-zinc-400">
                Discover fast-growing conversations,
                identify emerging narratives and understand
                what is driving audience attention across
                your connected platforms.
              </p>

            </div>


            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">

              <Activity
                size={15}
                className="text-emerald-400"
              />

              <span className="text-xs text-zinc-400">
                Updated 2 min ago
              </span>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* OVERVIEW STATS                                    */}
        {/* ================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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
        {/* SEARCH + FILTERS                                  */}
        {/* ================================================== */}

        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0b0f18]/90 p-4 sm:p-5">

          <div className="flex flex-col gap-4">

            {/* Search */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search topics or categories..."
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
              />

            </div>


            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">

              {/* Categories */}

              <div className="flex gap-1 overflow-x-auto pb-1">

                {categories.map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCategory(item)
                    }
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                      category === item
                        ? "bg-white text-black"
                        : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>


              {/* Sort */}

              <div className="relative shrink-0">

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                  className="h-10 appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-9 text-xs text-zinc-300 outline-none"
                >

                  <option
                    value="momentum"
                    className="bg-[#0b0f18]"
                  >
                    Highest momentum
                  </option>

                  <option
                    value="growth"
                    className="bg-[#0b0f18]"
                  >
                    Fastest growth
                  </option>

                  <option
                    value="mentions"
                    className="bg-[#0b0f18]"
                  >
                    Most mentions
                  </option>

                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600"
                />

              </div>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* MAIN GRID                                          */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">


          {/* TREND LIST */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90">

            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Trending now
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {filteredTrends.length} topics currently being tracked
                </p>

              </div>


              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07]">

                <Hash
                  size={17}
                  className="text-blue-400"
                />

              </div>

            </div>


            <div>

              {filteredTrends.length === 0 ? (

                <div className="px-6 py-16 text-center">

                  <Search
                    size={28}
                    className="mx-auto text-zinc-700"
                  />

                  <p className="mt-4 text-sm font-medium text-zinc-300">
                    No topics found
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Try another search or category.
                  </p>

                </div>

              ) : (

                filteredTrends.map(
                  (trend, index) => (

                    <TrendRow
                      key={trend.id}
                      trend={trend}
                      rank={index + 1}
                      onClick={() =>
                        setSelectedTrend(trend)
                      }
                    />

                  )
                )

              )}

            </div>

          </section>


          {/* RIGHT SIDE */}

          <section className="space-y-6">


            {/* TOP TREND */}

            <section className="rounded-3xl border border-blue-400/10 bg-blue-500/[0.025] p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">

                  <Flame
                    size={19}
                    className="text-orange-400"
                  />

                </div>


                <div>

                  <p className="text-xs uppercase tracking-widest text-zinc-600">
                    Fastest rising
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    #Performance
                  </h3>

                </div>

              </div>


              <div className="mt-6">

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-4xl font-semibold text-white">
                      94
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      momentum score
                    </p>

                  </div>


                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">

                    <ArrowUpRight size={13} />

                    +320%

                  </span>

                </div>


                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">

                  <div className="h-full w-[94%] rounded-full bg-blue-400" />

                </div>


                <p className="mt-5 text-sm leading-6 text-zinc-400">

                  This topic is receiving significantly
                  more attention than the previous period.
                  Positive reactions are currently driving
                  most of its growth.

                </p>

              </div>

            </section>


            {/* SENTIMENT */}

            <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Trend sentiment
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Sentiment across active topics.
                </p>

              </div>


              <div className="mt-6 space-y-5">

                <SentimentRow
                  label="Positive"
                  value="61%"
                  width="61%"
                  color="bg-emerald-400"
                />

                <SentimentRow
                  label="Neutral"
                  value="24%"
                  width="24%"
                  color="bg-zinc-500"
                />

                <SentimentRow
                  label="Negative"
                  value="15%"
                  width="15%"
                  color="bg-red-400"
                />

              </div>

            </section>


            {/* PLATFORMS */}

            <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    Where trends start
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Conversation sources
                  </p>

                </div>

                <BarChart3
                  size={18}
                  className="text-zinc-600"
                />

              </div>


              <div className="mt-5 space-y-4">

                <PlatformRow
                  name="X"
                  value="48%"
                  width="48%"
                />

                <PlatformRow
                  name="Instagram"
                  value="27%"
                  width="27%"
                />

                <PlatformRow
                  name="Telegram"
                  value="17%"
                  width="17%"
                />

                <PlatformRow
                  name="YouTube"
                  value="8%"
                  width="8%"
                />

              </div>

            </section>

          </section>

        </section>


        {/* ================================================== */}
        {/* EMERGING NARRATIVES                               */}
        {/* ================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h3 className="font-display text-xl tracking-wide text-white">
                Emerging narratives
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Topics that are not yet dominant but are gaining momentum.
              </p>

            </div>


            <span className="text-xs text-zinc-600">
              Early signal detection
            </span>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <Narrative
              title="Player consistency"
              growth="+74%"
              description="Increasing discussion around consistency across recent matches."
            />

            <Narrative
              title="Lineup predictions"
              growth="+61%"
              description="Audience speculation around possible lineup changes."
            />

            <Narrative
              title="Leadership decisions"
              growth="+48%"
              description="Growing conversation around tactical and captaincy decisions."
            />

          </div>

        </section>


        {/* ================================================== */}
        {/* STATUS                                             */}
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
                  Trend detection active
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  New conversations are continuously being evaluated.
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-emerald-400">
                Monitoring live
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* ================================================== */}
      {/* DETAIL MODAL                                       */}
      {/* ================================================== */}

      {selectedTrend && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          onClick={() =>
            setSelectedTrend(null)
          }
        >

          <div
            className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-[#0d121c] p-6 shadow-2xl sm:p-7"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start justify-between">

              <div>

                <span className="text-xs uppercase tracking-widest text-blue-400">
                  Topic analysis
                </span>

                <h3 className="mt-2 font-display text-3xl tracking-wide text-white">
                  {selectedTrend.name}
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                  {selectedTrend.category}
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedTrend(null)
                }
                className="rounded-lg px-3 py-2 text-xs text-zinc-500 hover:bg-white/[0.05] hover:text-white"
              >
                Close
              </button>

            </div>


            <p className="mt-7 text-sm leading-7 text-zinc-400">
              {selectedTrend.description}
            </p>


            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <Detail
                label="Mentions"
                value={selectedTrend.mentions}
              />

              <Detail
                label="Growth"
                value={selectedTrend.growth}
              />

              <Detail
                label="Posts"
                value={selectedTrend.posts}
              />

              <Detail
                label="Reach"
                value={selectedTrend.reach}
              />

            </div>


            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

              <div className="flex items-center justify-between">

                <span className="text-xs text-zinc-500">
                  Momentum
                </span>

                <span className="text-sm font-semibold text-white">
                  {selectedTrend.momentum}/100
                </span>

              </div>


              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                <div
                  className="h-full rounded-full bg-blue-400"
                  style={{
                    width: `${selectedTrend.momentum}%`,
                  }}
                />

              </div>

            </div>


            <div className="mt-6">

              <p className="text-xs text-zinc-600">
                Active platforms
              </p>


              <div className="mt-3 flex flex-wrap gap-2">

                {selectedTrend.platforms.map(
                  (item) => (

                    <span
                      key={item}
                      className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-zinc-400"
                    >
                      {item}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ================================================== */}
      {/* ANIMATION                                         */}
      {/* ================================================== */}

      <style jsx>{`
        .trends-glow {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(110px);
        }

        .trends-glow-one {
          width: 620px;
          height: 280px;
          left: 25%;
          top: 90px;
          background: rgba(59, 130, 246, 0.035);
          animation: trendsMoveOne 13s ease-in-out infinite;
        }

        .trends-glow-two {
          width: 440px;
          height: 260px;
          right: -90px;
          top: 48%;
          background: rgba(139, 92, 246, 0.025);
          animation: trendsMoveTwo 16s ease-in-out infinite;
        }

        @keyframes trendsMoveOne {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(70px, 35px) scale(1.1);
          }
        }

        @keyframes trendsMoveTwo {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-55px, -30px) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trends-glow {
            animation: none;
          }
        }
      `}</style>

    </main>
  );
}


/* ================================================== */
/* TREND STAT                                         */
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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/[0.13] hover:bg-white/[0.04]">

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.07]">

          <Icon
            size={18}
            className="text-blue-400"
          />

        </div>


        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">

          <ArrowUpRight size={13} />

          {change}

        </span>

      </div>


      <p className="mt-5 text-sm text-zinc-500">
        {title}
      </p>

      {/* Normal UI font for numbers */}

      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
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
  const sentimentStyles = {
    positive:
      "bg-emerald-500/10 text-emerald-400",
    negative:
      "bg-red-500/10 text-red-400",
    neutral:
      "bg-zinc-500/10 text-zinc-400",
  };


  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 border-b border-white/[0.06] px-5 py-5 text-left transition hover:bg-white/[0.025] sm:px-6"
    >

      {/* Rank */}

      <span className="w-7 shrink-0 text-sm font-medium text-zinc-700">
        {String(rank).padStart(2, "0")}
      </span>


      {/* Icon */}

      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.035] sm:flex">

        <Hash
          size={17}
          className="text-zinc-500"
        />

      </div>


      {/* Main */}

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <p className="text-sm font-semibold text-zinc-200">
            {trend.name}
          </p>


          <span className="rounded-full bg-white/[0.04] px-2 py-1 text-[10px] text-zinc-600">
            {trend.category}
          </span>

        </div>


        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-600">

          <span>
            {trend.mentions} mentions
          </span>

          <span>
            {trend.posts} posts
          </span>

          <span>
            {trend.reach} reach
          </span>

        </div>

      </div>


      {/* Sentiment */}

      <span
        className={`hidden rounded-full px-2.5 py-1 text-[10px] font-medium capitalize md:block ${sentimentStyles[trend.sentiment]}`}
      >
        {trend.sentiment}
      </span>


      {/* Growth */}

      <div className="hidden text-right sm:block">

        <div className="flex items-center justify-end gap-1 text-sm font-semibold text-emerald-400">

          <ArrowUpRight size={14} />

          {trend.growth}

        </div>

        <p className="mt-1 text-[10px] text-zinc-700">
          growth
        </p>

      </div>


      <ArrowUpRight
        size={17}
        className="shrink-0 text-zinc-700 transition group-hover:text-zinc-300"
      />

    </button>
  );
}


/* ================================================== */
/* SENTIMENT ROW                                      */
/* ================================================== */

function SentimentRow({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: string;
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
            width,
          }}
        />

      </div>

    </div>
  );
}


/* ================================================== */
/* PLATFORM ROW                                       */
/* ================================================== */

function PlatformRow({
  name,
  value,
  width,
}: {
  name: string;
  value: string;
  width: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          {name}
        </span>

        <span className="text-xs text-zinc-500">
          {value}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full bg-blue-400/70"
          style={{
            width,
          }}
        />

      </div>

    </div>
  );
}


/* ================================================== */
/* NARRATIVE                                          */
/* ================================================== */

function Narrative({
  title,
  growth,
  description,
}: {
  title: string;
  growth: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/[0.1] hover:bg-white/[0.035]">

      <div className="flex items-start justify-between gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07]">

          <Zap
            size={16}
            className="text-blue-400"
          />

        </div>


        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">

          <ArrowUpRight size={13} />

          {growth}

        </span>

      </div>


      <h4 className="mt-5 text-sm font-semibold text-zinc-200">
        {title}
      </h4>


      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>

    </div>
  );
}


/* ================================================== */
/* DETAIL                                             */
/* ================================================== */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">

      <p className="text-[11px] text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-zinc-200">
        {value}
      </p>

    </div>
  );
}