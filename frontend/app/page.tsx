"use client";

import {
  AlertTriangle,
  BarChart3,
  FileText,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

import {
  Show,
  useUser,
} from "@clerk/nextjs";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import StatCard from "./components/StatCard";
import SentimentChart from "./components/SentimentChart";
import EmergingIssue from "./components/EmergingIssue";
import TrendingTopics from "./components/TrendingTopics";
import RecentActivity from "./components/RecentActivity";

export default function Dashboard() {
  const { user } = useUser();

  const firstName =
    user?.firstName ||
    user?.username ||
    "there";

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <Show when="signed-in">

      <div className="min-h-screen bg-[#09090b] text-white">

        <Sidebar />

        <main className="lg:ml-64">

          <DashboardHeader />

          <div className="p-5 sm:p-8">

            {/* Page heading */}
            <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

              <div>

                <div className="mb-2 flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-xs font-medium uppercase tracking-widest text-emerald-400">
                    Live monitoring
                  </span>

                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {greeting}, {firstName}.
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Monitor audience sentiment, emerging narratives
                  and influence across your connected social platforms.
                </p>

              </div>

              <button className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">
                <Zap size={16} />
                Add data source
              </button>

            </div>

            {/* Monitoring Profile */}
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold">
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

              <button className="text-xs text-zinc-400 hover:text-white">
                Change profile
              </button>

            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

            </div>

            {/* Chart + Issue */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">

              <SentimentChart />

              <EmergingIssue />

            </div>

            {/* Bottom */}
            <div className="mt-6 grid gap-6 xl:grid-cols-2">

              <TrendingTopics />

              <RecentActivity />

            </div>

          </div>

        </main>

      </div>

    </Show>
  );
}