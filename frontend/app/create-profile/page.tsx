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
        "Monitor a person, creator, athlete, politician or other public figure.",
      icon: User,
    },
    {
      id: "brand" as ProfileType,
      title: "Brand / Company",
      description:
        "Track conversations, reputation and audience reactions around a brand.",
      icon: Building2,
    },
    {
      id: "campaign" as ProfileType,
      title: "Campaign / Event",
      description:
        "Monitor a campaign, event, launch or specific public conversation.",
      icon: Megaphone,
    },
  ];

  const getInputLabel = () => {
    if (profileType === "person") {
      return "Public figure profile URL or username";
    }

    if (profileType === "brand") {
      return "Brand / company profile URL or name";
    }

    return "Campaign / event name or URL";
  };

  const getPlaceholder = () => {
    if (profileType === "person") {
      return "https://instagram.com/username or @username";
    }

    if (profileType === "brand") {
      return "https://x.com/brand or brand name";
    }

    return "e.g. World Cup 2026";
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
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-zinc-100 dashboard-grid">

      {/* ================================================== */}
      {/* BACKGROUND LIGHT                                   */}
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

          {/* CLICKABLE LOGO */}

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
                  border
                  border-blue-400/40
                  bg-blue-400/10
                  text-sm
                  font-medium
                  text-blue-300
                "
              >
                2
              </div>

              <span className="font-display text-sm text-zinc-100">
                Monitoring profile
              </span>

            </div>

            <div className="h-px w-14 bg-zinc-800" />

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
                  border-zinc-700
                  bg-zinc-900/60
                  text-sm
                  text-zinc-600
                "
              >
                3
              </div>

              <span className="font-display text-sm text-zinc-600">
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
              What do you want to monitor?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-display text-sm leading-6 text-zinc-500 sm:text-base">
              Create a monitoring profile to track conversations,
              sentiment, trends and audience behavior across social
              platforms.
            </p>

          </div>

          {/* ================================================== */}
          {/* PROFILE TYPE                                      */}
          {/* ================================================== */}

          <div className="mt-12 grid gap-4 md:grid-cols-3">

            {profileOptions.map((option) => {

              const Icon = option.icon;

              const selected =
                profileType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setProfileType(option.id)
                  }
                  className={`
                    group
                    relative
                    min-h-[190px]
                    rounded-2xl
                    border
                    p-6
                    text-left
                    transition-all
                    duration-200

                    ${
                      selected
                        ? `
                          border-blue-400/30
                          bg-blue-400/[0.055]
                          shadow-[0_0_35px_rgba(59,130,246,0.045)]
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

                  {/* Icon */}

                  <div
                    className={`
                      mb-6
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      transition-all
                      duration-200

                      ${
                        selected
                          ? "border border-blue-300/20 bg-blue-400/10 text-blue-300"
                          : "border border-zinc-800 bg-zinc-900/80 text-zinc-500 group-hover:text-zinc-200"
                      }
                    `}
                  >
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Title */}

                  <h3 className="font-display text-base tracking-wide text-zinc-100">
                    {option.title}
                  </h3>

                  {/* Description */}

                  <p className="mt-2 max-w-xs font-display text-sm leading-6 text-zinc-500">
                    {option.description}
                  </p>

                </button>
              );
            })}

          </div>

          {/* ================================================== */}
          {/* INPUT                                              */}
          {/* ================================================== */}

          <div className="mx-auto mt-9 max-w-4xl">

            <label
              htmlFor="profile-input"
              className="mb-3 block font-display text-sm text-zinc-300"
            >
              {getInputLabel()}
            </label>

            <input
              id="profile-input"
              type="text"
              value={profileInput}
              onChange={(event) =>
                setProfileInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  profileInput.trim()
                ) {
                  handleContinue();
                }
              }}
              placeholder={getPlaceholder()}
              className="
                w-full
                rounded-xl
                border
                border-zinc-700/80
                bg-zinc-900/55
                px-5
                py-4
                font-display
                text-sm
                text-zinc-100
                outline-none
                transition-all
                placeholder:font-display
                placeholder:text-zinc-700
                focus:border-blue-400/40
                focus:bg-zinc-900/75
                focus:ring-1
                focus:ring-blue-400/20
              "
            />

            <p className="mt-2 font-display text-xs text-zinc-600">
              You can connect additional platforms and profiles later.
            </p>

          </div>

          {/* ================================================== */}
          {/* CONTINUE                                           */}
          {/* ================================================== */}

          <div className="mx-auto mt-8 flex max-w-4xl justify-end">

            <button
              type="button"
              disabled={!profileInput.trim()}
              onClick={handleContinue}
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
                disabled:cursor-not-allowed
                disabled:border-zinc-800
                disabled:bg-zinc-900
                disabled:text-zinc-600
              "
            >
              Continue

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
            SocialIntel analyzes publicly available social content
            and platform-authorized data. Private information is not
            exposed through the platform.
          </p>

        </div>

      </div>

    </main>
  );
}