"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
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
/* TYPES                                              */
/* ================================================== */

type ReportStatus = "Ready" | "Generating";

type ReportType =
  | "Weekly Intelligence"
  | "Sentiment Analysis"
  | "Trend Analysis"
  | "Audience Insights";

interface Report {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  status: ReportStatus;
  period: string;
  sources: string[];
  summary: string;
}


/* ================================================== */
/* STORAGE                                            */
/* ================================================== */

const REPORTS_STORAGE_KEY = "socialintel_reports";


/* ================================================== */
/* DEFAULT REPORTS                                    */
/* ================================================== */

const DEFAULT_REPORTS: Report[] = [
  {
    id: "report-1",
    title: "Weekly Intelligence Report",
    type: "Weekly Intelligence",
    date: "Aug 29, 2026",
    status: "Ready",
    period: "Aug 23 – Aug 29",
    sources: ["X", "Telegram"],
    summary:
      "Overall audience sentiment remained positive, while conversations around performance and team selection showed increased activity.",
  },

  {
    id: "report-2",
    title: "Sentiment Analysis Report",
    type: "Sentiment Analysis",
    date: "Aug 27, 2026",
    status: "Ready",
    period: "Aug 21 – Aug 27",
    sources: ["X"],
    summary:
      "Positive sentiment remained dominant with a noticeable increase in negative conversations around recent performance.",
  },

  {
    id: "report-3",
    title: "Trending Topics Report",
    type: "Trend Analysis",
    date: "Aug 25, 2026",
    status: "Ready",
    period: "Aug 19 – Aug 25",
    sources: ["X", "Telegram"],
    summary:
      "Performance, upcoming match discussions and team selection were the fastest-growing conversation topics.",
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
    type: "Weekly Intelligence",
    description:
      "Complete overview of sentiment, trends and audience activity.",
    icon: FileText,
  },

  {
    type: "Sentiment Analysis",
    description:
      "Detailed positive, negative and neutral sentiment analysis.",
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
      "Understand audience behavior, reactions and engagement.",
    icon: Sparkles,
  },
];


/* ================================================== */
/* PAGE                                               */
/* ================================================== */

