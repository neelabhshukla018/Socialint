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
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[270px] border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="flex h-full flex-col">

        {/* ================================================== */}
        {/* LOGO                                               */}
        {/* ================================================== */}

        <div className="flex h-[80px] shrink-0 items-center border-b border-zinc-800 px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Activity
                size={19}
                strokeWidth={2}
                className="text-black"
              />
            </div>

            <div className="leading-none">
              <h1 className="text-[20px] font-semibold tracking-tight text-white">
                SocialInt
              </h1>

              <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-zinc-500">
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
          <p className="mb-2 px-3 text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600">
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
          <p className="mb-2 mt-6 px-3 text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600">
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

              <span className="text-[11px] font-medium text-zinc-300">
                Data collection active
              </span>

            </div>

            <p className="mt-1.5 text-[10px] leading-4 text-zinc-500">
              X and Telegram are currently connected.
            </p>

            <Link
              href="/data-sources"
              className="mt-2 block text-[10px] font-medium text-zinc-300 transition hover:text-white"
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

      <span className="text-[13px] font-medium">
        {label}
      </span>

    </Link>
  );
}