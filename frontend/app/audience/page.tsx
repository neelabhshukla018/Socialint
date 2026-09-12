"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Globe2,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

type Segment = "all" | "followers" | "engaged" | "new";

const audienceData = {
  all: {
    people: "842.6K",
    growth: "+18.4%",
    engagement: "68.7%",
    engagementGrowth: "+9.2%",
    active: "124.8K",
    activeGrowth: "+14.6%",
    reach: "14.8M",
    reachGrowth: "+21.3%",
  },
  followers: {
    people: "512.4K",
    growth: "+12.8%",
    engagement: "61.4%",
    engagementGrowth: "+6.7%",
    active: "72.6K",
    activeGrowth: "+9.4%",
    reach: "8.2M",
    reachGrowth: "+16.2%",
  },
  engaged: {
    people: "184.7K",
    growth: "+26.4%",
    engagement: "82.6%",
    engagementGrowth: "+14.8%",
    active: "96.3K",
    activeGrowth: "+21.7%",
    reach: "5.7M",
    reachGrowth: "+28.4%",
  },
  new: {
    people: "145.5K",
    growth: "+34.8%",
    engagement: "54.2%",
    engagementGrowth: "+11.3%",
    active: "38.9K",
    activeGrowth: "+27.4%",
    reach: "3.1M",
    reachGrowth: "+31.6%",
  },
};

const locations = [
  { name: "India", audience: "38.4%", people: "323K", width: "38%" },
  { name: "United States", audience: "18.7%", people: "157K", width: "19%" },
  { name: "United Kingdom", audience: "11.3%", people: "95K", width: "11%" },
  { name: "Australia", audience: "8.9%", people: "75K", width: "9%" },
  { name: "Other", audience: "22.7%", people: "192K", width: "23%" },
];

const interests = [
  { name: "Cricket", percentage: "72%", width: "72%" },
  { name: "Sports", percentage: "64%", width: "64%" },
  { name: "Entertainment", percentage: "48%", width: "48%" },
  { name: "Technology", percentage: "31%", width: "31%" },
  { name: "News", percentage: "27%", width: "27%" },
];

const ageGroups = [
  { name: "18–24", value: "24%", width: "24%" },
  { name: "25–34", value: "38%", width: "38%" },
  { name: "35–44", value: "22%", width: "22%" },
  { name: "45–54", value: "11%", width: "11%" },
  { name: "55+", value: "5%", width: "5%" },
];

const activityData = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 74 },
  { day: "Wed", value: 58 },
  { day: "Thu", value: 82 },
  { day: "Fri", value: 69 },
  { day: "Sat", value: 91 },
  { day: "Sun", value: 76 },
];

