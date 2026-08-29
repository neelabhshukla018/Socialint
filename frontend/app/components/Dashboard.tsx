"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  TrendingUp,
  Zap,
  Plus,
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

  /* ================================================== */
  /* USER                                               */
  /* ================================================== */

  const firstName =
    user?.firstName ||
    user?.username ||
    "there";


  /* ================================================== */
  /* DYNAMIC GREETING                                   */
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


  return (
    <div className="dashboard-grid min-h-screen text-white">


      {/* ================================================== */}
      {/* SIDEBAR                                            */}
      {/* ================================================== */}

      <Sidebar />


      {/* ================================================== */}
      {/* MAIN CONTENT                                       */}
      {/* ================================================== */}

      <main className="lg:ml-[270px]">


        {/* ================================================== */}
        {/* HEADER                                             */}
        {/* ================================================== */}

        <DashboardHeader />


        {/* ================================================== */}
        {/* CONTENT                                            */}
        {/* ================================================== */}

        <div className="px-5 py-7 sm:px-8 sm:py-8">


          {/* ================================================== */}
          {/* PAGE INTRO                                         */}
          {/* ================================================== */}

          <section className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">

            <div>

              {/* Live monitoring */}

              <div className="mb-4 flex items-center gap-2">

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_10px_rgba(52,211,153,0.5)]
                  "
                />

                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Live monitoring
                </span>

              </div>


              {/* ================================================== */}
              {/* GREETING — KEANIA FONT                             */}
              {/* ================================================== */}

              <h1 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
                {greeting}, {firstName}.
              </h1>


              {/* Normal UI font */}

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Monitor audience sentiment, emerging narratives
                and influence across your connected social platforms.
              </p>

            </div>


            {/* ================================================== */}
            {/* ADD DATA SOURCE                                    */}
            {/* ================================================== */}

          <button
  type="button"
  className="
    flex
    w-fit
    items-center
    gap-2
    rounded-xl
    border
    border-zinc-700/60
    bg-zinc-200
    px-5
    py-3
    text-sm
    font-medium
    text-zinc-900
    shadow-lg
    shadow-black/10
    transition-all
    duration-200
    hover:bg-zinc-300
  "
>
  <Plus
    size={16}
    strokeWidth={3}
  />

  Add data source
</button>

          </section>


          {/* ================================================== */}
          {/* MONITORING PROFILE                                 */}
          {/* ================================================== */}

          <section
            className="
              mb-6
              flex
              flex-col
              justify-between
              gap-4
              rounded-2xl
              border
              border-zinc-700/60
              bg-zinc-900/60
              p-4
              backdrop-blur-md
              sm:flex-row
              sm:items-center
            "
          >

            <div className="flex items-center gap-4">

              {/* Profile avatar */}

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-blue-400/10
                  bg-blue-400/10
                  text-sm
                  font-semibold
                  text-blue-300
                "
              >
                SI
              </div>


              <div>

                {/* Heading — Keania */}

                <p className="font-display text-sm tracking-wide text-white">
                  Monitoring: Public Figure
                </p>


                {/* Normal font */}

                <p className="mt-1 text-[11px] text-zinc-500">
                  X · Telegram · Updated 2 minutes ago
                </p>

              </div>

            </div>


            <button
              type="button"
              className="
                text-left
                text-xs
                text-zinc-400
                transition
                hover:text-blue-300
                sm:text-right
              "
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

          <section
            className="
              mt-6
              rounded-2xl
              border
              border-zinc-700/60
              bg-zinc-900/55
              p-5
              backdrop-blur-md
            "
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">


                {/* Icon */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-blue-400/10
                    bg-blue-400/5
                  "
                >

                  <Activity
                    size={17}
                    strokeWidth={1.8}
                    className="text-blue-400"
                  />

                </div>


                <div>

                  {/* Heading — Keania */}

                  <p className="font-display text-sm tracking-wide text-zinc-200">
                    Data collection status
                  </p>


                  {/* Normal font */}

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Your connected platforms are being monitored.
                  </p>

                </div>

              </div>


              {/* ================================================== */}
              {/* ACTIVE STATUS                                      */}
              {/* ================================================== */}

              <div className="flex items-center gap-2">

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_10px_rgba(52,211,153,0.5)]
                  "
                />

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