"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Activity,
  AlertCircle,
  BarChart3,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  Video,
} from "lucide-react";

import {
  useApi,
} from "@/src/lib/api";

/* =========================================================
   TYPES
   ========================================================= */

interface StoredProfile {
  id: number;

  userId?: number;

  name: string;

  type:
    | "PERSON"
    | "BRAND"
    | "CAMPAIGN";

  identifier: string;

  input?: string;

  isActive?: boolean;
}

interface PostRecord {
  id: number;

  platform?: string;

  url?: string | null;

  authorName?: string | null;

  authorHandle?: string | null;

  content?: string | null;

  postType?: string;

  likes?: number | null;

  comments?: number | null;

  shares?: number | null;

  views?: number | null;

  sentiment?:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL"
    | string;

  sentimentScore?: number | null;

  publishedAt?: string | null;

  aiAnalysis?: {
    sentiment?: {
      label?: string;
      score?: number;
      explanation?: string;
    };

    emotions?: Array<{
      emotion: string;
      score: number;
    }>;

    topics?: string[];

    intent?: {
      label?: string;
      explanation?: string;
    };

    summary?: string;

    keyInsights?: string[];

    toxicity?: {
      detected?: boolean;
      score?: number;
      explanation?: string;
    };

    recommendations?: string[];

    confidence?: number;
  };
}

interface AnalysisResponse {
  success: boolean;

  message?: string;

  data?: unknown;
}

/* =========================================================
   HELPERS
   ========================================================= */

function numberValue(
  value: unknown
) {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : 0;
}

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN"
  ).format(
    numberValue(value)
  );
}

function compactNumber(
  value: number
) {
  const number =
    numberValue(value);

  if (number >= 1_000_000) {
    return `${(
      number / 1_000_000
    ).toFixed(1)}M`;
  }

  if (number >= 1_000) {
    return `${(
      number / 1_000
    ).toFixed(1)}K`;
  }

  return formatNumber(
    number
  );
}

function clamp(
  value: number,
  min = 0,
  max = 1
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}

function getStoredProfile():
  StoredProfile | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const stored =
      sessionStorage.getItem(
        "socialintel_profile"
      );

    if (stored) {
      const parsed =
        JSON.parse(
          stored
        );

      if (
        parsed?.id &&
        Number(parsed.id) > 0
      ) {
        return {
          ...parsed,
          id: Number(
            parsed.id
          ),
        };
      }
    }

    const storedId =
      sessionStorage.getItem(
        "socialintel_profile_id"
      );

    if (storedId) {
      const id =
        Number(storedId);

      if (
        Number.isFinite(id) &&
        id > 0
      ) {
        return {
          id,
          name:
            "Monitoring Profile",
          type: "PERSON",
          identifier: "",
        };
      }
    }

    const localStored =
      localStorage.getItem(
        "socialintel_profile"
      );

    if (localStored) {
      const parsed =
        JSON.parse(
          localStored
        );

      if (
        parsed?.id &&
        Number(parsed.id) > 0
      ) {
        return {
          ...parsed,
          id: Number(
            parsed.id
          ),
        };
      }
    }

    const localId =
      localStorage.getItem(
        "socialintel_profile_id"
      );

    if (localId) {
      const id =
        Number(localId);

      if (
        Number.isFinite(id) &&
        id > 0
      ) {
        return {
          id,
          name:
            "Monitoring Profile",
          type: "PERSON",
          identifier: "",
        };
      }
    }

    return null;
  } catch (error) {
    console.error(
      "Profile storage error:",
      error
    );

    return null;
  }
}

/* =========================================================
   NORMALIZE RESPONSE
   ========================================================= */

function extractRecords(
  data: unknown
): PostRecord[] {
  if (
    Array.isArray(data)
  ) {
    return data as PostRecord[];
  }

  if (
    !data ||
    typeof data !==
      "object"
  ) {
    return [];
  }

  const object =
    data as Record<
      string,
      unknown
    >;

  const possibleArrays = [
    object.posts,
    object.records,
    object.analysis,
    object.results,
    object.data,
  ];

  for (
    const value of possibleArrays
  ) {
    if (
      Array.isArray(value)
    ) {
      return value as PostRecord[];
    }
  }

  return [];
}