export default function ReportsPage() {
  const [reports, setReports] =
    useState<Report[]>(() => {
      if (typeof window === "undefined") return DEFAULT_REPORTS;
      try {
        const stored =
          localStorage.getItem(REPORTS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (error) {
        console.error(
          "Unable to load reports.",
          error
        );
      }
      return DEFAULT_REPORTS;
    });

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filter, setFilter] =
    useState<"All" | ReportType>("All");

  const [showGenerateModal, setShowGenerateModal] =
    useState(false);

  const [selectedReport, setSelectedReport] =
    useState<Report | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


  /* ================================================== */
  /* LOAD REPORTS                                      */
  /* ================================================== */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          REPORTS_STORAGE_KEY
        );

      if (!stored) {
        localStorage.setItem(
          REPORTS_STORAGE_KEY,
          JSON.stringify(DEFAULT_REPORTS)
        );
      }
    } catch (error) {
      console.error(
        "Unable to initialize reports storage.",
        error
      );
    }
  }, []);


  /* ================================================== */
  /* SAVE REPORTS                                      */
  /* ================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        REPORTS_STORAGE_KEY,
        JSON.stringify(reports)
      );
    } catch (error) {
      console.error(
        "Unable to save reports.",
        error
      );
    }
  }, [reports]);


  /* ================================================== */
  /* FILTER REPORTS                                    */
  /* ================================================== */

  const filteredReports = useMemo(() => {
    const query =
      searchQuery.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        report.title
          .toLowerCase()
          .includes(query) ||
        report.type
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "All" ||
        report.type === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    reports,
    searchQuery,
    filter,
  ]);


  /* ================================================== */
  /* DELETE REPORT                                     */
  /* ================================================== */

  const handleDelete = (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this report?"
      );

    if (!confirmed) return;

    setReports((current) =>
      current.filter(
        (report) =>
          report.id !== id
      )
    );

    if (
      selectedReport?.id === id
    ) {
      setSelectedReport(null);
    }
  };


  /* ================================================== */
  /* GENERATE REPORT                                   */
  /* ================================================== */

  const handleGenerate = (
    type: ReportType
  ) => {
    const newReport: Report = {
      id: `report-${Date.now()}`,

      title: `${type} Report`,

      type,

      date:
        new Date().toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),

      status: "Generating",

      period: "Current period",

      sources: [
        "X",
        "Telegram",
      ],

      summary:
        "Your report is being prepared from the latest available monitoring data.",
    };

    setReports((current) => [
      newReport,
      ...current,
    ]);

    setShowGenerateModal(false);


    /* ---------------------------------------------- */
    /* Simulated generation                           */
    /* ---------------------------------------------- */

    setTimeout(() => {
      setReports((current) =>
        current.map((report) =>
          report.id === newReport.id
            ? {
                ...report,

                status: "Ready",

                summary:
                  "The latest monitoring data has been analyzed. This report contains insights into sentiment, trends, engagement and audience activity.",
              }
            : report
        )
      );
    }, 1800);
  };


  /* ================================================== */
  /* EXPORT REPORT                                     */
  /* ================================================== */

  const handleExport = (
    report: Report
  ) => {
    const content = `
SOCIALINTEL
${report.title}

Report type:
${report.type}

Period:
${report.period}

Generated:
${report.date}

Sources:
${report.sources.join(", ")}

Summary:
${report.summary}
`;

    const blob = new Blob(
      [content],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${report.title
        .toLowerCase()
        .replace(/\s+/g, "-")}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  /* ================================================== */
  /* UI                                                 */
  /* ================================================== */

  return (
    <div className="min-h-screen bg-[#fafafa] bg-grid-dashboard text-zinc-900 selection:bg-[#457B9D]/20">

      {/* ================================================== */}
      {/* SIDEBAR                                            */}
      {/* ================================================== */}

      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />


      {/* ================================================== */}
      {/* MAIN                                               */}
      {/* ================================================== */}

      <main className="lg:ml-[270px]">

        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />


        <div className="p-4 sm:p-8">

          <div className="mx-auto max-w-7xl">


            {/* ================================================== */}
            {/* PAGE HEADER                                        */}
            {/* ================================================== */}

            <section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <FileText
                    size={15}
                    className="text-[#457B9D]"
                  />

                  <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#457B9D]">
                    Intelligence center
                  </span>

                </div>


                <h1 className="font-display text-3xl tracking-tight text-zinc-950 sm:text-5xl">
                  Reports
                </h1>


                <p className="mt-2.5 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600">
                  Generate, inspect, and export intelligence reports from your monitored social discussions.
                </p>

              </div>


              {/* Generate */}

              <button
                type="button"
                onClick={() =>
                  setShowGenerateModal(true)
                }
                className="flex w-fit items-center gap-2 rounded-xl bg-[#457B9D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#386785] active:scale-98"
              >

                <Plus size={18} strokeWidth={2.5} />

                <span>Generate report</span>

              </button>

            </section>


            {/* ================================================== */}
            {/* SUMMARY                                            */}
            {/* ================================================== */}

            <section className="mb-6 grid gap-4 sm:grid-cols-3">

              <ReportStat
                label="Total reports"
                value={reports.length}
                icon={FileText}
              />

              <ReportStat
                label="Ready reports"
                value={
                  reports.filter(
                    (report) =>
                      report.status ===
                      "Ready"
                  ).length
                }
                icon={Check}
              />

              <ReportStat
                label="Latest report"
                value={
                  reports.length > 0
                    ? reports[0].date
                    : "None"
                }
                icon={Clock3}
              />

            </section>


            {/* ================================================== */}
            {/* SEARCH + FILTER                                    */}
            {/* ================================================== */}

            <section className="mb-6 flex flex-col gap-3 sm:flex-row">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-[#457B9D] focus:ring-2 focus:ring-[#457B9D]/20 shadow-xs"
                />

              </div>


              {/* Filter */}

              <div className="relative">

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(
                      event.target
                        .value as
                        | "All"
                        | ReportType
                    )
                  }
                  className="h-full min-w-[190px] appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-800 outline-none transition focus:border-[#457B9D] focus:ring-2 focus:ring-[#457B9D]/20 shadow-xs"
                >

                  <option value="All">
                    All report types
                  </option>

                  {reportTypes.map(
                    (reportType) => (
                      <option
                        key={
                          reportType.type
                        }
                        value={
                          reportType.type
                        }
                      >
                        {
                          reportType.type
                        }
                      </option>
                    )
                  )}

                </select>


                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

              </div>

            </section>


            {/* ================================================== */}
            {/* REPORT LIST                                        */}
            {/* ================================================== */}

            <section className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs">

              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">

                <div>

                  <h2 className="font-display text-lg tracking-tight text-zinc-950">
                    Generated reports
                  </h2>

                  <p className="mt-0.5 text-xs text-zinc-500">
                    Your saved intelligence reports
                  </p>

                </div>


                <span className="text-xs font-mono text-zinc-500">
                  {filteredReports.length} reports
                </span>

              </div>


              {filteredReports.length === 0 ? (

                <EmptyReports
                  searchQuery={searchQuery}
                  onGenerate={() =>
                    setShowGenerateModal(
                      true
                    )
                  }
                />

              ) : (

                <div className="divide-y divide-zinc-100">

                  {filteredReports.map(
                    (report) => (

                      <ReportRow
                        key={report.id}
                        report={report}

                        onOpen={() =>
                          setSelectedReport(
                            report
                          )
                        }

                        onExport={() =>
                          handleExport(
                            report
                          )
                        }

                        onDelete={() =>
                          handleDelete(
                            report.id
                          )
                        }
                      />

                    )
                  )}

                </div>

              )}

            </section>

          </div>

        </div>

      </main>


      {/* ================================================== */}
      {/* GENERATE MODAL                                     */}
      {/* ================================================== */}

      {showGenerateModal && (
        <GenerateReportModal
          onClose={() =>
            setShowGenerateModal(false)
          }
          onGenerate={
            handleGenerate
          }
        />
      )}


      {/* ================================================== */}
      {/* REPORT PREVIEW                                     */}
      {/* ================================================== */}

      {selectedReport && (
        <ReportPreviewModal
          report={selectedReport}
          onClose={() =>
            setSelectedReport(null)
          }
          onExport={() =>
            handleExport(
              selectedReport
            )
          }
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
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
            {value}
          </p>
        </div>

        <div className="rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 p-2.5 text-[#457B9D]">
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
  onExport,
  onDelete,
}: {
  report: Report;
  onOpen: () => void;
  onExport: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group px-5 py-5 transition hover:bg-zinc-50/80 sm:px-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        {/* REPORT INFO */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
            <FileText size={18} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-zinc-900">
                {report.title}
              </h3>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold font-mono border ${
                  report.status === "Ready"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-[#457B9D]/10 text-[#457B9D] border-[#457B9D]/20"
                }`}
              >
                {report.status}
              </span>
            </div>

            <p className="mt-1 text-xs text-zinc-500">
              {report.type}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <CalendarDays size={12} />
                {report.period}
              </span>
              <span>•</span>
              <span>{report.date}</span>
              <span>•</span>
              <span>{report.sources.join(" · ")}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            disabled={report.status !== "Ready"}
            className="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 shadow-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            View
          </button>

          <button
            type="button"
            onClick={onExport}
            disabled={report.status !== "Ready"}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 shadow-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-transparent p-2 text-zinc-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
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

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/70">

        <FileText
          size={20}
          className="text-zinc-500"
        />

      </div>


      <h3 className="mt-4 font-display text-lg tracking-wide text-white">

        {searchQuery
          ? "No reports found"
          : "No reports yet"}

      </h3>


      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">

        {searchQuery
          ? "Try changing your search or report type filter."
          : "Generate your first intelligence report from your monitored data."}

      </p>


      {!searchQuery && (
        <button
          type="button"
          onClick={onGenerate}
          className="mt-5 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
        >

          <Plus size={14} />

          Generate report

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
/* REPORT PREVIEW MODAL                              */
/* ================================================== */

function ReportPreviewModal({
  report,
  onClose,
  onExport,
}: {
  report: Report;
  onClose: () => void;
  onExport: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 sm:p-5 backdrop-blur-xs"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-zinc-100 bg-white/95 px-5 py-5 backdrop-blur-xl sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
              <FileText size={18} strokeWidth={2} />
            </div>

            <div>
              <h2 className="font-display text-xl tracking-tight text-zinc-950">
                {report.title}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500 font-mono">
                {report.type} · {report.period}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="Close report"
          >
            <X size={18} />
          </button>
        </div>

        {/* REPORT CONTENT */}
        <div className="space-y-6 p-5 sm:p-6">
          {/* Executive summary */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Executive summary
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {report.summary}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid gap-3 sm:grid-cols-3">
            <PreviewMetric label="Posts analyzed" value="125.4K" />
            <PreviewMetric label="Engagement" value="4.82M" />
            <PreviewMetric label="Positive sentiment" value="68.4%" />
          </div>

          {/* Sentiment */}
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4">
            <p className="text-sm font-semibold text-zinc-900">
              Sentiment overview
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Audience sentiment during this report period.
            </p>

            <div className="mt-5 space-y-4">
              <ProgressRow
                label="Positive"
                value="68%"
                width="68%"
                className="bg-emerald-500"
              />
              <ProgressRow
                label="Neutral"
                value="17%"
                width="17%"
                className="bg-[#457B9D]"
              />
              <ProgressRow
                label="Negative"
                value="15%"
                width="15%"
                className="bg-rose-500"
              />
            </div>
          </div>

          {/* Trends */}
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#457B9D]" />
              <p className="text-sm font-semibold text-zinc-900">
                Key trends
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <TrendItem
                number="01"
                title="#Performance"
                detail="Fastest growing conversation"
              />
              <TrendItem
                number="02"
                title="#UpcomingMatch"
                detail="High engagement activity"
              />
              <TrendItem
                number="03"
                title="#TeamSelection"
                detail="Increasing audience discussion"
              />
            </div>
          </div>

          {/* Sources */}
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4">
            <p className="text-sm font-semibold text-zinc-900">
              Data sources
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {report.sources.map((source) => (
                <span
                  key={source}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-mono text-zinc-700"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 bg-zinc-50/50 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onExport}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#457B9D] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#386785]"
          >
            <Download size={14} />
            <span>Export report</span>
          </button>
        </div>
      </div>
    </div>
  );
}


/* ================================================== */
/* PREVIEW METRIC                                     */
/* ================================================== */

function PreviewMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wide font-mono">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tracking-tight text-zinc-950">
        {value}
      </p>
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
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="font-mono text-zinc-500">{value}</span>
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


/* ================================================== */
/* TREND ITEM                                         */
/* ================================================== */

function TrendItem({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs font-bold text-zinc-400">{number}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-zinc-900">{title}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{detail}</p>
      </div>
    </div>
  );
}