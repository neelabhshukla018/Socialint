"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  ArrowDownRight,
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
  {
    name: "India",
    audience: "38.4%",
    people: "323K",
    width: "38%",
  },
  {
    name: "United States",
    audience: "18.7%",
    people: "157K",
    width: "19%",
  },
  {
    name: "United Kingdom",
    audience: "11.3%",
    people: "95K",
    width: "11%",
  },
  {
    name: "Australia",
    audience: "8.9%",
    people: "75K",
    width: "9%",
  },
  {
    name: "Other",
    audience: "22.7%",
    people: "192K",
    width: "23%",
  },
];


const interests = [
  {
    name: "Cricket",
    percentage: "72%",
    width: "72%",
  },
  {
    name: "Sports",
    percentage: "64%",
    width: "64%",
  },
  {
    name: "Entertainment",
    percentage: "48%",
    width: "48%",
  },
  {
    name: "Technology",
    percentage: "31%",
    width: "31%",
  },
  {
    name: "News",
    percentage: "27%",
    width: "27%",
  },
];


const ageGroups = [
  {
    name: "18–24",
    value: "24%",
    width: "24%",
  },
  {
    name: "25–34",
    value: "38%",
    width: "38%",
  },
  {
    name: "35–44",
    value: "22%",
    width: "22%",
  },
  {
    name: "45–54",
    value: "11%",
    width: "11%",
  },
  {
    name: "55+",
    value: "5%",
    width: "5%",
  },
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
  const [segment, setSegment] =
    useState<Segment>("all");

  const [search, setSearch] = useState("");

  const data = audienceData[segment];


  const filteredLocations = useMemo(() => {
    return locations.filter((location) =>
      location.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">


      {/* ================================================== */}
      {/* BACKGROUND                                         */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="audience-glow audience-glow-one" />

        <div className="audience-glow audience-glow-two" />

      </div>


      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">

        <div className="flex h-20 items-center justify-between px-5 sm:px-8">

          <div>

            <div className="mb-1.5 flex items-center gap-2">

              <Users
                size={16}
                className="text-blue-400"
              />

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                Audience intelligence
              </span>

            </div>


            <h1 className="font-display text-3xl tracking-wide text-white sm:text-4xl">
              Audience Insights
            </h1>

          </div>


          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            Audience tracking live

          </div>

        </div>

      </header>


      {/* ================================================== */}
      {/* CONTENT                                            */}
      {/* ================================================== */}

      <div className="relative z-10 px-5 py-8 sm:px-8">


        {/* ================================================== */}
        {/* INTRO                                             */}
        {/* ================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
                Understand your audience
              </h2>

              <p className="mt-2 max-w-3xl text-base leading-7 text-zinc-400">
                Understand who is engaging with the
                conversation, where they are located,
                what they care about and how their
                behaviour is changing over time.
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
        {/* SEGMENT SELECTOR                                  */}
        {/* ================================================== */}

        <section className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:flex-row sm:items-center">

          <div>

            <p className="text-xs uppercase tracking-widest text-zinc-600">
              Audience segment
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              Change the audience group being analysed.
            </p>

          </div>


          <div className="flex gap-1 overflow-x-auto rounded-xl bg-black/20 p-1">

            <SegmentButton
              active={segment === "all"}
              onClick={() => setSegment("all")}
            >
              All audience
            </SegmentButton>

            <SegmentButton
              active={segment === "followers"}
              onClick={() => setSegment("followers")}
            >
              Followers
            </SegmentButton>

            <SegmentButton
              active={segment === "engaged"}
              onClick={() => setSegment("engaged")}
            >
              Highly engaged
            </SegmentButton>

            <SegmentButton
              active={segment === "new"}
              onClick={() => setSegment("new")}
            >
              New audience
            </SegmentButton>

          </div>

        </section>


        {/* ================================================== */}
        {/* TOP STATS                                         */}
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
        {/* AUDIENCE PROFILE + ACTIVITY                       */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.45fr]">


          {/* PROFILE */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Audience profile
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Demographic distribution
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.07]">

                <Users
                  size={18}
                  className="text-blue-400"
                />

              </div>

            </div>


            {/* AGE */}

            <div className="mt-7">

              <div className="flex items-center justify-between">

                <p className="text-sm font-medium text-zinc-300">
                  Age distribution
                </p>

                <span className="text-xs text-zinc-600">
                  Share
                </span>

              </div>


              <div className="mt-5 space-y-4">

                {ageGroups.map((age) => (

                  <div key={age.name}>

                    <div className="mb-2 flex justify-between">

                      <span className="text-xs text-zinc-500">
                        {age.name}
                      </span>

                      <span className="text-xs text-zinc-400">
                        {age.value}
                      </span>

                    </div>


                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                      <div
                        className="h-full rounded-full bg-blue-400/70"
                        style={{
                          width: age.width,
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* GENDER */}

            <div className="mt-8 border-t border-white/[0.06] pt-6">

              <div className="flex items-center justify-between">

                <p className="text-sm font-medium text-zinc-300">
                  Audience gender
                </p>

                <span className="text-xs text-zinc-600">
                  Estimated
                </span>

              </div>


              <div className="mt-5 grid grid-cols-3 gap-3">

                <GenderCard
                  label="Men"
                  value="67%"
                />

                <GenderCard
                  label="Women"
                  value="31%"
                />

                <GenderCard
                  label="Other"
                  value="2%"
                />

              </div>

            </div>

          </section>


          {/* ACTIVITY */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Audience activity
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Relative engagement activity over the last 7 days
                </p>

              </div>


              <div className="rounded-xl bg-emerald-500/10 p-2.5">

                <BarChart3
                  size={18}
                  className="text-emerald-400"
                />

              </div>

            </div>


            <div className="mt-8 flex h-[270px] items-end gap-3 sm:gap-5">

              {activityData.map((item) => (

                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col justify-end"
                >

                  <div className="mb-3 text-center text-[10px] text-zinc-600">
                    {item.value}
                  </div>


                  <div className="flex h-[190px] items-end">

                    <div
                      className="w-full rounded-t-xl bg-blue-400/50 transition-all duration-300 hover:bg-blue-400/70"
                      style={{
                        height: `${item.value}%`,
                      }}
                    />

                  </div>


                  <div className="mt-3 text-center text-xs text-zinc-600">
                    {item.day}
                  </div>

                </div>

              ))}

            </div>


            <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

              <Sparkles
                size={15}
                className="text-blue-400"
              />

              <p className="text-xs leading-5 text-zinc-500">

                Saturday currently has the highest
                audience activity.

              </p>

            </div>

          </section>

        </section>


        {/* ================================================== */}
        {/* LOCATION + INTERESTS                              */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">


          {/* LOCATIONS */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Audience locations
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Where the conversation is coming from
                </p>

              </div>


              <MapPin
                size={19}
                className="text-zinc-600"
              />

            </div>


            {/* SEARCH */}

            <div className="relative mt-5">

              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search location..."
                className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-blue-400/30"
              />

            </div>


            <div className="mt-5 space-y-5">

              {filteredLocations.map(
                (location) => (

                  <div key={location.name}>

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm text-zinc-400">
                        {location.name}
                      </span>

                      <div className="flex gap-2">

                        <span className="text-xs text-zinc-600">
                          {location.people}
                        </span>

                        <span className="text-xs font-medium text-zinc-300">
                          {location.audience}
                        </span>

                      </div>

                    </div>


                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                      <div
                        className="h-full rounded-full bg-blue-400/60"
                        style={{
                          width: location.width,
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* INTERESTS */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Audience interests
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Topics your audience interacts with
                </p>

              </div>


              <Zap
                size={19}
                className="text-zinc-600"
              />

            </div>


            <div className="mt-7 space-y-6">

              {interests.map((interest) => (

                <div key={interest.name}>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm text-zinc-400">
                      {interest.name}
                    </span>

                    <span className="text-xs text-zinc-500">
                      {interest.percentage}
                    </span>

                  </div>


                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                    <div
                      className="h-full rounded-full bg-purple-400/60"
                      style={{
                        width: interest.width,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>


            <div className="mt-7 rounded-2xl border border-purple-400/10 bg-purple-400/[0.025] p-4">

              <div className="flex gap-3">

                <Sparkles
                  size={17}
                  className="mt-0.5 shrink-0 text-purple-400"
                />

                <div>

                  <p className="text-sm font-medium text-zinc-300">
                    Strongest interest
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Cricket is currently the strongest
                    shared interest among the analysed
                    audience.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </section>


        {/* ================================================== */}
        {/* AUDIENCE BEHAVIOUR                                */}
        {/* ================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <div className="flex items-center gap-2">

                <Activity
                  size={17}
                  className="text-blue-400"
                />

                <h3 className="text-lg font-semibold text-white">
                  Audience behaviour
                </h3>

              </div>

              <p className="mt-1 text-sm text-zinc-500">
                How people interact with the monitored profile.
              </p>

            </div>


            <span className="text-xs text-zinc-600">
              Last 7 days
            </span>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <BehaviourCard
              icon={MessageCircle}
              title="Conversation"
              value="42.8K"
              description="people actively discussing"
              change="+18.6%"
            />

            <BehaviourCard
              icon={Heart}
              title="Positive reactions"
              value="68.4%"
              description="of analysed interactions"
              change="+6.2%"
            />

            <BehaviourCard
              icon={Zap}
              title="High-intent users"
              value="18.7K"
              description="showing repeated engagement"
              change="+24.8%"
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
                  Audience analysis active
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Demographics and behaviour are being continuously analysed.
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
      {/* ANIMATION                                         */}
      {/* ================================================== */}

      <style jsx>{`

        .audience-glow {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(110px);
        }

        .audience-glow-one {
          width: 620px;
          height: 280px;
          left: 20%;
          top: 100px;
          background: rgba(59, 130, 246, 0.035);
          animation: audienceMoveOne 14s ease-in-out infinite;
        }

        .audience-glow-two {
          width: 480px;
          height: 260px;
          right: -100px;
          top: 55%;
          background: rgba(139, 92, 246, 0.025);
          animation: audienceMoveTwo 17s ease-in-out infinite;
        }

        @keyframes audienceMoveOne {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(65px, 40px) scale(1.1);
          }
        }

        @keyframes audienceMoveTwo {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-60px, -35px) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .audience-glow {
            animation: none;
          }
        }

      `}</style>

    </main>
  );
}


/* ================================================== */
/* SEGMENT BUTTON                                     */
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
      className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
        active
          ? "bg-white text-black"
          : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}


/* ================================================== */
/* AUDIENCE STAT                                      */
/* ================================================== */

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


      {/* Number intentionally uses normal UI font */}

      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>

    </div>
  );
}


/* ================================================== */
/* GENDER CARD                                        */
/* ================================================== */

function GenderCard({
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

      <p className="mt-1 text-lg font-semibold text-zinc-200">
        {value}
      </p>

    </div>
  );
}


/* ================================================== */
/* BEHAVIOUR CARD                                     */
/* ================================================== */

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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/[0.1]">

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">

          <Icon
            size={17}
            className="text-zinc-400"
          />

        </div>


        <span className="flex items-center gap-1 text-xs text-emerald-400">

          <ArrowUpRight size={12} />

          {change}

        </span>

      </div>


      <p className="mt-5 text-sm text-zinc-500">
        {title}
      </p>


      <p className="mt-1 text-2xl font-semibold text-white">
        {value}
      </p>


      <p className="mt-2 text-xs text-zinc-600">
        {description}
      </p>

    </div>
  );
}