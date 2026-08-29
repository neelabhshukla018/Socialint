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
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-zinc-800 px-6">
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Activity
                size={20}
                className="text-black"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-white">
                SocialInt
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Social Intelligence
              </p>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">

          <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
            Workspace
          </p>

          <div className="space-y-1">

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

          <p className="mb-3 mt-8 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
            Management
          </p>

          <div className="space-y-1">

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

        {/* Data source status */}
        <div className="border-t border-zinc-800 p-4">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-zinc-300">
                Data collection active
              </span>

            </div>

            <p className="mt-2 text-[11px] leading-5 text-zinc-500">
              X and Telegram are currently connected.
            </p>

            <Link
              href="/data-sources"
              className="mt-3 block text-xs font-medium text-white hover:text-zinc-300"
            >
              Manage sources →
            </Link>

          </div>

        </div>

      </div>
    </aside>
  );
}

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
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >
      <Icon size={18} />

      <span>{label}</span>
    </Link>
  );
}