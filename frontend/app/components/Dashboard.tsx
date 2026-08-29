"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useUser } from "@clerk/nextjs";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import StatCard from "./StatCard";
import SentimentChart from "./SentimentChart";
import EmergingIssue from "./EmergingIssue";
import TrendingTopics from "./TrendingTopics";
import RecentActivity from "./RecentActivity";

export default function Dashboard() {
  const { user } = useUser();

  const firstName =
    user?.firstName ||
    user?.username ||
    "there";

  const hour = new Date().getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="lg:ml-64">

        {/* Header */}
        <DashboardHeader />

        <div className="p-5 sm:p-8">

          {/* ================================================== */}
          {/* PAGE INTRO                                         */}
          {/* ================================================== */}

          <section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

            <div>

              {/* Live monitoring */}
              <div className="mb-3 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium uppercase tracking-widest text-emerald-400">
                  Live monitoring
                </span>

              </div>

              {/* Dynamic greeting */}
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {greeting}, {firstName}.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Monitor audience sentiment, emerging narratives
                and influence across your connected social platforms.
              </p>

            </div>

            {/* Add data source */}
            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              <Zap size={16} />

              Add data source
            </button>

          </section>


          {/* ================================================== */}
          {/* MONITORING PROFILE                                 */}
          {/* ================================================== */}

          <section className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-4">

              {/* Profile avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold">
                SI
              </div>

              <div>

                <p className="text-sm font-medium text-white">
                  Monitoring: Public Figure
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  X · Telegram · Updated 2 minutes ago
                </p>

              </div>

            </div>

            <button
              type="button"
              className="text-left text-xs text-zinc-400 transition hover:text-white sm:text-right"
            >
              Change profile
            </button>

          </section>


          {/* ================================================== */}
          {/* STATISTICS                                         */}
          {/* ================================================== */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">

            <SentimentChart />

            <EmergingIssue />

          </section>


          {/* ================================================== */}
          {/* TRENDING + RECENT ACTIVITY                         */}
          {/* ================================================== */}

          <section className="mt-6 grid gap-6 xl:grid-cols-2">

            <TrendingTopics />

            <RecentActivity />

          </section>


          {/* ================================================== */}
          {/* DATA COLLECTION STATUS                             */}
          {/* ================================================== */}

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800">
                  <Activity
                    size={17}
                    className="text-zinc-300"
                  />
                </div>

                <div>

                  <p className="text-sm font-medium text-zinc-200">
                    Data collection status
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Your connected platforms are being monitored.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-400">
                  Collection active
                </span>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}