"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle2,
  ExternalLink,
  Settings,
  Trash2,
  X as CloseIcon,
} from "lucide-react";

import {
  useNotifications,
  type NotificationItem,
  type NotificationType,
} from "../context/NotificationContext";

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function NotificationPopover({
  isOpen,
  onClose,
  triggerRef,
}: NotificationPopoverProps) {
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }
      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);
      }, 10);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const displayedNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return "";
    }
  };

  const renderIcon = (type: NotificationType) => {
    switch (type) {
      case "alert":
      case "warning":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle size={14} />
          </div>
        );
      case "success":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={14} />
          </div>
        );
      default:
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#457B9D]/10 text-[#457B9D]">
            <Bell size={14} />
          </div>
        );
    }
  };

  return (
    <div
      ref={popoverRef}
      className="
        fixed
        inset-x-3
        top-18
        sm:inset-auto
        sm:absolute
        sm:right-0
        sm:top-full
        sm:mt-2
        z-50
        sm:w-[380px]
        max-w-[calc(100vw-1.5rem)]
        rounded-2xl
        border
        border-zinc-200
        dark:border-zinc-800
        bg-white
        dark:bg-zinc-900
        shadow-xl
        animate-fadeIn
        overflow-hidden
        flex
        flex-col
      "
    >
      {/* Header */}
      <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition font-medium"
              >
                Mark all read
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
            >
              <CloseIcon size={15} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              filter === "all"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              filter === "unread"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {displayedNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell size={22} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              No notifications
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {filter === "unread" ? "You've read everything." : "You're all caught up."}
            </p>
          </div>
        ) : (
          displayedNotifications.map((item) => {
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                onClick={() => {
                  markAsRead(item.id);
                  if (item.link) {
                    onClose();
                    router.push(item.link);
                  }
                }}
                className={`group relative flex items-start gap-3 p-3 transition cursor-pointer ${
                  isUnread
                    ? "bg-zinc-50/70 dark:bg-zinc-800/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70"
                    : "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20"
                }`}
              >
                {renderIcon(item.type)}

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      {isUnread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#457B9D] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                    {item.message}
                  </p>

                  {item.link && (
                    <Link
                      href={item.link}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(item.id);
                        onClose();
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#457B9D] hover:underline"
                    >
                      <span>View</span>
                      <ExternalLink size={10} />
                    </Link>
                  )}
                </div>

                {/* Dismiss button on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  title="Dismiss"
                  className="opacity-0 group-hover:opacity-100 absolute right-2.5 top-3 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                >
                  <CloseIcon size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between text-xs">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition font-medium text-[11px]"
        >
          <Settings size={12} />
          <span>Notification settings</span>
        </Link>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={clearAllNotifications}
            className="text-[11px] text-zinc-400 hover:text-rose-600 transition"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
