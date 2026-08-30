"use client";

import { useAuth } from "@clerk/nextjs";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

/* =========================================================
   TYPES
   ========================================================= */

export interface CreateProfileInput {
  clerkId: string;
  email: string;
  name?: string;
  username?: string;

  profileType:
    | "PERSON"
    | "BRAND"
    | "CAMPAIGN";

  profileName: string;
  identifier: string;
}

/* =========================================================
   GENERIC API RESPONSE
   ========================================================= */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/* =========================================================
   CREATED PROFILE
   ========================================================= */

export interface CreatedProfile {
  user: {
    id: number;
    clerkId: string;
    email: string;
    name?: string | null;
    username?: string | null;
  };

  profile: {
    id: number;
    userId: number;
    name: string;

    type:
      | "PERSON"
      | "BRAND"
      | "CAMPAIGN";

    identifier: string;
    description?: string | null;
    isActive: boolean;
  };
}

/* =========================================================
   INSTAGRAM COMMENT
   ========================================================= */

export interface InstagramComment {
  id: string | null;
  username: string | null;
  text: string;
  likes: number | null;
  timestamp: string | null;
}

/* =========================================================
   AUDIENCE SENTIMENT
   ========================================================= */

export interface AudienceSentiment {
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

    commentsData?: InstagramComment[];
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

    audienceSentiment?: AudienceSentiment;

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
   POST ANALYSIS DASHBOARD TYPES
   ========================================================= */

export interface DashboardOverview {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
}

export interface SentimentDistributionItem {
  sentiment:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";

  count: number;
}

export interface SentimentOverTimeItem {
  date: string;

  positive: number;
  negative: number;
  neutral: number;
}

export interface EngagementOverTimeItem {
  date: string;

  likes: number;
  comments: number;
  shares: number;
  views: number;
}

export interface DashboardPost {
  id: number;

  platform: string;

  url: string;

  content: string | null;

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

  sentimentDistribution:
    SentimentDistributionItem[];

  sentimentOverTime:
    SentimentOverTimeItem[];

  engagementOverTime:
    EngagementOverTimeItem[];

  posts: DashboardPost[];
}

/* =========================================================
   API HOOK
   ========================================================= */

export function useApi() {
  const { getToken } = useAuth();

  /* =======================================================
     GENERIC REQUEST
     ======================================================= */

  const request = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = await getToken();

    if (!token) {
      throw new Error(
        "User is not authenticated."
      );
    }

    let response: Response;

    try {
      response = await fetch(
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

          cache: "no-store",
        }
      );
    } catch (error) {
      console.error(
        "API network error:",
        error
      );

      throw new Error(
        `Unable to connect to backend at ${API_URL}. Make sure the backend server is running.`
      );
    }

    let data: any = null;

    const contentType =
      response.headers.get(
        "content-type"
      );

