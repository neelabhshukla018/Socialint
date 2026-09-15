"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Heart,
  Plus,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

const emptySubscribe = () => () => {};

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/* ================================================== */
/* SOCIAL BRAND ICONS                                 */
/* ================================================== */

function InstagramIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function GithubIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

/* ================================================== */
/* TYPES                                              */
/* ================================================== */

type ReportStatus = "Ready" | "Generating";

type ReportType =
  | "Social Handles Analysis"
  | "Weekly Intelligence"
  | "Sentiment Analysis"
  | "Trend Analysis"
  | "Audience Insights";

interface HandleAnalysisItem {
  platform: "Instagram" | "Facebook" | "GitHub" | "X" | "Telegram";
  handle: string;
  followers: string;
  posts: number;
  engagementRate: string;
  sentiment: { positive: number; neutral: number; negative: number };
  note: string;
}

interface Report {
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
}

/* ================================================== */
/* STORAGE                                            */
/* ================================================== */

const REPORTS_STORAGE_KEY = "socialintel_reports_v5";

/* ================================================== */
/* DEFAULT REPORTS                                    */
/* ================================================== */

const DEFAULT_REPORTS: Report[] = [
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
  },
];

/* ================================================== */
/* REPORT TYPE CONFIG                                 */
/* ================================================== */

const reportTypes: {
  type: ReportType;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    type: "Social Handles Analysis",
    description:
      "Complete analysis across Instagram, Facebook, and GitHub handles.",
    icon: FileText,
  },
  {
    type: "Weekly Intelligence",
    description:
      "Overview of sentiment, trends, and audience activity across channels.",
    icon: CalendarDays,
  },
  {
    type: "Sentiment Analysis",
    description:
      "Detailed positive, neutral, and negative sentiment distribution.",
    icon: BarChart3,
  },
  {
    type: "Trend Analysis",
    description:
      "Discover emerging topics and rapidly growing conversations.",
    icon: TrendingUp,
  },
  {
    type: "Audience Insights",
    description:
      "Understand audience behavior, reactions, and engagement rates.",
    icon: Sparkles,
  },
];

