"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Mail,
  Send,
  Settings,
  ShieldAlert,
  Smartphone,
  Sparkles,
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
  const popoverRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    updatePreferences,
    notifyEvent,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<"all" | "analysis" | "alert" | "system">("all");
  const [editingChannels, setEditingChannels] = useState(false);
  const [tempEmail, setTempEmail] = useState(preferences.targetEmail);
  const [tempMobile, setTempMobile] = useState(preferences.targetMobile);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // If clicking inside the popover itself, keep open
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      // If clicking on the trigger button (e.g. bell), ignore so button onClick handles it
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
      // Delay attaching listener so the click that opened the popover doesn't immediately close it
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

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "analysis") return n.type === "analysis";
    if (activeFilter === "alert") return n.type === "alert" || n.type === "warning";
    if (activeFilter === "system") return n.type === "info" || n.type === "success";
    return true;
  });

  const handleSaveChannels = () => {
    updatePreferences({
      targetEmail: tempEmail.trim() || preferences.targetEmail,
      targetMobile: tempMobile.trim() || preferences.targetMobile,
    });
    setEditingChannels(false);
  };

  const handleTestDispatch = () => {
    notifyEvent({
      title: "Test Alert Dispatched",
      message: "Sample PR sentiment spike triggered. Dispatched to your configured email and mobile devices.",
      type: "analysis",
      dispatchChannels: true,
      meta: {
        platform: "X",
        sentiment: "POSITIVE",
      },
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return "Recently";
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
        sm:mt-2.5
        z-50
        sm:w-[420px]
        max-w-[calc(100vw-1.5rem)]
        rounded-3xl
        border
        border-zinc-200/90
        dark:border-zinc-800/90
        bg-white/98
        dark:bg-[#0c1017]/98
        shadow-[0_20px_50px_rgba(0,0,0,0.25)]
        dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]
        backdrop-blur-2xl
        animate-fadeIn
        overflow-hidden
        flex
        flex-col
        max-h-[82vh]
      "
    >
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#457B9D]/15 text-[#457B9D]">
              <Bell size={15} />
            </div>
            <h3 className="font-display text-base font-bold text-zinc-950 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold px-2 py-0.5">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-[#457B9D] hover:underline"
              >
                Mark all read
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        {/* Channels Dispatch Bar */}
        <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-2.5">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Notification Delivery Channels
            </span>
            <button
              type="button"
              onClick={() => setEditingChannels(!editingChannels)}
              className="text-[#457B9D] hover:underline text-[10px] font-mono"
            >
              {editingChannels ? "Cancel" : "Configure"}
            </button>
          </div>

          {!editingChannels ? (
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail size={12} className={preferences.emailNotifications ? "text-sky-600" : "text-zinc-400"} />
                  <span className="truncate">{preferences.targetEmail}</span>
                </span>
                <span className={`text-[10px] font-semibold ${preferences.emailNotifications ? "text-emerald-600" : "text-zinc-400"}`}>
                  {preferences.emailNotifications ? "Active" : "Off"}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5 truncate">
                  <Smartphone size={12} className={preferences.mobileNotifications ? "text-emerald-600" : "text-zinc-400"} />
                  <span className="truncate">{preferences.targetMobile}</span>
                </span>
                <span className={`text-[10px] font-semibold ${preferences.mobileNotifications ? "text-emerald-600" : "text-zinc-400"}`}>
                  {preferences.mobileNotifications ? "Active" : "Off"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 block mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs outline-none"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 block mb-1">
                  Recipient Mobile / SMS
                </label>
                <input
                  type="tel"
                  value={tempMobile}
                  onChange={(e) => setTempMobile(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs outline-none font-mono"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={handleSaveChannels}
                  className="rounded-lg bg-[#457B9D] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-[#386785]"
                >
                  Save Delivery Target
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto">
          {(["all", "analysis", "alert", "system"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium capitalize transition ${
                activeFilter === filter
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-2xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* NOTIFICATIONS LIST                                 */}
      {/* ================================================== */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`pt-2 first:pt-0 p-2.5 rounded-2xl transition cursor-pointer ${
                  isUnread
                    ? "bg-zinc-50/90 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-display text-xs font-bold text-zinc-950 dark:text-white truncate">
                      {item.title}
                    </span>
                    {isUnread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                  {item.message}
                </p>

                {/* Delivery Badges */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {item.meta?.sentiment && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase ${
                        item.meta.sentiment === "POSITIVE"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : item.meta.sentiment === "NEGATIVE"
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
                      }`}
                    >
                      {item.meta.sentiment}
                    </span>
                  )}

                  {item.channels?.email?.sent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-sky-700 dark:text-sky-400">
                      <Mail size={10} />
                      <span>Emailed</span>
                    </span>
                  )}

                  {item.channels?.mobile?.sent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      <Smartphone size={10} />
                      <span>SMS Sent</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================================================== */}
      {/* FOOTER ACTIONS                                     */}
      {/* ================================================== */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between text-xs shrink-0">
        <button
          type="button"
          onClick={handleTestDispatch}
          className="font-medium text-[#457B9D] hover:underline flex items-center gap-1 text-[11px]"
        >
          <Send size={11} />
          <span>Send Test Toast</span>
        </button>

        <div className="flex items-center gap-3">
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAllNotifications}
              className="text-zinc-400 hover:text-rose-600 transition text-[11px]"
            >
              Clear all
            </button>
          )}

          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition text-[11px] font-medium"
          >
            <Settings size={12} />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
