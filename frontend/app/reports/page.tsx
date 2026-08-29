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
    useState<Report[]>(DEFAULT_REPORTS);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filter, setFilter] =
    useState<"All" | ReportType>("All");

  const [showGenerateModal, setShowGenerateModal] =
    useState(false);

  const [selectedReport, setSelectedReport] =
    useState<Report | null>(null);


  /* ================================================== */
  /* LOAD REPORTS                                      */
  /* ================================================== */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          REPORTS_STORAGE_KEY
        );

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setReports(parsed);
        }
      } else {
        localStorage.setItem(
          REPORTS_STORAGE_KEY,
          JSON.stringify(DEFAULT_REPORTS)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load reports.",
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
    <div className="dashboard-grid min-h-screen bg-[#080b12] text-white">

      {/* ================================================== */}
      {/* SIDEBAR                                            */}
      {/* ================================================== */}

      <Sidebar />


      {/* ================================================== */}
      {/* MAIN                                               */}
      {/* ================================================== */}

      <main className="lg:ml-64">

        <DashboardHeader />


        <div className="p-5 sm:p-8">

          <div className="mx-auto max-w-7xl">


            {/* ================================================== */}
            {/* PAGE HEADER                                        */}
            {/* ================================================== */}

            <section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <FileText
                    size={15}
                    className="text-blue-400"
                  />

                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                    Intelligence center
                  </span>

                </div>


                <h1 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
                  Reports
                </h1>


                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                  Generate and review intelligence reports
                  from your monitored social conversations.
                </p>

              </div>


              {/* Generate */}

              <button
                type="button"
                onClick={() =>
                  setShowGenerateModal(true)
                }
                className="flex w-fit items-center gap-2 rounded-xl border border-zinc-700/70 bg-zinc-800/80 px-5 py-3 text-sm font-medium text-zinc-200 shadow-lg shadow-black/10 transition hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
              >

                <Plus size={17} />

                Generate report

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
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-3 pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
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
                  className="h-full min-w-[190px] appearance-none rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 pr-10 text-sm text-zinc-300 outline-none transition focus:border-zinc-600"
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
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

              </div>

            </section>


            {/* ================================================== */}
            {/* REPORT LIST                                        */}
            {/* ================================================== */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">

              <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 sm:px-6">

                <div>

                  <h2 className="font-display text-lg tracking-wide text-white">
                    Generated reports
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Your saved intelligence reports
                  </p>

                </div>


                <span className="text-xs text-zinc-600">
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

                <div className="divide-y divide-zinc-800">

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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-zinc-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </p>

        </div>


        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-2.5">

          <Icon
            size={18}
            className="text-zinc-400"
          />

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
    <div className="group px-5 py-5 transition hover:bg-zinc-800/20 sm:px-6">

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">


        {/* ================================================== */}
        {/* REPORT INFO                                       */}
        {/* ================================================== */}

        <div className="flex min-w-0 items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/70">

            <FileText
              size={18}
              className="text-zinc-400"
            />

          </div>


          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="truncate text-sm font-medium text-zinc-200">
                {report.title}
              </h3>


              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  report.status ===
                  "Ready"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {report.status}
              </span>

            </div>


            <p className="mt-1 text-xs text-zinc-500">
              {report.type}
            </p>


            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">

              <span className="flex items-center gap-1">

                <CalendarDays size={12} />

                {report.period}

              </span>

              <span>•</span>

              <span>
                {report.date}
              </span>

              <span>•</span>

              <span>
                {report.sources.join(
                  " · "
                )}
              </span>

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* ACTIONS                                           */}
        {/* ================================================== */}

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={onOpen}
            disabled={
              report.status !==
              "Ready"
            }
            className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            View
          </button>


          <button
            type="button"
            onClick={onExport}
            disabled={
              report.status !==
              "Ready"
            }
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >

            <Download size={13} />

            Export

          </button>


          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-transparent p-2 text-zinc-600 transition hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
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
  onGenerate: (
    type: ReportType
  ) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      onMouseDown={onClose}
    >

      <div
        className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0d1118] p-5 shadow-2xl sm:p-6"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div>

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">

              <Sparkles
                size={18}
                className="text-blue-400"
              />

            </div>


            <h2 className="font-display text-xl tracking-wide text-white">
              Generate report
            </h2>


            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Choose the intelligence report you want to generate.
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >

            <X size={18} />

          </button>

        </div>


        {/* Report types */}

        <div className="mt-6 grid gap-3">

          {reportTypes.map(
            (reportType) => {
              const Icon =
                reportType.icon;

              return (
                <button
                  key={
                    reportType.type
                  }
                  type="button"
                  onClick={() =>
                    onGenerate(
                      reportType.type
                    )
                  }
                  className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-900"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 transition group-hover:text-white">

                    <Icon size={17} />

                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-medium text-zinc-200">
                      {reportType.type}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {reportType.description}
                    </p>

                  </div>


                  <ChevronDown
                    size={15}
                    className="-rotate-90 text-zinc-600 transition group-hover:text-zinc-300"
                  />

                </button>
              );
            }
          )}

        </div>


        <p className="mt-5 text-center text-[10px] leading-5 text-zinc-600">
          Reports are generated from your currently available
          monitoring data and connected sources.
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      onMouseDown={onClose}
    >

      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-[#0d1118] shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================================================== */}
        {/* MODAL HEADER                                      */}
        {/* ================================================== */}

        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-zinc-800 bg-[#0d1118]/95 px-5 py-5 backdrop-blur-xl sm:px-6">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">

              <FileText
                size={18}
                className="text-blue-400"
              />

            </div>


            <div>

              <h2 className="font-display text-xl tracking-wide text-white">
                {report.title}
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                {report.type} ·{" "}
                {report.period}
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Close report"
          >

            <X size={18} />

          </button>

        </div>


        {/* ================================================== */}
        {/* REPORT CONTENT                                    */}
        {/* ================================================== */}

        <div className="space-y-6 p-5 sm:p-6">

          {/* Executive summary */}

          <div>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
              Executive summary
            </p>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {report.summary}
            </p>

          </div>


          {/* Metrics */}

          <div className="grid gap-3 sm:grid-cols-3">

            <PreviewMetric
              label="Posts analyzed"
              value="125.4K"
            />

            <PreviewMetric
              label="Engagement"
              value="4.82M"
            />

            <PreviewMetric
              label="Positive sentiment"
              value="68.4%"
            />

          </div>


          {/* Sentiment */}

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

            <p className="text-sm font-medium text-zinc-200">
              Sentiment overview
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Audience sentiment during this report period.
            </p>


            <div className="mt-5 space-y-4">

              <ProgressRow
                label="Positive"
                value="68%"
                width="68%"
                className="bg-emerald-400"
              />

              <ProgressRow
                label="Neutral"
                value="17%"
                width="17%"
                className="bg-zinc-500"
              />

              <ProgressRow
                label="Negative"
                value="15%"
                width="15%"
                className="bg-red-400"
              />

            </div>

          </div>


          {/* Trends */}

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

            <div className="flex items-center gap-2">

              <TrendingUp
                size={16}
                className="text-zinc-400"
              />

              <p className="text-sm font-medium text-zinc-200">
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

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

            <p className="text-sm font-medium text-zinc-200">
              Data sources
            </p>


            <div className="mt-3 flex flex-wrap gap-2">

              {report.sources.map(
                (source) => (
                  <span
                    key={source}
                    className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400"
                  >
                    {source}
                  </span>
                )
              )}

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* FOOTER                                            */}
        {/* ================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 bg-zinc-950/40 p-5 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            Close
          </button>


          <button
            type="button"
            onClick={onExport}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
          >

            <Download size={14} />

            Export report

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

      <p className="text-[11px] text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold tracking-tight text-white">
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

        <span className="text-zinc-400">
          {label}
        </span>

        <span className="text-zinc-500">
          {value}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">

        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width,
          }}
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

      <span className="text-[10px] text-zinc-600">
        {number}
      </span>


      <div className="min-w-0">

        <p className="text-xs font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-zinc-600">
          {detail}
        </p>

      </div>

    </div>
  );
}