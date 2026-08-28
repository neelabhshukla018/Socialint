"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    /*
     * Temporary storage for the frontend flow.
     *
     * Later this will be replaced with:
     *
     * Clerk user
     *      ↓
     * Node.js API
     *      ↓
     * Neon PostgreSQL
     */

    sessionStorage.setItem(
      "socialintel_profile",
      JSON.stringify(profile)
    );

    router.push("/data-sources");
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-6">

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

        </div>
      </header>

      {/* Main */}
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-6 py-14">

        <div className="w-full max-w-5xl">

          {/* Progress */}
          <div className="mb-12 flex items-center justify-center gap-3">

            {/* Step 1 */}
            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <Check size={16} />
              </div>

              <span className="text-sm font-medium text-zinc-300">
                Account
              </span>

            </div>

            <div className="h-px w-14 bg-zinc-700" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                2
              </div>

              <span className="text-sm font-medium text-white">
                Monitoring profile
              </span>

            </div>

            <div className="h-px w-14 bg-zinc-800" />

            {/* Step 3 */}
            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-sm text-zinc-500">
                3
              </div>

              <span className="text-sm text-zinc-600">
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
              What do you want to monitor?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Create a monitoring profile to track conversations,
              sentiment, trends and audience behavior across social
              platforms.
            </p>

          </div>

          {/* Profile Type */}
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
                  className={`group relative min-h-[190px] rounded-2xl border p-6 text-left transition-all ${
                    selected
                      ? "border-zinc-200 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/80"
                  }`}
                >

                  {/* Selected check */}
                  {selected && (
                    <div className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <Check
                        size={14}
                        strokeWidth={3}
                        className="text-black"
                      />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition ${
                      selected
                        ? "bg-white text-black"
                        : "bg-zinc-800 text-zinc-400 group-hover:text-white"
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {option.title}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                    {option.description}
                  </p>

                </button>
              );
            })}

          </div>

          {/* Input */}
          <div className="mx-auto mt-9 max-w-4xl">

            <label
              htmlFor="profile-input"
              className="mb-3 block text-sm font-medium text-zinc-300"
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
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            />

            <p className="mt-2 text-xs text-zinc-600">
              You can connect additional platforms and profiles later.
            </p>

          </div>

          {/* Continue */}
          <div className="mx-auto mt-8 flex max-w-4xl justify-end">

            <button
              type="button"
              disabled={!profileInput.trim()}
              onClick={handleContinue}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              Continue

              <ArrowRight size={17} />

            </button>

          </div>

          {/* Privacy */}
          <p className="mx-auto mt-10 max-w-2xl text-center text-[11px] leading-5 text-zinc-600">
            SocialIntel analyzes publicly available social content
            and platform-authorized data. Private information is not
            exposed through the platform.
          </p>

        </div>

      </div>

    </main>
  );
}