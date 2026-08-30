"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
} from "lucide-react";

import { useApi } from "@/src/lib/api";

/* =========================================================
   TYPES
   ========================================================= */

interface StoredProfile {
  id: number;
  userId?: number;

  type:
    | "PERSON"
    | "BRAND"
    | "CAMPAIGN";

  name: string;

  input?: string;

  identifier: string;

  isActive?: boolean;

  createdAt?: string;
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

interface DashboardData {
  overview: DashboardOverview;

  sentimentDistribution?: Array<{
    label: string;
    count: number;
    percentage: number;
  }>;

  posts?: Array<{
    id: number;
    authorName: string | null;
    authorHandle: string | null;
    content: string | null;
    url: string | null;
    postType: string;
    likes: number;
    comments: number;
    shares: number;
    views: number;
    sentiment: string;
    sentimentScore: number | null;
    publishedAt: string | null;
  }>;
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatNumber(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}

function formatCompact(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    ).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(
      value / 1_000
    ).toFixed(1)}K`;
  }

  return formatNumber(value);
}

function getStoredProfile(): StoredProfile | null {
  try {
    const stored =
      sessionStorage.getItem(
        "socialintel_profile"
      );

    if (stored) {
      const parsed =
        JSON.parse(stored);

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
      "Failed to read stored profile:",
      error
    );

    return null;
  }
}

/* =========================================================
   DASHBOARD
   ========================================================= */

export default function Dashboard() {
  const router =
    useRouter();

  const {
    getPostAnalysisDashboard,
  } = useApi();

  const [
    profile,
    setProfile,
  ] =
    useState<StoredProfile | null>(
      null
    );

  const [
    dashboard,
    setDashboard,
  ] =
    useState<DashboardData | null>(
      null
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
     LOAD REAL ANALYTICS
     ======================================================= */

  const loadDashboard =
    async (
      showRefresh = false
    ) => {
      if (!profile?.id) {
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
            profile.id
          );

        if (
          !response?.success
        ) {
          throw new Error(
            response?.message ||
              "Failed to load dashboard."
          );
        }

        setDashboard(
          response.data
        );
      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useEffect(() => {
    if (profile?.id) {
      loadDashboard();
    }
  }, [profile?.id]);

  /* =======================================================
     NO PROFILE
     ======================================================= */

  if (
    !loading &&
    !profile
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-6 text-white">
        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 text-center">
          <AlertCircle
            size={38}
            className="mx-auto text-yellow-400"
          />

          <h1 className="mt-5 text-xl font-semibold">
            No monitoring profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Create a monitoring profile
            first. Your real analytics
            will appear here once posts
            have been analyzed.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/create-profile"
              )
            }
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Create profile
          </button>
        </div>
      </main>
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
            Loading dashboard...
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
        <div className="max-w-lg rounded-3xl border border-red-500/20 bg-white/[0.025] p-8 text-center">
          <AlertCircle
            size={38}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-5 text-xl font-semibold">
            Dashboard error
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadDashboard(true)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  const overview =
    dashboard?.overview;

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#080b12] text-white">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">

        <div className="flex h-20 items-center justify-between px-5 sm:px-8">

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
              SocialIntel
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              Dashboard
            </h1>

          </div>

          <button
            type="button"
            onClick={() =>
              loadDashboard(true)
            }
            disabled={refreshing}
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

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="px-5 py-8 sm:px-8">

        {/* ===================================================
            PROFILE
            =================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="text-3xl font-semibold">
                  {profile?.name ||
                    "Monitoring Profile"}
                </h2>

                <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-400">
                  {profile?.type ||
                    "PERSON"}
                </span>

              </div>

              {profile?.identifier && (
                <p className="mt-2 text-sm text-zinc-500">
                  {profile.identifier}
                </p>
              )}

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Real-time social intelligence
                from your analyzed posts.
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs text-emerald-400">
                Analytics active
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            STAT CARDS
            =================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={MessageSquare}
            title="Analyzed posts"
            value={formatCompact(
              overview?.totalPosts ??
                0
            )}
            description="real posts analyzed"
          />

          <StatCard
            icon={Users}
            title="Comments"
            value={formatCompact(
              overview?.totalComments ??
                0
            )}
            description="real audience comments"
          />

          <StatCard
            icon={Zap}
            title="Engagement"
            value={formatCompact(
              overview?.totalEngagement ??
                0
            )}
            description="likes + comments + shares + views"
          />

          <StatCard
            icon={TrendingUp}
            title="Positive sentiment"
            value={`${(
              overview?.positivePercentage ??
              0
            ).toFixed(1)}%`}
            description="of analyzed posts"
          />

        </section>

        {/* ===================================================
            SENTIMENT
            =================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-3">

          <SentimentCard
            title="Positive"
            value={
              overview
                ?.positivePercentage ??
              0
            }
            count={
              overview
                ?.positivePosts ??
              0
            }
            icon={TrendingUp}
            className="text-emerald-400"
          />

          <SentimentCard
            title="Neutral"
            value={
              overview
                ?.neutralPercentage ??
              0
            }
            count={
              overview
                ?.neutralPosts ??
              0
            }
            icon={Activity}
            className="text-zinc-400"
          />

          <SentimentCard
            title="Negative"
            value={
              overview
                ?.negativePercentage ??
              0
            }
            count={
              overview
                ?.negativePosts ??
              0
            }
            icon={TrendingUp}
            className="text-red-400"
          />

        </section>

        {/* ===================================================
            ENGAGEMENT METRICS
            =================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Engagement overview
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Aggregated metrics from
                analyzed posts.
              </p>

            </div>

            <BarChart3
              size={22}
              className="text-blue-400"
            />

          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Metric
              label="Likes"
              value={
                overview?.totalLikes ??
                0
              }
            />

            <Metric
              label="Comments"
              value={
                overview
                  ?.totalComments ??
                0
              }
            />

            <Metric
              label="Shares"
              value={
                overview?.totalShares ??
                0
              }
            />

            <Metric
              label="Views"
              value={
                overview?.totalViews ??
                0
              }
            />

          </div>

        </section>

        {/* ===================================================
            LATEST POSTS
            =================================================== */}

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Latest analyzed posts
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Posts contributing to your
                current analytics.
              </p>

            </div>

            <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400">
              {dashboard?.posts
                ?.length ??
                0}{" "}
              shown
            </span>

          </div>

          <div className="mt-6 space-y-3">

            {!dashboard?.posts ||
            dashboard.posts.length ===
              0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center">

                <MessageSquare
                  size={28}
                  className="mx-auto text-zinc-700"
                />

                <p className="mt-3 text-sm text-zinc-500">
                  No analyzed posts yet.
                </p>

                <p className="mt-1 text-xs text-zinc-700">
                  Analyze an Instagram post
                  to populate your dashboard.
                </p>

              </div>
            ) : (
              dashboard.posts
                .slice(0, 10)
                .map((post) => (
                  <DashboardPost
                    key={post.id}
                    post={post}
                  />
                ))
            )}

          </div>

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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/[0.14] hover:bg-white/[0.04]">

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
   SENTIMENT CARD
   ========================================================= */

function SentimentCard({
  title,
  value,
  count,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  count: number;
  icon: typeof Activity;
  className: string;
}) {
  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {safeValue.toFixed(1)}%
          </p>

        </div>

        <Icon
          size={22}
          className={className}
        />

      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className={`h-full rounded-full ${
            title ===
            "Positive"
              ? "bg-emerald-400"
              : title ===
                "Negative"
              ? "bg-red-400"
              : "bg-zinc-500"
          }`}
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

      <p className="mt-3 text-xs text-zinc-600">
        {formatNumber(count)} posts
      </p>

    </div>
  );
}

/* =========================================================
   METRIC
   ========================================================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">

      <p className="text-xs uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-zinc-200">
        {formatCompact(
          value
        )}
      </p>

    </div>
  );
}

/* =========================================================
   DASHBOARD POST
   ========================================================= */

function DashboardPost({
  post,
}: {
  post: NonNullable<
    DashboardData["posts"]
  >[number];
}) {
  const sentiment =
    post.sentiment ||
    "NEUTRAL";

  const sentimentClass =
    sentiment ===
    "POSITIVE"
      ? "bg-emerald-500/10 text-emerald-400"
      : sentiment ===
        "NEGATIVE"
      ? "bg-red-500/10 text-red-400"
      : "bg-zinc-500/10 text-zinc-400";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${sentimentClass}`}
            >
              {sentiment}
            </span>

            <span className="text-xs text-zinc-600">
              {post.postType}
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

        <div className="grid grid-cols-3 gap-5 lg:w-[280px]">

          <Metric
            label="Likes"
            value={post.likes}
          />

          <Metric
            label="Comments"
            value={post.comments}
          />

          <Metric
            label="Shares"
            value={post.shares}
          />

        </div>

      </div>

    </div>
  );
}