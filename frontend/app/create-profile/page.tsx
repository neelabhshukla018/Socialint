"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useUser,
} from "@clerk/nextjs";

import {
  ArrowRight,
  Loader2,
  UserRound,
  Building2,
  Megaphone,
  AlertCircle,
} from "lucide-react";

import {
  useApi,
} from "@/src/lib/api";

/* =========================================================
   TYPES
   ========================================================= */

type ProfileType =
  | "PERSON"
  |  "BRAND"
  |  "CAMPAIGN";

/* =========================================================
   PAGE
   ========================================================= */

export default function CreateProfilePage() {
  const router =
    useRouter();

  const {
    user,
    isLoaded,
  } = useUser();

  const {
    createProfile,
  } = useApi();

  /* =======================================================
     STATE
     ======================================================= */

  const [
    profileType,
    setProfileType,
  ] =
    useState<ProfileType>(
      "PERSON"
    );

  const [
    profileName,
    setProfileName,
  ] =
    useState("");

  const [
    identifier,
    setIdentifier,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  /* =======================================================
     PROFILE OPTIONS
     ======================================================= */

  const profileOptions = [
    {
      type: "PERSON" as ProfileType,

      title: "Person",

      description:
        "Monitor a person, creator, public figure or individual.",

      icon: UserRound,
    },

    {
      type: "BRAND" as ProfileType,

      title: "Brand",

      description:
        "Monitor a company, product or brand.",

      icon: Building2,
    },

    {
      type: "CAMPAIGN" as ProfileType,

      title: "Campaign",

      description:
        "Monitor a campaign, movement or topic.",

      icon: Megaphone,
    },
  ];

  /* =======================================================
     SUBMIT
     ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(null);

    /* -----------------------------------------------------
       CLERK
       ----------------------------------------------------- */

    if (!isLoaded) {
      return;
    }

    if (!user) {
      setError(
        "You must be signed in to create a monitoring profile."
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATION
       ----------------------------------------------------- */

    const cleanProfileName =
      profileName.trim();

    const cleanIdentifier =
      identifier.trim();

    if (!cleanProfileName) {
      setError(
        "Please enter a profile name."
      );

      return;
    }

    if (!cleanIdentifier) {
      setError(
        "Please enter a profile identifier."
      );

      return;
    }

    /* -----------------------------------------------------
       USER INFORMATION
       ----------------------------------------------------- */

    const clerkId =
      user.id;

    const email =
      user.primaryEmailAddress
        ?.emailAddress;

    const name =
      user.fullName ||
      user.firstName ||
      undefined;

    const username =
      user.username ||
      undefined;

    if (!email) {
      setError(
        "Your Clerk account does not have a primary email address."
      );

      return;
    }

    /* -----------------------------------------------------
       CREATE DATABASE PROFILE
       ----------------------------------------------------- */

    try {
      setLoading(true);

      const response =
        await createProfile({
          clerkId,

          email,

          name,

          username,

          profileType,

          profileName:
            cleanProfileName,

          identifier:
            cleanIdentifier,
        });

      /* ---------------------------------------------------
         VALIDATE BACKEND RESPONSE
         --------------------------------------------------- */

      if (
        !response ||
        !response.success ||
        !response.data?.profile
      ) {
        throw new Error(
          response?.message ||
            "The monitoring profile could not be created."
        );
      }

      const profile =
        response.data.profile;

      /* ---------------------------------------------------
         IMPORTANT
         
         Store the REAL database profile ID.
         --------------------------------------------------- */

      const profileForStorage = {
        id: profile.id,

        userId:
          profile.userId,

        type:
          profile.type,

        name:
          profile.name,

        input:
          profile.identifier,

        identifier:
          profile.identifier,

        isActive:
          profile.isActive,

        createdAt:
          new Date().toISOString(),
      };

      /* ---------------------------------------------------
         SESSION STORAGE
         --------------------------------------------------- */

      sessionStorage.setItem(
        "socialintel_profile",
        JSON.stringify(
          profileForStorage
        )
      );

      /* ---------------------------------------------------
         ALSO STORE PROFILE ID
         --------------------------------------------------- */

      sessionStorage.setItem(
        "socialintel_profile_id",
        String(
          profile.id
        )
      );

      /*
       * Keep a localStorage copy too.
       *
       * Analytics can use this as a fallback
       * if sessionStorage is unavailable.
       */

      localStorage.setItem(
        "socialintel_profile",
        JSON.stringify(
          profileForStorage
        )
      );

      localStorage.setItem(
        "socialintel_profile_id",
        String(
          profile.id
        )
      );

      /* ---------------------------------------------------
         SUCCESS
         --------------------------------------------------- */

      console.log(
        "=============================================="
      );

      console.log(
        "✅ MONITORING PROFILE CREATED"
      );

      console.log(
        "Profile ID:",
        profile.id
      );

      console.log(
        "Profile name:",
        profile.name
      );

      console.log(
        "Profile type:",
        profile.type
      );

      console.log(
        "Identifier:",
        profile.identifier
      );

      console.log(
        "=============================================="
      );

      /* ---------------------------------------------------
         GO TO DATA SOURCES
         --------------------------------------------------- */

      router.push(
        "/data-sources"
      );

    } catch (err) {
      console.error(
        "Create profile error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create monitoring profile."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOADING CLERK
     ======================================================= */

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] text-white">

        <div className="text-center">

          <Loader2
            size={30}
            className="mx-auto animate-spin text-blue-400"
          />

          <p className="mt-4 text-sm text-zinc-500">
            Loading your account...
          </p>

        </div>

      </main>
    );
  }

  /* =======================================================
     NOT SIGNED IN
     ======================================================= */

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-6 text-white">

        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 text-center">

          <AlertCircle
            size={36}
            className="mx-auto text-yellow-400"
          />

          <h1 className="mt-5 text-xl font-semibold">
            Sign in required
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Please sign in before creating
            a monitoring profile.
          </p>

        </div>

      </main>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">

      {/* ===================================================
          BACKGROUND
          =================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-[15%] top-[-100px] h-[400px] w-[600px] rounded-full bg-blue-500/[0.035] blur-[120px]" />

        <div className="absolute bottom-[-100px] right-[-100px] h-[400px] w-[500px] rounded-full bg-purple-500/[0.025] blur-[120px]" />

      </div>

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="relative z-10 border-b border-white/[0.07]">

        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
              SocialIntel
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              Create monitoring profile
            </h1>

          </div>

          <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-500">
            Step 1
          </div>

        </div>

      </header>

      {/* ===================================================
          CONTENT
          =================================================== */}

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">

        <div className="mx-auto max-w-3xl">

          {/* =================================================
              TITLE
              ================================================= */}

          <div className="mb-10">

            <p className="text-sm font-medium text-blue-400">
              Monitoring setup
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              What do you want to monitor?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              Create a monitoring profile first.
              Your profile will receive a real
              database ID that will be used by
              Data Sources, Post Analysis and
              Analytics.
            </p>

          </div>

          {/* =================================================
              FORM
              ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-8"
          >

            {/* ===============================================
                PROFILE TYPE
                =============================================== */}

            <section>

              <label className="mb-4 block text-sm font-medium text-zinc-300">
                Profile type
              </label>

              <div className="grid gap-4 md:grid-cols-3">

                {profileOptions.map(
                  (option) => {

                    const Icon =
                      option.icon;

                    const selected =
                      profileType ===
                      option.type;

                    return (
                      <button
                        key={
                          option.type
                        }
                        type="button"
                        onClick={() =>
                          setProfileType(
                            option.type
                          )
                        }
                        className={`group rounded-2xl border p-5 text-left transition duration-200 ${
                          selected
                            ? "border-blue-400/40 bg-blue-500/[0.08]"
                            : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.045]"
                        }`}
                      >

                        <div className="flex items-start justify-between">

                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              selected
                                ? "bg-blue-500/15"
                                : "bg-white/[0.04]"
                            }`}
                          >

                            <Icon
                              size={19}
                              className={
                                selected
                                  ? "text-blue-400"
                                  : "text-zinc-500"
                              }
                            />

                          </div>

                          {selected && (
                            <span className="rounded-full bg-blue-400/10 px-2.5 py-1 text-[10px] font-medium text-blue-400">
                              Selected
                            </span>
                          )}

                        </div>

                        <h3 className="mt-5 text-base font-semibold">
                          {option.title}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                          {
                            option.description
                          }
                        </p>

                      </button>
                    );
                  }
                )}

              </div>

            </section>

            {/* ===============================================
                PROFILE NAME
                =============================================== */}

            <section>

              <label
                htmlFor="profileName"
                className="mb-3 block text-sm font-medium text-zinc-300"
              >
                Profile name
              </label>

              <input
                id="profileName"
                type="text"
                value={
                  profileName
                }
                onChange={(event) =>
                  setProfileName(
                    event.target.value
                  )
                }
                placeholder="e.g. Virat Kohli"
                disabled={
                  loading
                }
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-blue-400/40 focus:bg-white/[0.04] disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-zinc-600">
                A friendly name for this
                monitoring profile.
              </p>

            </section>

            {/* ===============================================
                IDENTIFIER
                =============================================== */}

            <section>

              <label
                htmlFor="identifier"
                className="mb-3 block text-sm font-medium text-zinc-300"
              >
                Profile identifier
              </label>

              <input
                id="identifier"
                type="text"
                value={
                  identifier
                }
                onChange={(event) =>
                  setIdentifier(
                    event.target.value
                  )
                }
                placeholder="@username or profile URL"
                disabled={
                  loading
                }
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-blue-400/40 focus:bg-white/[0.04] disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Example: @example or
                https://instagram.com/example
              </p>

            </section>

            {/* ===============================================
                ERROR
                =============================================== */}

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <div>

                  <p className="text-sm font-medium text-red-300">
                    Could not create profile
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-400/70">
                    {error}
                  </p>

                </div>

              </div>
            )}

            {/* ===============================================
                SUBMIT
                =============================================== */}

            <div className="flex flex-col gap-4 border-t border-white/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs text-zinc-600">
                  Your profile will be saved
                  securely in the database.
                </p>

              </div>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Creating...
                  </>
                ) : (
                  <>
                    Create profile

                    <ArrowRight
                      size={16}
                    />
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}