"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  Clock,
  Command,
  CornerDownLeft,
  Database,
  ExternalLink,
  FileText,
  Filter,
  Hash,
  Layers,
  Moon,
  Network,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import PlatformPngIcon, { getPlatformNormalizedKey } from "./PlatformPngIcon";
import { useAnalyzedPosts } from "@/src/lib/analyzedPostsStore";
import { useReports } from "@/src/lib/reportsStore";
import {
  getAllProfiles,
  getActiveProfile,
  getDataSources,
} from "@/src/lib/monitoringStore";

export type SearchCategory =
  | "all"
  | "pages"
  | "posts"
  | "reports"
  | "profiles"
  | "actions"
  | "topics";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Pages" | "Posts" | "Reports" | "Profiles" | "Actions" | "Topics";
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  platform?: string;
  badge?: string;
  badgeType?: "neutral" | "success" | "warning" | "info" | "brand";
  href?: string;
  action?: () => void;
  keywords?: string[];
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const RECENT_SEARCHES_KEY = "socialint:recent_searches";
const MAX_RECENT_SEARCHES = 6;

// Text highlighter for search matches
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;

  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return <>{text}</>;

  // Escape special regex chars in tokens
  const escapedTokens = tokens.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`(${escapedTokens.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = tokens.some(
          (token) => token.toLowerCase() === part.toLowerCase()
        );
        return isMatch ? (
          <span
            key={i}
            className="text-[#457B9D] dark:text-sky-300 font-semibold underline decoration-[#457B9D]/40 underline-offset-2"
          >
            {part}
          </span>
        ) : (
          part
        );
      })}
    </>
  );
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  initialQuery = "",
}: GlobalSearchModalProps) {
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { posts } = useAnalyzedPosts();
  const { reports } = useReports();

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isMac, setIsMac] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Mount detection & OS detection
  useEffect(() => {
    setMounted(true);
    if (typeof navigator !== "undefined") {
      setIsMac(/(Mac|iPod|iPhone|iPad)/i.test(navigator.userAgent));
    }
    // Load recent searches from localStorage
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;

    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(
        0,
        MAX_RECENT_SEARCHES
      );
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // storage quota exceeded or disabled
      }
      return updated;
    });
  }, []);

  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== termToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Global Escape & keyboard shortcuts listener
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (query.trim()) {
          setQuery("");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose, query]);

  // Build searchable items catalogue
  const allItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];

    // 1. NAVIGATION & APP PAGES
    items.push(
      {
        id: "page-dashboard",
        title: "Dashboard Overview",
        subtitle: "Real-time key metric cards, audience health & active narratives",
        category: "Pages",
        icon: Activity,
        href: "/",
        keywords: ["home", "main", "overview", "metrics", "stats", "workspace"],
      },
      {
        id: "page-analytics",
        title: "Analytics & Reach",
        subtitle: "Engagement breakdown, conversation activity & platform reach",
        category: "Pages",
        icon: BarChart3,
        href: "/analytics",
        keywords: ["stats", "reach", "engagement", "views", "charts", "performance", "kpi"],
      },
      {
        id: "page-posts-analysis",
        title: "Posts Analysis & Sentiment Scraper",
        subtitle: "Deep AI-driven sentiment, comment extraction & post intelligence",
        category: "Pages",
        icon: Sparkles,
        href: "/posts-analysis",
        keywords: ["scrape", "instagram", "youtube", "comments", "sentiment", "video", "post", "url"],
      },
      {
        id: "page-trends",
        title: "Trends & Topics",
        subtitle: "Fast-growing narratives, velocity scores & monitored hashtags",
        category: "Pages",
        icon: TrendingUp,
        href: "/trends",
        keywords: ["viral", "narratives", "hashtags", "velocity", "topics", "growth"],
      },
      {
        id: "page-audience",
        title: "Audience Insights",
        subtitle: "Audience demographics, cohort clusters & emotional sentiment",
        category: "Pages",
        icon: Users,
        href: "/audience",
        keywords: ["demographics", "clusters", "sentiment", "emotions", "users", "fans"],
      },
      {
        id: "page-influence",
        title: "Influence Network",
        subtitle: "Key opinion leaders, citation graphs & node relationships",
        category: "Pages",
        icon: Network,
        href: "/influence",
        keywords: ["influencers", "kol", "graph", "network", "citations", "nodes", "leaders"],
      },
      {
        id: "page-reports",
        title: "Reports & Intelligence Briefs",
        subtitle: "Executive briefs, weekly digests & downloadable PDF/CSV exports",
        category: "Pages",
        icon: FileText,
        href: "/reports",
        keywords: ["briefs", "export", "pdf", "csv", "summary", "weekly", "intelligence"],
      },
      {
        id: "page-data-sources",
        title: "Data Sources & API Integrations",
        subtitle: "Manage connections to X, Telegram, Instagram, YouTube & Facebook",
        category: "Pages",
        icon: Database,
        href: "/data-sources",
        keywords: ["connect", "channels", "feeds", "api", "tokens", "accounts", "sync"],
      },
      {
        id: "page-settings",
        title: "Workspace Settings",
        subtitle: "Profile configuration, appearance theme & notification rules",
        category: "Pages",
        icon: Settings,
        href: "/settings",
        keywords: ["preferences", "theme", "dark mode", "light mode", "alerts", "config", "account"],
      },
      {
        id: "page-create-profile",
        title: "Create Monitoring Profile",
        subtitle: "Setup new tracked brand, athlete, campaign or custom entity",
        category: "Pages",
        icon: PlusCircle,
        href: "/create-profile",
        keywords: ["new", "brand", "profile", "athlete", "monitor", "competitor", "setup"],
      }
    );

    // 2. REAL ANALYZED POSTS (from local storage / database)
    if (posts && posts.length > 0) {
      posts.forEach((item) => {
        const post = item.post as any;
        const ai = item.aiAnalysis as any;
        const authorName =
          post?.author?.name ||
          post?.author?.handle ||
          (typeof post?.author === "string" ? post.author : "Social Post");
        const caption =
          post?.content || post?.caption || ai?.summary || "Analyzed post record";
        const platform = post?.platform || getPlatformNormalizedKey(post?.url || "");

        // Determine dominant sentiment badge
        let sentimentBadge = "Analyzed";
        let badgeType: SearchItem["badgeType"] = "neutral";
        const dominant =
          ai?.audienceSentiment?.dominant ||
          (typeof ai?.sentiment === "string" ? ai.sentiment : ai?.sentiment?.label);

        if (dominant) {
          const domStr = String(dominant).toUpperCase();
          if (domStr.includes("POS")) {
            sentimentBadge = "Positive";
            badgeType = "success";
          } else if (domStr.includes("NEG")) {
            sentimentBadge = "Negative";
            badgeType = "warning";
          } else {
            sentimentBadge = "Neutral";
            badgeType = "info";
          }
        }

        const topics = Array.isArray(ai?.topics) ? ai.topics : [];
        const hashtags = Array.isArray(ai?.hashtags) ? ai.hashtags : [];
        const postKey = item.analyzedAt || (post?.url || String(Math.random()));

        items.push({
          id: `post-${postKey}`,
          title: `${authorName}: ${caption.slice(0, 60)}${caption.length > 60 ? "..." : ""}`,
          subtitle: ai?.summary || caption.slice(0, 100),
          category: "Posts",
          platform,
          badge: sentimentBadge,
          badgeType,
          href: post?.url
            ? `/posts-analysis?viewPost=${encodeURIComponent(post.url)}`
            : "/posts-analysis",
          keywords: [
            authorName,
            platform,
            ...topics,
            ...hashtags,
            post?.url || "",
            sentimentBadge,
          ],
        });
      });
    }

    // 3. REAL REPORTS (from reports store)
    if (reports && reports.length > 0) {
      reports.forEach((rep) => {
        items.push({
          id: `report-${rep.id}`,
          title: rep.title || "Intelligence Report",
          subtitle: rep.summary ? rep.summary.slice(0, 95) + "..." : `Type: ${rep.type} • ${rep.date || "Recent"}`,
          category: "Reports",
          icon: FileText,
          badge: rep.type || "Report",
          badgeType: "brand",
          href: `/reports?id=${rep.id}`,
          keywords: [
            rep.type || "",
            rep.title || "",
            ...(rep.sources || []),
            rep.date || "",
          ],
        });
      });
    }

    // 4. MONITORING PROFILES & DATA SOURCES
    try {
      const activeProf = getActiveProfile();
      if (activeProf) {
        items.push({
          id: `profile-active-${activeProf.id || activeProf.name}`,
          title: `Active Profile: ${activeProf.name}`,
          subtitle: activeProf.description || `Tracking: ${activeProf.input || "Custom targets"}`,
          category: "Profiles",
          icon: UserCheck,
          badge: "Active",
          badgeType: "success",
          href: "/create-profile",
          keywords: [
            activeProf.name,
            activeProf.input || "",
            ...(activeProf.keywords || []),
            ...(activeProf.sources || []),
          ],
        });
      }

      const userProfiles = getAllProfiles();
      userProfiles.forEach((prof) => {
        if (activeProf && prof.name === activeProf.name) return;
        items.push({
          id: `profile-${prof.id || prof.name}`,
          title: `Profile: ${prof.name}`,
          subtitle: prof.description || `Monitored entity (${prof.type || "entity"})`,
          category: "Profiles",
          icon: Users,
          badge: prof.type || "Profile",
          badgeType: "neutral",
          href: "/create-profile",
          keywords: [prof.name, prof.input || "", ...(prof.keywords || [])],
        });
      });

      const dataSources = getDataSources();
      dataSources.forEach((ds) => {
        items.push({
          id: `datasource-${ds.id}`,
          title: `${ds.name || ds.platform} Feed`,
          subtitle: `Handle: ${ds.handleOrUrl} • Status: ${ds.status}`,
          category: "Profiles",
          platform: ds.platform,
          badge: ds.status === "active" || ds.status === "CONNECTED" ? "Connected" : "Configured",
          badgeType: ds.status === "active" || ds.status === "CONNECTED" ? "success" : "neutral",
          href: "/data-sources",
          keywords: [ds.name, ds.platform, ds.handleOrUrl, ds.status],
        });
      });
    } catch {
      // safe fallback if storage unreadable
    }

    // 5. TRENDS & HASHTAGS (Dynamic from posts + curated)
    const topicSet = new Map<string, { count: number; badge?: string }>();

    // Seed curated topics
    topicSet.set("#Performance", { count: 320, badge: "+320% velocity" });
    topicSet.set("#UpcomingMatch", { count: 184, badge: "+184% growth" });
    topicSet.set("#TeamSelection", { count: 126, badge: "+126% momentum" });
    topicSet.set("#Captaincy", { count: 89, badge: "+89% reach" });
    topicSet.set("#WorldCup", { count: 210, badge: "+210% viral" });

    // Extract real hashtags from analyzed posts
    if (posts && posts.length > 0) {
      posts.forEach((p) => {
        const ai = p.aiAnalysis as any;
        const hashtags: string[] = Array.isArray(ai?.hashtags)
          ? ai.hashtags
          : Array.isArray(ai?.topics)
          ? ai.topics
          : [];
        hashtags.forEach((h: string) => {
          const tag = h.startsWith("#") ? h : `#${h}`;
          const current = topicSet.get(tag) || { count: 0 };
          topicSet.set(tag, {
            count: current.count + 15,
            badge: `${current.count + 15} mentions`,
          });
        });
      });
    }

    topicSet.forEach((val, tag) => {
      items.push({
        id: `topic-${tag.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        title: tag,
        subtitle: `Trend narrative & velocity analysis on social platforms`,
        category: "Topics",
        icon: Hash,
        badge: val.badge,
        badgeType: "brand",
        href: `/trends?search=${encodeURIComponent(tag.replace(/^#/, ""))}`,
        keywords: [tag, "trend", "narrative", "hashtag", "viral"],
      });
    });

    // 6. QUICK ACTIONS & PLATFORM INTELLIGENCE
    items.push(
      {
        id: "action-analyze-post",
        title: "Analyze a Public Social Post",
        subtitle: "Paste a YouTube, Instagram, Facebook, X, or Reddit link to run AI sentiment analysis",
        category: "Actions",
        icon: Sparkles,
        badge: "AI Scraper",
        badgeType: "brand",
        href: "/posts-analysis",
        keywords: ["analyze", "sentiment", "video", "reel", "comments", "extractor"],
      },
      {
        id: "action-toggle-theme",
        title: `Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`,
        subtitle: `Currently in ${resolvedTheme === "dark" ? "Dark" : "Light"} theme`,
        category: "Actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        badge: resolvedTheme === "dark" ? "Light Mode" : "Dark Mode",
        badgeType: "neutral",
        action: () => toggleTheme(),
        keywords: ["theme", "dark", "light", "appearance", "mode", "toggle", "color"],
      },
      {
        id: "action-generate-report",
        title: "Generate New Intelligence Brief",
        subtitle: "Create executive brief, sentiment audit, or cross-platform narrative digest",
        category: "Actions",
        icon: FileText,
        badge: "Executive Brief",
        badgeType: "brand",
        href: "/reports",
        keywords: ["report", "generate", "digest", "brief", "pdf", "export"],
      },
      {
        id: "action-connect-source",
        title: "Connect New Social Media Account",
        subtitle: "Add public accounts, YouTube channels, subreddits or hashtags for tracking",
        category: "Actions",
        icon: Database,
        badge: "Data Feed",
        badgeType: "info",
        href: "/data-sources",
        keywords: ["source", "connect", "add", "channel", "account", "feed"],
      },
      {
        id: "action-create-profile",
        title: "Configure Monitoring Profile",
        subtitle: "Define athlete, brand, or campaign keywords to start auto-collecting intel",
        category: "Actions",
        icon: PlusCircle,
        badge: "Profile Setup",
        badgeType: "success",
        href: "/create-profile",
        keywords: ["create", "setup", "profile", "brand", "athlete", "monitor"],
      },
      {
        id: "action-clear-recent",
        title: "Clear Search History",
        subtitle: "Remove recently searched terms and suggestions from this browser",
        category: "Actions",
        icon: Trash2,
        action: () => {
          setRecentSearches([]);
          try {
            localStorage.removeItem(RECENT_SEARCHES_KEY);
          } catch {}
        },
        keywords: ["clear", "history", "recent", "clean", "reset"],
      }
    );

    return items;
  }, [posts, reports, resolvedTheme, toggleTheme]);

  // Check if query is a direct URL or hashtag
  const specialActions = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const actions: SearchItem[] = [];

    // 1. Direct URL detection (Instagram, YouTube, X, Reddit, Facebook, or general URL)
    const isUrl =
      /^(https?:\/\/)/i.test(trimmed) ||
      trimmed.includes("instagram.com") ||
      trimmed.includes("youtube.com") ||
      trimmed.includes("youtu.be") ||
      trimmed.includes("x.com") ||
      trimmed.includes("twitter.com") ||
      trimmed.includes("reddit.com") ||
      trimmed.includes("facebook.com") ||
      trimmed.includes("fb.watch");

    if (isUrl) {
      const platformKey = getPlatformNormalizedKey(trimmed);
      const cleanUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

      actions.push({
        id: "action-direct-url-analysis",
        title: `Analyze ${platformKey.toUpperCase()} Post: "${cleanUrl.slice(0, 45)}..."`,
        subtitle: `Jump directly to Posts Analysis & scrape AI sentiment, comments & insights`,
        category: "Actions",
        platform: platformKey,
        badge: "Instant Analysis",
        badgeType: "brand",
        href: `/posts-analysis?url=${encodeURIComponent(cleanUrl)}`,
      });
    }

    // 2. Direct Hashtag / Topic Search
    if (trimmed.startsWith("#") || (trimmed.length > 2 && !trimmed.includes(" "))) {
      const tag = trimmed.replace(/^#/, "");
      actions.push({
        id: `action-direct-trend-${tag}`,
        title: `Explore Trend Narrative: #${tag}`,
        subtitle: `View velocity growth, audience sentiment, and platform buzz for #${tag}`,
        category: "Topics",
        icon: TrendingUp,
        badge: "Narrative Hub",
        badgeType: "brand",
        href: `/trends?search=${encodeURIComponent(tag)}`,
      });
      actions.push({
        id: `action-direct-posts-${tag}`,
        title: `Filter Posts by #${tag}`,
        subtitle: `Find all collected social posts and audience comments referencing #${tag}`,
        category: "Posts",
        icon: Hash,
        badge: "Posts Search",
        badgeType: "info",
        href: `/posts-analysis?search=${encodeURIComponent(tag)}`,
      });
    }

    // 3. Direct Reports search fallback
    if (trimmed.length > 2 && !isUrl) {
      actions.push({
        id: `action-direct-report-search-${trimmed}`,
        title: `Search Reports for "${trimmed}"`,
        subtitle: `Filter executive briefs, summaries, and intelligence documents`,
        category: "Reports",
        icon: FileText,
        badge: "Search Reports",
        badgeType: "neutral",
        href: `/reports?search=${encodeURIComponent(trimmed)}`,
      });
    }

    return actions;
  }, [query]);

  // High-performance search scoring algorithm
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    // Combine base items with query-derived dynamic actions
    const candidatePool = [...specialActions, ...allItems];

    let results = candidatePool;

    // Filter by active category tab if selected
    if (activeCategory !== "all") {
      results = results.filter((item) => {
        const catKey = item.category.toLowerCase();
        if (activeCategory === "posts") return catKey === "posts";
        if (activeCategory === "reports") return catKey === "reports";
        if (activeCategory === "pages") return catKey === "pages";
        if (activeCategory === "profiles") return catKey === "profiles";
        if (activeCategory === "actions") return catKey === "actions";
        if (activeCategory === "topics") return catKey === "topics";
        return true;
      });
    }

    if (!trimmed) {
      // When query is empty, show curated highlights & default list
      return results.slice(0, 14);
    }

    const qTokens = trimmed.split(/\s+/).filter(Boolean);

    // Score each item based on multiple relevance factors
    const scored = results
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const subLower = item.subtitle.toLowerCase();
        const catLower = item.category.toLowerCase();
        const platLower = (item.platform || "").toLowerCase();
        const keywords = item.keywords || [];

        let score = 0;

        // Top boost for special generated actions
        if (item.id.startsWith("action-direct-")) {
          score += 500;
        }

        // Exact title match
        if (titleLower === trimmed) {
          score += 200;
        } else if (titleLower.startsWith(trimmed)) {
          score += 120;
        } else if (titleLower.includes(trimmed)) {
          score += 80;
        }

        // Word-boundary match in title
        if (new RegExp(`\\b${trimmed}`, "i").test(titleLower)) {
          score += 40;
        }

        // Acronym match (e.g., "pa" -> "Posts Analysis")
        const initials = titleLower
          .split(/\s+/)
          .map((w) => w[0])
          .join("");
        if (initials.includes(trimmed) && trimmed.length >= 2) {
          score += 60;
        }

        // Token match in title
        const titleMatchesAllTokens = qTokens.every((token) =>
          titleLower.includes(token)
        );
        if (titleMatchesAllTokens) {
          score += 50;
        }

        // Subtitle match
        if (subLower.includes(trimmed)) {
          score += 35;
        } else if (qTokens.some((tok) => subLower.includes(tok))) {
          score += 15;
        }

        // Platform match (e.g. searching "youtube" boosts YouTube posts)
        if (platLower && platLower.includes(trimmed)) {
          score += 70;
        }

        // Keywords match
        if (keywords.some((kw) => kw.toLowerCase().includes(trimmed))) {
          score += 30;
        }

        // Category match
        if (catLower.includes(trimmed)) {
          score += 20;
        }

        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);

    // De-duplicate results by ID
    const seenIds = new Set<string>();
    const deduplicated: SearchItem[] = [];
    for (const r of scored) {
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id);
        deduplicated.push(r);
      }
    }

    return deduplicated;
  }, [allItems, specialActions, query, activeCategory]);

  // Category counts based on current query
  const categoryCounts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const candidatePool = [...specialActions, ...allItems];

    if (!trimmed) {
      return {
        all: candidatePool.length,
        pages: candidatePool.filter((i) => i.category === "Pages").length,
        posts: candidatePool.filter((i) => i.category === "Posts").length,
        reports: candidatePool.filter((i) => i.category === "Reports").length,
        actions: candidatePool.filter((i) => i.category === "Actions").length,
        topics: candidatePool.filter((i) => i.category === "Topics").length,
        profiles: candidatePool.filter((i) => i.category === "Profiles").length,
      };
    }

    const countMap = {
      all: 0,
      pages: 0,
      posts: 0,
      reports: 0,
      actions: 0,
      topics: 0,
      profiles: 0,
    };

    candidatePool.forEach((item) => {
      const match =
        item.title.toLowerCase().includes(trimmed) ||
        item.subtitle.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed) ||
        (item.platform && item.platform.toLowerCase().includes(trimmed)) ||
        (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(trimmed)));

      if (match) {
        countMap.all++;
        const cat = item.category.toLowerCase();
        if (cat === "pages") countMap.pages++;
        else if (cat === "posts") countMap.posts++;
        else if (cat === "reports") countMap.reports++;
        else if (cat === "actions") countMap.actions++;
        else if (cat === "topics") countMap.topics++;
        else if (cat === "profiles") countMap.profiles++;
      }
    });

    return countMap;
  }, [allItems, specialActions, query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  // Reset selected index when query or active category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Scroll active item into view smoothly
  useEffect(() => {
    if (!listRef.current) return;
    const selectedElement = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Select item action handler
  const handleSelect = (item: SearchItem) => {
    // Save to search history if query was used
    if (query.trim()) {
      saveRecentSearch(query.trim());
    } else {
      saveRecentSearch(item.title);
    }

    onClose();

    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      } else if (query.trim()) {
        saveRecentSearch(query.trim());
        // Fallback: search in posts analysis or trends
        onClose();
        router.push(`/posts-analysis?search=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Cycle category filter tabs
      const categories: SearchCategory[] = [
        "all",
        "pages",
        "posts",
        "reports",
        "topics",
        "actions",
      ];
      const currentIndex = categories.indexOf(activeCategory);
      if (e.shiftKey) {
        const nextIdx =
          currentIndex <= 0 ? categories.length - 1 : currentIndex - 1;
        setActiveCategory(categories[nextIdx]);
      } else {
        const nextIdx =
          currentIndex >= categories.length - 1 ? 0 : currentIndex + 1;
        setActiveCategory(categories[nextIdx]);
      }
    }
  };

  if (!isOpen || !mounted) return null;

  const categoryTabs: { id: SearchCategory; label: string; count: number }[] = [
    { id: "all", label: "All", count: categoryCounts.all },
    { id: "pages", label: "Pages", count: categoryCounts.pages },
    { id: "posts", label: "Posts", count: categoryCounts.posts },
    { id: "reports", label: "Reports", count: categoryCounts.reports },
    { id: "topics", label: "Topics", count: categoryCounts.topics },
    { id: "actions", label: "Actions", count: categoryCounts.actions },
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search SocialInt Command Palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 pb-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-xl sm:max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#090d16] text-zinc-900 dark:text-zinc-100 shadow-2xl transition-all duration-200 z-10 flex flex-col max-h-[85vh]">
        {/* Search Header Input */}
        <div className="relative flex items-center border-b border-zinc-100 dark:border-zinc-800/90 px-4 py-3 sm:py-3.5 bg-white dark:bg-[#090d16]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#457B9D]/10 text-[#457B9D] shrink-0 mr-3">
            <Search className="h-4 w-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, posts, reports, #hashtags, or paste any URL..."
            className="h-9 w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100 pr-2 font-medium"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              title="Clear search query"
              className="mr-2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer"
            >
              <X size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            title="Press ESC to close"
            aria-label="Close search"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 px-2 py-1 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-white shadow-2xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <span>ESC</span>
            <X size={12} className="opacity-70" />
          </button>
        </div>

        {/* Category Scoping Filter Pills */}
        <div className="flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/70 px-4 py-2 bg-zinc-50/70 dark:bg-zinc-900/40 text-xs overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-zinc-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter size={11} /> Scope:
          </span>
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#457B9D] text-white shadow-2xs"
                    : "bg-white dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:border-[#457B9D]/50 hover:text-[#457B9D] dark:hover:text-sky-300"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-100 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty Query State: Recent Searches & Quick Suggestions */}
        {!query.trim() && (
          <div className="px-4 py-3 bg-zinc-50/40 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800/60 text-xs">
            {recentSearches.length > 0 && (
              <div className="mb-2.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearAllRecentSearches}
                    className="hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    Clear history
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => setQuery(term)}
                      className="group inline-flex items-center gap-1 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-800/90 px-2 py-0.5 text-xs text-zinc-700 dark:text-zinc-300 hover:border-[#457B9D] hover:text-[#457B9D] dark:hover:text-sky-300 cursor-pointer shadow-2xs transition"
                    >
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(e, term)}
                        title="Remove from history"
                        className="opacity-40 hover:opacity-100 text-zinc-400 hover:text-red-500 p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-zinc-400 font-medium mr-1 flex items-center gap-1">
                <Sparkles size={11} className="text-[#457B9D]" /> Quick Suggestions:
              </span>
              {[
                "Instagram",
                "YouTube",
                "Sentiment",
                "#Performance",
                "Weekly Brief",
                "Dark Mode",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-lg border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-800/70 px-2 py-0.5 text-[11px] text-zinc-600 dark:text-zinc-300 hover:border-[#457B9D] hover:text-[#457B9D] dark:hover:text-sky-400 transition cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div
          ref={listRef}
          role="listbox"
          className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 min-h-[180px] max-h-[55vh]"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center px-4">
              <Search className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Try searching for a different keyword, page, hashtag like #cricket, or paste a public video/reel link.
              </p>
              {query && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(`/posts-analysis?search=${encodeURIComponent(query)}`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#457B9D] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#386480] transition"
                  >
                    <span>Search in Posts Analysis</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(`/trends?search=${encodeURIComponent(query)}`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-[#457B9D] hover:text-[#457B9D] transition"
                  >
                    <span>Search in Trends</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon || Activity;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.id}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-[#457B9D]/10 dark:bg-[#457B9D]/20 text-[#457B9D] dark:text-sky-300"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Icon or Platform Logo */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                          isSelected
                            ? "border-[#457B9D]/40 bg-[#457B9D] text-white shadow-xs"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                        }`}
                      >
                        {item.platform ? (
                          <PlatformPngIcon platform={item.platform} size={18} />
                        ) : (
                          <Icon size={16} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`truncate text-sm font-semibold ${
                              isSelected
                                ? "text-zinc-950 dark:text-white"
                                : "text-zinc-900 dark:text-zinc-200"
                            }`}
                          >
                            <HighlightMatch text={item.title} query={query} />
                          </p>

                          {/* Category Tag */}
                          <span
                            className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border font-semibold ${
                              item.category === "Pages"
                                ? "border-sky-200 dark:border-sky-900/50 text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40"
                                : item.category === "Posts"
                                ? "border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
                                : item.category === "Reports"
                                ? "border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                                : item.category === "Topics"
                                ? "border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                                : item.category === "Profiles"
                                ? "border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40"
                                : "border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40"
                            }`}
                          >
                            {item.category}
                          </span>

                          {/* Badge */}
                          {item.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                item.badgeType === "success"
                                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                                  : item.badgeType === "warning"
                                  ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
                                  : item.badgeType === "brand"
                                  ? "text-[#457B9D] dark:text-sky-300 bg-[#457B9D]/10"
                                  : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <HighlightMatch text={item.subtitle} query={query} />
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          <span>Enter</span>
                          <CornerDownLeft size={10} />
                        </span>
                      )}
                      <ArrowRight
                        size={15}
                        className={`transition-transform ${
                          isSelected
                            ? "translate-x-0.5 text-[#457B9D] dark:text-sky-400 opacity-100"
                            : "opacity-0 group-hover:opacity-100 text-zinc-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 px-4 py-2.5 bg-zinc-50/70 dark:bg-zinc-900/50 text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              <span className="hidden xs:inline">navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              <span className="hidden xs:inline">select</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                Tab
              </kbd>
              <span>switch scope</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-400">
              {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
            </span>
            <span className="hidden md:inline-block text-[10px] text-zinc-400">
              • {isMac ? "⌘K" : "Ctrl+K"}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
