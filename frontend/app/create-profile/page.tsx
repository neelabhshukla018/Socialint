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
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] bg-grid-slate-light text-zinc-900 selection:bg-[#457B9D]/20">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#457B9D] text-white font-mono text-xs font-bold shadow-xs">
                2
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-950 font-bold">
                Monitoring Profile
              </span>
            </div>

            <div className="h-px w-8 sm:w-14 bg-zinc-200" />

            {/* STEP 3 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-mono font-bold text-zinc-400">
                3
              </div>
              <span className="font-display text-xs sm:text-sm text-zinc-400 hidden sm:inline">
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
              What do you want to monitor?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-600">
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
                          : "border-zinc-200 bg-zinc-50 text-zinc-600 group-hover:text-zinc-950"
                      }
                    `}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base text-zinc-950">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* ================================================== */}
          {/* INPUT FORM                                         */}
          {/* ================================================== */}
          <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
            <label
              htmlFor="profile-input"
              className="block font-semibold text-sm text-zinc-900 mb-2"
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
                bg-zinc-50/60
                px-4
                py-3.5
                text-sm
                text-zinc-950
                outline-none
                transition-all
                placeholder:text-zinc-400
                focus:border-[#457B9D]
                focus:bg-white
                focus:ring-2
                focus:ring-[#457B9D]/20
              "
            />

            <p className="mt-2 text-xs text-zinc-500">
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
                disabled:text-zinc-400
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