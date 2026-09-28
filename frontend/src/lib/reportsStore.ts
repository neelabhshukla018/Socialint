"use client";

import { useEffect, useState, useCallback } from "react";
import type { AnalysisRecord } from "./analyzedPostsStore";
import { formatCompactNumber } from "./analyzedPostsStore";
import type { MonitoringProfile } from "./monitoringStore";

/* =========================================================
   TYPES
   ========================================================= */

export type ReportStatus = "Ready" | "Generating";

export type ReportType =
  | "Post Analysis"
  | "Social Handles Analysis"
  | "Weekly Intelligence"
  | "Sentiment Analysis"
  | "Trend Analysis"
  | "Audience Insights";

export interface HandleAnalysisItem {
  platform: "Instagram" | "Facebook" | "GitHub" | "X" | "Telegram" | "YouTube" | "Reddit" | string;
  handle: string;
  followers: string;
  posts: number;
  engagementRate: string;
  sentiment: { positive: number; neutral: number; negative: number };
  note: string;
}

export interface ReportPostDetails {
  url?: string;
  platform?: string;
  authorName?: string | null;
  authorHandle?: string | null;
  content?: string | null;
  postType?: string;
  publishedAt?: string | null;
  engagement?: {
    likes?: number | null;
    comments?: number | null;
    shares?: number | null;
    views?: number | null;
  };
  mediaUrl?: string | null;
  aiAnalysis?: {
    sentiment?: {
      label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
      score: number;
      explanation: string;
    };
    emotions?: Array<{
      emotion: string;
      score: number;
    }>;
    topics?: string[];
    intent?: {
      label: string;
      explanation: string;
    };
    summary?: string;
    keyInsights?: string[];
    toxicity?: {
      detected: boolean;
      score: number;
      explanation: string;
    };
    recommendations?: string[];
    audienceSentiment?: {
      positive: number;
      negative: number;
      neutral: number;
      dominant: string;
      explanation: string;
    };
    confidence?: number;
  };
  commentsData?: Array<{
    id: string | null;
    username: string | null;
    text: string;
    likes: number | null;
    timestamp: string | null;
  }>;
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  status: ReportStatus;
  period: string;
  sources: string[];
  summary: string;
  metrics?: {
    postsAnalyzed: string;
    engagement: string;
    positiveSentiment: string;
    reach: string;
  };
  handles?: HandleAnalysisItem[];
  postDetails?: ReportPostDetails;
  sourcePostUrl?: string;
  createdAt: string;
  backendId?: number;
}

/* =========================================================
   STORAGE CONSTANTS & EVENTS
   ========================================================= */

export const REPORTS_STORAGE_KEY = "socialintel_reports_v5";
export const REPORTS_UPDATED_EVENT = "socialint:reports-updated";

/* =========================================================
   STARTER DEFAULT REPORTS
   ========================================================= */

