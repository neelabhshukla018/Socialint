"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Activity,
  ArrowRight,
  Check,
  Camera,
  MessageCircle,
  Users,
  Play,
  Send,
} from "lucide-react";

export default function DataSourcesPage() {
  const router = useRouter();

  // Only ONE platform can be selected at a time
  const [selectedSource, setSelectedSource] = useState("x");

  const sources = [
    {
      id: "x",
      name: "X / Twitter",
      description:
        "Monitor public posts, replies, mentions and live conversations.",
      icon: MessageCircle,
      color: "text-zinc-950",
    },
    {
      id: "telegram",
      name: "Telegram",
      description:
        "Track public channels, discussions and emerging narratives.",
      icon: Send,
      color: "text-sky-600",
    },
    {
      id: "instagram",
      name: "Instagram",
      description:
        "Analyze public posts, comments and visual audience reactions.",
      icon: Camera,
      color: "text-pink-600",
    },
    {
      id: "facebook",
      name: "Facebook",
      description:
        "Monitor public brand pages, user posts and community engagement.",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: "youtube",
      name: "YouTube",
      description:
        "Analyze public comments, creator videos and long-form audience sentiment.",
      icon: Play,
      color: "text-red-600",
    },
  ];

  /* ================================================== */
  /* START MONITORING                                  */
  /* ================================================== */
  const handleStartMonitoring = () => {
    const existingProfile =
      sessionStorage.getItem("socialintel_profile");

    const profile = existingProfile
      ? JSON.parse(existingProfile)
      : {};

    const updatedProfile = {
      ...profile,
      source: selectedSource,
      monitoringStartedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(
      "socialintel_profile",
      JSON.stringify(updatedProfile)
    );

    router.push("/");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] bg-grid-dashboard text-zinc-900 selection:bg-[#457B9D]/20">
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <header className="relative z-10 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-xs">
              <Activity
                size={18}
                strokeWidth={2.5}
                className="text-[#457B9D]"
              />
            </div>

            <div className="leading-none">
              <h1 className="font-display text-[22px] tracking-tight text-zinc-950">
                SocialInt
              </h1>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#457B9D] font-bold">
                PR &amp; Intelligence
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* ================================================== */}
      {/* CONTENT                                            */}
      {/* ================================================== */}
      <div className="relative z-10 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {/* ================================================== */}
          {/* STEP INDICATOR                                     */}
          {/* ================================================== */}
          <div className="mb-12 flex items-center justify-center gap-3 sm:gap-4">
            {/* STEP 1 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-500 hidden sm:inline">
                Account
              </span>
            </div>

            <div className="h-px w-8 sm:w-14 bg-zinc-300" />

            {/* STEP 2 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-500 hidden sm:inline">
                Monitoring Profile
              </span>
            </div>

            <div className="h-px w-8 sm:w-14 bg-[#457B9D]/40" />

            {/* STEP 3 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#457B9D] text-white font-mono text-xs font-bold shadow-xs">
                3
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-950 font-bold">
                Data Sources
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* HEADING                                            */}
          {/* ================================================== */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D] shadow-xs">
                <Activity size={24} strokeWidth={2} />
              </div>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
              Connect your data source
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-600">
              Choose the primary social platform you want SocialInt to monitor. You can connect additional platforms anytime.
            </p>
          </div>

          {/* ================================================== */}
          {/* SOURCE GRID                                        */}
          {/* ================================================== */}
          <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => {
              const Icon = source.icon;
              const selected = selectedSource === source.id;

              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => setSelectedSource(source.id)}
                  className={`
                    group
                    relative
                    min-h-[160px]
                    rounded-2xl
                    p-6
                    text-left
                    transition-all
                    duration-200
                    border
                    ${
                      selected
                        ? `
                          border-[#457B9D]
                          bg-white
                          shadow-md
                          ring-2
                          ring-[#457B9D]/25
                        `
                        : `
                          border-zinc-200/80
                          bg-white/90
                          hover:border-zinc-300
                          hover:bg-white
                          hover:shadow-sm
                        `
                    }
                  `}
                >
                  {/* Selected check */}
                  {selected && (
                    <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#457B9D] text-white shadow-xs">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}

                  {/* Platform icon */}
                  <div
                    className={`
                      mb-4
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      transition-all
                      duration-200
                      ${
                        selected
                          ? "border-[#457B9D]/30 bg-[#457B9D]/10"
                          : "border-zinc-200 bg-zinc-50"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      strokeWidth={2}
                      className={
                        selected
                          ? source.color
                          : "text-zinc-600 group-hover:text-zinc-950"
                      }
                    />
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-base text-zinc-950">
                    {source.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    {source.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* ================================================== */}
          {/* BOTTOM CONTROLS                                    */}
          {/* ================================================== */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200/80">
            <p className="text-xs font-mono text-zinc-500">
              1 source selected · You can change or expand this later
            </p>

            <button
              type="button"
              onClick={handleStartMonitoring}
              className="flex items-center gap-2 rounded-full bg-[#457B9D] px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#386785] active:scale-98 transition w-full sm:w-auto justify-center"
            >
              <span>Start Monitoring</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Privacy footer */}
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-zinc-500">
            SocialInt strictly monitors public posts and platform-authorized data feeds. Private messages or credentials are never collected.
          </p>
        </div>
      </div>
    </main>
  );
}