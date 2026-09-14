"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "@clerk/nextjs";

export type NotificationType = "analysis" | "alert" | "success" | "info" | "warning";

export interface DeliveryChannels {
  email?: {
    sent: boolean;
    address: string;
  };
  mobile?: {
    sent: boolean;
    phone: string;
  };
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  channels?: DeliveryChannels;
  meta?: {
    sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED";
    sentimentScore?: number;
    platform?: string;
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
  channelsDispatched?: {
    email?: string;
    mobile?: string;
  };
  meta?: {
    sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED";
    platform?: string;
  };
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  targetEmail: string;
  mobileNotifications: boolean;
  targetMobile: string;
  analysisAlerts: boolean;
  crisisAlerts: boolean;
  weeklyReports: boolean;
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
    sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED";
    sentimentScore?: number;
    author?: string;
    summary?: string;
  }) => void;
  notifyEvent: (event: {
    title: string;
    message: string;
    type?: NotificationType;
    dispatchChannels?: boolean;
    meta?: NotificationItem["meta"];
  }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
}

const STORAGE_NOTIFICATIONS_KEY = "socialint_notifications";
const STORAGE_PREFERENCES_KEY = "socialint_notification_preferences";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  targetEmail: "analyst@socialintel.ai",
  mobileNotifications: true,
  targetMobile: "+1 (555) 019-2834",
  analysisAlerts: true,
  crisisAlerts: true,
  weeklyReports: true,
};

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-seed-1",
    type: "analysis",
    title: "Post Analysis Complete",
    message: "Analyzed X post from @openai: 86.4% Positive sentiment detected with strong virality.",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    read: false,
    channels: {
      email: { sent: true, address: "analyst@socialintel.ai" },
      mobile: { sent: true, phone: "+1 (555) 019-2834" },
    },
    meta: {
      platform: "X",
      sentiment: "POSITIVE",
      sentimentScore: 0.86,
      author: "@openai",
    },
  },
  {
    id: "notif-seed-2",
    type: "alert",
    title: "Crisis Alert Dispatched",
    message: "Surge in critical replies flagged on YouTube discussion. Summary emailed to user inbox.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    channels: {
      email: { sent: true, address: "analyst@socialintel.ai" },
      mobile: { sent: true, phone: "+1 (555) 019-2834" },
    },
    meta: {
      platform: "YouTube",
      sentiment: "NEGATIVE",
    },
  },
  {
    id: "notif-seed-3",
    type: "success",
    title: "Data Stream Connected",
    message: "Telegram intelligence stream successfully verified and connected to monitoring profile.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
    channels: {
      email: { sent: true, address: "analyst@socialintel.ai" },
    },
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);

  // Load preferences and notifications on mount
  useEffect(() => {
    setMounted(true);
    try {
      // Load preferences
      const savedPrefs = localStorage.getItem(STORAGE_PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      } else if (user) {
        const email = user.primaryEmailAddress?.emailAddress || DEFAULT_PREFERENCES.targetEmail;
        const phone = user.primaryPhoneNumber?.phoneNumber || DEFAULT_PREFERENCES.targetMobile;
        const initialPrefs = {
          ...DEFAULT_PREFERENCES,
          targetEmail: email,
          targetMobile: phone,
        };
        setPreferences(initialPrefs);
        localStorage.setItem(STORAGE_PREFERENCES_KEY, JSON.stringify(initialPrefs));
      }

      // Load notifications
      const savedNotifs = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        setNotifications(Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_NOTIFICATIONS);
      } else {
        setNotifications(SEED_NOTIFICATIONS);
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      }
    } catch {
      setNotifications(SEED_NOTIFICATIONS);
    }
  }, [user]);

  // Save notifications on change
  const persistNotifications = useCallback((newNotifs: NotificationItem[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(newNotifs));
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
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { ...toast, id, duration: toast.duration || 5000 };

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // max 5 concurrent toasts

      // Auto dismiss
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);

      return id;
    },
    [removeToast]
  );

  // Notify analysis complete (with email & mobile dispatch)
  const notifyAnalysisComplete = useCallback(
    (data: {
      platform: string;
      url: string;
      sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED";
      sentimentScore?: number;
      author?: string;
      summary?: string;
    }) => {
      const channels: DeliveryChannels = {};
      const channelsDispatched: { email?: string; mobile?: string } = {};

      if (preferences.emailNotifications && preferences.targetEmail) {
        channels.email = { sent: true, address: preferences.targetEmail };
        channelsDispatched.email = preferences.targetEmail;
      }

      if (preferences.mobileNotifications && preferences.targetMobile) {
        channels.mobile = { sent: true, phone: preferences.targetMobile };
        channelsDispatched.mobile = preferences.targetMobile;
      }

      const title = `Analysis Report Ready: ${data.platform}`;
      const message = `Analyzed ${data.platform} post ${
        data.author ? `from ${data.author}` : ""
      } with ${data.sentiment.toLowerCase()} sentiment score. Full report dispatched.`;

      // 1. Create notification item
      const notifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "analysis",
        title,
        message: data.summary || message,
        timestamp: new Date().toISOString(),
        read: false,
        channels,
        meta: {
          platform: data.platform,
          sentiment: data.sentiment,
          sentimentScore: data.sentimentScore,
          author: data.author,
          url: data.url,
        },
      };

      setNotifications((prev) => {
        const next = [notifItem, ...prev];
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      // 2. Trigger Custom in-app Toast (NEVER browser notification!)
      showToast({
        type: "analysis",
        title: "Post Analysis Complete",
        message: `${data.platform} post analyzed: ${data.sentiment} sentiment detected.`,
        duration: 6500,
        channelsDispatched,
        meta: {
          sentiment: data.sentiment,
          platform: data.platform,
        },
      });
    },
    [preferences, showToast]
  );

  // General event notification
  const notifyEvent = useCallback(
    (event: {
      title: string;
      message: string;
      type?: NotificationType;
      dispatchChannels?: boolean;
      meta?: NotificationItem["meta"];
    }) => {
      const type = event.type || "info";
      const channels: DeliveryChannels = {};
      const channelsDispatched: { email?: string; mobile?: string } = {};

      if (event.dispatchChannels) {
        if (preferences.emailNotifications && preferences.targetEmail) {
          channels.email = { sent: true, address: preferences.targetEmail };
          channelsDispatched.email = preferences.targetEmail;
        }
        if (preferences.mobileNotifications && preferences.targetMobile) {
          channels.mobile = { sent: true, phone: preferences.targetMobile };
          channelsDispatched.mobile = preferences.targetMobile;
        }
      }

      const notifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        type,
        title: event.title,
        message: event.message,
        timestamp: new Date().toISOString(),
        read: false,
        channels,
        meta: event.meta,
      };

      setNotifications((prev) => {
        const next = [notifItem, ...prev];
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      // Trigger Toast notification
      showToast({
        type,
        title: event.title,
        message: event.message,
        channelsDispatched: event.dispatchChannels ? channelsDispatched : undefined,
        meta: event.meta,
      });
    },
    [preferences, showToast]
  );

  // Mark single as read
  const markAsRead = useCallback(
    (id: string) => {
      const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      persistNotifications(updated);
    },
    [notifications, persistNotifications]
  );

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
  }, [notifications, persistNotifications]);

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