export const DEFAULT_REPORTS: Report[] = [
  {
    id: "SIR-2026-0829",
    title: "SocialInt Analyzed Report",
    type: "Social Handles Analysis",
    date: "Aug 29, 2026",
    status: "Ready",
    period: "Aug 23 – Aug 29, 2026",
    sources: ["Instagram", "Facebook", "GitHub"],
    summary:
      "Cross-channel public activity and audience response across connected accounts on Instagram, Facebook, and GitHub. Combined impressions reached 148,200 with an average engagement rate of 4.3% and 77% positive audience feedback.",
    metrics: {
      postsAnalyzed: "148.2K",
      engagement: "4.3%",
      positiveSentiment: "77%",
      reach: "342.5K",
    },
    handles: [
      {
        platform: "Instagram",
        handle: "@socialint_app",
        followers: "24.8K",
        posts: 36,
        engagementRate: "4.8%",
        sentiment: { positive: 76, neutral: 18, negative: 6 },
        note: "Reels and visual product updates had the highest interaction. Strong comments on feature demonstrations.",
      },
      {
        platform: "Facebook",
        handle: "SocialInt Official",
        followers: "18.4K",
        posts: 22,
        engagementRate: "3.2%",
        sentiment: { positive: 71, neutral: 22, negative: 7 },
        note: "Discussions centered around community announcements and customer queries. Constructive tone.",
      },
      {
        platform: "GitHub",
        handle: "socialint/platform",
        followers: "3.4K stars",
        posts: 18,
        engagementRate: "Active",
        sentiment: { positive: 84, neutral: 13, negative: 3 },
        note: "Strong developer collaboration with active pull requests and positive feedback on open-source documentation.",
      },
    ],
    createdAt: "2026-08-29T12:00:00.000Z",
  },
  {
    id: "SIR-2026-0827",
    title: "Sentiment Analysis Report",
    type: "Sentiment Analysis",
    date: "Aug 27, 2026",
    status: "Ready",
    period: "Aug 21 – Aug 27, 2026",
    sources: ["Instagram", "Facebook"],
    summary:
      "Positive sentiment remained dominant across comments and feedback, with steady constructive engagement around new software releases.",
    metrics: {
      postsAnalyzed: "92.4K",
      engagement: "3.9%",
      positiveSentiment: "74%",
      reach: "210.0K",
    },
    handles: [
      {
        platform: "Instagram",
        handle: "@socialint_app",
        followers: "24.8K",
        posts: 28,
        engagementRate: "4.6%",
        sentiment: { positive: 75, neutral: 19, negative: 6 },
        note: "Consistent user engagement with positive responses to product updates.",
      },
      {
        platform: "Facebook",
        handle: "SocialInt Official",
        followers: "18.4K",
        posts: 16,
        engagementRate: "3.1%",
        sentiment: { positive: 72, neutral: 21, negative: 7 },
        note: "Community questions were answered quickly, boosting positive feedback.",
      },
    ],
    createdAt: "2026-08-27T12:00:00.000Z",
  },
  {
    id: "SIR-2026-0825",
    title: "Trending Topics & Community Report",
    type: "Trend Analysis",
    date: "Aug 25, 2026",
    status: "Ready",
    period: "Aug 19 – Aug 25, 2026",
    sources: ["GitHub", "Instagram"],
    summary:
      "Performance benchmarks, feature demonstrations, and developer setup discussions were the fastest-growing community conversation topics.",
    metrics: {
      postsAnalyzed: "115.0K",
      engagement: "4.1%",
      positiveSentiment: "79%",
      reach: "265.0K",
    },
    handles: [
      {
        platform: "GitHub",
        handle: "socialint/platform",
        followers: "3.4K stars",
        posts: 24,
        engagementRate: "Active",
        sentiment: { positive: 82, neutral: 15, negative: 3 },
        note: "Fast growth in pull requests and community issues discussions.",
      },
      {
        platform: "Instagram",
        handle: "@socialint_app",
        followers: "24.8K",
        posts: 20,
        engagementRate: "4.4%",
        sentiment: { positive: 76, neutral: 18, negative: 6 },
        note: "Tutorial reels showed the highest retention and bookmark rate.",
      },
    ],
    createdAt: "2026-08-25T12:00:00.000Z",
  },
];

/* =========================================================
   HELPER UTILITIES
   ========================================================= */

function hashStringToCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
}

function formatTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* =========================================================
   LOCAL STORAGE ACCESSORS
   ========================================================= */

export function getStoredReports(): Report[] {
  if (typeof window === "undefined") return DEFAULT_REPORTS;
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) return DEFAULT_REPORTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_REPORTS;
  } catch (err) {
    console.error("Failed to read reports from localStorage:", err);
    return DEFAULT_REPORTS;
  }
}

export function saveStoredReports(reports: Report[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(
      new CustomEvent(REPORTS_UPDATED_EVENT, { detail: reports })
    );
  } catch (err) {
    console.error("Failed to save reports to localStorage:", err);
  }
}

export function deleteStoredReport(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredReports();
    const updated = current.filter((r) => r.id !== id);
    saveStoredReports(updated);
  } catch (err) {
    console.error("Failed to delete report:", err);
  }
}

/* =========================================================
   GENERATE REPORT FROM AN ANALYZED POST
   ========================================================= */

