"use client";

import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Brain,
  CheckCircle2,
  Mail,
  Smartphone,
  Sparkles,
  X as CloseIcon,
} from "lucide-react";
import { useNotifications, type ToastItem } from "../../context/NotificationContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="
        fixed
        top-4
        right-4
        sm:top-6
        sm:right-6
        z-[9999]
        flex
        flex-col
        gap-3
        max-w-sm
        sm:max-w-md
        w-[calc(100vw-2rem)]
        pointer-events-none
      "
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </aside>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const getIconAndColor = () => {
    switch (toast.type) {
      case "analysis":
        return {
          icon: Brain,
          bg: "bg-[#457B9D]/15 dark:bg-[#457B9D]/25",
          text: "text-[#457B9D]",
          border: "border-[#457B9D]/30",
        };
      case "alert":
        return {
          icon: AlertTriangle,
          bg: "bg-rose-50 dark:bg-rose-950/40",
          text: "text-rose-600 dark:text-rose-400",
          border: "border-rose-200 dark:border-rose-900",
        };
      case "success":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-50 dark:bg-emerald-950/40",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-900",
        };
      case "warning":
        return {
          icon: AlertCircle,
          bg: "bg-amber-50 dark:bg-amber-950/40",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-900",
        };
      default:
        return {
          icon: Bell,
          bg: "bg-sky-50 dark:bg-sky-950/40",
          text: "text-sky-600 dark:text-sky-400",
          border: "border-sky-200 dark:border-sky-900",
        };
    }
  };

  const style = getIconAndColor();
  const Icon = style.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        pointer-events-auto
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-zinc-200/90
        dark:border-zinc-800
        bg-white/95
        dark:bg-[#0c1017]/95
        p-4
        shadow-2xl
        backdrop-blur-xl
        transition-all
        duration-300
        animate-fadeIn
      "
    >
      {/* Top row: Icon, Title, Close Button */}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${style.border} ${style.bg} ${style.text}`}
        >
          <Icon size={18} strokeWidth={2.2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-tight text-zinc-950 dark:text-white truncate">
              {toast.title}
            </h4>

            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss notification"
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
            >
              <CloseIcon size={14} />
            </button>
          </div>

          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {toast.message}
          </p>

          {/* Sentiment Badge (if present) */}
          {toast.meta?.sentiment && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                  toast.meta.sentiment === "POSITIVE"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : toast.meta.sentiment === "NEGATIVE"
                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                }`}
              >
                Sentiment: {toast.meta.sentiment}
              </span>
              {toast.meta.platform && (
                <span className="text-[10px] font-mono text-zinc-400">
                  via {toast.meta.platform}
                </span>
              )}
            </div>
          )}

          {/* Dispatched Delivery Indicators */}
          {toast.channelsDispatched && (
            <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-2">
              {toast.channelsDispatched.email && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 text-[10px] font-mono text-sky-700 dark:text-sky-300">
                  <Mail size={11} className="shrink-0" />
                  <span className="truncate max-w-[150px]">
                    Emailed to {toast.channelsDispatched.email}
                  </span>
                </span>
              )}

              {toast.channelsDispatched.mobile && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                  <Smartphone size={11} className="shrink-0" />
                  <span className="truncate max-w-[140px]">
                    SMS Alert to {toast.channelsDispatched.mobile}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Auto-Dismiss Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-[#457B9D] animate-shrinkWidth"
          style={{ animationDuration: `${toast.duration || 5000}ms` }}
        />
      </div>
    </div>
  );
}
