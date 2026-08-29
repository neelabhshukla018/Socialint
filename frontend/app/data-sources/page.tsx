"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  AtSign,
  Camera,
  Check,
  MessageCircle,
  Play,
  Send,
} from "lucide-react";

type Platform = "x" | "telegram" | "instagram" | "facebook";

type PlatformState = {
  connected: boolean;
};

export default function DataSourcesPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<{
    type: string;
    input: string;
  } | null>(null);

  const [platforms, setPlatforms] = useState<
    Record<Platform, PlatformState>
  >({
    x: { connected: false },
    telegram: { connected: false },
    instagram: { connected: false },
    facebook: { connected: false },
  });

  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const savedProfile =
      sessionStorage.getItem("socialintel_profile");

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        setProfile(null);
      }
    }
  }, []);

  const togglePlatform = (platform: Platform) => {
    setPlatforms((current) => ({
      ...current,
      [platform]: {
        connected: !current[platform].connected,
      },
    }));
  };

  const connectedCount = Object.values(platforms).filter(
    (platform) => platform.connected
  ).length;

  const handleStartAnalysis = () => {
    setStarting(true);

    /*
     * TEMPORARY FRONTEND FLOW
     *
     * Later this will become:
     *
     * Frontend
     *    ↓
     * Node.js API
     *    ↓
     * Social Media APIs
     *    ↓
     * Neon PostgreSQL
     *    ↓
     * AI Analysis
     */

    sessionStorage.setItem(
      "socialintel_data_sources",
      JSON.stringify(platforms)
    );

    setTimeout(() => {
      router.push("/");
    }, 700);
  };

  const platformData = [
{
  id: "x" as Platform,
  name: "X",
  description:
    "Posts, replies, mentions and engagement data.",
  icon: AtSign,
  required: true,
  available: true,
},
    {
      id: "telegram" as Platform,
      name: "Telegram",
      description:
        "Public channel messages and conversation activity.",
      icon: Send,
      required: true,
      available: true,
    },
{
  id: "instagram" as Platform,
  name: "Instagram",
  description:
    "Public posts, comments and engagement insights.",
  icon: Camera,
  required: false,
  available: true,
},
    {
      id: "facebook" as Platform,
      name: "Facebook",
      description:
        "Public page posts, comments and engagement data.",
      icon: MessageCircle,
      required: false,
      available: true,
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Activity
                size={20}
                className="text-black"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold">
                SocialIntel
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Social Intelligence
              </p>
            </div>

          </div>

          <div className="text-xs text-zinc-500">
            Step 3 of 3
          </div>

        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">

        {/* Progress */}
        <div className="mb-12 flex items-center justify-center gap-3">

          {/* Account */}
          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <Check
                size={16}
                className="text-black"
              />
            </div>

            <span className="hidden text-sm font-medium text-zinc-300 sm:block">
              Account
            </span>

          </div>

          <div className="h-px w-10 bg-zinc-700 sm:w-14" />

          {/* Profile */}
          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <Check
                size={16}
                className="text-black"
              />
            </div>

            <span className="hidden text-sm font-medium text-zinc-300 sm:block">
              Monitoring profile
            </span>

          </div>

          <div className="h-px w-10 bg-white sm:w-14" />

          {/* Data sources */}
          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              3
            </div>

            <span className="hidden text-sm font-medium text-white sm:block">
              Data sources
            </span>

          </div>

        </div>

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-5 flex justify-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
              <Activity
                size={25}
                className="text-zinc-200"
              />
            </div>

          </div>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Connect your data sources
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Choose the platforms SocialIntel should use to
            collect public conversations, engagement and
            audience signals.
          </p>

        </div>

        {/* Monitoring profile summary */}
        {profile && (
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs uppercase tracking-widest text-zinc-600">
                  Monitoring
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {profile.input}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/create-profile")
                }
                className="flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
              >
                <ArrowLeft size={14} />
                Change profile
              </button>

            </div>

          </div>
        )}

        {/* Platforms */}
        <div className="mx-auto mt-8 max-w-4xl space-y-4">

          {platformData.map((platform) => {
            const Icon = platform.icon;

            const connected =
              platforms[platform.id].connected;

            return (
              <div
                key={platform.id}
                className={`rounded-2xl border p-5 transition-all ${
                  connected
                    ? "border-zinc-500 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                }`}
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-4">

                    {/* Icon */}
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        connected
                          ? "bg-white text-black"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    {/* Info */}
                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h3 className="text-sm font-semibold text-white">
                          {platform.name}
                        </h3>

                        {platform.required && (
                          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[9px] uppercase tracking-wider text-zinc-500">
                            Required
                          </span>
                        )}

                      </div>

                      <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">
                        {platform.description}
                      </p>

                    </div>

                  </div>

                  {/* Connect */}
                  <button
                    type="button"
                    onClick={() =>
                      togglePlatform(platform.id)
                    }
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                      connected
                        ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                        : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  >

                    {connected ? (
                      <>
                        <Check size={14} />
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}

                  </button>

                </div>

              </div>
            );
          })}

        </div>

        {/* Connection information */}
        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5">

          <div className="flex gap-3">

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
              <Activity
                size={15}
                className="text-zinc-400"
              />
            </div>

            <div>

              <p className="text-xs font-medium text-zinc-300">
                About data connections
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                SocialIntel will use platform-authorized
                access and publicly available content.
                Private account information will not be
                exposed in your analytics.
              </p>

            </div>

          </div>

        </div>

        {/* Bottom actions */}
        <div className="mx-auto mt-8 flex max-w-4xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

          <button
            type="button"
            onClick={() =>
              router.push("/create-profile")
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">

            <span className="text-center text-xs text-zinc-600 sm:text-right">
              {connectedCount === 0
                ? "Connect at least one source to continue."
                : `${connectedCount} source${
                    connectedCount > 1 ? "s" : ""
                  } selected`}
            </span>

            <button
              type="button"
              disabled={
                connectedCount === 0 || starting
              }
              onClick={handleStartAnalysis}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            >

              {starting ? (
                <>
                  <Activity
                    size={16}
                    className="animate-pulse"
                  />
                  Starting...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Start monitoring
                  <ArrowRight size={16} />
                </>
              )}

            </button>

          </div>

        </div>

        {/* Footer */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-[11px] leading-5 text-zinc-600">
          X and Telegram are the primary data sources for
          SocialIntel. Additional platforms can be enabled as
          the system expands.
        </p>

      </div>

    </main>
  );
}