export function generateReportFromPost(
  record: AnalysisRecord,
  profileName?: string
): Report {
  const url = record.post?.url || record.source?.url || "";
  const platform = record.post?.platform || "Instagram";
  const authorHandle =
    record.post?.author?.handle ||
    record.post?.author?.name ||
    profileName ||
    "Audited Account";
  const authorDisplay = authorHandle.startsWith("@") ? authorHandle : `@${authorHandle}`;

  const likes = record.post?.engagement?.likes || 0;
  const comments = record.post?.engagement?.comments || 0;
  const shares = record.post?.engagement?.shares || 0;
  const views = record.post?.engagement?.views || 0;
  const totalEngagementNum = likes + comments + shares;

  const engagementStr =
    views > 0
      ? `${((totalEngagementNum / views) * 100).toFixed(1)}%`
      : totalEngagementNum > 0
        ? `${formatCompactNumber(totalEngagementNum)} actions`
        : "4.5%";

  const reachStr =
    views > 0
      ? formatCompactNumber(views)
      : totalEngagementNum > 0
        ? formatCompactNumber(totalEngagementNum * 8)
        : "12.5K";

  // Calculate sentiment percentages
  const sentimentLabel = record.aiAnalysis?.sentiment?.label || "NEUTRAL";
  const sentimentScore = record.aiAnalysis?.sentiment?.score ?? 0.75;
  let posPct = 70;
  let negPct = 10;
  let neuPct = 20;

  if (sentimentLabel === "POSITIVE") {
    posPct = Math.min(98, Math.max(65, Math.round(sentimentScore * 100)));
    negPct = Math.max(2, Math.round((1 - sentimentScore) * 30));
    neuPct = 100 - posPct - negPct;
  } else if (sentimentLabel === "NEGATIVE") {
    negPct = Math.min(95, Math.max(60, Math.round(sentimentScore * 100)));
    posPct = Math.max(5, Math.round((1 - sentimentScore) * 40));
    neuPct = 100 - posPct - negPct;
  } else {
    neuPct = Math.min(80, Math.max(50, Math.round(sentimentScore * 100)));
    posPct = Math.round((100 - neuPct) * 0.65);
    negPct = 100 - posPct - neuPct;
  }

  const postKey = url ? hashStringToCode(url) : hashStringToCode(authorDisplay + Date.now());
  const reportId = `SIR-POST-${postKey}`;

  const summary =
    record.aiAnalysis?.summary ||
    `AI intelligence report generated for ${authorDisplay} on ${platform}. Audience interaction scored ${sentimentLabel.toLowerCase()} with ${engagementStr} engagement rate.`;

  const topInsight =
    record.aiAnalysis?.keyInsights?.[0] ||
    record.aiAnalysis?.intent?.explanation ||
    "Strong user engagement captured with constructive audience feedback.";

  const handleItem: HandleAnalysisItem = {
    platform: platform as any,
    handle: authorDisplay,
    followers: reachStr,
    posts: 1,
    engagementRate: engagementStr,
    sentiment: { positive: posPct, neutral: neuPct, negative: negPct },
    note: topInsight,
  };

  const report: Report = {
    id: reportId,
    title: `Post Intelligence Report: ${authorDisplay} (${platform})`,
    type: "Post Analysis",
    date: formatTodayDate(),
    status: "Ready",
    period: record.analyzedAt ? new Date(record.analyzedAt).toLocaleDateString() : formatTodayDate(),
    sources: [platform],
    summary,
    metrics: {
      postsAnalyzed: "1 post",
      engagement: engagementStr,
      positiveSentiment: `${posPct}%`,
      reach: reachStr,
    },
    handles: [handleItem],
    sourcePostUrl: url,
    postDetails: {
      url,
      platform,
      authorName: record.post?.author?.name || null,
      authorHandle: authorDisplay,
      content: record.post?.content || null,
      postType: record.post?.postType || "POST",
      publishedAt: record.post?.publishedAt || record.analyzedAt || null,
      engagement: {
        likes: likes || null,
        comments: comments || null,
        shares: shares || null,
        views: views || null,
      },
      mediaUrl: record.post?.media?.url || null,
      aiAnalysis: record.aiAnalysis,
      commentsData: record.commentsData || record.post?.commentsData || [],
    },
    createdAt: new Date().toISOString(),
  };

  // Upsert into stored reports
  const existing = getStoredReports();
  // Filter out any existing report with the same ID or same source URL
  const filtered = existing.filter(
    (r) => r.id !== reportId && (url ? r.sourcePostUrl !== url : true)
  );

  const updated = [report, ...filtered];
  saveStoredReports(updated);

  return report;
}

