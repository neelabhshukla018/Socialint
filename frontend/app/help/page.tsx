"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Globe,
  Headphones,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  Network,
  Radio,
  Search,
  Send,
  Server,
  Settings as SettingsIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useNotifications } from "../context/NotificationContext";
import { useSocl } from "../context/SoclContext";
import { cn } from "@/src/lib/utils";

// ============================================================================
// CONSTANTS
// ============================================================================

const SUPPORT_EMAIL = "supportsocialint@gmail.com";

type TabId =
  | "all"
  | "why"
  | "pipeline"
  | "data"
  | "analysis"
  | "playbooks"
  | "locations"
  | "reports"
  | "privacy"
  | "contact";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TABS: TabItem[] = [
  { id: "all", label: "Overview", icon: Compass },
  { id: "why", label: "Why SocialInt?", icon: Zap },
  { id: "pipeline", label: "How It Works (Path)", icon: Cpu },
  { id: "data", label: "Data Taken", icon: Database },
  { id: "analysis", label: "Analysis Engine", icon: Activity },
  { id: "playbooks", label: "Playbooks", icon: Layers },
  { id: "locations", label: "Platform Map", icon: LayoutDashboard },
  { id: "reports", label: "Download Reports", icon: Download },
  { id: "privacy", label: "Privacy & Safety", icon: ShieldCheck },
  { id: "contact", label: "Contact Us", icon: Mail },
];

// How It Works Connected Nodes
const HOW_IT_WORKS_NODES = [
  {
    id: "target-definition",
    shortLabel: "Target Setup",
    title: "Target Definition & Entity Setup",
    headline: "Configure Public Channels & Monitored Entities",
    description:
      "SocialInt requires zero passwords. Configure target creator handles, YouTube channels, X discussion queries, or campaign hashtags to monitor multi-platform channels in a single unified workspace.",
    keySignals: [
      "Public Instagram creator handles & reels",
      "YouTube channels & video comment threads",
      "X (Twitter) search queries & community topics",
      "Brand campaign hashtags & competitor keywords",
    ],
    highlight: "Zero Private Credentials Required",
    icon: Radio,
  },
  {
    id: "data-extraction",
    shortLabel: "Extraction",
    title: "Headless Ingestion & Normalization",
    headline: "Public Signal Harvesting & Unified Schema",
    description:
      "Lightweight ingestion actors ethically collect public posts, comment replies, video timestamps, and engagement signals, converting fragmented platform metrics into a standardized intelligence schema.",
    keySignals: [
      "Automated public comment and reply harvesting",
      "Captions, post media descriptors, and timestamps",
      "Aggregated engagement velocity indicators",
      "Zero private DM or password access guaranteed",
    ],
    highlight: "Cross-Platform Normalization",
    icon: Server,
  },
  {
    id: "sentiment-engine",
    shortLabel: "Sentiment",
    title: "Contextual Sentiment & Emotion Analysis",
    headline: "Context-Aware Polarity (-100 to +100)",
    description:
      "Advanced natural language processing evaluates semantic intent, emotion distributions, and public sentiment polarity, accurately detecting sarcasm, internet culture, and shifting brand perception.",
    keySignals: [
      "Polarity Intensity Rating: -100 to +100",
      "Emotion Spectrum: Joy, Trust, Skepticism, Anger",
      "Executive key takeaways extracted automatically",
      "Toxicity and hostile sentiment filtering",
    ],
    highlight: "Nuanced Sarcasm & Slang Detection",
    icon: Activity,
  },
  {
    id: "influence-graph",
    shortLabel: "Influence Graph",
    title: "Network Centrality & Anomaly Radar",
    headline: "Graph Topology & Early Warning Radar",
    description:
      "Calculates eigenvector and betweenness centrality to separate authentic community drivers from bot farms. Anomaly detection monitors comment acceleration rates to catch viral PR flare-ups hours before traditional tools.",
    keySignals: [
      "Degree and betweenness centrality coefficients",
      "Identification of bridge accounts connecting audiences",
      "Virality acceleration trigger (>3.2x baseline)",
      "Interactive 2D & 3D force-directed topology",
    ],
    highlight: "Filters Real Amplifiers from Bots",
    icon: Network,
  },
  {
    id: "executive-dossiers",
    shortLabel: "Deliverables",
    title: "Interactive Dashboards & Instant Reports",
    headline: "Command Center Views & Stakeholder Deliverables",
    description:
      "Make strategic decisions with confidence. Monitor live signals across purpose-built views, review post-by-post breakdowns, and download print-ready executive PDF dossiers or raw CSV datasets with one click.",
    keySignals: [
      "Instant vector-rendered PDF reports with charts",
      "Raw CSV spreadsheets for Excel, Tableau, and BI modeling",
      "Developer JSON bundles for automated data pipelines",
      "Historical trend preservation for brand equity tracking",
    ],
    highlight: "Print-Ready PDF & Raw CSV Exports",
    icon: FileText,
  },
];