    try {
      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      } else {
        const text =
          await response.text();

        data = text
          ? { message: text }
          : null;
      }
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `API request failed with status ${response.status}.`
      );
    }

    return data as T;
  };

  /* =======================================================
     CREATE MONITORING PROFILE
     ======================================================= */

  const createProfile = async (
    input: CreateProfileInput
  ) => {
    if (
      !input.profileName.trim()
    ) {
      throw new Error(
        "Profile name is required."
      );
    }

    if (
      !input.identifier.trim()
    ) {
      throw new Error(
        "Profile identifier is required."
      );
    }

    return request<
      ApiResponse<CreatedProfile>
    >(
      "/api/profiles",
      {
        method: "POST",

        body: JSON.stringify({
          clerkId:
            input.clerkId,

          email:
            input.email,

          name:
            input.name,

          username:
            input.username,

          profileType:
            input.profileType,

          profileName:
            input.profileName.trim(),

          identifier:
            input.identifier.trim(),
        }),
      }
    );
  };

  /* =======================================================
     GET PROFILES
     ======================================================= */

  const getProfiles = async (
    clerkId: string
  ) => {
    if (!clerkId) {
      throw new Error(
        "Clerk user ID is required."
      );
    }

    return request<
      ApiResponse<
        CreatedProfile["profile"][]
      >
    >(
      `/api/profiles?clerkId=${encodeURIComponent(
        clerkId
      )}`,
      {
        method: "GET",
      }
    );
  };

  /* =======================================================
     ANALYZE POST
     ======================================================= */

  const analyzePost = async (
    url: string,
    profileId?: number
  ) => {
    if (!url.trim()) {
      throw new Error(
        "Post URL is required."
      );
    }

    return request<
      ApiResponse<AnalyzedPostResponse>
    >(
      "/api/post-analysis/analyze",
      {
        method: "POST",

        body: JSON.stringify({
          url: url.trim(),

          ...(profileId
            ? { profileId }
            : {}),
        }),
      }
    );
  };

  /* =======================================================
     GET POST ANALYSIS
     ======================================================= */

  const getPostAnalysis = async (
    profileId: number
  ) => {
    if (!profileId) {
      throw new Error(
        "profileId is required."
      );
    }

    return request<
      ApiResponse<
        AnalyzedPostResponse[]
      >
    >(
      `/api/post-analysis?profileId=${profileId}`,
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
      if (!profileId) {
        throw new Error(
          "profileId is required."
        );
      }

      return request<
        ApiResponse<
          PostAnalysisDashboard
        >
      >(
        `/api/post-analysis/dashboard?profileId=${profileId}`,
        {
          method: "GET",
        }
      );
    };

  /* =======================================================
     DATA SOURCES
     ======================================================= */

  const getDataSources = async (
    profileId: number
  ) => {
    if (!profileId) {
      throw new Error(
        "profileId is required."
      );
    }

    return request(
      `/api/data-sources?profileId=${profileId}`,
      {
        method: "GET",
      }
    );
  };

  /* =======================================================
     CONNECT DATA SOURCE
     ======================================================= */

  const connectDataSource = async (
    input: {
      profileId: number;

      platform:
        | "X"
        | "INSTAGRAM"
        | "TELEGRAM"
        | "YOUTUBE";

      username?: string;

      profileUrl?: string;

      externalId?: string;
    }
  ) => {
    if (!input.profileId) {
      throw new Error(
        "profileId is required."
      );
    }

    if (!input.platform) {
      throw new Error(
        "platform is required."
      );
    }

    return request(
      "/api/data-sources",
      {
        method: "POST",

        body: JSON.stringify({
          profileId:
            input.profileId,

          platform:
            input.platform,

          username:
            input.username,

          profileUrl:
            input.profileUrl,

          externalId:
            input.externalId,
        }),
      }
    );
  };

  /* =======================================================
     GET SINGLE DATA SOURCE
     ======================================================= */

  const getDataSource = async (
    id: number
  ) => {
    if (!id) {
      throw new Error(
        "Data source ID is required."
      );
    }

    return request(
      `/api/data-sources/${id}`,
      {
        method: "GET",
      }
    );
  };

  /* =======================================================
     UPDATE DATA SOURCE
     ======================================================= */

  const updateDataSource = async (
    id: number,
    input: {
      status?: string;
      username?: string;
      profileUrl?: string;
      externalId?: string;
    }
  ) => {
    if (!id) {
      throw new Error(
        "Data source ID is required."
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
      if (!id) {
        throw new Error(
          "Data source ID is required."
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

  const deleteDataSource = async (
    id: number
  ) => {
    if (!id) {
      throw new Error(
        "Data source ID is required."
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
     RETURN API
     ======================================================= */

  return {
    request,

    /* Profiles */
    createProfile,
    getProfiles,

    /* Post analysis */
    analyzePost,
    getPostAnalysis,
    getPostAnalysisDashboard,

    /* Data sources */
    getDataSources,
    getDataSource,
    connectDataSource,
    updateDataSource,
    disconnectDataSource,
    deleteDataSource,
  };
}