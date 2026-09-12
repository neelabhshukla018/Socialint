"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import StatCard from "./StatCard";
import SentimentChart from "./SentimentChart";
import EmergingIssue from "./EmergingIssue";
import TrendingTopics from "./TrendingTopics";
import RecentActivity from "./RecentActivity";

interface MonitoringProfile {
  type?: "person" | "brand" | "campaign";
  input?: string;
  source?: string;
  createdAt?: string;
  monitoringStartedAt?: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile] = useState<MonitoringProfile | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedProfile = sessionStorage.getItem("socialintel_profile");
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch {
      return null;
    }
  });

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
  /* PROFILE TYPE                                      */
  /* ================================================== */
  const getProfileTitle = () => {
    if (profile?.type === "brand") {
      return "Brand / Company";
    }
    if (profile?.type === "campaign") {
      return "Campaign / Event";
    }
    return "Public Figure";
  };

  /* ================================================== */
  /* DATA SOURCE                                       */
  /* ================================================== */
  const getSourceName = () => {
    switch (profile?.source) {
      case "telegram":
        return "Telegram";
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "youtube":
        return "YouTube";
      case "x":
        return "X";
      default:
        return "No source connected";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] bg-grid-slate-light text-zinc-900 selection:bg-[#457B9D]/20">
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

        <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-7xl mx-auto">
          {/* ================================================== */}
          {/* PAGE INTRO                                         */}
          {/* ================================================== */}
          <section className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              {/* Live monitoring badge */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Live monitoring active
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
                {greeting}, {firstName}.
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600">
                Monitor audience sentiment, emerging narratives, and influence across your connected social platforms in real time.
              </p>
            </div>

            {/* Add data source button with #457B9D */}
            <button
              type="button"
              onClick={() => router.push("/data-sources")}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#457B9D] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#386785] active:scale-98 transition"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Add data source</span>
            </button>
          </section>

          {/* ================================================== */}
          {/* MONITORING PROFILE BANNER                          */}
          {/* ================================================== */}
          <section className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4.5 shadow-xs sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {/* Profile avatar with brand color */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-sm font-bold text-[#457B9D] shadow-xs">
                SI
              </div>

              <div>
                <p className="font-display text-sm tracking-tight text-zinc-950">
                  Monitoring: {getProfileTitle()}
                </p>

                <p className="mt-0.5 text-xs text-zinc-500 font-mono">
                  {getSourceName()} · {profile?.input || "No profile configured"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/create-profile")}
              className="text-left text-xs font-semibold text-[#457B9D] hover:underline sm:text-right"
            >
              Change profile &rarr;
            </button>
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
          <section className="mt-6 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                  <Activity size={18} strokeWidth={2} />
                </div>

                <div>
                  <p className="font-display text-sm text-zinc-950">
                    Data collection status
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Your connected platforms are actively being parsed and analyzed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>

                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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