const FAQS = [
  {
    q: "Does SocialInt require my social media passwords or private login credentials?",
    a: "Never. SocialInt is built with a zero-trust architecture. You never provide your Instagram, YouTube, X, or Reddit passwords. The platform monitors only publicly available signals, ensuring your personal and company accounts remain completely untouched and secure.",
  },
  {
    q: "Can I monitor private accounts or confidential private groups?",
    a: "No. SocialInt strictly respects privacy boundaries and platform terms of service. It only analyzes publicly visible posts, comments, reels, and community discussions. It will never access private DMs, locked profiles, or secret groups.",
  },
  {
    q: "How does the sentiment scoring scale work (-100 to +100)?",
    a: "Every analyzed post and comment is evaluated on a mathematical scale from -100 (intense hostility, boycott calls, brand crisis) through 0 (neutral reporting, factual questions) to +100 (enthusiastic endorsement, praise, customer delight). Posts are then categorized into Positive, Neutral, or Negative classifications with emotion breakdowns (Joy, Trust, Anger, Skepticism, Anticipation).",
  },
  {
    q: "How do I download reports and what formats are supported?",
    a: "Navigate to the Reports page (/reports) or click 'Export Report' from any analytics dashboard. SocialInt supports 3 export formats: Executive PDF (polished briefing with charts and executive takeaways), CSV Data (spreadsheet of all posts, comments, dates, and engagement counts for Excel/Tableau), and JSON Intelligence Bundle (complete nested schema for developers).",
  },
  {
    q: "How often is data refreshed and ingested?",
    a: "When 'Automatic Monitoring' is active in Settings, SocialInt syncs data streams on your chosen refresh interval (default: every 15 minutes, configurable down to 5 minutes). You can also click 'Sync Now' on any monitored profile or data source to trigger an immediate on-demand ingestion run.",
  },
  {
    q: "How do I get direct support or request custom integrations?",
    a: "You can email our engineering desk directly at supportsocialint@gmail.com. We respond within 2 hours during active working windows, and we can configure custom scraper actors for niche platforms, enterprise integrations, or custom reporting templates.",
  },
];

const DATA_TAKEN_ITEMS = [
  {
    category: "Public Profile Identifiers",
    description:
      "Public creator handles, YouTube channel URLs, public Reddit usernames, and display names (@creator_name).",
    icon: UserCheck,
  },
  {
    category: "Public Post Captions & Media Metadata",
    description:
      "Post caption text, media type (Reel, Short, Image carousel, Tweet), published timestamp, and author metadata.",
    icon: FileText,
  },
  {
    category: "Public Engagement Signals",
    description:
      "View count, like count, comment tally, retweet/re-share metrics, and engagement rate velocity.",
    icon: TrendingUp,
  },
  {
    category: "Public Comments & Community Threads",
    description:
      "Top public comments, replies, commenter usernames, timestamp, and like counts on comments.",
    icon: MessageSquare,
  },
  {
    category: "Target Brand Hashtags & Keywords",
    description:
      "Custom keywords, campaign hashtags (#BrandLaunch), competitor queries, and topic filters.",
    icon: Tag,
  },
];

const DATA_EXCLUDED_ITEMS = [
  {
    category: "Social Media Passwords & Logins",
    description: "SocialInt NEVER asks for, stores, or handles your personal social account passwords.",
    icon: Lock,
  },
  {
    category: "Private Direct Messages (DMs)",
    description: "Strict zero-intrusion policy. We cannot and will never read inboxes or private chats.",
    icon: MessageSquare,
  },
  {
    category: "Private Profiles & Secret Groups",
    description: "Accounts or subreddits set to private are completely ignored and inaccessible.",
    icon: ShieldAlert,
  },
  {
    category: "Personal Device Telemetry & Contacts",
    description: "No access to user phonebooks, contact lists, GPS location, camera, or microphone.",
    icon: AlertTriangle,
  },
  {
    category: "Payment & Financial Information",
    description: "SocialInt never stores credit cards; billing is processed via PCI-certified gateways.",
    icon: Shield,
  },
];

