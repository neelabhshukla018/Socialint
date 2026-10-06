"use client";

import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Heart,
  Image as ImageIcon,
  Layers,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Tag,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import {
  useReports,
  type Report,
  type ReportType,
  type HandleAnalysisItem,
} from "@/src/lib/reportsStore";
import { useAnalyzedPosts } from "@/src/lib/analyzedPostsStore";
import { getActiveProfile } from "@/src/lib/monitoringStore";

const emptySubscribe = () => () => {};

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

import PlatformPngIcon from "../components/PlatformPngIcon";

function PlatformIcon({ platform, size = 16, className = "" }: { platform?: string; size?: number; className?: string }) {
  return <PlatformPngIcon platform={platform} size={size} className={className} />;
}


/* ================================================== */
/* REPORT TYPE CONFIG                                 */
/* ================================================== */

const reportTypes: {
  type: ReportType;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    type: "Post Analysis",
    description: "Detailed intelligence on an audited post with sentiment, comments, and recommendations.",
    icon: FileText,
  },
  {
    type: "Social Handles Analysis",
    description: "Complete performance synthesis across your audited social handles.",
    icon: Layers,
  },
  {
    type: "Sentiment Analysis",
    description: "Deep breakdown of positive, neutral, and critical audience reaction.",
    icon: BarChart3,
  },
  {
    type: "Trend Analysis",
    description: "Emerging conversation themes, hashtags, and narrative momentum.",
    icon: TrendingUp,
  },
  {
    type: "Audience Insights",
    description: "Direct community feedback, top commenters, and influence network.",
    icon: Users,
  },
];

/* ================================================== */
/* PAGE                                               */
/* ================================================== */

