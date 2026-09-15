"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

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
  const [hasMounted, setHasMounted] = useState(false);

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
          setReports(parsed);
        }
      }
    } catch (error) {
      console.error("Unable to load reports.", error);
    }
    setHasMounted(true);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden my-auto"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* MODAL ACTION TOOLBAR */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
              <FileText size={17} strokeWidth={2} />
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                {report.title}
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                {report.period} • {report.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
              aria-label="Close report preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* REPORT CONTENT DOCUMENT (ID for PDF capture) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-50/50">
          <div
            id="socialint-analyzed-report-doc"
            className="w-full bg-white p-6 sm:p-10 rounded-xl border border-zinc-200 text-zinc-900 shadow-xs space-y-7"
            style={{ backgroundColor: "#ffffff", color: "#09090b" }}
          >
            {/* 1. REPORT HEADING: "SocialInt Analyzed Report" */}
            <header className="border-b border-zinc-200 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
                      SocialInt
                    </span>
                    <span className="text-[11px] font-mono bg-[#457B9D]/10 text-[#457B9D] px-2 py-0.5 rounded font-semibold border border-[#457B9D]/20">
                      Analyzed Report
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    SocialInt Analyzed Report
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Social media handles performance, public conversation activity & sentiment audit
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs text-zinc-500 font-mono space-y-1">
                  <p>
                    <span className="text-zinc-400">Report ID:</span>{" "}
                    <strong className="text-zinc-700 font-semibold">{report.id}</strong>
                  </p>
                  <p>
                    <span className="text-zinc-400">Period:</span>{" "}
                    <strong className="text-zinc-700 font-semibold">{report.period}</strong>
                  </p>
                  <p>
                    <span className="text-zinc-400">Date:</span>{" "}
                    <strong className="text-zinc-700 font-semibold">{report.date}</strong>
                  </p>
                </div>
              </div>
            </header>

            {/* 2. EXECUTIVE SUMMARY */}
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Executive Summary
              </h2>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs sm:text-sm leading-relaxed text-zinc-700">
                {report.summary}
              </div>
            </section>

            {/* 3. KEY METRICS */}
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Key Performance Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">
                    Posts Analyzed
                  </span>
                  <span className="text-xl font-bold font-mono text-zinc-950 mt-1 block">
                    {report.metrics?.postsAnalyzed || "148.2K"}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
                    +12.4% vs last period
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">
                    Total Impressions
                  </span>
                  <span className="text-xl font-bold font-mono text-zinc-950 mt-1 block">
                    {report.metrics?.reach || "342.5K"}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                    Audience reach
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">
                    Avg Engagement
                  </span>
                  <span className="text-xl font-bold font-mono text-zinc-950 mt-1 block">
                    {report.metrics?.engagement || "4.3%"}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                    Benchmark: 2.5%
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">
                    Positive Sentiment
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                    {report.metrics?.positiveSentiment || "77%"}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block">
                    Dominant response
                  </span>
                </div>
              </div>
            </section>

            {/* 4. MONITORED SOCIAL HANDLES BREAKDOWN */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Monitored Social Handles Breakdown
                </h2>
                <span className="text-[11px] font-mono text-zinc-400">
                  {displayHandles.length} Channels Audited
                </span>
              </div>

              <div className="space-y-3">
                {displayHandles.map((handleItem, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-100">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200">
                          {handleItem.platform === "Instagram" && (
                            <InstagramIcon size={16} className="text-pink-600" />
                          )}
                          {handleItem.platform === "Facebook" && (
                            <FacebookIcon size={16} className="text-blue-600" />
                          )}
                          {handleItem.platform === "GitHub" && (
                            <GithubIcon size={16} className="text-zinc-800" />
                          )}
                          {!["Instagram", "Facebook", "GitHub"].includes(handleItem.platform) && (
                            <FileText size={16} className="text-[#457B9D]" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900">
                            {handleItem.platform}: {handleItem.handle}
                          </h3>
                          <p className="text-xs text-zinc-500 font-mono">
                            {handleItem.followers} Followers • {handleItem.posts} Posts Audited
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-semibold text-zinc-700 bg-zinc-50 px-2.5 py-1 rounded border border-zinc-200 self-start sm:self-auto">
                        Rate: {handleItem.engagementRate}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-zinc-600 mb-1 font-mono">
                        <span>Sentiment Distribution</span>
                        <span className="font-semibold text-emerald-600">
                          {handleItem.sentiment.positive}% Positive
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-100 overflow-hidden flex">
                        <div
                          style={{ width: `${handleItem.sentiment.positive}%` }}
                          className="bg-emerald-500"
                        />
                        <div
                          style={{ width: `${handleItem.sentiment.neutral}%` }}
                          className="bg-[#457B9D]"
                        />
                        <div
                          style={{ width: `${handleItem.sentiment.negative}%` }}
                          className="bg-rose-500"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
                        <span>+{handleItem.sentiment.positive}% pos</span>
                        <span>{handleItem.sentiment.neutral}% neu</span>
                        <span>-{handleItem.sentiment.negative}% neg</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 mt-2.5 pt-2 border-t border-zinc-100">
                      <strong className="text-zinc-800 font-semibold">Key Finding:</strong>{" "}
                      {handleItem.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. SENTIMENT OVERVIEW */}
            <section className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
                Audience Sentiment Overview
              </h2>
              <div className="space-y-2.5">
                <ProgressRow
                  label="Positive Feedback"
                  value="77%"
                  width="77%"
                  className="bg-emerald-500"
                />
                <ProgressRow
                  label="Neutral / Inquiries"
                  value="17%"
                  width="17%"
                  className="bg-[#457B9D]"
                />
                <ProgressRow
                  label="Critical / Issues"
                  value="6%"
                  width="6%"
                  className="bg-rose-500"
                />
              </div>
            </section>

            {/* 6. KEY TOPICS */}
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
                Trending Conversation Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 font-mono">
                  #Performance <strong className="text-emerald-600 ml-1">+38%</strong>
                </span>
                <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 font-mono">
                  #FeatureUpdates <strong className="text-emerald-600 ml-1">+29%</strong>
                </span>
                <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 font-mono">
                  #DeveloperSetup <strong className="text-zinc-500 ml-1">+14%</strong>
                </span>
                <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 font-mono">
                  #Documentation <strong className="text-emerald-600 ml-1">+11%</strong>
                </span>
              </div>
            </section>

            {/* 7. DETAILED ANALYZED FOOTER */}
            <footer className="border-t border-zinc-200 pt-5 text-xs text-zinc-500 space-y-2 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-zinc-700 font-medium">
                <span>
                  SocialInt Analyzed Report • Handles: {report.sources.join(", ")}
                </span>
                <span>Generated on {report.date} • Page 1 of 1</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Document ID: {report.id} • Confidential • Prepared for SocialInt workspace analysis. All metrics compiled from verified public social channels.
              </p>
            </footer>
          </div>
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4">
          <p className="text-xs text-zinc-400 font-mono hidden sm:block">
            SocialInt Report Preview • ID: {report.id}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 text-center shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* PROGRESS ROW                                       */
/* ================================================== */

function ProgressRow({
  label,
  value,
  width,
  className,
}: {
  label: string;
  value: string;
  width: string;
  className: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="font-mono text-zinc-600 font-semibold">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
        <div
          className={`h-full rounded-full ${className}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}