const PLATFORM_LOCATIONS = [
  {
    title: "Command Center Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description:
      "High-level pulse of your monitored profiles: overall sentiment gauge, 24h activity chart, emerging PR flare-ups, and live stream status.",
    features: [
      "Real-time sentiment gauge (-100 to +100)",
      "24-hour post velocity & activity timeline",
      "Immediate PR crisis alert triggers",
    ],
  },
  {
    title: "Posts Analysis",
    href: "/posts-analysis",
    icon: MessageSquare,
    description:
      "Inspect individual posts across Instagram, YouTube, and X. Expand any post to view key takeaways, comment sentiment distribution, and emotion ratings.",
    features: [
      "Semantic takeaways & argument summaries",
      "Comment emotion & polarity breakdown",
      "Virality score & amplification index",
    ],
  },
  {
    title: "Trends & Topics",
    href: "/trends",
    icon: TrendingUp,
    description:
      "Track trending hashtags, emerging storyline clusters, and narrative momentum to discover what the internet is talking about before it peaks.",
    features: [
      "Hashtag momentum radar & velocity",
      "Emerging topic cluster detection",
      "Sentiment trajectory tracking over time",
    ],
  },
  {
    title: "Audience Insights",
    href: "/audience",
    icon: Users,
    description:
      "Understand who engages with your brand: demographic breakdowns, audience affinity groups, active hours heatmap, and top vocal community members.",
    features: [
      "Demographic cohort & interest splits",
      "Peak interaction & active hours heatmaps",
      "Audience affinity & vocal advocates matrix",
    ],
  },
  {
    title: "Influence Network",
    href: "/influence",
    icon: Network,
    description:
      "Interactive 2D & 3D node-and-link network topology mapping key opinion leaders, media outlets, amplifiers, and community clusters.",
    features: [
      "Eigenvector & betweenness centrality scoring",
      "Amplifier bridge identification",
      "Interactive physics graph canvas",
    ],
  },
  {
    title: "Executive Reports",
    href: "/reports",
    icon: FileText,
    description:
      "Generate, preview, and download formal analytical digests, handle briefings, and raw spreadsheets ready for stakeholders and executives.",
    features: [
      "Instant vector PDF dossier compilation",
      "Complete raw CSV spreadsheet export",
      "Hierarchical JSON intelligence payload",
    ],
  },
  {
    title: "Data Sources",
    href: "/data-sources",
    icon: Radio,
    description:
      "Manage connected Instagram, YouTube, and X handles. Check real-time ingestion health, trigger on-demand syncs, or pause streams.",
    features: [
      "Platform connector status & latency",
      "Manual scraping trigger & re-syncs",
      "Source error diagnostics & rate-limit health",
    ],
  },
  {
    title: "Workspace Settings",
    href: "/settings",
    icon: SettingsIcon,
    description:
      "Tune analysis sensitivity, toggle dark/light mode, adjust auto-refresh intervals, and manage workspace data exports.",
    features: [
      "Sensitivity threshold sliders & tuning",
      "Appearance, theme & contrast settings",
      "Workspace data export & cache purge controls",
    ],
  },
  {
    title: "SOCL Assistant",
    href: "/socl",
    icon: Bot,
    description:
      "Interactive assistant to answer platform questions, interpret sentiment metrics, and draft PR crisis holding statements.",
    features: [
      "Real-time PR crisis advice & draft copy",
      "Sentiment formula & metric explanations",
      "Contextual quick prompts tailored to data",
    ],
  },
];

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

function HelpContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "all";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCategory, setFormCategory] = useState("Support Inquiry");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { showToast } = useNotifications();
  const { openSocl } = useSocl();

  // Copy email handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopiedEmail(true);
    showToast({
      title: "Email Copied",
      message: `Support email ${SUPPORT_EMAIL} copied to your clipboard.`,
      type: "success",
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Submit contact form -> compose mailto
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMessage.trim()) return;

    const subject = encodeURIComponent(`[SocialInt ${formCategory}] from ${formName || "User"}`);
    const body = encodeURIComponent(
      `Name: ${formName || "Not provided"}\nEmail: ${formEmail || "Not provided"}\nCategory: ${formCategory}\n\nMessage:\n${formMessage}`
    );

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    setFormSubmitted(true);
    showToast({
      title: "Support Request Initialized",
      message: "Your default email application is launching to deliver your message directly to the engineering desk.",
      type: "info",
    });
  };

  // Filtered FAQs based on user search
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Node path progress percentage (0% to 100%)
  const nodeProgress = (activeNodeIndex / (HOW_IT_WORKS_NODES.length - 1)) * 100;

  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-[#080b12] text-zinc-900 dark:text-zinc-100 transition-colors duration-150">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 lg:pl-[270px] flex flex-col">
        {/* Dashboard Header */}
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Container: Centric, spacious, open layout */}
        <main className="relative flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-14 lg:py-20 max-w-7xl w-full mx-auto space-y-14 sm:space-y-20 lg:space-y-28 overflow-x-clip">
          {/* ============================================================ */}
          {/* HERO SECTION (CENTRIC & SPACIOUS)                            */}
          {/* ============================================================ */}
          <section className="card-hanging relative rounded-3xl sm:rounded-4xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-10 lg:p-16 overflow-hidden shadow-xs">
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
              {/* Title & Subtitle */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl tracking-tight text-zinc-950 dark:text-white leading-[1.2]">
                  Everything You Need to Know About{" "}
                  <span className="text-[#457B9D] dark:text-cyan-400">
                    SocialInt
                  </span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal max-w-2xl mx-auto">
                  A unified platform for tracking brand perception, sentiment drift, audience cohorts, and influence networks across social media ecosystems.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => openSocl("I need help navigating SocialInt and understanding its features.")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#457B9D] hover:bg-[#386b8b] px-5 py-3 text-xs sm:text-sm font-semibold text-white transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <MessageSquare size={16} />
                  <span>Ask SOCL Assistant</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-4 py-3 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-[#457B9D]/60 hover:bg-white dark:hover:bg-zinc-800 transition active:scale-95 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check size={16} className="text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[210px] sm:max-w-none">
                        Copied {SUPPORT_EMAIL}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="font-mono text-xs truncate max-w-[210px] sm:max-w-none">{SUPPORT_EMAIL}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Search Centered */}
              <div className="relative w-full max-w-md mx-auto">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides, reports, privacy..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 pl-10 pr-12 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-hidden focus:ring-1 focus:ring-[#457B9D] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* FLOATING TAB PILLS NAVIGATION                                */}
          {/* ============================================================ */}
          <div className="sticky top-16 sm:top-20 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 py-3 bg-zinc-50/90 dark:bg-[#080b12]/90 backdrop-blur-xl border-y border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x scroll-smooth">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                const isDesktopOnly =
                  tab.id === "pipeline" ||
                  tab.id === "analysis" ||
                  tab.id === "playbooks" ||
                  tab.id === "locations" ||
                  tab.id === "reports";
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative items-center gap-2 shrink-0 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-tight transition-all duration-150 cursor-pointer",
                      isDesktopOnly ? "hidden md:inline-flex" : "inline-flex",
                      isActive
                        ? "text-white dark:text-zinc-950 font-bold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800/60"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-xl bg-[#457B9D] dark:bg-white shadow-xs"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon size={15} />
                      <span>{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 1: WHY SOCIALINT? (CENTRIC & SPACIOUS)               */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "why") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  Why SocialInt?
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Traditional social listening tools dump overwhelming keyword counts. SocialInt translates noisy conversations into clear, actionable intelligence and reputational foresight.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                {/* Feature 1 */}
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 lg:p-9 space-y-4 sm:space-y-5 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#457B9D]/10 text-[#457B9D] dark:text-cyan-400">
                    <Globe size={24} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Unified Cross-Platform Tracking
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Track Instagram creators, YouTube video comments, X (Twitter) discussions, and Reddit threads all from a single monitoring profile. Eliminate tab-switching and fragmented metrics.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 lg:p-9 space-y-4 sm:space-y-5 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#457B9D]/10 text-[#457B9D] dark:text-cyan-400">
                    <Activity size={24} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Contextual Sentiment Polarity (-100 to +100)
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Rather than a blind guess, our engine evaluates sarcasm, internet culture, and multi-lingual slang with 94%+ contextual accuracy, grouping responses into positive, neutral, and negative intensity tiers.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 lg:p-9 space-y-4 sm:space-y-5 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Early-Warning Reputation Radar
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Spot hostile comment clusters and negative drift before they develop into viral controversies. Configurable alert thresholds trigger immediate desktop notifications and executive briefings.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 lg:p-9 space-y-4 sm:space-y-5 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Network size={24} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Network Centrality & Influence Topology
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Raw follower numbers are vanity. SocialInt maps communication hubs, bridges, and reply densities with graph algorithms to identify who truly shapes audience consensus.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 2: HOW SOCIALINT WORKS (CONNECTED NODE-WISE PATH)    */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "pipeline") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block space-y-8 sm:space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  How SocialInt Works
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  An automated 5-stage pipeline from target configuration to real-time reputational alerting.
                </p>
              </div>

              {/* Connected Visual Path (Desktop & Mobile) */}
              <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 lg:p-10 shadow-xs space-y-8 sm:space-y-10">
                {/* Visual Path Track with horizontal scroll container on narrow phones */}
                <div className="overflow-x-auto no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0 pb-2 sm:pb-0 touch-pan-x">
                  <div className="relative min-w-[360px] sm:min-w-0 pt-4 pb-6 sm:pb-8">
                    {/* Background Track Line */}
                    <div className="absolute top-6 sm:top-7 left-5 sm:left-6 right-5 sm:right-6 h-1 sm:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden" />

                    {/* Active Colored Path Connecting Node to Node */}
                    <div
                      className="absolute top-6 sm:top-7 left-5 sm:left-6 h-1 sm:h-1.5 bg-[#457B9D] dark:bg-cyan-500 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `calc(${nodeProgress}% * 0.94)`,
                      }}
                    />

                    {/* Nodes Along Connected Path */}
                    <div className="relative flex items-start justify-between z-10">
                      {HOW_IT_WORKS_NODES.map((node, idx) => {
                        const isActive = activeNodeIndex === idx;
                        const isPast = activeNodeIndex >= idx;
                        const Icon = node.icon;
                        return (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() => setActiveNodeIndex(idx)}
                            className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-hidden max-w-[72px] sm:max-w-none text-center"
                          >
                            <div
                              className={cn(
                                "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 shrink-0",
                                isActive
                                  ? "border-[#457B9D] dark:border-cyan-400 bg-[#457B9D] dark:bg-cyan-500 text-white shadow-lg shadow-[#457B9D]/30 dark:shadow-cyan-500/30 scale-105 sm:scale-110"
                                  : isPast
                                  ? "border-[#457B9D] bg-white dark:bg-zinc-900 text-[#457B9D] dark:text-cyan-400 shadow-xs"
                                  : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 hover:border-zinc-400"
                              )}
                            >
                              <Icon size={18} className="sm:size-5" />
                            </div>

                            {/* Node Label */}
                            <div className="w-full text-center">
                              <span
                                className={cn(
                                  "block text-xs sm:text-sm font-semibold transition-colors mt-1 leading-tight sm:leading-normal",
                                  isActive
                                    ? "text-[#457B9D] dark:text-cyan-400 font-bold"
                                    : "text-zinc-600 dark:text-zinc-400"
                                )}
                              >
                                {node.shortLabel}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Active Node Detail Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNodeIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-6 sm:p-8 space-y-6 sm:space-y-8"
                  >
                    <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-4 sm:pb-5 text-center sm:text-left space-y-1.5">
                      <h3 className="font-display text-xl sm:text-2xl text-zinc-950 dark:text-white">
                        {HOW_IT_WORKS_NODES[activeNodeIndex].title}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-[#457B9D] dark:text-cyan-400">
                        {HOW_IT_WORKS_NODES[activeNodeIndex].headline}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
                      <div className="md:col-span-7 space-y-3">
                        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                          {HOW_IT_WORKS_NODES[activeNodeIndex].description}
                        </p>
                      </div>

                      <div className="md:col-span-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-3">
                        <span className="font-mono text-xs font-bold uppercase text-zinc-400 tracking-wider block">
                          Key Capabilities:
                        </span>
                        <ul className="space-y-2">
                          {HOW_IT_WORKS_NODES[activeNodeIndex].keySignals.map((signal, sIdx) => (
                            <li
                              key={sIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
                            >
                              <CheckCircle2
                                size={15}
                                className="text-[#457B9D] dark:text-cyan-400 shrink-0 mt-0.5"
                              />
                              <span>{signal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Manual Navigation between Nodes */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                      <button
                        type="button"
                        disabled={activeNodeIndex === 0}
                        onClick={() => setActiveNodeIndex((prev) => Math.max(0, prev - 1))}
                        className="w-full sm:w-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition cursor-pointer shrink-0"
                      >
                        &larr; Previous Stage
                      </button>

                      <div className="text-xs sm:text-sm font-mono text-zinc-400 text-center">
                        Stage {activeNodeIndex + 1} of {HOW_IT_WORKS_NODES.length}: {HOW_IT_WORKS_NODES[activeNodeIndex].shortLabel}
                      </div>

                      <button
                        type="button"
                        disabled={activeNodeIndex === HOW_IT_WORKS_NODES.length - 1}
                        onClick={() => setActiveNodeIndex((prev) => Math.min(HOW_IT_WORKS_NODES.length - 1, prev + 1))}
                        className="w-full sm:w-auto rounded-xl bg-[#457B9D] hover:bg-[#3d6e8d] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
                      >
                        Next Stage &rarr;
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 3: WHAT DATA IT TAKES (TRANSPARENCY HANGING CARDS)   */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "data") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  What Data SocialInt Ingests vs. Never Touches
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  We believe in uncompromising privacy standards. SocialInt operates exclusively on public, transparent social signals.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Card: Ingested */}
                <div className="card-hanging rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 lg:p-9 space-y-6 shadow-xs">
                  <div className="flex items-center gap-3.5 border-b border-emerald-500/20 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-display text-xl text-emerald-950 dark:text-emerald-200">
                      Data SocialInt Ingests
                    </span>
                  </div>

                  <div className="space-y-4">
                    {DATA_TAKEN_ITEMS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 p-4.5 sm:p-5 transition hover:border-emerald-500/40"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white break-words">
                              {item.category}
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Card: Excluded */}
                <div className="card-hanging rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-8 lg:p-9 space-y-6 shadow-xs">
                  <div className="flex items-center gap-3.5 border-b border-rose-500/20 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
                      <Lock size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-display text-xl text-rose-950 dark:text-rose-200">
                      What We NEVER Access
                    </span>
                  </div>

                  <div className="space-y-4">
                    {DATA_EXCLUDED_ITEMS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 p-4.5 sm:p-5 transition hover:border-rose-500/40"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white break-words">
                              {item.category}
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 4: ANALYSIS ENGINE (CLEAN PRODUCT ARCHITECTURE)      */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "analysis") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block space-y-8 sm:space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  How SocialInt Analyzes Your Data
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Three interconnected evaluation models examine posts for sentiment intensity, underlying audience psychology, and viral reach velocity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Model 1 */}
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-7 space-y-4 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#457B9D]/10 text-[#457B9D] dark:text-cyan-400">
                    <Activity size={22} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Polarity Spectrum (-100 to +100)
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Evaluates nuanced discussions on a continuous intensity index rather than binary labels. Captures praise, constructive feedback, and brand risks.
                  </p>
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">+1 to +100</span>
                      <span className="text-zinc-400">Advocacy & Praise</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400">-10 to +10</span>
                      <span className="text-zinc-400">Factual Inquiries</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">-1 to -100</span>
                      <span className="text-zinc-400">Critical Sentiment</span>
                    </div>
                  </div>
                </div>

                {/* Model 2 */}
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-7 space-y-4 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    6-Dimensional Emotion Matrix
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Detects the psychological tone behind community replies to uncover authentic sentiment drivers before they manifest in top-level metrics.
                  </p>
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block">Monitored Dimensions:</span>
                    <p className="font-medium text-zinc-700 dark:text-zinc-300">Delight, Trust, Anticipation, Skepticism, Concern, Hostility</p>
                  </div>
                </div>

                {/* Model 3 */}
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-7 space-y-4 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <TrendingUp size={22} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Virality & Anomaly Acceleration
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Tracks comment volume rate-of-change against historical creator averages. Flags coordinated attacks, brigading, or breakout viral momentum.
                  </p>
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-mono">Velocity Threshold</span>
                      <span className="font-mono font-bold text-[#457B9D] dark:text-cyan-400">&gt;3.2x baseline</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-mono">Detection Window</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">&lt; 15 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 5: PLAYBOOKS (PRACTICAL USAGE)                       */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "playbooks") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block space-y-8 sm:space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  How You Can Use SocialInt Effectively
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Real-world execution workflows for PR teams, brand stewards, marketing analysts, and creator managers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 space-y-3 sm:space-y-4 shadow-xs">
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    PR Crisis Mitigation & Early Triage
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Set alert sensitivity in <Link href="/settings" className="text-[#457B9D] dark:text-cyan-400 hover:underline">Settings</Link> to 25%. When negative discourse triggers an alert, inspect root-cause comments in <Link href="/posts-analysis" className="text-[#457B9D] dark:text-cyan-400 hover:underline">Posts Analysis</Link> and take targeted action before viral news cycles begin.
                  </p>
                </div>

                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 space-y-3 sm:space-y-4 shadow-xs">
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Influencer Due Diligence & Vetting
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Before committing sponsorship budgets, enter creator handles in <Link href="/create-profile" className="text-[#457B9D] dark:text-cyan-400 hover:underline">Monitoring Profiles</Link>. Check audience trust ratings and the <Link href="/influence" className="text-[#457B9D] dark:text-cyan-400 hover:underline">Influence Graph</Link> to distinguish genuine engagement from bought follower counts.
                  </p>
                </div>

                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 space-y-3 sm:space-y-4 shadow-xs">
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Product Launch Sentiment Tracking
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Track launch hashtags on the <Link href="/trends" className="text-[#457B9D] dark:text-cyan-400 hover:underline">Trends Radar</Link>. Monitor customer reception regarding features or pricing, and export an executive PDF briefing directly for leadership review.
                  </p>
                </div>

                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 space-y-3 sm:space-y-4 shadow-xs">
                  <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white">
                    Competitor Intelligence Benchmarking
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Set up rival brand handles to pinpoint their customer friction points and unresolved complaints. Leverage their negative sentiment trends to optimize your own product messaging and campaign positioning.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 6: WHERE YOU CAN SEE ANALYZED DATA                   */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "locations") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block space-y-8 sm:space-y-12"
            >
              <div className="text-center max-w-3xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  Where You Can See Analyzed Data
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Every metric has a purpose-built view inside your workspace. Browse each specialized interface below to discover which views provide high-level pulses, deep post forensics, network topologies, or executive deliverables.
                </p>
              </div>

              {/* Spacious 3x3 Grid (9 platform destinations with generous breathing room) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {PLATFORM_LOCATIONS.map((loc, idx) => {
                  const Icon = loc.icon;
                  return (
                    <Link
                      key={idx}
                      href={loc.href}
                      className="card-hanging group flex flex-col justify-between rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 hover:border-[#457B9D]/50 dark:hover:border-cyan-500/40 shadow-xs transition-all duration-200 space-y-6"
                    >
                      <div className="space-y-5">
                        {/* Top bar with icon and route badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#457B9D]/10 text-[#457B9D] dark:text-cyan-400 group-hover:bg-[#457B9D] group-hover:text-white transition duration-200 shadow-2xs shrink-0">
                            <Icon size={22} />
                          </div>
                          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 font-medium truncate max-w-[140px] sm:max-w-none">
                            {loc.href}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white group-hover:text-[#457B9D] dark:group-hover:text-cyan-400 transition-colors mt-1.5 flex items-center justify-between gap-2">
                            <span className="truncate">{loc.title}</span>
                            <ArrowUpRight size={18} className="text-zinc-400 group-hover:text-[#457B9D] dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                          </h3>
                          <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                            {loc.description}
                          </p>
                        </div>

                        {/* Feature capabilities */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                            Key Capabilities:
                          </span>
                          {loc.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              <CheckCircle2 size={15} className="text-[#457B9D] dark:text-cyan-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom interactive link bar */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#457B9D] dark:text-cyan-400">
                        <span className="truncate">Open {loc.title.split(" ")[0]} View</span>
                        <div className="flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-200 shrink-0">
                          <span>Enter</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 7: HOW TO DOWNLOAD REPORTS & SUPPORTED FORMATS       */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "reports") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block space-y-10 sm:space-y-14"
            >
              {/* Main Section Header */}
              <div className="text-center max-w-3xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  How to Download Reports
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Export stakeholder-ready executive briefings, raw tabular spreadsheets, or complete developer data bundles in seconds. All reports are rendered client-side with zero queue delay.
                </p>
              </div>

              {/* Sub-section 1: 4-Step Download Guide */}
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                  <h3 className="font-display text-xl sm:text-2xl text-zinc-950 dark:text-white">
                    How to Download Any Report in 4 Simple Steps
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Follow this streamlined workflow from your live dashboard directly to your local machine:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Step 1 */}
                  <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#457B9D] dark:text-cyan-400">
                          01
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          <Compass size={18} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                          Open Reports Hub
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Navigate to the Reports page from the primary sidebar or click the &apos;Export Report&apos; quick-action button on any analytics dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <Link
                        href="/reports"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#457B9D] dark:text-cyan-400 hover:underline"
                      >
                        <span>Open /reports view</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#457B9D] dark:text-cyan-400">
                          02
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          <SlidersHorizontal size={18} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                          Select Entity & Range
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Choose the monitored brand handle or channel, then filter your timeframe: Last 24 Hours, Last 7 Days, Last 30 Days, or All Time.
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-mono text-zinc-500">
                      <span>Multi-channel & date filters</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#457B9D] dark:text-cyan-400">
                          03
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          <FileText size={18} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                          Choose Output Format
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Select your desired format: Executive PDF Dossier for stakeholders, Tabular CSV for spreadsheet modeling, or JSON for developers.
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-mono text-zinc-500">
                      <span>PDF, CSV, or JSON payloads</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#457B9D] dark:text-cyan-400">
                          04
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          <Download size={18} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                          Instant Download
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Click &apos;Download&apos;. The browser generates your file on-the-fly and saves it directly to your downloads folder without server wait queues.
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 size={14} />
                      <span>Zero queue time (&lt; 2s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 8: PRIVACY AND SAFETY                                */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "privacy") && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  Privacy, Compliance & Safety Standards
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Engineered with zero-password access, TLS 1.3 in-transit encryption, and strict GDPR data sovereignty.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 space-y-3.5 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Lock size={22} />
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                    Zero-Password Architecture
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    SocialInt never asks for or stores social credentials. Ingestion is performed via isolated, read-only actors targeting public signals.
                  </p>
                </div>

                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 space-y-3.5 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Shield size={22} />
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                    End-to-End Encryption
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Browser sessions utilize TLS 1.3 encryption. Database records are protected at rest via AES-256 standard encryption.
                  </p>
                </div>

                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 space-y-3.5 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                    GDPR & Data Sovereignty
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Complete data portability. You can export your entire history or purge monitored profiles and local application cache with 1 click in Settings.
                  </p>
                </div>

                <div className="card-hanging rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 space-y-3.5 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <UserCheck size={22} />
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-zinc-950 dark:text-white">
                    Enterprise Clerk Auth
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Identity validation supported by Clerk with multi-factor authentication (MFA), OAuth 2.0 (Google, GitHub), and secure cryptographic sessions.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* SECTION 9: EMAIL HELP & CONTACT US                           */}
          {/* ============================================================ */}
          {(activeTab === "all" || activeTab === "contact") && (
            <motion.section
              id="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  Contact Us & Email Support
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Have an edge-case question, feature request, or need a custom scraper actor configured? Reach out directly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Contact Info & Support Guarantee Card */}
                <div className="card-hanging lg:col-span-5 rounded-3xl border border-[#457B9D]/30 bg-linear-to-b from-[#457B9D]/10 via-white to-white dark:from-[#457B9D]/20 dark:via-[#0d111a] dark:to-[#080b12] p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 shadow-xs">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl sm:text-2xl text-zinc-950 dark:text-white">
                      Direct Developer Support
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      SocialInt is actively engineered by Neelabh Shukla. You receive direct developer assistance for fast resolutions.
                    </p>
                  </div>

                  {/* Highlighted Email Card */}
                  <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/90 p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-mono text-xs uppercase font-bold text-zinc-400">
                      Primary Support Address
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs sm:text-sm md:text-base font-bold text-[#457B9D] dark:text-cyan-400 truncate max-w-[200px] sm:max-w-none">
                        {SUPPORT_EMAIL}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95 cursor-pointer shrink-0"
                        title="Copy email to clipboard"
                      >
                        {copiedEmail ? (
                          <Check size={16} className="text-emerald-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>

                    <a
                      href={`mailto:${SUPPORT_EMAIL}?subject=SocialInt%20Support%20Inquiry`}
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-3 text-xs sm:text-sm font-semibold hover:opacity-90 transition active:scale-95 cursor-pointer text-center"
                    >
                      <ExternalLink size={15} />
                      <span>Open in Mail Client</span>
                    </a>
                  </div>

                  {/* Guarantees */}
                  <div className="space-y-3.5 pt-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                      <Clock size={16} className="text-[#457B9D] dark:text-cyan-400 shrink-0" />
                      <span>Response SLA: <strong>Within 2 hours</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                      <UserCheck size={16} className="text-[#457B9D] dark:text-cyan-400 shrink-0" />
                      <span>Direct Lead Engineer: <strong>Neelabh Shukla</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                      <Radio size={16} className="text-[#457B9D] dark:text-cyan-400 shrink-0" />
                      <span>Custom Platform Connectors: <strong>Available upon request</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Interactive Support Form */}
                <div className="card-hanging lg:col-span-7 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d111a] p-6 sm:p-8 lg:p-10 space-y-6 shadow-xs">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-zinc-950 dark:text-white">
                      Send a Message to Support
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      Fill out this quick form and click send. It pre-populates your inquiry directly to {SUPPORT_EMAIL}.
                    </p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-hidden focus:ring-1 focus:ring-[#457B9D] transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Your Reply Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="alex@company.com"
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-hidden focus:ring-1 focus:ring-[#457B9D] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Inquiry Category
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white focus:border-[#457B9D] focus:outline-hidden focus:ring-1 focus:ring-[#457B9D] transition"
                      >
                        <option value="Platform Guidance">How to Use SocialInt / Platform Guidance</option>
                        <option value="Data Ingestion Help">Data Ingestion / Scraper Help</option>
                        <option value="Report Download Inquiry">Report Download & Export Inquiry</option>
                        <option value="Bug Report">Report a Bug / Platform Issue</option>
                        <option value="Feature Suggestion">Feature Suggestion / Enhancement</option>
                        <option value="Custom Integration">Custom API / Platform Integration</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Your Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Describe your question, request, or issue with as much detail as possible..."
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-hidden focus:ring-1 focus:ring-[#457B9D] transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#457B9D] hover:bg-[#3d6e8d] text-white py-3.5 text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      <Send size={15} className="shrink-0" />
                      <span className="truncate">Send Support Inquiry</span>
                    </button>

                    {formSubmitted && (
                      <p className="text-center font-mono text-xs text-emerald-600 dark:text-emerald-400">
                        ✓ Your mail client has been launched with your formatted support ticket!
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#080b12] text-zinc-600 dark:text-zinc-400 font-mono text-xs">
          Loading Knowledge Hub...
        </div>
      }
    >
      <HelpContent />
    </Suspense>
  );
}