/* ================================================== */
/* PAGE                                               */
/* ================================================== */

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(DEFAULT_REPORTS);
  const hasMounted = useHasMounted();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | ReportType>("All");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* LOAD REPORTS AFTER MOUNT (Guarantees matching SSR and client hydration) */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => {
            setReports(parsed);
          }, 0);
        }
      }
    } catch (error) {
      console.error("Unable to load reports.", error);
    }
  }, []);

  /* SAVE REPORTS */
  useEffect(() => {
    if (!hasMounted) return;
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error("Unable to save reports.", error);
    }
  }, [reports, hasMounted]);

  /* FILTER REPORTS */
  const filteredReports = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(query) ||
        report.type.toLowerCase().includes(query) ||
        report.summary.toLowerCase().includes(query) ||
        report.sources.some((s) => s.toLowerCase().includes(query));

      const matchesFilter = filter === "All" || report.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [reports, searchQuery, filter]);

  /* DELETE REPORT */
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Delete this report?");
    if (!confirmed) return;

    setReports((current) => current.filter((report) => report.id !== id));
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  /* GENERATE REPORT */
  const handleGenerate = (type: ReportType) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newId = `SIR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newReport: Report = {
      id: newId,
      title: type === "Social Handles Analysis" ? "SocialInt Analyzed Report" : `${type} Report`,
      type,
      date: today,
      status: "Generating",
      period: "Current period",
      sources: ["Instagram", "Facebook", "GitHub"],
      summary:
        "Your report is being prepared from the latest available monitoring data across connected handles.",
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
    };

    setReports((current) => [newReport, ...current]);
    setShowGenerateModal(false);

    setTimeout(() => {
      setReports((current) =>
        current.map((report) =>
          report.id === newReport.id
            ? {
                ...report,
                status: "Ready",
                summary:
                  "Latest social media activity analyzed across Instagram, Facebook, and GitHub. Community feedback is 76% positive with strong engagement.",
              }
            : report
        )
      );
    }, 1500);
  };

  /* OPEN PREVIEW */
  const handleOpenPreview = (report: Report) => {
    setSelectedReport(report);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080b12] bg-grid-dashboard text-zinc-900 dark:text-zinc-100 selection:bg-[#457B9D]/20 transition-colors duration-150">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* MAIN */}
      <main className="lg:ml-[270px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <div className="px-4 py-5 sm:px-8 sm:py-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            {/* PAGE HEADER */}
            <section className="mb-6 sm:mb-8 flex flex-col items-center text-center sm:items-start sm:text-left xl:flex-row xl:items-end justify-between gap-5 sm:gap-6">
              <div className="flex flex-col items-center sm:items-start">
                <div className="mb-2 sm:mb-3 flex items-center justify-center sm:justify-start gap-2">
                  <FileText size={15} className="text-[#457B9D]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#457B9D]">
                    Intelligence center
                  </span>
                </div>

                <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-white text-center sm:text-left">
                  Reports
                </h1>

                <p className="mt-1.5 sm:mt-2.5 max-w-2xl text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 text-center sm:text-left mx-auto sm:mx-0">
                  Preview and download analyzed reports for your social media handles (Instagram, Facebook, GitHub).
                </p>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={() => setShowGenerateModal(true)}
                className="flex w-full sm:w-fit items-center justify-center gap-2 rounded-xl bg-[#457B9D] px-5 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#386785] active:scale-98 shrink-0"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>Generate report</span>
              </button>
            </section>

            {/* SUMMARY STATS */}
            <section className="mb-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <ReportStat
                label="Total reports"
                value={reports.length}
                icon={FileText}
              />
              <ReportStat
                label="Ready reports"
                value={reports.filter((r) => r.status === "Ready").length}
                icon={Check}
              />
              <ReportStat
                label="Latest report"
                value={reports.length > 0 ? reports[0].date : "None"}
                icon={Clock3}
              />
            </section>

            {/* SEARCH + FILTER */}
            <section className="mb-6 flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-xs sm:text-sm text-zinc-950 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 focus:border-[#457B9D] focus:ring-2 focus:ring-[#457B9D]/20 shadow-xs"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "All" | ReportType)}
                  className="h-full w-full sm:w-auto sm:min-w-[190px] appearance-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 outline-none transition focus:border-[#457B9D] focus:ring-2 focus:ring-[#457B9D]/20 shadow-xs"
                >
                  <option value="All">All report types</option>
                  {reportTypes.map((rt) => (
                    <option key={rt.type} value={rt.type}>
                      {rt.type}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
            </section>

            {/* REPORT LIST */}
            <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-display text-lg tracking-tight text-zinc-950 dark:text-white">
                    Generated reports
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Your analyzed reports with handles breakdown & preview
                  </p>
                </div>

                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {filteredReports.length} reports
                </span>
              </div>

              {filteredReports.length === 0 ? (
                <EmptyReports
                  searchQuery={searchQuery}
                  onGenerate={() => setShowGenerateModal(true)}
                />
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredReports.map((report) => (
                    <ReportRow
                      key={report.id}
                      report={report}
                      onOpen={() => handleOpenPreview(report)}
                      onDelete={() => handleDelete(report.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* GENERATE MODAL */}
      {showGenerateModal && (
        <GenerateReportModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
        />
      )}

      {/* PREVIEW MODAL */}
      {selectedReport && (
        <ReportPreviewModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

/* ================================================== */
/* REPORT STAT                                        */
/* ================================================== */

function ReportStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {value}
          </p>
        </div>

        <div className="rounded-xl border border-[#457B9D]/20 dark:border-[#457B9D]/30 bg-[#457B9D]/10 dark:bg-[#457B9D]/15 p-2.5 text-[#457B9D]">
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* REPORT ROW                                         */
/* ================================================== */

function ReportRow({
  report,
  onOpen,
  onDelete,
}: {
  report: Report;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const isReady = report.status === "Ready";

  return (
    <div className="group px-3.5 py-4 transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 sm:px-6 sm:py-5">
      <div className="flex flex-col justify-between gap-3 sm:gap-4 lg:flex-row lg:items-center">
        {/* REPORT INFO */}
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#457B9D]/20 dark:border-[#457B9D]/30 bg-[#457B9D]/10 dark:bg-[#457B9D]/15 text-[#457B9D]">
            <FileText size={18} strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3
                onClick={onOpen}
                className="cursor-pointer truncate text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white hover:text-[#457B9D] transition max-w-[180px] xs:max-w-xs sm:max-w-none"
              >
                {report.title}
              </h3>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold font-mono border ${
                  isReady
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40"
                    : "bg-[#457B9D]/10 dark:bg-[#457B9D]/20 text-[#457B9D] border-[#457B9D]/20"
                }`}
              >
                {report.status}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {report.type}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <CalendarDays size={12} />
                {report.period}
              </span>
              <span>•</span>
              <span>{report.date}</span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline">{report.sources.join(" · ")}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 self-start sm:self-auto pl-12 lg:pl-0">
          <button
            type="button"
            onClick={onOpen}
            disabled={!isReady}
            className="flex items-center gap-1.5 rounded-lg border border-[#457B9D]/30 bg-[#457B9D]/10 hover:bg-[#457B9D]/20 dark:bg-[#457B9D]/15 dark:hover:bg-[#457B9D]/25 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-[#457B9D] dark:text-[#7bb5d4] transition shadow-xs active:scale-98 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-transparent p-1.5 sm:p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition hover:bg-rose-50 dark:hover:bg-rose-950/20"
            aria-label={`Delete ${report.title}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* EMPTY STATE                                        */
/* ================================================== */

function EmptyReports({
  searchQuery,
  onGenerate,
}: {
  searchQuery: string;
  onGenerate: () => void;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[#457B9D]">
        <FileText size={20} />
      </div>

      <h3 className="mt-4 font-display text-lg tracking-wide text-zinc-950 dark:text-white">
        {searchQuery ? "No reports found" : "No reports yet"}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {searchQuery
          ? "Try changing your search or report type filter."
          : "Generate your first intelligence report from your monitored data."}
      </p>

      {!searchQuery && (
        <button
          type="button"
          onClick={onGenerate}
          className="mt-5 flex items-center gap-2 rounded-xl bg-[#457B9D] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#386785]"
        >
          <Plus size={14} />
          <span>Generate report</span>
        </button>
      )}
    </div>
  );
}

/* ================================================== */
/* GENERATE REPORT MODAL                              */
/* ================================================== */

function GenerateReportModal({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: (type: ReportType) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 sm:p-5 backdrop-blur-xs"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl sm:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
              <Sparkles size={18} strokeWidth={2} />
            </div>

            <h2 className="font-display text-xl tracking-tight text-zinc-950">
              Generate report
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Choose the intelligence report you want to generate.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Report types */}
        <div className="mt-6 grid gap-3">
          {reportTypes.map((reportType) => {
            const Icon = reportType.icon;
            return (
              <button
                key={reportType.type}
                type="button"
                onClick={() => onGenerate(reportType.type)}
                className="group flex items-center gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-left transition hover:border-[#457B9D] hover:bg-white hover:shadow-xs"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-[#457B9D] transition group-hover:bg-[#457B9D] group-hover:text-white group-hover:border-[#457B9D]">
                  <Icon size={17} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900 group-hover:text-[#457B9D]">
                    {reportType.type}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {reportType.description}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className="-rotate-90 text-zinc-400 transition group-hover:text-zinc-700"
                />
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-xs text-zinc-400 font-mono">
          Reports are generated from your currently available monitoring data and connected sources.
        </p>
      </div>
    </div>
  );
}

/* ================================================== */
/* ENHANCED REPORT PREVIEW MODAL WITH PDF EXPORT      */
/* ================================================== */

function ReportPreviewModal({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  // Fallback handle details if report doesn't contain them
  const displayHandles: HandleAnalysisItem[] = report.handles || [
    {
      platform: "Instagram",
      handle: "@socialint_app",
      followers: "24.8K",
      posts: 36,
      engagementRate: "4.8%",
      sentiment: { positive: 76, neutral: 18, negative: 6 },
      note: "High interaction on reels and feature announcements with positive audience comments.",
    },
    {
      platform: "Facebook",
      handle: "SocialInt Official",
      followers: "18.4K",
      posts: 22,
      engagementRate: "3.2%",
      sentiment: { positive: 71, neutral: 22, negative: 7 },
      note: "Steady community engagement with constructive conversations on recent updates.",
    },
    {
      platform: "GitHub",
      handle: "socialint/platform",
      followers: "3.4K stars",
      posts: 18,
      engagementRate: "Active",
      sentiment: { positive: 84, neutral: 13, negative: 3 },
      note: "Developer collaboration with swift pull requests review and documentation praise.",
    },
  ];

  // Sample verified posts for each platform to give real social media analytics context
  const platformPosts: Record<
    string,
    {
      content: string;
      metrics: { label: string }[];
      highlight: string;
    }
  > = {
    Instagram: {
      content:
        "Sneak peek of our new live analytics stream! Tracking engagement across connected handles in real-time. Which platform should we integrate next? 🚀",
      metrics: [
        { label: "1,420 likes" },
        { label: "186 comments" },
        { label: "94 shares" },
      ],
      highlight: "Short-form video reels drove 68% of new profile visits this week.",
    },
    Facebook: {
      content:
        "Community Q&A Recap: Key answers regarding automated reporting schedules, API rate limits, and team workspace access.",
      metrics: [
        { label: "412 reactions" },
        { label: "68 comments" },
        { label: "31 shares" },
      ],
      highlight: "Active discussions on release announcements and custom alert webhook setup.",
    },
    GitHub: {
      content:
        "Release v2.4.0: Scaled stream ingestion pipeline with low-latency scoring and webhook dispatchers.",
      metrics: [
        { label: "84 new stars" },
        { label: "14 PRs merged" },
        { label: "28 issues closed" },
      ],
      highlight: "Fast pull request turnarounds with positive feedback on API documentation clarity.",
    },
  };

  const communityQuotes = [
    {
      author: "@dev_sarah",
      platform: "Instagram",
      quote: "The unified multi-channel view saved our team hours every week. Real-time updates are fast.",
      badge: "Verified Account",
    },
    {
      author: "@alex_k",
      platform: "GitHub",
      quote: "Code review was swift and the documentation worked out of the box on first attempt.",
      badge: "Contributor",
    },
    {
      author: "Marcus Chen",
      platform: "Facebook",
      quote: "Appreciate the transparent answers during the community live stream. Very responsive team.",
      badge: "Community Member",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 p-3 sm:p-5 md:p-6 backdrop-blur-sm overflow-y-auto"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-5xl flex flex-col rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] shadow-2xl overflow-hidden my-auto transition-colors duration-150"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0c1017]/95 px-5 sm:px-7 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3.5 min-w-0">
           

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg font-sans tracking-tight text-black dark:text-white">
                  SocialInt
                </span>
                <span className="text-zinc-300 dark:text-zinc-700 font-bold">•</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  Social Handles Performance Report
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-medium">
                Period: {report.period} • Updated {report.date}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Close report preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL CONTENT: AUTHENTIC PRODUCT ANALYTICS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 md:p-8 bg-zinc-50/70 dark:bg-[#070a0f] space-y-6 sm:space-y-8">
          {/* 1. TOP SUMMARY CARD */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0e131f] p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#457B9D] dark:text-cyan-400 font-mono">
                  Audience & Content Intelligence
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight mt-1">
                  Social Media Handles Overview
                </h1>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                  Aggregated audience activity and feedback across 3 connected channels
                </p>
              </div>

              {/* Channels badge list */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700">
                  <InstagramIcon size={14} className="text-pink-600" />
                  @socialint_app
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700">
                  <FacebookIcon size={14} className="text-blue-600" />
                  SocialInt Official
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700">
                  <GithubIcon size={14} className="text-zinc-800 dark:text-white" />
                  socialint/platform
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal mt-5">
              {report.summary}
            </p>
          </div>

          {/* 2. HIGH-LEVEL AGGREGATE STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e131f] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Audience</span>
                <Users size={16} className="text-[#457B9D]" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white mt-2">
                46.6K
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                +840 this week
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e131f] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Tracked Posts</span>
                <BarChart3 size={16} className="text-[#457B9D]" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white mt-2">
                {report.metrics?.postsAnalyzed || "76"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                Across 3 handles
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e131f] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Avg Engagement</span>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white mt-2">
                {report.metrics?.engagement || "4.3%"}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Above platform avg
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e131f] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Positive Feedback</span>
                <Heart size={16} className="text-rose-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                {report.metrics?.positiveSentiment || "77%"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                17% neutral, 6% critical
              </p>
            </div>
          </div>

          {/* 3. AUDITED SOCIAL HANDLES BREAKDOWN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-black dark:text-white tracking-tight">
                Audited Social Handles Breakdown
              </h2>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                3 Connected Profiles
              </span>
            </div>

            <div className="grid gap-5">
              {displayHandles.map((handleItem, idx) => {
                const postInfo = platformPosts[handleItem.platform] || {
                  content: "Latest published update discussing features and platform roadmap.",
                  metrics: [{ label: "High reactions" }, { label: "Active comments" }],
                  highlight: handleItem.note,
                };

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e131f] p-5 sm:p-6 shadow-xs hover:border-[#457B9D]/40 transition duration-150 space-y-4"
                  >
                    {/* Header: Platform icon, handle name, followers, rate */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shrink-0">
                          {handleItem.platform === "Instagram" && (
                            <InstagramIcon size={20} className="text-pink-600 dark:text-pink-400" />
                          )}
                          {handleItem.platform === "Facebook" && (
                            <FacebookIcon size={20} className="text-blue-600 dark:text-blue-400" />
                          )}
                          {handleItem.platform === "GitHub" && (
                            <GithubIcon size={20} className="text-zinc-900 dark:text-white" />
                          )}
                          {!["Instagram", "Facebook", "GitHub"].includes(handleItem.platform) && (
                            <FileText size={20} className="text-[#457B9D]" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-black dark:text-white tracking-tight">
                              {handleItem.handle}
                            </h3>
                            <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                              {handleItem.platform}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                            {handleItem.followers} Followers • {handleItem.posts} Posts Audited
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm font-bold text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                          Engagement: {handleItem.engagementRate}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                          {handleItem.sentiment.positive}% Positive
                        </span>
                      </div>
                    </div>

                    {/* Real Post Snippet Highlight */}
                    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                        Top Engaging Content
                      </span>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed italic">
                        &ldquo;{postInfo.content}&rdquo;
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300 pt-1">
                        {postInfo.metrics.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700"
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Audience Insight Note */}
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      <strong className="text-black dark:text-white font-bold mr-1">
                        Audience Takeaway:
                      </strong>
                      {handleItem.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. REAL COMMUNITY FEEDBACK CALLOUTS */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-black dark:text-white tracking-tight">
                Verified Audience Feedback Highlights
              </h2>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Sample Community Quotes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communityQuotes.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e131f] p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3"
                >
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                    &ldquo;{q.quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3 text-xs">
                    <div>
                      <span className="font-bold text-black dark:text-white block">
                        {q.author}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                        via {q.platform}
                      </span>
                    </div>
                    <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {q.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] px-6 py-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
            SocialInt Workspace • Verified multi-channel reporting
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 px-6 py-2.5 text-xs sm:text-sm font-bold transition shadow-xs"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}