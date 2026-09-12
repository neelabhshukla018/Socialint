"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Activity,
  ArrowRight,
  Building2,
  Check,
  Megaphone,
  User,
} from "lucide-react";

type ProfileType = "person" | "brand" | "campaign";

export default function CreateProfilePage() {
  const router = useRouter();

  const [profileType, setProfileType] =
    useState<ProfileType>("person");

  const [profileInput, setProfileInput] = useState("");

  const profileOptions = [
    {
      id: "person" as ProfileType,
      title: "Public Figure",
      description:
        "Monitor a creator, executive, athlete, or prominent public figure.",
      icon: User,
    },
    {
      id: "brand" as ProfileType,
      title: "Brand / Company",
      description:
        "Track conversations, PR sentiment, and reputation around a brand.",
      icon: Building2,
    },
    {
      id: "campaign" as ProfileType,
      title: "Campaign / Event",
      description:
        "Monitor a marketing campaign, keynote launch, or specific public event.",
      icon: Megaphone,
    },
  ];

  const getInputLabel = () => {
    if (profileType === "person") {
      return "Public figure profile URL or handle";
    }

    if (profileType === "brand") {
      return "Brand / company name or official profile";
    }

    return "Campaign / event name or hashtag";
  };

  const getPlaceholder = () => {
    if (profileType === "person") {
      return "e.g. @username or profile URL";
    }

    if (profileType === "brand") {
      return "e.g. Acme Corp or @acme";
    }

    return "e.g. #SpringLaunch2026";
  };

  const handleContinue = () => {
    if (!profileInput.trim()) return;

    const profile = {
      type: profileType,
      input: profileInput.trim(),
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem(
      "socialintel_profile",
      JSON.stringify(profile)
    );

    router.push("/data-sources");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] dark:bg-[#080b12] bg-grid-dashboard text-zinc-900 dark:text-zinc-100 selection:bg-[#457B9D]/20 transition-colors duration-150">
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <header className="relative z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition group-hover:bg-cyan-600">
              <Activity size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">
                SocialInt
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase -mt-0.5">
               PR & Intelligence
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* ================================================== */}
      {/* MAIN CONTAINER                                     */}
      {/* ================================================== */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full">
          {/* ================================================== */}
          {/* STEP INDICATOR                                     */}
          {/* ================================================== */}
          <div className="mb-12 flex items-center justify-center gap-3 sm:gap-4">
            {/* STEP 1 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                Account
              </span>
            </div>

            <div className="h-px w-8 sm:w-14 bg-zinc-300 dark:bg-zinc-700" />

            {/* STEP 2 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#457B9D] text-white font-mono text-xs font-bold shadow-xs">
                2
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-950 dark:text-zinc-100 font-bold">
                Monitoring Profile
              </span>
            </div>

            <div className="h-px w-8 sm:w-14 bg-zinc-200 dark:bg-zinc-800" />

            {/* STEP 3 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                3
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 hidden sm:inline">
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

            <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-zinc-50">
              What do you want to monitor?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Create a monitoring target to track discussions, sentiment spikes, and audience behavior across social platforms.
            </p>
          </div>

          {/* ================================================== */}
          {/* PROFILE TYPE CARDS                                 */}
          {/* ================================================== */}
          <div className="mt-10 grid gap-4 grid-cols-1 md:grid-cols-3">
            {profileOptions.map((option) => {
              const Icon = option.icon;
              const selected = profileType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setProfileType(option.id)}
                  className={`
                    group
                    relative
                    min-h-[170px]
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
                          dark:bg-zinc-900
                          shadow-md
                          ring-2
                          ring-[#457B9D]/25
                        `
                        : `
                          border-zinc-200/80
                          dark:border-zinc-800/80
                          bg-white/90
                          dark:bg-zinc-900/60
                          hover:border-zinc-300
                          dark:hover:border-zinc-700
                          hover:bg-white
                          dark:hover:bg-zinc-900
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

                  {/* Icon */}
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
                          ? "border-[#457B9D]/30 bg-[#457B9D]/10 text-[#457B9D]"
                          : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100"
                      }
                    `}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base text-zinc-950 dark:text-zinc-100">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* ================================================== */}
          {/* INPUT FORM                                         */}
          {/* ================================================== */}
          <div className="mt-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-6 shadow-xs">
            <label
              htmlFor="profile-input"
              className="block font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-2"
            >
              {getInputLabel()}
            </label>

            <input
              id="profile-input"
              type="text"
              value={profileInput}
              onChange={(event) => setProfileInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && profileInput.trim()) {
                  handleContinue();
                }
              }}
              placeholder={getPlaceholder()}
              className="
                w-full
                rounded-xl
                border
                border-zinc-200
                dark:border-zinc-700
                bg-zinc-50/60
                dark:bg-zinc-800/60
                px-4
                py-3.5
                text-sm
                text-zinc-950
                dark:text-zinc-100
                outline-none
                transition-all
                placeholder:text-zinc-400
                focus:border-[#457B9D]
                focus:bg-white
                dark:focus:bg-zinc-800
                focus:ring-2
                focus:ring-[#457B9D]/20
              "
            />

            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              You can connect additional platforms and monitoring profiles at any time.
            </p>
          </div>

          {/* ================================================== */}
          {/* CONTINUE BUTTON                                    */}
          {/* ================================================== */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={!profileInput.trim()}
              onClick={handleContinue}
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-[#457B9D]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#386785]
                active:scale-98
                disabled:cursor-not-allowed
                disabled:bg-zinc-200
                dark:disabled:bg-zinc-800
                disabled:text-zinc-400
                dark:disabled:text-zinc-600
                w-full
                sm:w-auto
                justify-center
              "
            >
              <span>Continue to Data Sources</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Privacy footer */}
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-zinc-500">
            SocialInt analyzes publicly accessible discussions and platform-authorized data feeds. Private credentials are never collected.
          </p>
        </div>
      </div>
    </main>
  );
}