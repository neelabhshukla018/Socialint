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
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-zinc-800 bg-[#09090b]/90 px-5 backdrop-blur-xl sm:px-8">

      <div>
        <p className="text-xs text-zinc-500">
          Workspace
        </p>

        <h2 className="text-lg font-semibold text-white">
          Social Intelligence
        </h2>
      </div>

      <div className="flex items-center gap-3">

        {/* Search */}
        <button className="hidden rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 hover:text-white sm:block">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 hover:text-white">

          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />

        </button>

        {/* Authentication */}
        <Show when="signed-out">

          <SignUpButton mode="modal">

            <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200">
              Get Started
            </button>

          </SignUpButton>

        </Show>

        <Show when="signed-in">

          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox:
                  "rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2",

                userButtonOuterIdentifier:
                  "text-sm font-medium text-white",

                userButtonTrigger:
                  "focus:shadow-none",
              },
            }}
          />

        </Show>

      </div>

    </header>
  );
}