"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Minus,
  Play,
  Search,
  ShieldAlert,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

import {
  useApi,
  type AnalyzedPostResponse,
} from "@/src/lib/api";

/* =========================================================
   TYPES
   ========================================================= */

type AudienceSentiment = {
  positive: number;
  negative: number;
  neutral: number;
  dominant:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL"
    | "MIXED"
    | "UNAVAILABLE";
  explanation: string;
};

type InstagramComment = {
  id: string | null;
  username: string | null;
  text: string;
  likes: number | null;
  timestamp: string | null;
};

type AnalysisRecord =
  AnalyzedPostResponse & {
    analyzedAt: string;

    /*
     * Backend returns commentsData inside post, but we keep the
     * optional top-level field too for backwards compatibility.
     */
    commentsData?: InstagramComment[];

    post: AnalyzedPostResponse["post"] & {
      commentsData?: InstagramComment[];
    };

    aiAnalysis: AnalyzedPostResponse["aiAnalysis"] & {
      audienceSentiment?: AudienceSentiment;
    };
  };

/* =========================================================
   HELPERS
   ========================================================= */

function formatNumber(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value)
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN"
  ).format(value);
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "Unknown";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unknown";
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function clamp(
  value: number,
  min = 0,
  max = 100
) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}

/* =========================================================
   SENTIMENT PIE CHART
   ========================================================= */

function SentimentPieChart({
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

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        No sentiment data yet.
      </div>
    );
  }

  const positivePercent =
    (positive / total) * 100;

  const negativePercent =
    (negative / total) * 100;

  const neutralPercent =
    (neutral / total) * 100;

  const positiveLength =
    positivePercent;

  const negativeLength =
    negativePercent;

  const neutralLength =
    neutralPercent;

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row">
      <div className="relative h-56 w-56 shrink-0">
        <svg
          viewBox="0 0 42 42"
          className="h-full w-full -rotate-90"
        >
          {/* Positive */}

          <circle
            cx="21"
            cy="21"
            r="15.9155"
            fill="transparent"
            stroke="#22c55e"
            strokeWidth="6"
            strokeDasharray={`${positiveLength} ${
              100 - positiveLength
            }`}
            strokeDashoffset="0"
          />

          {/* Negative */}

          <circle
            cx="21"
            cy="21"
            r="15.9155"
            fill="transparent"
            stroke="#ef4444"
            strokeWidth="6"
            strokeDasharray={`${negativeLength} ${
              100 - negativeLength
            }`}
            strokeDashoffset={`-${positiveLength}`}
          />

          {/* Neutral */}

          <circle
            cx="21"
            cy="21"
            r="15.9155"
            fill="transparent"
            stroke="#a1a1aa"
            strokeWidth="6"
            strokeDasharray={`${neutralLength} ${
              100 - neutralLength
            }`}
            strokeDashoffset={`-${
              positiveLength +
              negativeLength
            }`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {total}
          </span>

          <span className="text-xs text-zinc-500">
            analyzed
          </span>
        </div>
      </div>

      <div className="w-full space-y-4">
        <SentimentLegend
          label="Positive"
          value={positive}
          percentage={
            positivePercent
          }
          dotClass="bg-green-500"
        />

        <SentimentLegend
          label="Negative"
          value={negative}
          percentage={
            negativePercent
          }
          dotClass="bg-red-500"
        />

        <SentimentLegend
          label="Neutral"
          value={neutral}
          percentage={
            neutralPercent
          }
          dotClass="bg-zinc-400"
        />
      </div>
    </div>
  );
}

