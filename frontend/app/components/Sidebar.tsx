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
  X,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      group: "Workspace",
      items: [
        { href: "/", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/analytics", icon: Activity, label: "Analytics" },
        { href: "/posts-analysis", icon: MessageSquare, label: "Posts Analysis" },
        { href: "/trends", icon: TrendingUp, label: "Trends & Topics" },
        { href: "/audience", icon: Users, label: "Audience Insights" },
        { href: "/influence", icon: Network, label: "Influence Network" },
      ],
    },
    {
      group: "Management",
      items: [
        { href: "/reports", icon: FileText, label: "Reports" },
        { href: "/settings", icon: Settings, label: "Settings" },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* ================================================== */}
      {/* LOGO BANNER                                        */}
      {/* ================================================== */}
      <div className="relative flex h-20 shrink-0 items-center justify-between border-b border-zinc-200/80 px-6">
        <Link
          href="/"
          onClick={onClose}
          className="relative z-10 flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition group-hover:bg-cyan-600">
            <Activity size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[25px] tracking-tight text-zinc-900 leading-none">
              SocialInt
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase -mt-0.5">
              PR & Intelligence
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 lg:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ================================================== */}
      {/* NAVIGATION                                         */}
      {/* ================================================== */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {navLinks.map((group, gIdx) => (
          <div key={gIdx}>
            <p className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                      isActive
                        ? "bg-[#457B9D] text-white font-medium shadow-xs shadow-[#457B9D]/20"
                        : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={
                        isActive
                          ? "text-white shrink-0"
                          : "text-zinc-400 group-hover:text-zinc-700 shrink-0"
                      }
                    />
                    <span className="text-[13px] font-medium tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ================================================== */}
      {/* DATA COLLECTION STATUS CARD                        */}
      {/* ================================================== */}
      <div className="shrink-0 border-t border-zinc-200/80 p-3.5 bg-zinc-50/50">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-zinc-900">
              Data collection active
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
            Social discussions across platforms monitored in real time.
          </p>
          <Link
            href="/data-sources"
            onClick={onClose}
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#457B9D] hover:underline"
          >
            <span>Manage sources</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[270px] overflow-hidden border-r border-zinc-200/80 bg-white/95 backdrop-blur-md lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={onClose}
          />
          {/* Slide-out Drawer */}
          <div className="fixed left-0 top-0 h-full w-[280px] max-w-[85vw] shadow-2xl transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}