"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "@clerk/nextjs";
import { getSettings, SETTINGS_CHANGED_EVENT } from "@/src/lib/settingsStore";

export type NotificationType = "info" | "success" | "warning" | "alert";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  meta?: {
    platform?: string;
    sentiment?: string;
    url?: string;
    author?: string;
  };
}

export interface ToastItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  link?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  targetEmail?: string;
  targetMobile?: string;
  analysisAlerts?: boolean;
  crisisAlerts?: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  toasts: ToastItem[];
  preferences: NotificationPreferences;
  showToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  notifyAnalysisComplete: (data: {
    platform: string;
    url: string;
    sentiment: string;
    sentimentScore?: number;
    author?: string;
    summary?: string;
  }) => void;
  notifyEvent: (event: {
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
    dispatchChannels?: boolean;
    meta?: NotificationItem["meta"];
  }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
}

const STORAGE_NOTIFICATIONS_KEY = "socialint_notifications";
const STORAGE_PREFERENCES_KEY = "socialint_notification_preferences";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  weeklyReports: true,
  targetEmail: "",
  targetMobile: "",
  analysisAlerts: true,
  crisisAlerts: true,
};

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "info",
    title: "Analysis complete",
    message: "Post analysis for @openai on X is ready.",
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    read: false,
    link: "/posts-analysis",
    meta: {
      platform: "X",
      sentiment: "POSITIVE",
      author: "@openai",
    },
  },
  {
    id: "notif-2",
    type: "alert",
    title: "Negative sentiment alert",
    message: "Spike in negative comments detected on YouTube.",
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    read: false,
    meta: {
      platform: "YouTube",
      sentiment: "NEGATIVE",
    },
  },
  {
    id: "notif-3",
    type: "success",
    title: "Data source connected",
    message: "Telegram data feed is now active and syncing.",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: true,
    link: "/data-sources",
  },
];

function deduplicateNotifications(items: NotificationItem[]): NotificationItem[] {
  const seen = new Set<string>();
  const result: NotificationItem[] = [];
  for (const item of items) {
    if (item && item.id && !seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Load preferences and notifications on mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(STORAGE_PREFERENCES_KEY);
      const appSettings = getSettings();
      if (savedPrefs) {
        setPreferences({
          ...JSON.parse(savedPrefs),
          pushNotifications: appSettings.pushNotifications,
          emailNotifications: appSettings.emailNotifications,
          weeklyReports: appSettings.weeklyReports,
        });
      } else if (user) {
        const email = user.primaryEmailAddress?.emailAddress || "";
        const phone = user.primaryPhoneNumber?.phoneNumber || "";
        const initialPrefs = {
          ...DEFAULT_PREFERENCES,
          pushNotifications: appSettings.pushNotifications,
          emailNotifications: appSettings.emailNotifications,
          weeklyReports: appSettings.weeklyReports,
          targetEmail: email,
          targetMobile: phone,
        };
        setPreferences(initialPrefs);
        localStorage.setItem(STORAGE_PREFERENCES_KEY, JSON.stringify(initialPrefs));
      }

      const savedNotifs = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const deduplicated = deduplicateNotifications(parsed);
          setNotifications(deduplicated);
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(deduplicated));
        } else {
          setNotifications(SEED_NOTIFICATIONS);
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
        }
      } else {
        setNotifications(SEED_NOTIFICATIONS);
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      }
    } catch {
      setNotifications(SEED_NOTIFICATIONS);
    }

    const handleSettingsChange = (e: any) => {
      const newSettings = e.detail || getSettings();
      setPreferences((prev) => ({
        ...prev,
        emailNotifications: newSettings.emailNotifications,
        pushNotifications: newSettings.pushNotifications,
        weeklyReports: newSettings.weeklyReports,
        targetEmail: newSettings.alertEmail || prev.targetEmail,
      }));
    };

    window.addEventListener(SETTINGS_CHANGED_EVENT, handleSettingsChange);
    return () => window.removeEventListener(SETTINGS_CHANGED_EVENT, handleSettingsChange);
  }, [user]);

  // Persist notifications helper
  const persistNotifications = useCallback((newNotifs: NotificationItem[]) => {
    const deduplicated = deduplicateNotifications(newNotifs);
    setNotifications(deduplicated);
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(deduplicated));
    } catch {
      // ignore
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences((prev) => {
      const merged = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_PREFERENCES_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    });
  }, []);

  // Remove toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Show Toast
  const showToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const currentSettings = getSettings();
      if (!currentSettings.pushNotifications) {
        return "";
      }

      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastItem = { ...toast, id, duration: toast.duration || 4500 };

      setToasts((prev) => [newToast, ...prev.slice(0, 2)]); // Keep max 3 toasts

      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);

      return id;
    },
    [removeToast]
  );

  // Notify analysis complete
  const notifyAnalysisComplete = useCallback(
    (data: {
      platform: string;
      url: string;
      sentiment: string;
      sentimentScore?: number;
      author?: string;
      summary?: string;
    }) => {
      const appSettings = getSettings();
      const isNegative = (data.sentiment || "").toUpperCase() === "NEGATIVE";
      const score = data.sentimentScore ?? (isNegative ? 82 : 20);
      const isCrisis = isNegative && score >= (appSettings.crisisAlertThreshold || 75);

      const title = isCrisis
        ? `PR Alert: Crisis Spike on ${data.platform}`
        : "Analysis complete";
      const message = `${data.platform} post by ${data.author || "creator"} was analyzed.`;
      const notifType: NotificationType = isCrisis ? "warning" : "info";

      const targetLink = `/posts-analysis?viewPost=${encodeURIComponent(data.url)}`;

      const uniqueId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const notifItem: NotificationItem = {
        id: uniqueId,
        type: notifType,
        title,
        message: data.summary || message,
        timestamp: new Date().toISOString(),
        read: false,
        link: targetLink,
        meta: {
          platform: data.platform,
          sentiment: data.sentiment,
          author: data.author,
          url: data.url,
        },
      };

      setNotifications((prev) => {
        const next = deduplicateNotifications([notifItem, ...prev]);
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      showToast({
        type: "info",
        title: "Analysis complete",
        message: `${data.platform} post analyzed (${data.sentiment.toLowerCase()} sentiment).`,
        link: targetLink,
      });
    },
    [showToast]
  );

  // General event notification
  const notifyEvent = useCallback(
    (event: {
      title: string;
      message: string;
      type?: NotificationType;
      link?: string;
      dispatchChannels?: boolean;
      meta?: NotificationItem["meta"];
    }) => {
      const type = event.type || "info";

      const uniqueId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const notifItem: NotificationItem = {
        id: uniqueId,
        type,
        title: event.title,
        message: event.message,
        timestamp: new Date().toISOString(),
        read: false,
        link: event.link,
        meta: event.meta,
      };

      setNotifications((prev) => {
        const next = deduplicateNotifications([notifItem, ...prev]);
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      showToast({
        type,
        title: event.title,
        message: event.message,
      });
    },
    [showToast]
  );

  // Mark single as read
  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    []
  );

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Delete single notification
  const deleteNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    []
  );

  // Clear all
  const clearAllNotifications = useCallback(() => {
    persistNotifications([]);
  }, [persistNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        preferences,
        showToast,
        removeToast,
        notifyAnalysisComplete,
        notifyEvent,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
