"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  MessageSquare,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
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

import { useApi } from "@/src/lib/api";

/* =========================================================
   TYPES
   ========================================================= */

type SentimentLabel =
  | "POSITIVE"
  | "NEGATIVE"
  | "NEUTRAL";

interface SentimentDistributionItem {
  label: SentimentLabel;
  count: number;
  percentage: number;
}

interface SentimentOverTimeItem {
  date: string | null;
  sentiment: SentimentLabel;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
}

interface EngagementOverTimeItem {
  date: string | null;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement: number;
}

interface DashboardOverview {
  totalPosts: number;

  positivePosts: number;
  negativePosts: number;
  neutralPosts: number;

  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;

  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;

  totalEngagement: number;

  averageSentimentScore: number;

  highImpactPosts: number;
}

interface DashboardPost {
  id: number;
  externalId: string | null;

  authorName: string | null;
  authorHandle: string | null;

  content: string | null;

  url: string | null;

  postType: string;

  likes: number;
  comments: number;
  shares: number;
  views: number;

  sentiment: SentimentLabel;

  sentimentScore: number | null;

  publishedAt: string | null;
}

interface DashboardData {
  overview: DashboardOverview;
  sentimentDistribution: SentimentDistributionItem[];
  sentimentOverTime: SentimentOverTimeItem[];
  engagementOverTime: EngagementOverTimeItem[];
  posts: DashboardPost[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function formatCompactNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return formatNumber(value);
}

function formatPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(1)}%`;
}

function formatDate(date: string | null) {
  if (!date) {
    return "Unknown";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* =========================================================
   SENTIMENT COLORS
   ========================================================= */

const SENTIMENT_COLORS = {
  POSITIVE: "#34d399",
  NEUTRAL: "#71717a",
  NEGATIVE: "#f87171",
};

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function AnalyticsPage() {
  const { getPostAnalysisDashboard } = useApi();

  const [range, setRange] = useState<
    "7d" | "30d"
  >("7d");

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [profileId, setProfileId] =
    useState<number | null>(null);

  /* =======================================================
     FIND ACTIVE PROFILE
     ======================================================= */

  useEffect(() => {
    try {
      const possibleKeys = [
        "profileId",
        "activeProfileId",
        "selectedProfileId",
        "monitoringProfileId",
      ];

      let foundId: number | null = null;

      for (const key of possibleKeys) {
        const value =
          window.localStorage.getItem(key);

        if (!value) {
          continue;
        }

        const parsed = Number(value);

        if (
          Number.isFinite(parsed) &&
          parsed > 0
        ) {
          foundId = parsed;
          break;
        }
      }

      /*
       * If your dashboard stores the active
       * profile using one of the above keys,
       * it will automatically be picked up.
       */
      setProfileId(foundId);
    } catch (err) {
      console.error(
        "Could not read profile ID:",
        err
      );
    }
  }, []);

  /* =======================================================
     LOAD ANALYTICS
     ======================================================= */

  const loadAnalytics = async (
    showRefresh = false
  ) => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response =
        await getPostAnalysisDashboard(
          profileId
        ) as ApiResponse<DashboardData>;

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to load analytics."
        );
      }

      setDashboard(response.data);
    } catch (err) {
      console.error(
        "Analytics loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [profileId]);

  /* =======================================================
     FILTER DATE RANGE
     ======================================================= */

  const filteredEngagement =
    useMemo(() => {
      if (!dashboard) {
        return [];
      }

      const records =
        dashboard.engagementOverTime || [];

      if (range === "30d") {
        return records;
      }

      const cutoff =
        new Date();

      cutoff.setDate(
        cutoff.getDate() - 7
      );

      return records.filter((item) => {
        if (!item.date) {
          return true;
        }

        const date =
          new Date(item.date);

        return date >= cutoff;
      });
    }, [dashboard, range]);

  /* =======================================================
     FILTER SENTIMENT TREND
     ======================================================= */

  const filteredSentiment =
    useMemo(() => {
      if (!dashboard) {
        return [];
      }

      const records =
        dashboard.sentimentOverTime || [];

      if (range === "30d") {
        return records;
      }

      const cutoff =
        new Date();

      cutoff.setDate(
        cutoff.getDate() - 7
      );

      return records.filter((item) => {
        if (!item.date) {
          return true;
        }

        const date =
          new Date(item.date);

        return date >= cutoff;
      });
    }, [dashboard, range]);

  /* =======================================================
     SENTIMENT DATA
     ======================================================= */

  const sentimentData =
    useMemo(() => {
      if (!dashboard) {
        return [];
      }

      const distribution =
        dashboard.sentimentDistribution || [];

      return distribution.map(
        (item) => ({
          name:
            item.label.charAt(0) +
            item.label
              .slice(1)
              .toLowerCase(),

          value:
            Number(item.percentage) || 0,

          count:
            Number(item.count) || 0,

          label: item.label,
        })
      );
    }, [dashboard]);

  /* =======================================================
     SENTIMENT SUMMARY
     ======================================================= */

  const sentimentSummary =
    useMemo(() => {
      if (!dashboard) {
        return {
          positive: 0,
          neutral: 0,
          negative: 0,
        };
      }

      return {
        positive:
          Number(
            dashboard.overview
              .positivePercentage
          ) || 0,

        neutral:
          Number(
            dashboard.overview
              .neutralPercentage
          ) || 0,

        negative:
          Number(
            dashboard.overview
              .negativePercentage
          ) || 0,
      };
    }, [dashboard]);

  /* =======================================================
     SENTIMENT TREND DATA
     ======================================================= */

  const sentimentChartData =
    useMemo(() => {
      return filteredSentiment.map(
        (item) => ({
          date: formatDate(
            item.date
          ),

          positive:
            Number(item.positive) || 0,

          neutral:
            Number(item.neutral) || 0,

          negative:
            Number(item.negative) || 0,
        })
      );
    }, [filteredSentiment]);

  /* =======================================================
     ENGAGEMENT CHART DATA
     ======================================================= */

  const engagementChartData =
    useMemo(() => {
      return filteredEngagement.map(
        (item) => ({
          date: formatDate(
            item.date
          ),

          likes:
            Number(item.likes) || 0,

          comments:
            Number(item.comments) || 0,

          shares:
            Number(item.shares) || 0,

          views:
            Number(item.views) || 0,

          engagement:
            Number(item.engagement) || 0,
        })
      );
    }, [filteredEngagement]);

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] text-white">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-blue-400"
            size={32}
          />

          <p className="mt-4 text-sm text-zinc-400">
            Loading analytics...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     NO PROFILE
     ======================================================= */

  if (!profileId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-6 text-white">
        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-[#0b0f18] p-8 text-center">
          <AlertCircle
            size={36}
            className="mx-auto text-yellow-400"
          />

          <h1 className="mt-5 text-xl font-semibold">
            No monitoring profile selected
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Select or create a monitoring
            profile first. Analytics will
            appear here once your profile
            has analyzed posts.
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-6 text-white">
        <div className="max-w-lg rounded-3xl border border-red-500/20 bg-[#0b0f18] p-8 text-center">
          <AlertCircle
            size={38}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-5 text-xl font-semibold">
            Analytics could not be loaded
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadAnalytics(true)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     EMPTY DATA
     ======================================================= */

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] text-white">
        <p className="text-zinc-500">
          No analytics data available.
        </p>
      </main>
    );
  }

  const overview =
    dashboard.overview;

  const positivePercentage =
    sentimentSummary.positive;

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="analytics-glow analytics-glow-one" />

        <div className="analytics-glow analytics-glow-two" />

      </div>

      {/* =====================================================
          HEADER
          ===================================================== */}

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

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                loadAnalytics(true)
              }
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.08] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <select
              value={range}
              onChange={(event) =>
                setRange(
                  event.target.value as
                    | "7d"
                    | "30d"
                )
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

        </div>

      </header>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="relative z-10 px-5 py-8 sm:px-8">

        {/* ===================================================
            INTRO
            =================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
                Audience performance
              </h2>

              <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-400">
                Real analytics from your
                analyzed social media posts.
                Track engagement and audience
                sentiment over time.
              </p>

            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              Live analytics

            </div>

          </div>

        </section>

        {/* ===================================================
            STATISTICS
            =================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <AnalyticsCard
            icon={MessageSquare}
            title="Analyzed posts"
            value={formatCompactNumber(
              overview.totalPosts
            )}
            description="posts analyzed"
          />

          <AnalyticsCard
            icon={Users}
            title="Total comments"
            value={formatCompactNumber(
              overview.totalComments
            )}
            description="comments captured"
          />

          <AnalyticsCard
            icon={Zap}
            title="Total engagement"
            value={formatCompactNumber(
              overview.totalEngagement
            )}
            description="likes + comments + shares + views"
          />

          <AnalyticsCard
            icon={Activity}
            title="Positive sentiment"
            value={formatPercentage(
              positivePercentage
            )}
            description="positive analyzed content"
          />

        </section>

        {/* ===================================================
            ENGAGEMENT + SENTIMENT
            =================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">

          {/* =================================================
              ENGAGEMENT GRAPH
              ================================================= */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Engagement trend
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Real engagement collected
                  from analyzed posts.
                </p>

              </div>

              <TrendingUp
                size={20}
                className="text-emerald-400"
              />

            </div>

            <div className="mt-8 h-[350px]">

              {engagementChartData.length ===
              0 ? (
                <EmptyChart
                  text="No engagement history available yet."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={
                      engagementChartData
                    }
                  >

                    <defs>

                      <linearGradient
                        id="engagementGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#60a5fa"
                          stopOpacity={0.25}
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
                      dataKey="date"
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
                          "12px",
                        color: "#fff",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke="#60a5fa"
                      strokeWidth={2.5}
                      fill="url(#engagementGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>
              )}

            </div>

          </section>

          {/* =================================================
              SENTIMENT PIE
              ================================================= */}

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

              {sentimentData.length ===
              0 ? (
                <EmptyChart
                  text="No sentiment data available."
                />
              ) : (
                <>

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={
                          sentimentData
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={78}
                        outerRadius={105}
                        paddingAngle={3}
                        stroke="none"
                      >

                        {sentimentData.map(
                          (entry) => (
                            <Cell
                              key={
                                entry.label
                              }
                              fill={
                                SENTIMENT_COLORS[
                                  entry.label
                                ]
                              }
                            />
                          )
                        )}

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

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                    <div className="text-center">

                      <p className="text-4xl font-semibold text-white">
                        {formatPercentage(
                          positivePercentage
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Positive
                      </p>

                    </div>

                  </div>

                </>
              )}

            </div>

            <div className="space-y-4">

              <SentimentRow
                label="Positive"
                value={
                  sentimentSummary.positive
                }
                color="bg-emerald-400"
              />

              <SentimentRow
                label="Neutral"
                value={
                  sentimentSummary.neutral
                }
                color="bg-zinc-500"
              />

              <SentimentRow
                label="Negative"
                value={
                  sentimentSummary.negative
                }
                color="bg-red-400"
              />

            </div>

          </section>

        </section>

        {/* ===================================================
            SENTIMENT TREND
            =================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

          <div className="flex items-start justify-between">

            <div>

              <h3 className="text-lg font-semibold text-white">
                Sentiment trend
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Positive, neutral and negative
                conversations over time.
              </p>

            </div>

            <Activity
              size={20}
              className="text-blue-400"
            />

          </div>

          <div className="mt-8 h-[350px]">

            {sentimentChartData.length ===
            0 ? (
              <EmptyChart
                text="No sentiment history available yet."
              />
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={
                    sentimentChartData
                  }
                >

                  <CartesianGrid
                    stroke="#202733"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
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
                        "12px",
                      color: "#fff",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#34d399"
                    fill="#34d399"
                    fillOpacity={0.18}
                  />

                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke="#71717a"
                    fill="#71717a"
                    fillOpacity={0.18}
                  />

                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke="#f87171"
                    fill="#f87171"
                    fillOpacity={0.18}
                  />

                </AreaChart>

              </ResponsiveContainer>
            )}

          </div>

        </section>

        {/* ===================================================
            ENGAGEMENT BREAKDOWN
            =================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

          <div>

            <h3 className="text-lg font-semibold text-white">
              Engagement breakdown
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              How your total engagement is
              distributed.
            </p>

          </div>

          <div className="mt-7 h-[300px]">

            {engagementChartData.length ===
            0 ? (
              <EmptyChart
                text="No engagement data available."
              />
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={
                    engagementChartData
                  }
                >

                  <CartesianGrid
                    stroke="#202733"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
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
                    dataKey="likes"
                    fill="#60a5fa"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                    name="Likes"
                  />

                  <Bar
                    dataKey="comments"
                    fill="#a78bfa"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                    name="Comments"
                  />

                  <Bar
                    dataKey="shares"
                    fill="#34d399"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                    name="Shares"
                  />

                </BarChart>

              </ResponsiveContainer>
            )}

          </div>

        </section>

        {/* ===================================================
            SUMMARY CARDS
            =================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MiniStat
            title="Total likes"
            value={
              overview.totalLikes
            }
            icon={TrendingUp}
          />

          <MiniStat
            title="Total comments"
            value={
              overview.totalComments
            }
            icon={MessageSquare}
          />

          <MiniStat
            title="Total shares"
            value={
              overview.totalShares
            }
            icon={ArrowUpRight}
          />

          <MiniStat
            title="High impact posts"
            value={
              overview.highImpactPosts
            }
            icon={Zap}
          />

        </section>

        {/* ===================================================
            POSTS
            =================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-lg font-semibold text-white">
                Analyzed posts
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Latest posts included in your
                analytics.
              </p>

            </div>

            <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400">
              {overview.totalPosts} posts
            </span>

          </div>

          <div className="mt-6 space-y-3">

            {dashboard.posts.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center text-sm text-zinc-500">
                No analyzed posts yet.
              </div>
            ) : (
              dashboard.posts
                .slice(0, 10)
                .map((post) => (
                  <PostRow
                    key={post.id}
                    post={post}
                  />
                ))
            )}

          </div>

        </section>

        {/* ===================================================
            STATUS
            =================================================== */}

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
                  Dashboard is using real
                  analyzed post data.
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

      {/* =====================================================
          ANIMATION
          ===================================================== */}

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
          background: rgba(
            59,
            130,
            246,
            0.035
          );
          animation:
            analyticsMoveOne 12s
            ease-in-out infinite;
        }

        .analytics-glow-two {
          width: 450px;
          height: 250px;
          right: -100px;
          top: 50%;
          background: rgba(
            139,
            92,
            246,
            0.03
          );
          animation:
            analyticsMoveTwo 15s
            ease-in-out infinite;
        }

        @keyframes analyticsMoveOne {

          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(70px, 35px)
              scale(1.12);
          }

        }

        @keyframes analyticsMoveTwo {

          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-60px, -30px)
              scale(1.1);
          }

        }

        @media (
          prefers-reduced-motion: reduce
        ) {

          .analytics-glow {
            animation: none;
          }

        }

      `}</style>

    </main>
  );
}

