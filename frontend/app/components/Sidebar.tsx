"use client";

import {
  Activity,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Network,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[270px] overflow-hidden border-r border-zinc-800 bg-zinc-950 lg:block">

      <div className="flex h-full flex-col">

        {/* ================================================== */}
        {/* LOGO                                               */}
        {/* ================================================== */}

        <div className="relative flex h-[80px] shrink-0 items-center overflow-hidden border-b border-zinc-700 px-6">

          {/* ================================================== */}
          {/* SUBTLE ANIMATED LIGHT BEHIND LOGO                 */}
          {/* ================================================== */}

          <div className="pointer-events-none absolute inset-0">

            {/* Main blue/purple wave */}

            <div
              className="
                sidebar-logo-wave
                absolute
                -left-24
                -top-24
                h-[180px]
                w-[360px]
                rounded-[50%]
                bg-gradient-to-r
                from-blue-500/[0.12]
                via-cyan-500/[0.10]
                to-cyan-400/[0.05]
                blur-[45px]
              "
            />

            {/* Smaller moving light */}

            <div
              className="
                sidebar-logo-glow
                absolute
                -right-20
                top-[-60px]
                h-[150px]
                w-[220px]
                rounded-full
                bg-red-400/[0.07]
                blur-[40px]
              "
            />

          </div>


          {/* ================================================== */}
          {/* LOGO                                               */}
          {/* ================================================== */}

          <Link
            href="/"
            className="relative z-10 flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Activity
                size={20}
                strokeWidth={3}
                className="text-black"
              />
            </div>

            <div className="leading-none">

              <h1 className="font-display text-[24px] tracking-wide text-white">
                SocialInt
              </h1>

              <p className="mt-1 font-display text-[8px] uppercase tracking-[0.18em] text-zinc-500">
                Social Intelligence
              </p>

            </div>

          </Link>

        </div>


        {/* ================================================== */}
        {/* NAVIGATION                                         */}
        {/* ================================================== */}

        <nav className="flex-1 px-3 py-5">

          {/* Workspace */}

          <p className="mb-2 px-3 font-display text-[9px] uppercase tracking-[0.18em] text-zinc-600">
            Workspace
          </p>

          <div className="space-y-0.5">

            <NavItem
              href="/"
              icon={LayoutDashboard}
              label="Dashboard"
              active
            />

            <NavItem
              href="/analytics"
              icon={Activity}
              label="Analytics"
            />

            <NavItem
              href="/posts-analysis"
              icon={MessageSquare}
              label="Posts Analysis"
            />

            <NavItem
              href="/trends"
              icon={TrendingUp}
              label="Trends & Topics"
            />

            <NavItem
              href="/audience"
              icon={Users}
              label="Audience Insights"
            />

            <NavItem
              href="/influence"
              icon={Network}
              label="Influence Network"
            />

          </div>


          {/* Management */}

          <p className="mb-2 mt-6 px-3 font-display text-[9px] uppercase tracking-[0.18em] text-zinc-600">
            Management
          </p>

          <div className="space-y-0.5">

            <NavItem
              href="/reports"
              icon={FileText}
              label="Reports"
            />

            <NavItem
              href="/settings"
              icon={Settings}
              label="Settings"
            />

          </div>

        </nav>


        {/* ================================================== */}
        {/* DATA COLLECTION STATUS                             */}
        {/* ================================================== */}

        <div className="shrink-0 border-t border-zinc-800 p-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-3">

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

              <span className="font-display text-[11px] text-zinc-300">
                Data collection active
              </span>

            </div>

            <p className="mt-1.5 font-display text-[10px] leading-4 text-zinc-500">
              X and Telegram are currently connected.
            </p>

            <Link
              href="/data-sources"
              className="mt-2 block font-display text-[10px] text-zinc-300 transition hover:text-white"
            >
              Manage sources →
            </Link>

          </div>

        </div>

      </div>
    </aside>
  );
}


/* ================================================== */
/* NAV ITEM                                           */
/* ================================================== */

function NavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >

      <Icon
        size={17}
        strokeWidth={1.8}
        className="shrink-0"
      />

      <span className="font-display text-[13px]">
        {label}
      </span>

    </Link>
  );
}