function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const searchParamQuery = searchParams.get("search") || searchParams.get("q");
  const reportIdParam = searchParams.get("id");
  const hasMounted = useHasMounted();
  const { reports, deleteReport, generateReport } = useReports();
  const { posts } = useAnalyzedPosts();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | ReportType>("All");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportingId, setExportingId] = useState<string | null>(null);

  /* AUTO-POPULATE SEARCH QUERY FROM URL SEARCH PARAMS */
  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery);
    }
  }, [searchParamQuery]);

  /* AUTO-SELECT REPORT BY ID FROM URL PARAMS */
  useEffect(() => {
    if (reportIdParam && reports.length > 0) {
      const match = reports.find((r) => String(r.id) === String(reportIdParam));
      if (match) {
        setSelectedReport(match);
      }
    }
  }, [reportIdParam, reports]);

  /* AUTO-SELECT OR AUTO-GENERATE REPORT FOR TARGET URL */
  useEffect(() => {
    if (!urlParam || !hasMounted) return;
    const cleanUrl = decodeURIComponent(urlParam).trim();

    // 1. Look for existing report matching this URL
    const match = reports.find(
      (r) =>
        r.postDetails?.url === cleanUrl ||
        r.sources?.some((s) => s.includes(cleanUrl) || cleanUrl.includes(s))
    );

    if (match) {
      setSelectedReport(match);
      return;
    }

    // 2. If no report object exists yet, but this post was analyzed, auto-generate Post Analysis report
    if (posts.length > 0) {
      const targetPost = posts.find(
        (p) => p.post.url === cleanUrl || p.source.url === cleanUrl
      );
      if (targetPost) {
        const activeProfile = getActiveProfile();
        const reordered = [targetPost, ...posts.filter((p) => p !== targetPost)];
        const created = generateReport("Post Analysis", reordered, activeProfile);
        if (created) {
          setSelectedReport(created);
        }
      }
    }
  }, [urlParam, reports, posts, hasMounted, generateReport]);

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
    const confirmed = window.confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    deleteReport(id);
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  /* GENERATE REPORT */
  const handleGenerate = (type: ReportType) => {
    if (posts.length === 0) {
      alert("No analyzed posts found. Please analyze at least one social media post first to generate a report.");
      router.push("/posts-analysis");
      return;
    }

    const activeProfile = getActiveProfile();
    const newReport = generateReport(type, posts, activeProfile);
    setShowGenerateModal(false);

    if (newReport) {
      setSelectedReport(newReport);
    }
  };

  /* QUICK EXPORT PNG OR JPG DIRECTLY FROM LIST */
  const handleQuickExport = (report: Report, format: "png" | "jpeg") => {
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
             

                <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-white text-center sm:text-left">
                  Reports
                </h1>

                <p className="mt-1.5 sm:mt-2.5 max-w-2xl text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 text-center sm:text-left mx-auto sm:mx-0">
                  Comprehensive intelligence reports synthesized directly from your analyzed posts. Preview findings, audience insights, influence networks, and export to PNG or JPG.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => router.push("/posts-analysis")}
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                >
                  <Search size={15} />
                  <span>Analyze post</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGenerateModal(true)}
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-[#457B9D] px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#386785] active:scale-98 shrink-0"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Generate report</span>
                </button>
              </div>
            </section>

            {/* SUMMARY STATS (Grounded in Real Data) */}
            <section className="mb-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <ReportStat
                label="Generated reports"
                value={hasMounted ? reports.length : 0}
                icon={FileText}
                helper={reports.length === 0 ? "No reports generated yet" : "Dynamic intelligence"}
              />
              <ReportStat
                label="Analyzed posts"
                value={hasMounted ? posts.length : 0}
                icon={Check}
                helper={posts.length === 0 ? "Analyze a post to start" : `${posts.length} real posts analyzed`}
              />
              <ReportStat
                label="Latest report"
                value={hasMounted && reports.length > 0 ? reports[0].date : "None"}
                icon={Clock3}
                helper={reports.length > 0 ? reports[0].type : "Awaiting first analysis"}
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
                  placeholder="Search reports by title, channel, topic, or source..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 py-2.5 sm:py-3 pl-10 sm:pl-11 pr-10 text-xs sm:text-sm text-zinc-950 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 focus:border-[#457B9D] focus:ring-2 focus:ring-[#457B9D]/20 shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer"
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "All" | ReportType)}
                  className="h-full w-full sm:w-auto sm:min-w-[210px] appearance-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 outline-none transition focus:border-[#457B9D] focus:ring-2 focus:ring-[#457B9D]/20 shadow-xs"
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
            <section className="card-hanging rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-display text-lg tracking-tight text-zinc-950 dark:text-white">
                    Verified Intelligence Reports
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Real data reports generated from your analyzed social media posts
                  </p>
                </div>

                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {hasMounted ? filteredReports.length : 0} reports
                </span>
              </div>

              {!hasMounted || filteredReports.length === 0 ? (
                <EmptyReports
                  searchQuery={searchQuery}
                  totalPosts={posts.length}
                  onAnalyze={() => router.push("/posts-analysis")}
                  onGenerate={() => setShowGenerateModal(true)}
                />
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredReports.map((report) => (
                    <ReportRow
                      key={report.id}
                      report={report}
                      onOpen={() => setSelectedReport(report)}
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
          totalPosts={posts.length}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
          onAnalyze={() => {
            setShowGenerateModal(false);
            router.push("/posts-analysis");
          }}
        />
      )}

      {/* ENHANCED PREVIEW & EXPORT MODAL */}
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
/* REPORT STAT COMPONENT                              */
/* ================================================== */

function ReportStat({
  label,
  value,
  icon: Icon,
  helper,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  helper?: string;
}) {
  return (
    <div className="card-hanging rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {value}
          </p>
          {helper && (
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              {helper}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[#457B9D]/20 dark:border-[#457B9D]/30 bg-[#457B9D]/10 dark:bg-[#457B9D]/15 p-2.5 text-[#457B9D]">
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* REPORT ROW (LIST ITEM)                             */
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
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-[#457B9D]/20 dark:border-[#457B9D]/30 bg-[#457B9D]/10 dark:bg-[#457B9D]/15 text-[#457B9D]">
            <FileText size={19} strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3
                onClick={onOpen}
                className="cursor-pointer truncate text-xs sm:text-sm font-bold text-zinc-900 dark:text-white hover:text-[#457B9D] transition"
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

            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {report.type} • {report.summary}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <CalendarDays size={12} />
                {report.date}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <PlatformIcon platform={report.sources[0]} size={12} />
                {report.sources.join(", ")}
              </span>
              {report.metrics?.positiveSentiment && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {report.metrics.positiveSentiment} positive
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 self-start sm:self-auto pl-0 sm:pl-12 lg:pl-0 shrink-0">
          <button
            type="button"
            onClick={onOpen}
            className="flex items-center gap-1.5 rounded-lg border border-[#457B9D]/30 bg-[#457B9D]/10 hover:bg-[#457B9D]/20 dark:bg-[#457B9D]/15 dark:hover:bg-[#457B9D]/25 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-[#457B9D] dark:text-[#7bb5d4] transition shadow-xs active:scale-98"
          >
            <Eye size={13} />
            <span>Preview & Export</span>
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
/* EMPTY STATE (NO DUMMY DATA FOR FIRST TIME USER)    */
/* ================================================== */

function EmptyReports({
  searchQuery,
  totalPosts,
  onAnalyze,
  onGenerate,
}: {
  searchQuery: string;
  totalPosts: number;
  onAnalyze: () => void;
  onGenerate: () => void;
}) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-[#457B9D]">
        <FileText size={24} />
      </div>

      <h3 className="mt-4 font-display text-lg tracking-wide text-zinc-950 dark:text-white">
        {searchQuery ? "No reports found" : "No reports yet"}
      </h3>

      <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {searchQuery
          ? "No intelligence reports matched your search term or filter. Try clearing filters."
          : totalPosts === 0
            ? "When you analyze a social media post, SocialInt automatically generates a real report with key insights, audience feedback, influence network, trending topics, and strategic steps."
            : `You have ${totalPosts} analyzed post${totalPosts === 1 ? "" : "s"}. Click below to synthesize an intelligence report from your real data.`}
      </p>

      {!searchQuery && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAnalyze}
            className="flex items-center gap-2 rounded-xl bg-[#457B9D] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#386785]"
          >
            <Search size={14} />
            <span>Analyze a post</span>
          </button>

          {totalPosts > 0 && (
            <button
              type="button"
              onClick={onGenerate}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
              <FileText size={14} className="text-[#457B9D]" />
              <span>Generate report from {totalPosts} posts</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#080b12] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#457B9D]" />
        </div>
      }
    >
      <ReportsPageContent />
    </Suspense>
  );
}

/* ================================================== */
/* GENERATE REPORT MODAL                              */
/* ================================================== */

function GenerateReportModal({
  totalPosts,
  onClose,
  onGenerate,
  onAnalyze,
}: {
  totalPosts: number;
  onClose: () => void;
  onGenerate: (type: ReportType) => void;
  onAnalyze: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 sm:p-5 backdrop-blur-xs"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] p-5 shadow-2xl sm:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
              <FileText size={18} strokeWidth={2} />
            </div>

            <h2 className="font-display text-xl tracking-tight text-zinc-950 dark:text-white">
              Generate Intelligence Report
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Synthesize real data across your analyzed social content.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {totalPosts === 0 ? (
          <div className="mt-6 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20 p-5 text-center">
            <AlertCircle size={24} className="mx-auto text-amber-600 dark:text-amber-400" />
            <h3 className="mt-2 text-sm font-bold text-amber-900 dark:text-amber-200">
              No Analyzed Posts Found
            </h3>
            <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300 leading-relaxed max-w-sm mx-auto">
              Reports are grounded in genuine post intelligence. Please analyze at least one social media post URL first so our analytics engine can extract real insights, sentiment, and audience feedback.
            </p>
            <button
              type="button"
              onClick={onAnalyze}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#457B9D] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#386785]"
            >
              <Search size={13} />
              <span>Go to Post Analyzer</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            <p className="text-xs font-mono text-[#457B9D] font-bold">
              Available data: {totalPosts} analyzed post{totalPosts === 1 ? "" : "s"} ready
            </p>

            {reportTypes.map((reportType) => {
              const Icon = reportType.icon;
              return (
                <button
                  key={reportType.type}
                  type="button"
                  onClick={() => onGenerate(reportType.type)}
                  className="group flex items-center gap-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 text-left transition hover:border-[#457B9D] hover:bg-white dark:hover:bg-zinc-800/80 hover:shadow-xs"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#457B9D] transition group-hover:bg-[#457B9D] group-hover:text-white group-hover:border-[#457B9D]">
                    <Icon size={17} strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-[#457B9D]">
                      {reportType.type}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {reportType.description}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className="-rotate-90 text-zinc-400 transition group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                  />
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-5 text-center text-xs text-zinc-400 font-mono">
          Only authentic verified telemetry and intelligence extraction will be included in the report.
        </p>
      </div>
    </div>
  );
}

/* ================================================== */
/* ENHANCED REPORT PREVIEW MODAL WITH PNG & JPG EXPORT*/
/* ================================================== */

function ReportPreviewModal({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<"png" | "jpeg" | null>(null);

  // Extract real post data or details
  const post = report.postDetails;
  const authorDisplay =
    post?.authorHandle ||
    (report.handles && report.handles[0]?.handle) ||
    "Audited Account";

  const authorName = post?.authorName || authorDisplay.replace("@", "");
  const platform = post?.platform || report.sources[0] || "Instagram";

  const likes = post?.engagement?.likes ?? null;
  const commentsCount = post?.engagement?.comments ?? null;
  const shares = post?.engagement?.shares ?? null;
  const views = post?.engagement?.views ?? null;

  const keyInsights =
    report.keyInsights && report.keyInsights.length > 0
      ? report.keyInsights
      : post?.aiAnalysis?.keyInsights || [
          "Report synthesized directly from analyzed social media data.",
        ];

  const recommendations =
    report.recommendations && report.recommendations.length > 0
      ? report.recommendations
      : post?.aiAnalysis?.recommendations || [
          "Monitor ongoing audience sentiment responses in real-time.",
          "Engage directly with high-resonance audience feedback.",
        ];

  const topics =
    report.topics && report.topics.length > 0
      ? report.topics
      : post?.aiAnalysis?.topics || [];

  const rawComments = post?.commentsData || [];

  // EXPORT TO PNG OR JPG (Supports modern CSS colors: oklab, oklch)
  const handleExportImage = async (format: "png" | "jpeg") => {
    if (!reportRef.current) return;
    setIsExporting(format);

    try {
      const isDark = document.documentElement.classList.contains("dark");
      const bgColor = isDark ? "#0c1017" : "#ffffff";
      let dataUrl = "";

      // 1. Primary: Use html-to-image (renders via browser native SVG foreignObject, natively supporting oklab/oklch)
      try {
        const { toPng, toJpeg } = await import("html-to-image");
        if (format === "png") {
          dataUrl = await toPng(reportRef.current, {
            quality: 0.98,
            pixelRatio: 2,
            backgroundColor: bgColor,
            cacheBust: true,
          });
        } else {
          dataUrl = await toJpeg(reportRef.current, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: bgColor,
            cacheBust: true,
          });
        }
      } catch (htmlToImageErr) {
        console.warn("html-to-image export warning, attempting html2canvas-pro fallback:", htmlToImageErr);
        // 2. Fallback: Use html2canvas-pro (community fork with CSS Color Module 4 oklab/oklch parser)
        const html2canvasPro = (await import("html2canvas-pro")).default;
        const canvas = await html2canvasPro(reportRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: bgColor,
        });
        dataUrl = canvas.toDataURL(format === "png" ? "image/png" : "image/jpeg", 0.95);
      }

      if (!dataUrl) {
        throw new Error("Unable to capture image from report container");
      }

      const extension = format === "png" ? "png" : "jpg";
      const link = document.createElement("a");
      const safeTitle = (report.title || "SocialInt-Report")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      link.download = `${safeTitle}-${report.id}.${extension}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Failed to export report as ${format.toUpperCase()}:`, err);
      alert(`Could not export report as ${format.toUpperCase()}: ${err instanceof Error ? err.message : "Unknown error"}.`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/85 p-2 sm:p-5 backdrop-blur-sm overflow-y-auto"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[94vh] w-full max-w-5xl flex flex-col rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] shadow-2xl overflow-hidden my-auto transition-colors duration-150"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* MODAL ACTION BAR */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0c1017]/95 px-4 sm:px-7 py-3 sm:py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#457B9D]/10 text-[#457B9D] font-bold">
              <PlatformIcon platform={platform} size={18} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base font-sans tracking-tight text-zinc-950 dark:text-white">
                  SocialInt Intelligence
                </span>
                <span className="text-zinc-300 dark:text-zinc-700 font-bold">•</span>
                <span className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-none">
                  {report.title}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                ID: {report.id} • Generated: {report.date}
              </p>
            </div>
          </div>

          {/* EXPORT BUTTONS */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* PNG Export */}
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => handleExportImage("png")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition shadow-xs disabled:opacity-50"
              title="Download high-resolution PNG image"
            >
              {isExporting === "png" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <ImageIcon size={13} />
              )}
              <span>Export PNG</span>
            </button>

            {/* JPG Export */}
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => handleExportImage("jpeg")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3.5 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 transition shadow-xs disabled:opacity-50"
              title="Download optimized JPG image"
            >
              {isExporting === "jpeg" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Download size={13} />
              )}
              <span>Export JPG</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE / EXPORTABLE REPORT CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 md:p-8 bg-zinc-50/70 dark:bg-[#070a0f]">
          <div
            ref={reportRef}
            className="space-y-6 sm:space-y-7 rounded-2xl bg-white dark:bg-[#0c1017] p-4 sm:p-7 md:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm"
          >
            {/* 1. REPORT HERO BANNER */}
            <div className="pb-5 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#457B9D]">
                      Social Intelligence Report
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Verified
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-1.5">
                    {report.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Audited source: <strong className="text-zinc-800 dark:text-zinc-200">{authorDisplay}</strong> on {platform} • Period: {report.period}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700">
                    <PlatformIcon platform={platform} size={14} />
                    {platform}
                  </span>
                </div>
              </div>

              {/* EXECUTIVE SUMMARY */}
              <div className="mt-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-200/70 dark:border-zinc-800/80">
                <p className="text-xs uppercase font-mono font-bold text-zinc-400 mb-1">
                  Executive Summary
                </p>
                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* 2. REAL AUDITED CONTENT SNIPPET & ENGAGEMENT METRICS */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Audited Content & Real Engagement
                </h2>
                {post?.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#457B9D] hover:underline font-medium"
                  >
                    <span>View original post</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Real Content Box */}
              {post?.content ? (
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Caption / Content
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans italic">
                    &ldquo;{post.content}&rdquo;
                  </p>
                  {post.publishedAt && (
                    <p className="text-[11px] text-zinc-400 mt-2 font-mono">
                      Published: {new Date(post.publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : null}

              {/* Real Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Likes</span>
                    <Heart size={15} className="text-rose-500" />
                  </div>
                  <p className="text-lg sm:text-2xl font-extrabold text-zinc-950 dark:text-white mt-1">
                    {likes !== null ? likes.toLocaleString() : "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Comments</span>
                    <MessageCircle size={15} className="text-blue-500" />
                  </div>
                  <p className="text-lg sm:text-2xl font-extrabold text-zinc-950 dark:text-white mt-1">
                    {commentsCount !== null ? commentsCount.toLocaleString() : "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Shares</span>
                    <Share2 size={15} className="text-purple-500" />
                  </div>
                  <p className="text-lg sm:text-2xl font-extrabold text-zinc-950 dark:text-white mt-1">
                    {shares !== null ? shares.toLocaleString() : "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Positive Sentiment</span>
                    <TrendingUp size={15} className="text-emerald-500" />
                  </div>
                  <p className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {report.metrics?.positiveSentiment || "Active"}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. KEY INSIGHTS & INTENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Key Insights */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-[#457B9D]" />
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                    Key Insights
                  </h3>
                </div>

                <ul className="space-y-2.5">
                  {keyInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#457B9D] shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detected Intent & Emotions */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-amber-500" />
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                      Communication Intent
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {report.intent?.label || post?.aiAnalysis?.intent?.label || "Community Engagement"}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {report.intent?.explanation || post?.aiAnalysis?.intent?.explanation || "Constructive interaction with followers."}
                  </p>
                </div>

                {/* Emotions */}
                {(report.emotions && report.emotions.length > 0) || (post?.aiAnalysis?.emotions && post.aiAnalysis.emotions.length > 0) ? (
                  <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                      Detected Emotional Tone
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(report.emotions || post?.aiAnalysis?.emotions || []).map((emo, eIdx) => (
                        <span
                          key={eIdx}
                          className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                        >
                          <span className="capitalize">{emo.emotion}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {Math.round(emo.score * 100)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 4. TRENDING TOPICS & HASHTAGS */}
            {topics.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-[#457B9D]" />
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                    Trending Topics & Narratives
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {topics.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                    >
                      <Tag size={12} className="text-[#457B9D]" />
                      <span>{topic.startsWith("#") ? topic : `#${topic.replace(/\s+/g, "")}`}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. INFLUENCE NETWORK (REAL NODES) */}
            {report.networkNodes && report.networkNodes.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#457B9D]" />
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                      Influence Network & Key Interacting Accounts
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {report.networkNodes.length} key entities
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {report.networkNodes.map((node, nIdx) => (
                    <div
                      key={nIdx}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 p-3.5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[170px]">
                          {node.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {node.type}
                        </p>
                      </div>

                      <span className="rounded-full bg-white dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-[#457B9D] border border-zinc-200 dark:border-zinc-700">
                        {node.influence}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. AUDIENCE INSIGHTS & REAL COMMENTS */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                    Audience Feedback & Verified Comments
                  </h3>
                </div>

                <span className="text-xs text-zinc-500 font-mono">
                  {rawComments.length} verified comment{rawComments.length === 1 ? "" : "s"}
                </span>
              </div>

              {rawComments.length === 0 ? (
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  No public comments were retrieved for this audited post.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                  {rawComments.slice(0, 6).map((comment, cIdx) => (
                    <div key={cIdx} className="p-3.5 sm:p-4 bg-zinc-50/30 dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {comment.username ? `@${comment.username}` : "Audience user"}
                        </span>
                        {comment.likes !== null && comment.likes > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-500 font-semibold font-mono">
                            <Heart size={11} fill="currentColor" />
                            {comment.likes}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {comment.text}
                      </p>
                      {comment.timestamp && (
                        <p className="mt-1 text-[10px] text-zinc-400 font-mono">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. ACTIONABLE STEPS TO TAKE (STRATEGIC RECOMMENDATIONS) */}
            <div className="rounded-2xl border border-[#457B9D]/30 bg-[#457B9D]/5 dark:bg-[#457B9D]/10 p-4 sm:p-6 space-y-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#457B9D]" />
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white tracking-tight">
                  Actionable Steps to Take (Strategic Recommendations)
                </h3>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Prioritized next steps derived by SocialInt based on the audience response, sentiment score, and detected content narratives:
              </p>

              <div className="grid gap-2.5 sm:gap-3">
                {recommendations.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    className="flex items-start gap-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-3.5 shadow-2xs"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#457B9D] text-[11px] font-bold text-white font-mono">
                      {rIdx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. REPORT FOOTER VERIFICATION */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400 font-mono">
              <span>Verified Report ID: {report.id}</span>
              <span>Generated by SocialInt Intelligence Platform</span>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] px-6 py-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
            Grounded in authentic telemetry • Export anytime in PNG or JPG
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => handleExportImage("png")}
              className="flex-1 sm:flex-initial rounded-xl bg-[#457B9D] hover:bg-[#386785] text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-1.5"
            >
              {isExporting === "png" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2.5 text-xs sm:text-sm font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}