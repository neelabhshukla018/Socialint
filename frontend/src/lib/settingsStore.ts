"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getDataSources, getActiveProfile, getAllProfiles } from "./monitoringStore";

export type AppearanceMode = "DARK" | "LIGHT" | "SYSTEM";
export type StreamingMode = "realtime" | "batch" | "manual";
export type AiModelMode = "gemini-2.5-flash" | "gemini-1.5-pro" | "claude-3-5-sonnet" | "gpt-4o";
export type SentimentSensitivity = "high" | "standard" | "conservative";

export interface AppSettings {
  // Workspace Info
  workspaceName: string;
  workspaceDescription: string;
  industry: string;

  // Monitoring & Automation
  automaticMonitoring: boolean;
  refreshInterval: string; // "1" | "5" | "15" | "30" | "60"
  streamingMode: StreamingMode;
  autoAnalyzeNewPosts: boolean;

  // AI & Intelligence
  defaultAiModel: AiModelMode;
  crisisAlertThreshold: number; // e.g. 75 (%)
  autoGenerateReports: boolean;
  sentimentSensitivity: SentimentSensitivity;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  soundAlerts: boolean;
  alertEmail?: string;

  // Appearance
  appearance: AppearanceMode;
  compactView: boolean;
}

export const SETTINGS_STORAGE_KEY = "socialint_settings_cache_v2";
export const SETTINGS_CHANGED_EVENT = "socialint:settings-changed";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  workspaceName: "Social Intelligence",
  workspaceDescription:
    "Monitor audience sentiment, emerging narratives, and influence across connected social platforms.",
  industry: "Technology & AI",

  automaticMonitoring: true,
  refreshInterval: "5",
  streamingMode: "realtime",
  autoAnalyzeNewPosts: true,

  defaultAiModel: "gemini-2.5-flash",
  crisisAlertThreshold: 75,
  autoGenerateReports: true,
  sentimentSensitivity: "standard",

  emailNotifications: true,
  pushNotifications: true,
  weeklyReports: true,
  soundAlerts: false,
  alertEmail: "",

  appearance: "LIGHT",
  compactView: false,
};

// Internal in-memory cache
let cachedSettings: AppSettings | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(SETTINGS_CHANGED_EVENT, { detail: cachedSettings })
    );
  }
}

/**
 * Read settings synchronously from memory or localStorage
 */
export function getSettings(): AppSettings {
  if (cachedSettings) return cachedSettings;
  if (typeof window === "undefined") return DEFAULT_APP_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const loaded: AppSettings = {
        ...DEFAULT_APP_SETTINGS,
        ...parsed,
      };
      cachedSettings = loaded;
      return loaded;
    }
  } catch (e) {
    console.warn("Failed reading settings from localStorage", e);
  }

  const fallback: AppSettings = { ...DEFAULT_APP_SETTINGS };
  cachedSettings = fallback;
  return fallback;
}

/**
 * Update partial settings, persist to localStorage, and broadcast to all listeners
 */
export function updateSettings(updates: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const next: AppSettings = {
    ...current,
    ...updates,
  };

  cachedSettings = next;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed writing settings to localStorage", e);
    }
  }

  notifyListeners();
  return next;
}

/**
 * Reset settings to default values
 */
export function resetSettings(): AppSettings {
  const defaults: AppSettings = { ...DEFAULT_APP_SETTINGS };
  cachedSettings = defaults;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_APP_SETTINGS)
      );
    } catch (e) {
      console.warn("Failed resetting settings", e);
    }
  }

  notifyListeners();
  return defaults;
}

/**
 * Clear local application cache and reset settings to default
 */
export function clearLocalApplicationCache() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    localStorage.removeItem("socialint_analyzed_posts_records");
    localStorage.removeItem("socialintel_reports_v5");
    localStorage.removeItem("socialint_reports_v2");
    localStorage.removeItem("socialint_recent_activities_v2");
    resetSettings();
  } catch (e) {
    console.warn("Failed clearing application cache", e);
  }
}

/**
 * Export complete workspace data package as JSON string
 */
export function generateWorkspaceExportData(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    version: "2.0.0",
    settings: getSettings(),
    activeProfile: getActiveProfile(),
    profiles: getAllProfiles(),
    dataSources: getDataSources(),
    analyzedPosts: (function () {
      if (typeof window === "undefined") return [];
      try {
        const raw = localStorage.getItem("socialint_analyzed_posts_records");
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })(),
    reports: (function () {
      if (typeof window === "undefined") return [];
      try {
        const raw = localStorage.getItem("socialintel_reports_v5") || localStorage.getItem("socialint_reports_v2");
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })(),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Subscribe helper for useSyncExternalStore
 */
function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleCustomEvent = () => callback();
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === SETTINGS_STORAGE_KEY) {
      cachedSettings = null; // force reload from storage
      callback();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener(SETTINGS_CHANGED_EVENT, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener(SETTINGS_CHANGED_EVENT, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

/**
 * React Hook for consuming settings with instant cross-component reactivity
 */
export function useSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    getSettings,
    () => DEFAULT_APP_SETTINGS
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const setSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    updateSettings({ [key]: value });
  };

  return {
    settings: mounted ? settings : DEFAULT_APP_SETTINGS,
    setSetting,
    updateSettings,
    resetSettings,
    isLoaded: mounted,
  };
}
