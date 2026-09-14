"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X as CloseIcon,
} from "lucide-react";
import { useNotifications, type ToastItem, type NotificationType } from "../../context/NotificationContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="
        fixed
        bottom-5
        right-5
        sm:bottom-6
        sm:right-6
        z-[9999]
        flex
        flex-col
        gap-2.5
        max-w-sm
        w-[calc(100vw-2.5rem)]
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
  const renderIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />;
      case "alert":
      case "warning":
        return <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />;
      default:
        return <Info size={16} className="text-[#457B9D] shrink-0 mt-0.5" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        pointer-events-auto
        flex
        items-start
        gap-3
        rounded-xl
        border
        border-zinc-200/90
        dark:border-zinc-800
        bg-white/95
        dark:bg-[#0c1017]/95
        p-3.5
        shadow-lg
        backdrop-blur-md
        transition-all
        duration-200
        animate-fadeIn
      "
    >
      {renderIcon(toast.type)}

      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs font-semibold text-zinc-900 dark:text-white">
          {toast.title}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 -mr-1 -mt-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition shrink-0"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