export default function AudiencePage() {
  const [segment, setSegment] = useState<Segment>("all");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const data = audienceData[segment];

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080b12] bg-grid-dashboard text-zinc-900 dark:text-zinc-100 selection:bg-[#457B9D]/20 transition-colors duration-150">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="lg:ml-[270px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <div className="p-4 sm:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* ================================================== */}
            {/* HEADER                                             */}
            {/* ================================================== */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Users size={16} className="text-[#457B9D]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#457B9D]">
                    Audience Intelligence
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-zinc-50">
                  Audience Insights
                </h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Analyze who is engaging with your monitored profiles, where they are located, and what content drives resonance.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Audience tracking live
              </div>
            </div>

            {/* ================================================== */}
            {/* SEGMENT SELECTOR                                  */}
            {/* ================================================== */}
            <section className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 shadow-xs sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Audience segment
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Filter by cohort or engagement level.
                </p>
              </div>

              <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-1">
                <SegmentButton active={segment === "all"} onClick={() => setSegment("all")}>
                  All audience
                </SegmentButton>
                <SegmentButton active={segment === "followers"} onClick={() => setSegment("followers")}>
                  Followers
                </SegmentButton>
                <SegmentButton active={segment === "engaged"} onClick={() => setSegment("engaged")}>
                  Highly engaged
                </SegmentButton>
                <SegmentButton active={segment === "new"} onClick={() => setSegment("new")}>
                  New audience
                </SegmentButton>
              </div>
            </section>

            {/* ================================================== */}
            {/* OVERVIEW STATS                                    */}
            {/* ================================================== */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AudienceStat
                icon={Users}
                title="People reached"
                value={data.people}
                change={data.growth}
              />
              <AudienceStat
                icon={Heart}
                title="Engagement rate"
                value={data.engagement}
                change={data.engagementGrowth}
              />
              <AudienceStat
                icon={MessageCircle}
                title="Active audience"
                value={data.active}
                change={data.activeGrowth}
              />
              <AudienceStat
                icon={Globe2}
                title="Estimated reach"
                value={data.reach}
                change={data.reachGrowth}
              />
            </section>

            {/* ================================================== */}
            {/* DEMOGRAPHICS + ACTIVITY                           */}
            {/* ================================================== */}
            <div className="grid gap-6 xl:grid-cols-[1fr_1.45fr]">
              {/* Demographics */}
              <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Audience profile
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      Demographic distribution
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                    <Users size={17} />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <span>Age distribution</span>
                    <span>Share</span>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    {ageGroups.map((age) => (
                      <div key={age.name}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{age.name}</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">{age.value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-[#457B9D]"
                            style={{ width: age.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender breakdown */}
                <div className="mt-7 border-t border-zinc-100 dark:border-zinc-800 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Gender estimation
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2.5">
                    <GenderCard label="Men" value="67%" />
                    <GenderCard label="Women" value="31%" />
                    <GenderCard label="Other" value="2%" />
                  </div>
                </div>
              </section>

              {/* Weekly Activity */}
              <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Activity by day
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      Relative conversation volume
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <BarChart3 size={17} />
                  </div>
                </div>

                <div className="mt-8 flex h-[230px] items-end gap-2.5 sm:gap-4">
                  {activityData.map((item) => (
                    <div key={item.day} className="flex h-full flex-1 flex-col justify-end">
                      <span className="mb-2 text-center text-[11px] font-semibold text-zinc-400">
                        {item.value}
                      </span>
                      <div className="flex h-[170px] items-end">
                        <div
                          className="w-full rounded-t-lg bg-[#457B9D]/80 transition-all duration-300 hover:bg-[#457B9D]"
                          style={{ height: `${item.value}%` }}
                        />
                      </div>
                      <span className="mt-2 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/30 p-3">
                  <Sparkles size={15} className="text-[#457B9D] shrink-0" />
                  <p className="text-xs text-blue-900 dark:text-blue-300 font-medium">
                    Saturday generated the highest interaction intensity across all platforms.
                  </p>
                </div>
              </section>
            </div>

            {/* ================================================== */}
            {/* LOCATIONS & INTERESTS                              */}
            {/* ================================================== */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Locations */}
              <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Audience locations
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      Geographic distribution of engagement
                    </p>
                  </div>
                  <MapPin size={18} className="text-zinc-400" />
                </div>

                <div className="relative mt-4">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Filter country or region..."
                    className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 pl-10 pr-4 text-xs text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 focus:border-[#457B9D] focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>

                <div className="mt-5 space-y-4">
                  {filteredLocations.map((loc) => (
                    <div key={loc.name}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{loc.name}</span>
                        <div className="flex gap-2">
                          <span className="text-zinc-500 dark:text-zinc-400">{loc.people}</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">{loc.audience}</span>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-[#457B9D]"
                          style={{ width: loc.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Interests */}
              <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Audience interests
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      Affinity categories and discussion topics
                    </p>
                  </div>
                  <Zap size={18} className="text-amber-500" />
                </div>

                <div className="mt-6 space-y-4">
                  {interests.map((interest) => (
                    <div key={interest.name}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{interest.name}</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{interest.percentage}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-[#457B9D]"
                          style={{ width: interest.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/30 p-4">
                  <div className="flex gap-3">
                    <Sparkles size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Dominant shared affinity
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                        Cricket and athletic performance continue to represent over 70% of conversation touchpoints.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ================================================== */}
            {/* AUDIENCE BEHAVIOUR CARDS                           */}
            {/* ================================================== */}
            <section className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2">
                <Activity size={17} className="text-[#457B9D]" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Engagement behavior
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Key patterns over the last 7 days
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <BehaviourCard
                  icon={MessageCircle}
                  title="Conversation"
                  value="42.8K"
                  description="people actively contributing comments"
                  change="+18.6%"
                />
                <BehaviourCard
                  icon={Heart}
                  title="Positive reactions"
                  value="68.4%"
                  description="of all analyzed responses"
                  change="+6.2%"
                />
                <BehaviourCard
                  icon={Zap}
                  title="High-intent users"
                  value="18.7K"
                  description="demonstrating recurring engagement"
                  change="+24.8%"
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
/* SUBCOMPONENTS                                      */
/* ================================================== */

function SegmentButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-[#457B9D] text-white shadow-xs"
          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/50"
      }`}
    >
      {children}
    </button>
  );
}

function AudienceStat({
  icon: Icon,
  title,
  value,
  change,
}: {
  icon: typeof Users;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 shadow-xs transition hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md">
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

      <p className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}

function GenderCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/50 p-3 text-center">
      <p className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-0.5 text-base font-extrabold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}

function BehaviourCard({
  icon: Icon,
  title,
  value,
  description,
  change,
}: {
  icon: typeof MessageCircle;
  title: string;
  value: string;
  description: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 p-5 transition hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800/60 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
          <Icon size={17} />
        </div>

        <span className="flex items-center gap-1 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <ArrowUpRight size={12} />
          {change}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </p>

      <p className="mt-1 text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}