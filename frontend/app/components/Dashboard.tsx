"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import StatCard from "./StatCard";
import SentimentChart from "./SentimentChart";
import EmergingIssue from "./EmergingIssue";
import TrendingTopics from "./TrendingTopics";
import RecentActivity from "./RecentActivity";
import {
  getActiveProfile,
  getDataSources,
  type MonitoringProfile,
} from "@/src/lib/monitoringStore";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState<MonitoringProfile | null>(null);
  const [dataSources, setDataSources] = useState<any[]>([]);

  useEffect(() => {
    const active = getActiveProfile();
    const sources = getDataSources();
    setProfile(active);
    setDataSources(sources);
  }, []);

  /* ================================================== */
  /* USER                                              */
  /* ================================================== */
  const firstName =
    user?.firstName ||
    user?.username ||
    "there";

  /* ================================================== */
  /* DYNAMIC GREETING                                  */
  /* ================================================== */
  const hour = new Date().getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
        ? "Good afternoon"
        : hour >= 17 && hour < 22
          ? "Good evening"
          : "Good night";

  /* ================================================== */
  /* PROFILE TYPE & INITIALS                            */
  /* ================================================== */
  const getInitials = (text?: string) => {
    if (!text) return "SI";
    return text
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  const getProfileTitle = () => {
    return profile?.name || "Active Target";
  };

  /* ================================================== */
  /* DATA SOURCE NAMES                                  */
  /* ================================================== */
  const getSourceName = () => {
    if (dataSources.length > 0) {
      const names = dataSources.map((s) => s.name.split(" ")[0]).join(", ");
      return `${names} (${dataSources.length} ${dataSources.length === 1 ? "source" : "sources"})`;
    }
    return "No source connected";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080b12] bg-grid-dashboard text-zinc-900 dark:text-zinc-100 selection:bg-[#457B9D]/20 transition-colors duration-150">
      {/* ================================================== */}
      {/* SIDEBAR (DESKTOP + MOBILE DRAWER)                  */}
      {/* ================================================== */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* ================================================== */}
      {/* MAIN CONTENT                                       */}
      {/* ================================================== */}
      <main className="lg:ml-[270px]">
        {/* Header with hamburger toggle */}
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <div className="px-4 py-5 sm:px-8 sm:py-8 max-w-7xl mx-auto overflow-x-hidden">
          {/* ================================================== */}
          {/* PAGE INTRO                                         */}
          {/* ================================================== */}
          <section className="mb-6 sm:mb-8 flex flex-col items-center text-center sm:items-start sm:text-left xl:flex-row xl:items-end justify-between gap-5 sm:gap-6">
            <div className="flex flex-col items-center sm:items-start">
              {/* Live monitoring badge */}
              <div className="mb-2.5 sm:mb-3 inline-flex items-center justify-center sm:justify-start gap-2 rounded-full border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 sm:px-3 py-1 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Live monitoring active
                </span>
              </div>

              <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-white text-center sm:text-left">
                {greeting}, {firstName}.
              </h1>

              <p className="mt-2 sm:mt-2.5 max-w-2xl text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 text-center sm:text-left mx-auto sm:mx-0">
                Monitor audience sentiment, emerging narratives, and influence across your connected social platforms in real time.
              </p>
            </div>

            {/* Add data source button with #457B9D */}
            <button
              type="button"
              onClick={() => router.push("/data-sources")}
              className="mt-2 xl:mt-0 flex w-auto items-center justify-center gap-1.5 rounded-xl bg-[#457B9D] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#386785] active:scale-98 transition shrink-0"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add data source</span>
            </button>
          </section>

          {/* ================================================== */}
          {/* MONITORING PROFILE BANNER                          */}
          {/* ================================================== */}
          <section className="mb-6 flex flex-col justify-between gap-3 sm:gap-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 p-3.5 sm:p-4.5 shadow-xs sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {/* Profile avatar with brand color */}
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-[#457B9D]/30 bg-[#457B9D]/10 text-xs sm:text-sm font-bold text-[#457B9D] shadow-xs">
                {getInitials(profile?.name)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display text-xs sm:text-sm font-bold tracking-tight text-zinc-950 dark:text-white truncate">
                    Monitoring: {getProfileTitle()}
                  </p>
                  {profile?.category && (
                    <span className="hidden sm:inline-block rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {profile.category}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate">
                  {getSourceName()} · {profile?.input || "No profile configured"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => router.push("/data-sources")}
                className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
              >
                Manage sources
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <button
                type="button"
                onClick={() => router.push("/create-profile")}
                className="text-xs font-semibold text-[#457B9D] hover:underline"
              >
                Change profile &rarr;
              </button>
            </div>
          </section>

          {/* ================================================== */}
          {/* STATISTICS                                         */}
          {/* ================================================== */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Posts analyzed"
              value="125.4K"
              change="+18.4%"
              icon={FileText}
            />

            <StatCard
              title="Total engagement"
              value="4.82M"
              change="+24.7%"
              icon={BarChart3}
            />

            <StatCard
              title="Positive sentiment"
              value="68.4%"
              change="+6.2%"
              icon={TrendingUp}
            />

            <StatCard
              title="Active alerts"
              value="12"
              change="+3 today"
              icon={AlertTriangle}
              positive={false}
            />
          </section>

          {/* ================================================== */}
          {/* SENTIMENT + EMERGING ISSUE                         */}
          {/* ================================================== */}
          <section className="mt-6 grid gap-6 grid-cols-1 xl:grid-cols-[1.7fr_1fr]">
            <SentimentChart />
            <EmergingIssue />
          </section>

          {/* ================================================== */}
          {/* TRENDING + RECENT ACTIVITY                         */}
          {/* ================================================== */}
          <section className="mt-6 grid gap-6 grid-cols-1 xl:grid-cols-2">
            <TrendingTopics />
            <RecentActivity />
          </section>

          {/* ================================================== */}
          {/* DATA COLLECTION STATUS                             */}
          {/* ================================================== */}
          <section className="mt-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 p-5 shadow-xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                  <Activity size={18} strokeWidth={2} />
                </div>

                <div>
                  <p className="font-display text-sm text-zinc-950 dark:text-white">
                    Data collection status
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Your connected platforms are actively being parsed and analyzed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>

                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                  {profile?.source
                    ? "Collection active"
                    : "No source connected"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}