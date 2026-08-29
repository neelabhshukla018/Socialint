"use client";

import {
  Bell,
  Search,
} from "lucide-react";

import {
  Show,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function DashboardHeader() {
  return (
    <header
      className="
        sticky
        top-0
        z-20
        flex
        h-20
        items-center
        justify-between
        border-b
        border-zinc-700/50
        bg-[#080b12]/75
        px-5
        backdrop-blur-xl
        sm:px-8
      "
    >

      {/* ================================================== */}
      {/* WORKSPACE                                          */}
      {/* ================================================== */}

      <div>

        <p className="text-[11px] font-medium tracking-wide text-zinc-500">
          Workspace
        </p>

        <h2 className="font-display text-lg tracking-wide text-white">
          Social Intelligence
        </h2>

      </div>


      {/* ================================================== */}
      {/* ACTIONS                                            */}
      {/* ================================================== */}

      <div className="flex items-center gap-2 sm:gap-3">


        {/* ================================================== */}
        {/* SEARCH                                             */}
        {/* ================================================== */}

        <button
          type="button"
          aria-label="Search"
          className="
            hidden
            rounded-xl
            border
            border-zinc-700/60
            bg-zinc-900/60
            p-2.5
            text-zinc-400
            backdrop-blur-md
            transition-all
            duration-200
            hover:border-zinc-600
            hover:bg-zinc-800/70
            hover:text-white
            sm:block
          "
        >

          <Search
            size={18}
            strokeWidth={1.8}
          />

        </button>


        {/* ================================================== */}
        {/* NOTIFICATIONS                                      */}
        {/* ================================================== */}

        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            rounded-xl
            border
            border-zinc-700/60
            bg-zinc-900/60
            p-2.5
            text-zinc-400
            backdrop-blur-md
            transition-all
            duration-200
            hover:border-zinc-600
            hover:bg-zinc-800/70
            hover:text-white
          "
        >

          <Bell
            size={18}
            strokeWidth={1.8}
          />

          {/* Notification dot */}

          <span
            className="
              absolute
              right-2
              top-2
              h-1.5
              w-1.5
              rounded-full
              bg-red-400
              shadow-[0_0_8px_rgba(248,113,113,0.7)]
            "
          />

        </button>


        {/* ================================================== */}
        {/* SIGNED OUT                                        */}
        {/* ================================================== */}

        <Show when="signed-out">

          <SignUpButton mode="modal">

            <button
              type="button"
              className="
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-black
                transition-all
                duration-200
                hover:bg-zinc-200
                sm:px-5
                sm:text-sm
              "
            >
              Get Started
            </button>

          </SignUpButton>

        </Show>


        {/* ================================================== */}
        {/* SIGNED IN                                         */}
        {/* ================================================== */}

        <Show when="signed-in">

          <UserButton
            showName
            appearance={{
              elements: {

                /* User container */

                userButtonBox:
                  "rounded-xl border border-zinc-700/60 bg-zinc-900/70 px-3 py-2 backdrop-blur-md text-white",

                /* User name */

                userButtonOuterIdentifier:
                  "text-xs font-medium text-zinc-200 sm:text-sm",

                /* Avatar */

                userButtonAvatarBox:
                  "h-7 w-7 sm:h-8 sm:w-8",

                /* Trigger */

                userButtonTrigger:
                  "rounded-xl focus:shadow-none",

                /* Clerk dropdown */

                userButtonPopoverCard:
                  "border border-zinc-700 bg-zinc-900 text-white shadow-2xl",

              },
            }}
          />

        </Show>

      </div>

    </header>
  );
}