/* =========================================================
   ANALYTICS CARD
   ========================================================= */

function AnalyticsCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: typeof Activity;
  title: string;
  value: string;
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

        <ArrowUpRight
          size={16}
          className="text-emerald-400"
        />

      </div>

      <p className="mt-5 text-sm font-medium text-zinc-400">
        {title}
      </p>

      <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   SENTIMENT ROW
   ========================================================= */

function SentimentRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, value)
  );

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          {label}
        </span>

        <span className="text-sm font-medium text-zinc-200">
          {formatPercentage(
            safeValue
          )}
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   MINI STAT
   ========================================================= */

function MiniStat({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-zinc-500">
          {title}
        </p>

        <Icon
          size={17}
          className="text-blue-400"
        />

      </div>

      <p className="mt-3 text-2xl font-semibold text-white">
        {formatCompactNumber(value)}
      </p>

    </div>
  );
}

/* =========================================================
   POST ROW
   ========================================================= */

function PostRow({
  post,
}: {
  post: DashboardPost;
}) {
  const sentimentClass =
    post.sentiment === "POSITIVE"
      ? "bg-emerald-500/10 text-emerald-400"
      : post.sentiment === "NEGATIVE"
      ? "bg-red-500/10 text-red-400"
      : "bg-zinc-500/10 text-zinc-400";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.1] hover:bg-white/[0.035]">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${sentimentClass}`}
            >
              {post.sentiment}
            </span>

            <span className="text-xs text-zinc-600">
              {formatDate(
                post.publishedAt
              )}
            </span>

          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-300">

            {post.content ||
              "No caption available."}

          </p>

          {post.authorHandle && (
            <p className="mt-2 text-xs text-zinc-600">
              @{post.authorHandle}
            </p>
          )}

        </div>

        <div className="grid grid-cols-3 gap-5 text-center lg:w-[280px]">

          <div>

            <p className="text-xs text-zinc-600">
              Likes
            </p>

            <p className="mt-1 text-sm font-medium text-zinc-300">
              {formatCompactNumber(
                post.likes
              )}
            </p>

          </div>

          <div>

            <p className="text-xs text-zinc-600">
              Comments
            </p>

            <p className="mt-1 text-sm font-medium text-zinc-300">
              {formatCompactNumber(
                post.comments
              )}
            </p>

          </div>

          <div>

            <p className="text-xs text-zinc-600">
              Shares
            </p>

            <p className="mt-1 text-sm font-medium text-zinc-300">
              {formatCompactNumber(
                post.shares
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   EMPTY CHART
   ========================================================= */

function EmptyChart({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/[0.07]">

      <div className="text-center">

        <BarChart3
          size={30}
          className="mx-auto text-zinc-700"
        />

        <p className="mt-3 text-sm text-zinc-500">
          {text}
        </p>

      </div>

    </div>
  );
}