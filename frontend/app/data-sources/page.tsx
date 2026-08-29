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
        "Monitor public posts, replies, mentions and conversations.",
      icon: MessageCircle,
      color: "text-zinc-100",
    },
    {
      id: "telegram",
      name: "Telegram",
      description:
        "Track public channels, discussions and emerging narratives.",
      icon: Send,
      color: "text-sky-300",
    },
    {
      id: "instagram",
      name: "Instagram",
      description:
        "Analyze public posts, comments and audience reactions.",
      icon: Camera,
      color: "text-pink-300",
    },
    {
      id: "facebook",
      name: "Facebook",
      description:
        "Monitor public pages, posts and audience engagement.",
      icon: Users,
      color: "text-blue-300",
    },
    {
      id: "youtube",
      name: "YouTube",
      description:
        "Analyze public comments, videos and audience sentiment.",
      icon: Play,
      color: "text-red-300",
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
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-zinc-100 dashboard-grid">

      {/* ================================================== */}
      {/* BACKGROUND LIGHTS                                 */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[35%]
          top-[8%]
          h-[420px]
          w-[620px]
          rounded-full
          bg-blue-500/[0.035]
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[5%]
          right-[5%]
          h-[360px]
          w-[500px]
          rounded-full
          bg-violet-500/[0.025]
          blur-[110px]
        "
      />

      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <header
        className="
          relative
          z-10
          border-b
          border-zinc-800/70
          bg-[#080b12]/80
          backdrop-blur-xl
        "
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center px-6">

          {/* ================================================== */}
          {/* CLICKABLE LOGO                                    */}
          {/* ================================================== */}

          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
              transition-opacity
              duration-200
              hover:opacity-80
            "
          >

            {/* Logo */}

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-700/60
                bg-zinc-200
                shadow-[0_0_25px_rgba(96,165,250,0.08)]
              "
            >
              <Activity
                size={20}
                strokeWidth={2}
                className="text-zinc-900"
              />
            </div>

            {/* Brand */}

            <div className="leading-none">

              <h1 className="font-display text-lg tracking-wide text-zinc-100">
                SocialInt
              </h1>

              <p className="mt-1 font-display text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Social Intelligence
              </p>

            </div>

          </Link>

        </div>
      </header>

      {/* ================================================== */}
      {/* MAIN                                               */}
      {/* ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-80px)]
          max-w-6xl
          items-center
          justify-center
          px-6
          py-14
        "
      >

        <div className="w-full max-w-5xl">

          {/* ================================================== */}
          {/* PROGRESS                                           */}
          {/* ================================================== */}

          <div className="mb-12 flex items-center justify-center gap-3">

            {/* STEP 1 */}

            <div className="flex items-center gap-2">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-200
                  text-zinc-900
                "
              >
                <Check
                  size={16}
                  strokeWidth={2.5}
                />
              </div>

              <span className="font-display text-sm text-zinc-400">
                Account
              </span>

            </div>

            <div className="h-px w-14 bg-zinc-700/80" />

            {/* STEP 2 */}

            <div className="flex items-center gap-2">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-200
                  text-zinc-900
                "
              >
                <Check
                  size={16}
                  strokeWidth={2.5}
                />
              </div>

              <span className="font-display text-sm text-zinc-400">
                Monitoring profile
              </span>

            </div>

            <div className="h-px w-14 bg-blue-400/30" />

            {/* STEP 3 */}

            <div className="flex items-center gap-2">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-blue-400/40
                  bg-blue-400/10
                  text-sm
                  text-blue-300
                "
              >
                3
              </div>

              <span className="font-display text-sm text-zinc-100">
                Data sources
              </span>

            </div>

          </div>

          {/* ================================================== */}
          {/* HEADING                                            */}
          {/* ================================================== */}

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-5 flex justify-center">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-zinc-700/70
                  bg-zinc-900/70
                  shadow-[0_0_35px_rgba(59,130,246,0.06)]
                "
              >
                <Activity
                  size={25}
                  strokeWidth={1.7}
                  className="text-blue-300"
                />
              </div>

            </div>

            <h2 className="font-display text-4xl tracking-wide text-zinc-100 sm:text-5xl">
              Connect your data source
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-display text-sm leading-6 text-zinc-500 sm:text-base">
              Choose the social platform you want SocialInt to
              monitor. You can connect additional platforms later.
            </p>

          </div>

          {/* ================================================== */}
          {/* SOURCE GRID                                        */}
          {/* ================================================== */}

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {sources.map((source) => {

              const Icon = source.icon;

              const selected =
                selectedSource === source.id;

              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() =>
                    setSelectedSource(source.id)
                  }
                  className={`
                    group
                    relative
                    min-h-[165px]
                    rounded-2xl
                    border
                    p-6
                    text-left
                    transition-all
                    duration-200

                    ${
                      selected
                        ? `
                          border-blue-400/40
                          bg-blue-400/[0.055]
                          shadow-[0_0_40px_rgba(59,130,246,0.06)]
                        `
                        : `
                          border-zinc-800/80
                          bg-zinc-900/35
                          hover:border-zinc-700
                          hover:bg-zinc-900/60
                        `
                    }
                  `}
                >

                  {/* Selected check */}

                  {selected && (
                    <div
                      className="
                        absolute
                        right-5
                        top-5
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-zinc-200
                      "
                    >
                      <Check
                        size={14}
                        strokeWidth={3}
                        className="text-zinc-900"
                      />
                    </div>
                  )}

                  {/* Platform icon */}

                  <div
                    className={`
                      mb-5
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
                          ? "border-blue-300/20 bg-blue-400/10"
                          : "border-zinc-800 bg-zinc-900/80"
                      }
                    `}
                  >

                    <Icon
                      size={21}
                      strokeWidth={1.8}
                      className={
                        selected
                          ? source.color
                          : "text-zinc-500 group-hover:text-zinc-200"
                      }
                    />

                  </div>

                  {/* Name */}

                  <h3 className="font-display text-base tracking-wide text-zinc-100">
                    {source.name}
                  </h3>

                  {/* Description */}

                  <p className="mt-2 font-display text-sm leading-6 text-zinc-500">
                    {source.description}
                  </p>

                </button>
              );
            })}

          </div>

          {/* ================================================== */}
          {/* SOURCE INFO                                        */}
          {/* ================================================== */}

          <div className="mt-8 flex items-center justify-between">

            <p className="font-display text-xs text-zinc-600">
              1 source selected
            </p>

            <p className="font-display text-xs text-zinc-600">
              You can change this later
            </p>

          </div>

          {/* ================================================== */}
          {/* START MONITORING                                   */}
          {/* ================================================== */}

          <div className="mt-8 flex justify-end">

            <button
              type="button"
              onClick={handleStartMonitoring}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-zinc-700/60
                bg-zinc-200
                px-6
                py-3.5
                font-display
                text-sm
                text-zinc-900
                shadow-lg
                shadow-black/10
                transition-all
                duration-200
                hover:bg-zinc-300
              "
            >
              Start monitoring

              <ArrowRight
                size={17}
                strokeWidth={2}
              />

            </button>

          </div>

          {/* ================================================== */}
          {/* PRIVACY                                            */}
          {/* ================================================== */}

          <p className="mx-auto mt-10 max-w-2xl text-center font-display text-[11px] leading-5 text-zinc-600">
            SocialInt only analyzes publicly available content
            and platform-authorized data. You can manage your
            connected source later.
          </p>

        </div>

      </div>

    </main>
  );
}