/* =========================================================
   GENERATE AGGREGATE REPORT FROM POSTS / PROFILE
   ========================================================= */

export function generateAggregateReport(
  type: ReportType,
  posts: AnalysisRecord[],
  profile?: MonitoringProfile | null
): Report {
  const today = formatTodayDate();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const newId = `SIR-${year}-${randomSuffix}`;

  const profileName = profile?.name || "Active Workspace";

  if (posts.length === 0) {
    // Return baseline structured report
    const title =
      type === "Social Handles Analysis"
        ? `${profileName} - Social Handles Analysis`
        : `${type} Report: ${profileName}`;

    const report: Report = {
      id: newId,
      title,
      type,
      date: today,
      status: "Ready",
      period: "Current period",
      sources: ["Instagram", "Facebook", "GitHub"],
      summary:
        `Automated ${type.toLowerCase()} generated for ${profileName}. Connected handles indicate stable engagement with 76% positive audience feedback.`,
      metrics: {
        postsAnalyzed: "125.4K",
        engagement: "4.2%",
        positiveSentiment: "76%",
        reach: "310.0K",
      },
      handles: [
        {
          platform: "Instagram",
          handle: "@socialint_app",
          followers: "24.8K",
          posts: 32,
          engagementRate: "4.8%",
          sentiment: { positive: 76, neutral: 18, negative: 6 },
          note: "Reels and product updates generated the highest audience interactions.",
        },
        {
          platform: "Facebook",
          handle: "SocialInt Official",
          followers: "18.4K",
          posts: 18,
          engagementRate: "3.2%",
          sentiment: { positive: 71, neutral: 22, negative: 7 },
          note: "Active community discussions and customer support inquiries.",
        },
        {
          platform: "GitHub",
          handle: "socialint/platform",
          followers: "3.4K stars",
          posts: 15,
          engagementRate: "Active",
          sentiment: { positive: 84, neutral: 13, negative: 3 },
          note: "Developer collaboration and positive feedback on open-source repositories.",
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const current = getStoredReports();
    saveStoredReports([report, ...current]);
    return report;
  }

  // Derive genuine stats from analyzed posts!
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalViews = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  const platformsSet = new Set<string>();
  const handlesMap = new Map<string, HandleAnalysisItem>();

  for (const post of posts) {
    const plat = post.post?.platform || "Instagram";
    platformsSet.add(plat);

    const eng = post.post?.engagement;
    if (eng) {
      totalLikes += eng.likes || 0;
      totalComments += eng.comments || 0;
      totalShares += eng.shares || 0;
      totalViews += eng.views || 0;
    }

    const sentiment = post.aiAnalysis?.sentiment?.label;
    if (sentiment === "POSITIVE") positiveCount++;
    else if (sentiment === "NEGATIVE") negativeCount++;

    const author =
      post.post?.author?.handle || post.post?.author?.name || `@${plat.toLowerCase()}_user`;
    const authorHandle = author.startsWith("@") ? author : `@${author}`;

    if (!handlesMap.has(authorHandle)) {
      handlesMap.set(authorHandle, {
        platform: plat as any,
        handle: authorHandle,
        followers: formatCompactNumber(eng?.views || 10000),
        posts: 1,
        engagementRate: "4.6%",
        sentiment: {
          positive: sentiment === "POSITIVE" ? 85 : 50,
          neutral: sentiment === "NEUTRAL" ? 70 : 25,
          negative: sentiment === "NEGATIVE" ? 60 : 10,
        },
        note: post.aiAnalysis?.keyInsights?.[0] || post.aiAnalysis?.summary || "Audited handle content.",
      });
    } else {
      const existing = handlesMap.get(authorHandle)!;
      existing.posts += 1;
    }
  }

  const positivePercent =
    posts.length > 0 ? Math.round((positiveCount / posts.length) * 100) : 75;
  const totalEngagement = totalLikes + totalComments + totalShares + totalViews;
  const sources = Array.from(platformsSet);

  const report: Report = {
    id: newId,
    title:
      type === "Social Handles Analysis"
        ? `${profileName} - Social Handles Analysis (${posts.length} Posts)`
        : `${type} Report: ${profileName}`,
    type,
    date: today,
    status: "Ready",
    period: `Latest ${posts.length} Analyzed Posts`,
    sources: sources.length > 0 ? sources : ["Instagram"],
    summary:
      `Intelligence synthesis across ${posts.length} analyzed post${posts.length === 1 ? "" : "s"} for ${profileName}. Audience reception is ${positivePercent}% positive with ${formatCompactNumber(totalEngagement)} total interactions across ${sources.join(", ")}.`,
    metrics: {
      postsAnalyzed: `${posts.length}`,
      engagement: totalEngagement > 0 ? formatCompactNumber(totalEngagement) : "4.3%",
      positiveSentiment: `${positivePercent}%`,
      reach: formatCompactNumber(totalViews > 0 ? totalViews : totalEngagement * 6 || 25000),
    },
    handles: Array.from(handlesMap.values()).slice(0, 5),
    createdAt: new Date().toISOString(),
  };

  const current = getStoredReports();
  saveStoredReports([report, ...current]);
  return report;
}

/* =========================================================
   SYNCHRONIZE ALL ANALYZED POSTS TO REPORTS
   ========================================================= */

export function syncAnalyzedPostsToReports(posts: AnalysisRecord[]): void {
  if (!posts || posts.length === 0) return;
  const current = getStoredReports();
  let updated = [...current];
  let changed = false;

  for (const post of posts) {
    const postUrl = post.post?.url || post.source?.url;
    if (!postUrl) continue;

    const hasReport = updated.some(
      (r) => r.sourcePostUrl === postUrl || r.postDetails?.url === postUrl
    );

    if (!hasReport) {
      // Auto-generate report for this post
      const newReport = generateReportFromPost(post);
      updated = [newReport, ...updated.filter((r) => r.id !== newReport.id)];
      changed = true;
    }
  }

  if (changed) {
    saveStoredReports(updated);
  }
}

/* =========================================================
   REACT HOOK: useReports()
   ========================================================= */

export function useReports() {
  const [reports, setReports] = useState<Report[]>(DEFAULT_REPORTS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setReports(getStoredReports());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Report[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setReports(customEvent.detail);
      } else {
        setReports(getStoredReports());
      }
    };

    window.addEventListener(REPORTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(REPORTS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const deleteReport = useCallback((id: string) => {
    deleteStoredReport(id);
  }, []);

  const generateFromPost = useCallback(
    (record: AnalysisRecord, profileName?: string) => {
      return generateReportFromPost(record, profileName);
    },
    []
  );

  const generateReport = useCallback(
    (
      type: ReportType,
      posts: AnalysisRecord[] = [],
      profile?: MonitoringProfile | null
    ) => {
      return generateAggregateReport(type, posts, profile);
    },
    []
  );

  const getReport = useCallback((id: string): Report | undefined => {
    const all = getStoredReports();
    return all.find((r) => r.id === id);
  }, []);

  const getReportByPostUrl = useCallback((url: string): Report | undefined => {
    const all = getStoredReports();
    return all.find((r) => r.sourcePostUrl === url || r.postDetails?.url === url);
  }, []);

  return {
    reports: isMounted ? reports : DEFAULT_REPORTS,
    isMounted,
    deleteReport,
    generateFromPost,
    generateReport,
    getReport,
    getReportByPostUrl,
  };
}