function SentimentLegend({
  label,
  value,
  percentage,
  dotClass,
}: {
  label: string;
  value: number;
  percentage: number;
  dotClass: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${dotClass}`}
        />

        <span className="text-sm text-zinc-300">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-white">
          {value}
        </span>

        <span className="text-sm text-zinc-500">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   AUDIENCE SENTIMENT CHART
   ========================================================= */

function AudienceSentimentChart({
  sentiment,
}: {
  sentiment?: AudienceSentiment;
}) {
  if (
    !sentiment ||
    sentiment.dominant === "UNAVAILABLE"
  ) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-6 text-center">
        <MessageCircle className="mb-4 h-10 w-10 text-zinc-600" />
        <p className="font-medium text-zinc-400">
          Audience sentiment unavailable
        </p>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
          Instagram comments were not available for this post,
          so SocialIntel will not guess the audience reaction.
        </p>
      </div>
    );
  }

  const positive = clamp(sentiment.positive * 100);
  const negative = clamp(sentiment.negative * 100);
  const neutral = clamp(sentiment.neutral * 100);

  const total = positive + negative + neutral;

  if (total <= 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-zinc-500">
        No audience sentiment data.
      </div>
    );
  }

  const positivePercent = (positive / total) * 100;
  const negativePercent = (negative / total) * 100;
  const neutralPercent = (neutral / total) * 100;

  const dominantLabel =
    sentiment.dominant === "POSITIVE"
      ? "Positive"
      : sentiment.dominant === "NEGATIVE"
        ? "Negative"
        : sentiment.dominant === "NEUTRAL"
          ? "Neutral"
          : "Mixed";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-7 md:flex-row">
        <div className="relative h-52 w-52 shrink-0">
          <svg
            viewBox="0 0 42 42"
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="21"
              cy="21"
              r="15.9155"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth="6"
              strokeDasharray={`${positivePercent} ${100 - positivePercent}`}
              strokeDashoffset="0"
            />
            <circle
              cx="21"
              cy="21"
              r="15.9155"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="6"
              strokeDasharray={`${negativePercent} ${100 - negativePercent}`}
              strokeDashoffset={`-${positivePercent}`}
            />
            <circle
              cx="21"
              cy="21"
              r="15.9155"
              fill="transparent"
              stroke="#a1a1aa"
              strokeWidth="6"
              strokeDasharray={`${neutralPercent} ${100 - neutralPercent}`}
              strokeDashoffset={`-${positivePercent + negativePercent}`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Dominant
            </span>
            <span className="mt-1 text-xl font-bold text-white">
              {dominantLabel}
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <AudienceSentimentRow
            label="Positive"
            value={positive}
            dotClass="bg-green-500"
          />
          <AudienceSentimentRow
            label="Negative"
            value={negative}
            dotClass="bg-red-500"
          />
          <AudienceSentimentRow
            label="Neutral"
            value={neutral}
            dotClass="bg-zinc-400"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
          AI interpretation
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {sentiment.explanation}
        </p>
      </div>
    </div>
  );
}

function AudienceSentimentRow({
  label,
  value,
  dotClass,
}: {
  label: string;
  value: number;
  dotClass: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
          <span className="text-sm text-zinc-300">{label}</span>
        </div>
        <span className="text-sm font-semibold text-white">
          {value.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full ${dotClass} transition-all duration-500`}
          style={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   COMMENTS GRAPH
   ========================================================= */

function CommentInsights({
  comments,
}: {
  comments: InstagramComment[];
}) {
  const visibleComments = comments.filter(
    (comment) => comment.text?.trim()
  );

  if (visibleComments.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-6 text-center">
        <MessageCircle className="mb-4 h-9 w-9 text-zinc-600" />
        <p className="font-medium text-zinc-400">
          No comments were returned
        </p>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
          The backend only displays audience insights when real Instagram
          comments are returned by Apify.
        </p>
      </div>
    );
  }

  const maxLikes = Math.max(
    ...visibleComments.map((comment) => comment.likes ?? 0),
    1
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/5 bg-black/20 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Recent audience comments
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              {visibleComments.length} real comments returned by the data source
            </p>
          </div>

          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
            {visibleComments.length} comments
          </span>
        </div>

        <div className="space-y-3">
          {visibleComments.slice(0, 10).map((comment, index) => {
            const likes = comment.likes ?? 0;
            const likeWidth = Math.max(
              (likes / maxLikes) * 100,
              likes > 0 ? 4 : 0
            );

            return (
              <div
                key={comment.id ?? `${comment.username}-${index}`}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {comment.username
                        ? `@${comment.username}`
                        : "Instagram user"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {comment.text}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-zinc-600">Likes</p>
                    <p className="mt-1 font-semibold text-white">
                      {formatNumber(likes)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${likeWidth}%` }}
                  />
                </div>

                {comment.timestamp && (
                  <p className="mt-2 text-[11px] text-zinc-700">
                    {formatDate(comment.timestamp)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
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
  records: AnalysisRecord[];
}) {
  if (records.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        Analyze posts to see engagement.
      </div>
    );
  }

  const points = records.map((record, index) => {
    const likes = record.post.engagement.likes ?? 0;
    const comments = record.post.engagement.comments ?? 0;
    const shares = record.post.engagement.shares ?? 0;
    const views = record.post.engagement.views ?? 0;

    return {
      index: index + 1,
      likes,
      comments,
      shares,
      views,
      total: likes + comments + shares + views,
    };
  });

  const maxValue = Math.max(
    ...points.flatMap((point) => [
      point.likes,
      point.comments,
      point.shares,
      point.views,
    ]),
    1
  );

  const totals = {
    likes: points.reduce((sum, point) => sum + point.likes, 0),
    comments: points.reduce((sum, point) => sum + point.comments, 0),
    shares: points.reduce((sum, point) => sum + point.shares, 0),
    views: points.reduce((sum, point) => sum + point.views, 0),
  };

  const getHeight = (value: number) => {
    if (value <= 0) return "0%";
    return `${Math.max((value / maxValue) * 100, 3)}%`;
  };

  return (
    <div className="w-full">
      <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-white/5 bg-black/20 p-4">
        <div className="absolute inset-x-4 inset-y-4 flex flex-col justify-between pointer-events-none">
          {[4, 3, 2, 1, 0].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-right text-[10px] text-zinc-600">
                {formatNumber(Math.round((maxValue * step) / 4))}
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-[68px] right-4 top-4 flex items-end justify-around gap-3">
          {points.map((point) => (
            <div key={point.index} className="flex h-full min-w-0 flex-1 items-end justify-center gap-1">
              <div className="w-full max-w-[22px] rounded-t-md bg-red-500 transition-all duration-300 hover:bg-red-400" style={{ height: getHeight(point.likes) }} title={`Post ${point.index} • Likes: ${formatNumber(point.likes)}`} />
              <div className="w-full max-w-[22px] rounded-t-md bg-blue-500 transition-all duration-300 hover:bg-blue-400" style={{ height: getHeight(point.comments) }} title={`Post ${point.index} • Comments: ${formatNumber(point.comments)}`} />
              <div className="w-full max-w-[22px] rounded-t-md bg-purple-500 transition-all duration-300 hover:bg-purple-400" style={{ height: getHeight(point.shares) }} title={`Post ${point.index} • Shares: ${formatNumber(point.shares)}`} />
              <div className="w-full max-w-[22px] rounded-t-md bg-green-500 transition-all duration-300 hover:bg-green-400" style={{ height: getHeight(point.views) }} title={`Post ${point.index} • Views: ${formatNumber(point.views)}`} />
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 left-[68px] right-4 flex justify-around">
          {points.map((point) => (
            <span key={point.index} className="text-[10px] text-zinc-600">Post {point.index}</span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-6 text-xs">
        <LegendItem label="Likes" className="bg-red-500" />
        <LegendItem label="Comments" className="bg-blue-500" />
        <LegendItem label="Shares" className="bg-purple-500" />
        <LegendItem label="Views" className="bg-green-500" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <EngagementTotal label="Likes" value={totals.likes} />
        <EngagementTotal label="Comments" value={totals.comments} />
        <EngagementTotal label="Shares" value={totals.shares} />
        <EngagementTotal label="Views" value={totals.views} />
      </div>
    </div>
  );
}

function EngagementTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3 text-center">
      <p className="text-xs text-zinc-600">{label}</p>
      <p className="mt-1 font-semibold text-white">{formatNumber(value)}</p>
    </div>
  );
}

function LegendItem({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-2 text-zinc-400">
      <span
        className={`h-2.5 w-2.5 rounded-full ${className}`}
      />

      {label}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function PostsAnalysisPage() {
  const {
    analyzePost,
  } = useApi();

  const [
    postUrl,
    setPostUrl,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    records,
    setRecords,
  ] = useState<
    AnalysisRecord[]
  >([]);

  /* =======================================================
     ANALYZE POST
     ======================================================= */

  const handleAnalyze =
    async () => {
      const url =
        postUrl.trim();

      if (!url) {
        setError(
          "Please paste an Instagram post URL."
        );

        return;
      }

      if (
        !url.includes(
          "instagram.com"
        )
      ) {
        setError(
          "Please enter a valid Instagram URL."
        );

        return;
      }

      setError("");
      setLoading(true);

      try {
        /*
         * We intentionally don't require profileId
         * here yet.
         *
         * The backend can analyze the public URL
         * independently.
         */

        const response =
          await analyzePost(
            url
          );

        if (
          !response ||
          !response.success
        ) {
          throw new Error(
            response?.message ||
              "Post analysis failed."
          );
        }

        const analysis =
          response.data;

        const record: AnalysisRecord =
          {
            ...analysis,

            analyzedAt:
              new Date().toISOString(),
          };

        /*
         * Add newest post to the
         * beginning of the list.
         */

        setRecords(
          (previous) => [
            record,
            ...previous,
          ]
        );

        /*
         * Clear URL after successful
         * analysis.
         */

        setPostUrl("");

      } catch (err) {
        console.error(
          "Frontend post analysis error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to analyze post."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     ENTER KEY
     ======================================================= */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key ===
      "Enter"
    ) {
      handleAnalyze();
    }
  };

  /* =======================================================
     OVERALL SENTIMENT
     ======================================================= */

  const sentimentStats =
    useMemo(() => {
      let positive = 0;
      let negative = 0;
      let neutral = 0;

      records.forEach(
        (record) => {
          const sentiment =
            record.aiAnalysis
              .sentiment.label;

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
        }
      );

      return {
        positive,
        negative,
        neutral,
        total:
          positive +
          negative +
          neutral,
      };
    }, [records]);

  /* =======================================================
     OVERALL ENGAGEMENT
     ======================================================= */

  const engagement =
    useMemo(() => {
      return records.reduce(
        (total, record) => {
          return (
            total +
            (record.post
              .engagement.likes ??
              0) +
            (record.post
              .engagement.comments ??
              0) +
            (record.post
              .engagement.shares ??
              0) +
            (record.post
              .engagement.views ??
              0)
          );
        },
        0
      );
    }, [records]);

  /* =======================================================
     AVERAGE CONFIDENCE
     ======================================================= */

  const averageConfidence =
    useMemo(() => {
      if (
        records.length ===
        0
      ) {
        return 0;
      }

      const total =
        records.reduce(
          (sum, record) =>
            sum +
            record.aiAnalysis
              .confidence,
          0
        );

      return (
        total /
        records.length
      );
    }, [records]);

  /* =======================================================
     LATEST POST
     ======================================================= */

  const latest =
    records[0];

  const latestAudienceSentiment =
    latest?.aiAnalysis?.audienceSentiment;

  /*
   * IMPORTANT:
   * The backend sends commentsData inside the post object:
   * response.data.post.commentsData
   *
   * Keep the top-level fallback so older responses still work.
   */
  const latestComments =
    latest?.post?.commentsData ??
    latest?.commentsData ??
    [];

  /* =======================================================
     UI
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#070a10] text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">

        {/* =================================================
            HEADER
            ================================================= */}

        <header className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-blue-400 uppercase">
              <Activity className="h-4 w-4" />

              Content Intelligence
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Posts Analysis
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
              Understand what people are
              saying, identify sentiment,
              discover recurring narratives
              and measure engagement across
              analyzed social posts.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            Live analysis
          </div>
        </header>

        {/* =================================================
            ANALYZE INPUT
            ================================================= */}

        <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5 shadow-2xl md:p-7">

          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              Analyze a public post
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Paste an Instagram post URL.
              SocialIntel will retrieve the
              real post using Apify and analyze
              its content and media using AI.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <ExternalLink className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

              <input
                value={postUrl}
                onChange={(event) =>
                  setPostUrl(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                disabled={loading}
                placeholder="https://www.instagram.com/p/..."
                className="h-14 w-full rounded-xl border border-white/10 bg-black/30 pl-12 pr-5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              onClick={
                handleAnalyze
              }
              disabled={loading}
              className="flex h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />

                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />

                  Analyze Post
                </>
              )}
            </button>
          </div>

          {/* Loading message */}

          {loading && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-300">
              <Loader2 className="h-4 w-4 animate-spin" />

              <span>
                Fetching Instagram data →
                downloading media →
                running AI analysis...
              </span>
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <span>
                {error}
              </span>
            </div>
          )}
        </section>

        {/* =================================================
            OVERVIEW CARDS
            ================================================= */}

        <section className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            icon={
              <Search className="h-5 w-5" />
            }
            title="Posts analyzed"
            value={formatNumber(
              records.length
            )}
            description="This session"
            iconClass="text-blue-400"
          />

          <StatCard
            icon={
              <ThumbsUp className="h-5 w-5" />
            }
            title="Positive posts"
            value={
              sentimentStats.total
                ? `${(
                    (sentimentStats.positive /
                      sentimentStats.total) *
                    100
                  ).toFixed(1)}%`
                : "0%"
            }
            description={`${sentimentStats.positive} posts`}
            iconClass="text-green-400"
          />

          <StatCard
            icon={
              <ThumbsDown className="h-5 w-5" />
            }
            title="Negative posts"
            value={
              sentimentStats.total
                ? `${(
                    (sentimentStats.negative /
                      sentimentStats.total) *
                    100
                  ).toFixed(1)}%`
                : "0%"
            }
            description={`${sentimentStats.negative} posts`}
            iconClass="text-red-400"
          />

          <StatCard
            icon={
              <Zap className="h-5 w-5" />
            }
            title="Total engagement"
            value={formatNumber(
              engagement
            )}
            description="Likes + comments + shares + views"
            iconClass="text-yellow-400"
          />

          <StatCard
            icon={
              <MessageCircle className="h-5 w-5" />
            }
            title="Comments captured"
            value={formatNumber(
              latestComments.length
            )}
            description="Recent comments from Apify"
            iconClass="text-purple-400"
          />
        </section>

        {/* =================================================
            CHARTS
            ================================================= */}

        <section className="mb-10 grid gap-6 xl:grid-cols-2">

          {/* SENTIMENT */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Sentiment distribution
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Overall sentiment across
                  analyzed URLs.
                </p>
              </div>

              <Brain className="h-6 w-6 text-blue-400" />
            </div>

            <SentimentPieChart
              positive={
                sentimentStats.positive
              }
              negative={
                sentimentStats.negative
              }
              neutral={
                sentimentStats.neutral
              }
            />
          </div>

          {/* ENGAGEMENT */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Engagement trend
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Engagement metrics from
                  analyzed posts.
                </p>
              </div>

              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>

            <EngagementGraph
              records={records}
            />
          </div>
        </section>

        {/* =================================================
            AUDIENCE INTELLIGENCE
            ================================================= */}

        {latest && (
          <section className="mb-10 grid gap-6 xl:grid-cols-2">
            {/* AUDIENCE SENTIMENT */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Audience sentiment
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Sentiment inferred from real Instagram comments returned
                    by Apify.
                  </p>
                </div>

                <MessageCircle className="h-6 w-6 text-purple-400" />
              </div>

              <AudienceSentimentChart
                sentiment={latestAudienceSentiment}
              />
            </div>

            {/* COMMENTS */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Comment intelligence
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Recent comments, authors and comment engagement.
                  </p>
                </div>

                <Heart className="h-6 w-6 text-red-400" />
              </div>

              <CommentInsights comments={latestComments} />
            </div>
          </section>
        )}

        {/* =================================================
            LATEST POST
            ================================================= */}

        {latest && (
          <section className="mb-10 rounded-2xl border border-blue-500/20 bg-blue-500/[0.025] p-6">

            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-blue-400">
                  <Sparkles className="h-4 w-4" />

                  Latest analysis
                </div>

                <h2 className="text-2xl font-semibold">
                  Real Instagram data
                </h2>
              </div>

              <a
                href={
                  latest.post.url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
              >
                Open post

                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

              {/* MEDIA */}

              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">

                {latest.post.media?.url ? (
                  <img
                    src={
                      latest.post.media.url
                    }
                    alt={
                      latest.post.author
                        ?.name ||
                      "Instagram post"
                    }
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-zinc-600">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
              </div>

              {/* POST DATA */}

              <div className="space-y-5">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      {latest.post.author
                        ?.name ||
                        "Unknown author"}
                    </p>

                    <p className="text-sm text-zinc-500">
                      @
                      {latest.post.author
                        ?.handle ||
                        "unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">

                  <Metric
                    icon={
                      <Heart className="h-4 w-4 text-red-400" />
                    }
                    label="Likes"
                    value={formatNumber(
                      latest.post
                        .engagement
                        .likes
                    )}
                  />

                  <Metric
                    icon={
                      <MessageCircle className="h-4 w-4 text-blue-400" />
                    }
                    label="Comments"
                    value={formatNumber(
                      latest.post
                        .engagement
                        .comments
                    )}
                  />

                  <Metric
                    icon={
                      <Zap className="h-4 w-4 text-yellow-400" />
                    }
                    label="Shares"
                    value={formatNumber(
                      latest.post
                        .engagement
                        .shares
                    )}
                  />

                  <Metric
                    icon={
                      <Play className="h-4 w-4 text-green-400" />
                    }
                    label="Views"
                    value={formatNumber(
                      latest.post
                        .engagement
                        .views
                    )}
                  />
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                    {latest.post
                      .content ||
                      latest.post
                        .supplementalText ||
                      "No text content available."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {latest.post.postType}
                  </span>

                  {latestAudienceSentiment &&
                    latestAudienceSentiment.dominant !== "UNAVAILABLE" && (
                      <span
                        className={`rounded-full border px-3 py-1 ${
                          latestAudienceSentiment.dominant === "POSITIVE"
                            ? "border-green-500/20 bg-green-500/10 text-green-400"
                            : latestAudienceSentiment.dominant === "NEGATIVE"
                              ? "border-red-500/20 bg-red-500/10 text-red-400"
                              : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                        }`}
                      >
                        Audience: {latestAudienceSentiment.dominant}
                      </span>
                    )}

                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {latestComments.length} comments analyzed
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />

                    {formatDate(
                      latest.post
                        .publishedAt
                    )}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            AI ANALYSIS
            ================================================= */}

        {latest && (
          <section className="mb-10 grid gap-6 xl:grid-cols-2">

            {/* SENTIMENT */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <Brain className="h-5 w-5" />
                }
                title="AI sentiment"
              />

              <div className="mt-6 flex items-center gap-5">

                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
                    latest.aiAnalysis
                      .sentiment
                      .label ===
                    "POSITIVE"
                      ? "bg-green-500/10 text-green-400"
                      : latest.aiAnalysis
                          .sentiment
                          .label ===
                        "NEGATIVE"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {latest.aiAnalysis
                    .sentiment
                    .label ===
                  "POSITIVE" ? (
                    <ThumbsUp className="h-8 w-8" />
                  ) : latest.aiAnalysis
                      .sentiment
                      .label ===
                    "NEGATIVE" ? (
                    <ThumbsDown className="h-8 w-8" />
                  ) : (
                    <Minus className="h-8 w-8" />
                  )}
                </div>

                <div>
                  <p className="text-3xl font-bold">
                    {
                      latest
                        .aiAnalysis
                        .sentiment
                        .label
                    }
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Score:{" "}
                    {(
                      latest
                        .aiAnalysis
                        .sentiment
                        .score *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-zinc-400">
                {
                  latest.aiAnalysis
                    .sentiment
                    .explanation
                }
              </p>
            </div>

            {/* CONFIDENCE */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <ShieldAlert className="h-5 w-5" />
                }
                title="AI confidence"
              />

              <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    Analysis confidence
                  </span>

                  <span className="font-semibold text-white">
                    {(
                      latest
                        .aiAnalysis
                        .confidence *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${clamp(
                        latest
                          .aiAnalysis
                          .confidence *
                          100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-5 text-sm text-zinc-500">
                  Average confidence across
                  this session:{" "}
                  {(
                    averageConfidence *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            EMOTIONS + TOPICS
            ================================================= */}

        {latest && (
          <section className="mb-10 grid gap-6 xl:grid-cols-2">

            {/* EMOTIONS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <Activity className="h-5 w-5" />
                }
                title="Detected emotions"
              />

              <div className="mt-6 space-y-4">

                {latest.aiAnalysis
                  .emotions
                  .length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No emotions detected.
                  </p>
                ) : (
                  latest.aiAnalysis.emotions.map(
                    (emotion) => (
                      <div
                        key={
                          emotion.emotion
                        }
                      >
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-zinc-300">
                            {
                              emotion.emotion
                            }
                          </span>

                          <span className="text-zinc-500">
                            {(
                              emotion.score *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-purple-500"
                            style={{
                              width: `${clamp(
                                emotion.score *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            {/* TOPICS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <TrendingUp className="h-5 w-5" />
                }
                title="Detected topics"
              />

              <div className="mt-6 flex flex-wrap gap-3">

                {latest.aiAnalysis
                  .topics
                  .length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No topics detected.
                  </p>
                ) : (
                  latest.aiAnalysis.topics.map(
                    (topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-sm text-blue-300"
                      >
                        {topic}
                      </span>
                    )
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            INTENT + TOXICITY
            ================================================= */}

        {latest && (
          <section className="mb-10 grid gap-6 xl:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <Zap className="h-5 w-5" />
                }
                title="Content intent"
              />

              <div className="mt-5">
                <span className="inline-flex rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300">
                  {
                    latest.aiAnalysis
                      .intent
                      .label
                  }
                </span>

                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  {
                    latest.aiAnalysis
                      .intent
                      .explanation
                  }
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <ShieldAlert className="h-5 w-5" />
                }
                title="Toxicity & safety"
              />

              <div className="mt-5 flex items-center gap-4">

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                    latest.aiAnalysis
                      .toxicity
                      .detected
                      ? "bg-red-500/10 text-red-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {latest.aiAnalysis
                    .toxicity
                    .detected ? (
                    <AlertCircle className="h-7 w-7" />
                  ) : (
                    <CheckCircle2 className="h-7 w-7" />
                  )}
                </div>

                <div>
                  <p className="font-semibold">
                    {latest.aiAnalysis
                      .toxicity
                      .detected
                      ? "Potential toxicity detected"
                      : "No toxicity detected"}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Score:{" "}
                    {(
                      latest
                        .aiAnalysis
                        .toxicity
                        .score *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                {
                  latest.aiAnalysis
                    .toxicity
                    .explanation
                }
              </p>
            </div>
          </section>
        )}

        {/* =================================================
            SUMMARY
            ================================================= */}

        {latest && (
          <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <SectionTitle
              icon={
                <Sparkles className="h-5 w-5" />
              }
              title="AI summary"
            />

            <p className="mt-6 max-w-5xl text-base leading-8 text-zinc-300">
              {
                latest.aiAnalysis
                  .summary
              }
            </p>
          </section>
        )}

        {/* =================================================
            KEY INSIGHTS + RECOMMENDATIONS
            ================================================= */}

        {latest && (
          <section className="mb-10 grid gap-6 xl:grid-cols-2">

            {/* KEY INSIGHTS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <Brain className="h-5 w-5" />
                }
                title="Key insights"
              />

              <div className="mt-6 space-y-4">

                {latest.aiAnalysis
                  .keyInsights
                  .map(
                    (
                      insight,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-4"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                          {index +
                            1}
                        </span>

                        <p className="text-sm leading-6 text-zinc-300">
                          {insight}
                        </p>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* RECOMMENDATIONS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <SectionTitle
                icon={
                  <ArrowUpRight className="h-5 w-5" />
                }
                title="Recommendations"
              />

              <div className="mt-6 space-y-4">

                {latest.aiAnalysis
                  .recommendations
                  .map(
                    (
                      recommendation,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-4"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />

                        <p className="text-sm leading-6 text-zinc-300">
                          {
                            recommendation
                          }
                        </p>
                      </div>
                    )
                  )}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            ALL ANALYZED POSTS
            ================================================= */}

        {records.length > 0 && (
          <section className="mb-10">

            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  Analyzed posts
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Every URL analyzed during
                  this session.
                </p>
              </div>

              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                {records.length}{" "}
                posts
              </span>
            </div>

            <div className="space-y-4">

              {records.map(
                (
                  record,
                  index
                ) => (
                  <div
                    key={`${record.source.url}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                      {/* THUMBNAIL */}

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black/30">

                        {record.post
                          .media?.url ? (
                          <img
                            src={
                              record
                                .post
                                .media
                                .url
                            }
                            alt="Post"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-700">
                            <ImageIcon className="h-7 w-7" />
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="font-semibold text-white">
                            {record
                              .post
                              .author
                              ?.name ||
                              "Unknown"}
                          </span>

                          <span className="text-sm text-zinc-600">
                            @
                            {record
                              .post
                              .author
                              ?.handle ||
                              "unknown"}
                          </span>

                          <SentimentBadge
                            sentiment={
                              record
                                .aiAnalysis
                                .sentiment
                                .label
                            }
                          />
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                          {record
                            .post
                            .content ||
                            record
                              .post
                              .supplementalText ||
                            "No text available."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-600">

                          <span>
                            ❤️{" "}
                            {formatNumber(
                              record
                                .post
                                .engagement
                                .likes
                            )}
                          </span>

                          <span>
                            💬{" "}
                            {formatNumber(
                              record
                                .post
                                .engagement
                                .comments
                            )}
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              record
                                .post
                                .publishedAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* LINK */}

                      <a
                        href={
                          record
                            .post
                            .url ||
                          record
                            .source
                            .url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm text-zinc-300 hover:bg-white/5"
                      >
                        View

                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* =================================================
            EMPTY STATE
            ================================================= */}

        {records.length ===
          0 &&
          !loading && (
            <section className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center">

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Search className="h-9 w-9" />
              </div>

              <h2 className="text-2xl font-semibold">
                Start analyzing posts
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                Paste a public Instagram post
                URL above. The real post data
                will be retrieved from Apify,
                analyzed by Gemini, and displayed
                here.
              </p>
            </section>
          )}

        {/* =================================================
            FOOTER
            ================================================= */}

        <footer className="border-t border-white/10 pt-8 text-center text-xs text-zinc-600">
          SocialIntel analyzes publicly
          available social content and
          platform-authorized data.
        </footer>
      </div>
    </main>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon,
  title,
  value,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

      <div className="mb-8 flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 ${iconClass}`}
        >
          {icon}
        </div>

        <ArrowUpRight className="h-4 w-4 text-green-400" />
      </div>

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-600">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION TITLE
   ========================================================= */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h2 className="text-xl font-semibold">
        {title}
      </h2>
    </div>
  );
}

/* =========================================================
   METRIC
   ========================================================= */

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-4 py-3">

      {icon}

      <div>
        <p className="text-xs text-zinc-600">
          {label}
        </p>

        <p className="font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SENTIMENT BADGE
   ========================================================= */

function SentimentBadge({
  sentiment,
}: {
  sentiment:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";
}) {
  const classes =
    sentiment ===
    "POSITIVE"
      ? "border-green-500/20 bg-green-500/10 text-green-400"
      : sentiment ===
        "NEGATIVE"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${classes}`}
    >
      {sentiment}
    </span>
  );
}