/* =========================================================
   PAGE
   ========================================================= */

export default function PostsAnalysisPage() {
  const router =
    useRouter();

  const {
    getPostAnalysis,
  } = useApi();

  const [
    profile,
    setProfile,
  ] =
    useState<StoredProfile | null>(
      null
    );

  const [
    records,
    setRecords,
  ] =
    useState<PostRecord[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  /* =======================================================
     LOAD PROFILE
     ======================================================= */

  useEffect(() => {
    const storedProfile =
      getStoredProfile();

    if (!storedProfile) {
      setLoading(false);
      return;
    }

    setProfile(
      storedProfile
    );
  }, []);

  /* =======================================================
     LOAD ANALYSIS
     ======================================================= */

  const loadAnalysis =
    async (
      refresh = false
    ) => {
      if (!profile?.id) {
        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const response =
          (await getPostAnalysis(
            profile.id
          )) as AnalysisResponse;

        if (
          !response?.success
        ) {
          throw new Error(
            response?.message ||
              "Failed to fetch post analysis."
          );
        }

        const normalized =
          extractRecords(
            response.data
          );

        setRecords(
          normalized
        );
      } catch (err) {
        console.error(
          "Post analysis error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch post analysis."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useEffect(() => {
    if (profile?.id) {
      loadAnalysis();
    }
  }, [profile?.id]);

  /* =======================================================
     CALCULATIONS
     ======================================================= */

  const stats =
    useMemo(() => {
      const total =
        records.length;

      let positive = 0;
      let negative = 0;
      let neutral = 0;

      let likes = 0;
      let comments = 0;
      let shares = 0;
      let views = 0;

      let sentimentScore = 0;
      let sentimentScoreCount = 0;

      let toxicityCount = 0;

      for (
        const post of records
      ) {
        const sentiment =
          String(
            post.sentiment ||
              post.aiAnalysis
                ?.sentiment
                ?.label ||
              "NEUTRAL"
          ).toUpperCase();

        if (
          sentiment ===
          "POSITIVE"
        ) {
          positive++;
        } else if (
          sentiment ===
          "NEGATIVE"
        ) {
          negative++;
        } else {
          neutral++;
        }

        likes +=
          numberValue(
            post.likes
          );

        comments +=
          numberValue(
            post.comments
          );

        shares +=
          numberValue(
            post.shares
          );

        views +=
          numberValue(
            post.views
          );

        const score =
          post.sentimentScore ??
          post.aiAnalysis
            ?.sentiment
            ?.score;

        if (
          score !== undefined &&
          score !== null &&
          Number.isFinite(
            Number(score)
          )
        ) {
          sentimentScore +=
            Number(score);

          sentimentScoreCount++;
        }

        if (
          post.aiAnalysis
            ?.toxicity
            ?.detected
        ) {
          toxicityCount++;
        }
      }

      const percentage = (
        value: number
      ) =>
        total > 0
          ? (value / total) *
            100
          : 0;

      return {
        total,

        positive,
        negative,
        neutral,

        positivePercentage:
          percentage(
            positive
          ),

        negativePercentage:
          percentage(
            negative
          ),

        neutralPercentage:
          percentage(
            neutral
          ),

        likes,

        comments,

        shares,

        views,

        engagement:
          likes +
          comments +
          shares +
          views,

        averageSentimentScore:
          sentimentScoreCount >
          0
            ? sentimentScore /
              sentimentScoreCount
            : 0,

        toxicityCount,
      };
    }, [records]);

  /* =======================================================
     NO PROFILE
     ======================================================= */

  if (
    !loading &&
    !profile
  ) {
    return (
      <EmptyState
        title="No monitoring profile found"
        description="Create a monitoring profile before opening post analytics."
        buttonText="Create profile"
        onClick={() =>
          router.push(
            "/create-profile"
          )
        }
      />
    );
  }

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] text-white">
        <div className="text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-blue-400"
          />

          <p className="mt-4 text-sm text-zinc-500">
            Loading real post analysis...
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
      <EmptyState
        title="Unable to load analytics"
        description={error}
        buttonText="Try again"
        onClick={() =>
          loadAnalysis(true)
        }
      />
    );
  }

  /* =======================================================
     MAIN PAGE
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#080b12] text-white">

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">

        <div className="flex h-20 items-center justify-between px-5 sm:px-8">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
              SocialIntel
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              Post Analysis
            </h1>
          </div>

          <button
            type="button"
            disabled={
              refreshing
            }
            onClick={() =>
              loadAnalysis(true)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.08] disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

      </header>

      {/* ===================================================
          CONTENT
          =================================================== */}

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">

        {/* =================================================
            PROFILE HEADER
            ================================================= */}

        <section className="mb-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-3xl font-semibold">
                  {profile?.name ||
                    "Monitoring Profile"}
                </h2>

                <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-400">
                  {profile?.type}
                </span>

              </div>

              {profile?.identifier && (
                <p className="mt-2 text-sm text-zinc-500">
                  {profile.identifier}
                </p>
              )}

            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              Live analysis data

            </div>

          </div>

        </section>

        {/* =================================================
            TOP STATS
            ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            icon={BarChart3}
            title="Analyzed posts"
            value={compactNumber(
              stats.total
            )}
            description="Real analyzed posts"
          />

          <StatCard
            icon={ThumbsUp}
            title="Likes"
            value={compactNumber(
              stats.likes
            )}
            description="Total post likes"
          />

          <StatCard
            icon={MessageCircle}
            title="Comments"
            value={compactNumber(
              stats.comments
            )}
            description="Real audience comments"
          />

          <StatCard
            icon={Activity}
            title="Engagement"
            value={compactNumber(
              stats.engagement
            )}
            description="Likes + comments + shares + views"
          />

          <StatCard
            icon={
              stats.negative >
              stats.positive
                ? TrendingDown
                : TrendingUp
            }
            title="Avg sentiment"
            value={`${(
              stats.averageSentimentScore *
              100
            ).toFixed(1)}%`}
            description="Average AI score"
          />

        </section>

        {/* =================================================
            SENTIMENT + PIE
            ================================================= */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">

          <SentimentDistribution
            positive={
              stats.positive
            }
            negative={
              stats.negative
            }
            neutral={
              stats.neutral
            }
            total={
              stats.total
            }
            positivePercentage={
              stats.positivePercentage
            }
            negativePercentage={
              stats.negativePercentage
            }
            neutralPercentage={
              stats.neutralPercentage
            }
          />

          <SentimentPie
            positive={
              stats.positive
            }
            negative={
              stats.negative
            }
            neutral={
              stats.neutral
            }
          />

        </section>

        {/* =================================================
            ENGAGEMENT GRAPH
            ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Engagement trend
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Engagement metrics from
                analyzed posts.
              </p>
            </div>

            <TrendingUp
              size={22}
              className="text-emerald-400"
            />

          </div>

          <EngagementGraph
            records={records}
          />

        </section>

        {/* =================================================
            POSTS
            ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Analyzed posts
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Real posts and AI sentiment
                classification.
              </p>
            </div>

            <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400">
              {records.length} posts
            </span>

          </div>

          {records.length ===
          0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/[0.08] p-12 text-center">

              <Video
                size={30}
                className="mx-auto text-zinc-700"
              />

              <p className="mt-4 text-sm text-zinc-500">
                No analyzed posts yet.
              </p>

              <p className="mt-1 text-xs text-zinc-700">
                Paste a public social-media
                post URL and analyze it.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-4">

              {records.map(
                (post) => (
                  <PostCard
                    key={
                      post.id
                    }
                    post={
                      post
                    }
                  />
                )
              )}

            </div>
          )}

        </section>

        {/* =================================================
            AI / SAFETY
            ================================================= */}

        <section className="mt-6 grid gap-6 md:grid-cols-2">

          <InsightCard
            title="AI confidence"
            value={
              records.length
                ? `${(
                    records.reduce(
                      (
                        total,
                        post
                      ) =>
                        total +
                        numberValue(
                          post
                            .aiAnalysis
                            ?.confidence
                        ),
                      0
                    ) /
                    records.length
                  * 100
                ).toFixed(1)}%`
                : "0%"
            }
            description="Average confidence across analyzed posts."
          />

          <InsightCard
            title="Toxicity signals"
            value={String(
              stats.toxicityCount
            )}
            description="Posts where the AI detected potentially harmful content."
          />

        </section>

      </div>

    </main>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

        <Icon
          size={18}
          className="text-blue-400"
        />

      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-600">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   SENTIMENT DISTRIBUTION
   ========================================================= */

function SentimentDistribution({
  positive,
  negative,
  neutral,
  total,
  positivePercentage,
  negativePercentage,
  neutralPercentage,
}: {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">

      <h2 className="text-xl font-semibold">
        Sentiment distribution
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Positive, negative and neutral
        posts.
      </p>

      <div className="mt-7 space-y-6">

        <SentimentRow
          label="Positive"
          count={positive}
          percentage={
            positivePercentage
          }
          className="bg-emerald-400"
          textClass="text-emerald-400"
        />

        <SentimentRow
          label="Neutral"
          count={neutral}
          percentage={
            neutralPercentage
          }
          className="bg-zinc-500"
          textClass="text-zinc-400"
        />

        <SentimentRow
          label="Negative"
          count={negative}
          percentage={
            negativePercentage
          }
          className="bg-red-400"
          textClass="text-red-400"
        />

      </div>

      <div className="mt-7 border-t border-white/[0.06] pt-5">

        <p className="text-xs text-zinc-600">
          Total analyzed
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {formatNumber(
            total
          )}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   SENTIMENT ROW
   ========================================================= */

function SentimentRow({
  label,
  count,
  percentage,
  className,
  textClass,
}: {
  label: string;
  count: number;
  percentage: number;
  className: string;
  textClass: string;
}) {
  const width =
    clamp(
      percentage,
      0,
      100
    );

  return (
    <div>

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span
            className={`h-2.5 w-2.5 rounded-full ${className}`}
          />

          <span className="text-sm text-zinc-300">
            {label}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <span className="text-xs text-zinc-600">
            {formatNumber(
              count
            )}
          </span>

          <span
            className={`text-sm font-medium ${textClass}`}
          >
            {percentage.toFixed(
              1
            )}
            %
          </span>

        </div>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${width}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   PIE CHART
   ========================================================= */

function SentimentPie({
  positive,
  negative,
  neutral,
}: {
  positive: number;
  negative: number;
  neutral: number;
}) {
  const total =
    positive +
    negative +
    neutral;

  const positivePercent =
    total > 0
      ? (positive / total) *
        100
      : 0;

  const negativePercent =
    total > 0
      ? (negative / total) *
        100
      : 0;

  const neutralPercent =
    total > 0
      ? (neutral / total) *
        100
      : 0;

  const positiveDeg =
    positivePercent *
    3.6;

  const negativeDeg =
    negativePercent *
    3.6;

  const positiveEnd =
    positiveDeg;

  const negativeEnd =
    positiveDeg +
    negativeDeg;

  const gradient =
    total === 0
      ? "conic-gradient(#27272a 0deg 360deg)"
      : `conic-gradient(
          #34d399 0deg ${positiveEnd}deg,
          #f87171 ${positiveEnd}deg ${negativeEnd}deg,
          #71717a ${negativeEnd}deg 360deg
        )`;

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold">
            Sentiment overview
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Overall AI classification.
          </p>
        </div>

        <BarChart3
          size={22}
          className="text-blue-400"
        />

      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-8 sm:flex-row">

        <div className="relative h-52 w-52">

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                gradient,
            }}
          />

          <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-[#0a0d14]">

            <span className="text-3xl font-semibold">
              {total}
            </span>

            <span className="mt-1 text-xs text-zinc-600">
              posts
            </span>

          </div>

        </div>

        <div className="w-full max-w-xs space-y-4">

          <LegendItem
            label="Positive"
            count={
              positive
            }
            percentage={
              positivePercent
            }
            dotClass="bg-emerald-400"
            textClass="text-emerald-400"
          />

          <LegendItem
            label="Negative"
            count={
              negative
            }
            percentage={
              negativePercent
            }
            dotClass="bg-red-400"
            textClass="text-red-400"
          />

          <LegendItem
            label="Neutral"
            count={
              neutral
            }
            percentage={
              neutralPercent
            }
            dotClass="bg-zinc-500"
            textClass="text-zinc-400"
          />

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   LEGEND
   ========================================================= */

function LegendItem({
  label,
  count,
  percentage,
  dotClass,
  textClass,
}: {
  label: string;
  count: number;
  percentage: number;
  dotClass: string;
  textClass: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">

      <div className="flex items-center gap-3">

        <span
          className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
        />

        <span className="text-sm text-zinc-300">
          {label}
        </span>

      </div>

      <div className="flex items-center gap-3">

        <span className="text-xs text-zinc-600">
          {count}
        </span>

        <span
          className={`text-sm font-medium ${textClass}`}
        >
          {percentage.toFixed(
            1
          )}
          %
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   ENGAGEMENT GRAPH
   ========================================================= */

function EngagementGraph({
  records,
}: {
  records: PostRecord[];
}) {
  const points =
    records
      .slice()
      .reverse()
      .slice(-12)
      .map(
        (
          post,
          index
        ) => {
          const engagement =
            numberValue(
              post.likes
            ) +
            numberValue(
              post.comments
            ) +
            numberValue(
              post.shares
            ) +
            numberValue(
              post.views
            );

          return {
            index,
            value:
              engagement,
            label:
              post.publishedAt
                ? new Date(
                    post.publishedAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month:
                        "short",
                    }
                  )
                : `Post ${
                    index + 1
                  }`,
          };
        }
      );

  if (
    points.length ===
    0
  ) {
    return (
      <div className="mt-8 flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/[0.08]">

        <p className="text-sm text-zinc-600">
          No engagement data available.
        </p>

      </div>
    );
  }

  const width = 900;
  const height = 300;
  const padding = 35;

  const maxValue =
    Math.max(
      ...points.map(
        (point) =>
          point.value
      ),
      1
    );

  const xStep =
    points.length > 1
      ? (width -
          padding * 2) /
        (points.length -
          1)
      : 0;

  const coordinates =
    points.map(
      (
        point,
        index
      ) => {
        const x =
          padding +
          index *
            xStep;

        const y =
          height -
          padding -
          (point.value /
            maxValue) *
            (height -
              padding *
                2);

        return {
          ...point,
          x,
          y,
        };
      }
    );

  const linePath =
    coordinates
      .map(
        (
          point,
          index
        ) =>
          `${
            index ===
            0
              ? "M"
              : "L"
          } ${point.x} ${point.y}`
      )
      .join(" ");

  return (
    <div className="mt-8 overflow-x-auto">

      <div className="min-w-[700px]">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-72 w-full"
          preserveAspectRatio="none"
        >

          {[0, 1, 2, 3, 4].map(
            (line) => {
              const y =
                padding +
                ((height -
                  padding *
                    2) /
                  4) *
                  line;

              return (
                <line
                  key={line}
                  x1={
                    padding
                  }
                  x2={
                    width -
                    padding
                  }
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-white/[0.06]"
                />
              );
            }
          )}

          <path
            d={
              linePath
            }
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-400"
          />

          {coordinates.map(
            (point) => (
              <circle
                key={
                  point.index
                }
                cx={
                  point.x
                }
                cy={
                  point.y
                }
                r="5"
                className="fill-blue-400"
              />
            )
          )}

        </svg>

        <div className="mt-2 flex justify-between px-6">

          {points.map(
            (point) => (
              <span
                key={
                  point.index
                }
                className="text-[10px] text-zinc-600"
              >
                {point.label}
              </span>
            )
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   POST CARD
   ========================================================= */

function PostCard({
  post,
}: {
  post: PostRecord;
}) {
  const sentiment =
    String(
      post.sentiment ||
        post.aiAnalysis
          ?.sentiment
          ?.label ||
        "NEUTRAL"
    ).toUpperCase();

  const sentimentClass =
    sentiment ===
    "POSITIVE"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/10"
      : sentiment ===
        "NEGATIVE"
      ? "bg-red-500/10 text-red-400 border-red-400/10"
      : "bg-zinc-500/10 text-zinc-400 border-zinc-400/10";

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-white/[0.12]">

      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${sentimentClass}`}
            >
              {sentiment}
            </span>

            {post.platform && (
              <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-500">
                {
                  post.platform
                }
              </span>
            )}

            {post.postType && (
              <span className="text-[11px] text-zinc-600">
                {
                  post.postType
                }
              </span>
            )}

          </div>

          {post.authorName && (
            <p className="mt-4 text-sm font-medium text-zinc-300">
              {post.authorName}
            </p>
          )}

          {post.authorHandle && (
            <p className="mt-1 text-xs text-zinc-600">
              @
              {
                post.authorHandle
              }
            </p>
          )}

          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
            {post.content ||
              post.aiAnalysis
                ?.summary ||
              "No caption available."}
          </p>

          {post.aiAnalysis
            ?.summary &&
            post.content && (
              <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  AI summary
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {
                    post
                      .aiAnalysis
                      .summary
                  }
                </p>

              </div>
            )}

        </div>

        <div className="lg:w-[390px]">

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">

            <MiniMetric
              icon={ThumbsUp}
              label="Likes"
              value={compactNumber(
                numberValue(
                  post.likes
                )
              )}
            />

            <MiniMetric
              icon={
                MessageCircle
              }
              label="Comments"
              value={compactNumber(
                numberValue(
                  post.comments
                )
              )}
            />

            <MiniMetric
              icon={Activity}
              label="Shares"
              value={compactNumber(
                numberValue(
                  post.shares
                )
              )}
            />

            <MiniMetric
              icon={BarChart3}
              label="Views"
              value={compactNumber(
                numberValue(
                  post.views
                )
              )}
            />

          </div>

          <div className="mt-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

            <div className="flex items-center justify-between">

              <span className="text-xs text-zinc-600">
                AI confidence
              </span>

              <span className="text-sm font-medium text-blue-400">
                {(
                  numberValue(
                    post.aiAnalysis
                      ?.confidence
                  ) *
                  100
                ).toFixed(
                  1
                )}
                %
              </span>

            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

              <div
                className="h-full rounded-full bg-blue-400"
                style={{
                  width: `${clamp(
                    numberValue(
                      post
                        .aiAnalysis
                        ?.confidence
                    ),
                    0,
                    1
                  ) * 100}%`,
                }}
              />

            </div>

          </div>

          {post.url && (
            <a
              href={
                post.url
              }
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-blue-400"
            >
              Open original post
              <ExternalLink
                size={13}
              />
            </a>
          )}

        </div>

      </div>

    </article>
  );
}

/* =========================================================
   MINI METRIC
   ========================================================= */

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">

      <div className="flex items-center gap-2">

        <Icon
          size={13}
          className="text-zinc-600"
        />

        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-medium text-zinc-300">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   INSIGHT CARD
   ========================================================= */

function InsightCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-zinc-600">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}: {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-6 text-white">

      <div className="max-w-lg rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 text-center">

        <AlertCircle
          size={38}
          className="mx-auto text-yellow-400"
        />

        <h1 className="mt-5 text-xl font-semibold">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          {description}
        </p>

        <button
          type="button"
          onClick={
            onClick
          }
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          {buttonText}
        </button>

      </div>

    </main>
  );
}