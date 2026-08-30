"use client";

import { useAuth } from "@clerk/nextjs";

/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

/* =========================================================
   TYPES
   ========================================================= */

export interface AnalyzePostInput {
  url: string;
  profileId?: number;
}

export interface SentimentDistributionItem {
  label:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";

  count: number;
  percentage: number;
}

export interface SentimentOverTimeItem {
  date: string | null;

  sentiment:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";

  score: number;

  positive: number;
  negative: number;
  neutral: number;
}

export interface EngagementOverTimeItem {
  date: string | null;

  likes: number;
  comments: number;
  shares: number;
  views: number;

  engagement: number;
}

export interface DashboardOverview {
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

export interface DashboardPost {
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

  sentiment:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";

  sentimentScore: number | null;

  publishedAt: string | null;
}

export interface PostAnalysisDashboard {
  overview: DashboardOverview;

  sentimentDistribution: SentimentDistributionItem[];

  sentimentOverTime: SentimentOverTimeItem[];

  engagementOverTime: EngagementOverTimeItem[];

  posts: DashboardPost[];
}

/* =========================================================
   API RESPONSE TYPES
   ========================================================= */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

/* =========================================================
   ANALYZED POST RESPONSE
   ========================================================= */

export interface AnalyzedPostResponse {
  post: {
    platform: string;

    url: string;

    accessible: boolean;

    author: {
      name: string | null;
      handle: string | null;
    };

    content: string | null;

    postType: string;

    engagement: {
      likes: number | null;
      comments: number | null;
      shares: number | null;
      views: number | null;
    };

    publishedAt: string | null;

    media?: {
      url: string | null;
      type: string | null;
    };

    supplementalText?: string | null;
  };

  aiAnalysis: {
    sentiment: {
      label:
        | "POSITIVE"
        | "NEGATIVE"
        | "NEUTRAL";

      score: number;

      explanation: string;
    };

    emotions: Array<{
      emotion: string;
      score: number;
    }>;

    topics: string[];

    intent: {
      label: string;
      explanation: string;
    };

    summary: string;

    keyInsights: string[];

    toxicity: {
      detected: boolean;
      score: number;
      explanation: string;
    };

    recommendations: string[];

    confidence: number;
  };

  source: {
    url: string;

    retrieved: boolean;

    urlContextUsed: boolean;

    provider: string;
  };
}

/* =========================================================
   API HOOK
   ========================================================= */

export function useApi() {
  const { getToken } = useAuth();

  /* =======================================================
     GENERIC REQUEST FUNCTION
     ======================================================= */

  const request = async <T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = await getToken();

    if (!token) {
      throw new Error(
        "User is not authenticated."
      );
    }

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {}),

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    /* =====================================================
       HANDLE EMPTY RESPONSE
       ===================================================== */

    const text =
      await response.text();

    let data: any = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text,
        };
      }
    }

    /* =====================================================
       HANDLE API ERROR
       ===================================================== */

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `API request failed with status ${response.status}.`
      );
    }

    return data as T;
  };

  /* =======================================================
     ANALYZE A SOCIAL MEDIA POST
     ======================================================= */

  const analyzePost = async (
    url: string,
    profileId?: number
  ) => {
    const cleanUrl =
      url.trim();

    if (!cleanUrl) {
      throw new Error(
        "Post URL is required."
      );
    }

    const body: AnalyzePostInput = {
      url: cleanUrl,
    };

    /*
     * profileId is optional for backward compatibility.
     *
     * When the user is analyzing a post from
     * a monitoring profile, we will send it.
     *
     * Example:
     *
     * {
     *   url: "https://www.instagram.com/p/...",
     *   profileId: 1
     * }
     */

    if (
      profileId !== undefined &&
      Number.isFinite(profileId)
    ) {
      body.profileId =
        profileId;
    }

    return request<
      ApiResponse<AnalyzedPostResponse>
    >(
      "/api/post-analysis/analyze",
      {
        method: "POST",

        body: JSON.stringify(
          body
        ),
      }
    );
  };

  /* =======================================================
     GET OLD / EXISTING POST ANALYSIS
     ======================================================= */

  const getPostAnalysis = async (
    profileId: number
  ) => {
    if (
      !profileId ||
      !Number.isFinite(profileId)
    ) {
      throw new Error(
        "profileId is required."
      );
    }

    return request(
      `/api/post-analysis?profileId=${encodeURIComponent(
        profileId
      )}`,
      {
        method: "GET",
      }
    );
  };

  /* =======================================================
     GET POST ANALYSIS DASHBOARD
     ======================================================= */

  const getPostAnalysisDashboard =
    async (
      profileId: number
    ) => {
      if (
        !profileId ||
        !Number.isFinite(profileId)
      ) {
        throw new Error(
          "profileId is required."
        );
      }

      return request<
        ApiResponse<PostAnalysisDashboard>
      >(
        `/api/post-analysis/dashboard?profileId=${encodeURIComponent(
          profileId
        )}`,
        {
          method: "GET",
        }
      );
    };

  /* =======================================================
     GET DATA SOURCES
     ======================================================= */

  const getDataSources = async (
    profileId: number
  ) => {
    if (
      !profileId ||
      !Number.isFinite(profileId)
    ) {
      throw new Error(
        "profileId is required."
      );
    }

    return request(
      `/api/data-sources?profileId=${encodeURIComponent(
        profileId
      )}`,
      {
        method: "GET",
      }
    );
  };

  /* =======================================================
     CONNECT DATA SOURCE
     ======================================================= */

  const connectDataSource =
    async (input: {
      profileId: number;

      platform:
        | "X"
        | "INSTAGRAM"
        | "TELEGRAM"
        | "YOUTUBE";

      username?: string;

      profileUrl?: string;

      externalId?: string;
    }) => {
      return request(
        "/api/data-sources",
        {
          method: "POST",

          body: JSON.stringify(
            input
          ),
        }
      );
    };

  /* =======================================================
     UPDATE DATA SOURCE
     ======================================================= */

  const updateDataSource =
    async (
      id: number,
      input: {
        status?: string;
        username?: string;
        profileUrl?: string;
        externalId?: string;
      }
    ) => {
      if (
        !id ||
        !Number.isFinite(id)
      ) {
        throw new Error(
          "Invalid data source ID."
        );
      }

      return request(
        `/api/data-sources/${id}`,
        {
          method: "PATCH",

          body: JSON.stringify(
            input
          ),
        }
      );
    };

  /* =======================================================
     DISCONNECT DATA SOURCE
     ======================================================= */

  const disconnectDataSource =
    async (
      id: number
    ) => {
      if (
        !id ||
        !Number.isFinite(id)
      ) {
        throw new Error(
          "Invalid data source ID."
        );
      }

      return request(
        `/api/data-sources/${id}/disconnect`,
        {
          method: "PATCH",
        }
      );
    };

  /* =======================================================
     DELETE DATA SOURCE
     ======================================================= */

  const deleteDataSource =
    async (
      id: number
    ) => {
      if (
        !id ||
        !Number.isFinite(id)
      ) {
        throw new Error(
          "Invalid data source ID."
        );
      }

      return request(
        `/api/data-sources/${id}`,
        {
          method: "DELETE",
        }
      );
    };

  /* =======================================================
     RETURN API METHODS
     ======================================================= */

  return {
    request,

    analyzePost,

    getPostAnalysis,

    getPostAnalysisDashboard,

    getDataSources,

    connectDataSource,

    updateDataSource,

    disconnectDataSource,

    deleteDataSource,
  };
}