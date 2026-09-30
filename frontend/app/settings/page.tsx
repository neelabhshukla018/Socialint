"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bell,
  Bot,
  Check,
  ChevronRight,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  LogOut,
  Monitor,
  Moon,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  User,
  Zap,
} from "lucide-react";

import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useNotifications } from "../context/NotificationContext";
import { API_URL } from "@/src/lib/api";
import PlatformPngIcon from "../components/PlatformPngIcon";
import {
  useSettings,
  updateSettings as persistSettings,
  resetSettings as restoreDefaultSettings,
  generateWorkspaceExportData,
  clearLocalApplicationCache,
  type AppSettings,
  type AppearanceMode,
  type AiModelMode,
  type SentimentSensitivity,
  type StreamingMode,
} from "@/src/lib/settingsStore";
import {
  getDataSources,
  toggleDataSourceStatus,
  deleteDataSource,
  type DataSourceItem,
  getActiveProfile,
} from "@/src/lib/monitoringStore";

type SettingsTab =
  | "profile"
  | "monitoring"
  | "ai"
  | "notifications"
  | "appearance"
  | "security";

const INDUSTRY_OPTIONS = [
  "Technology & AI",
  "Consumer Brands & E-commerce",
  "Finance, Crypto & Fintech",
  "Media, Entertainment & Gaming",
  "Healthcare & Pharmaceuticals",
  "Public Relations & Marketing Agency",
  "Public Sector & Government",
  "Hospitality & Travel",
];

const AI_MODELS: {
  id: AiModelMode;
  name: string;
  provider: string;
  badge: string;
  description: string;
  speed: string;
}[] = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google DeepMind",
    badge: "Recommended",
    description:
      "Ultra-low latency streaming inference. Optimized for real-time social sentiment extraction and high-volume feeds.",
    speed: "Sub-400ms",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google DeepMind",
    badge: "Deep Reasoning",
    description:
      "2M token context window with comprehensive PR narrative graphs and multi-entity crisis cross-examination.",
    speed: "~1.2s",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    badge: "Executive Tone",
    description:
      "Nuanced linguistic analysis, high-fidelity corporate brand protection, and crisis escalation playbooks.",
    speed: "~900ms",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    badge: "Multimodal Omni",
    description:
      "High-throughput cross-lingual analysis and rapid pattern matching across multimodal social content.",
    speed: "~750ms",
  },
];

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const { updatePreferences, notifyEvent } = useNotifications();
  const { settings, updateSettings, resetSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Local draft state for inputs that user can edit before saving
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [dataSources, setDataSourcesState] = useState<DataSourceItem[]>([]);
  const [activeProfileName, setActiveProfileName] = useState("Brand Entity");

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync draft whenever global settings change
  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  // Load real data sources and active profile on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sources = getDataSources();
      setDataSourcesState(sources);
      const prof = getActiveProfile();
      if (prof?.name) setActiveProfileName(prof.name);
    }
  }, []);

  // Sync email from Clerk if alertEmail is empty
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && !draft.alertEmail) {
      setDraft((prev) => ({
        ...prev,
        alertEmail: user.primaryEmailAddress!.emailAddress,
      }));
    }
  }, [user]);

  // Update draft field helper
  const updateDraft = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
    setError("");
  };

  // Direct toggle with instant global activation (for critical toggles)
  const toggleImmediate = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
    toastTitle?: string,
    toastMsg?: string
  ) => {
    updateDraft(key, value);
    updateSettings({ [key]: value });

    if (toastTitle && toastMsg) {
      notifyEvent({
        title: toastTitle,
        message: toastMsg,
        type: value ? "success" : "info",
        link: "/settings",
      });
    }
  };

  // Save changes handler (persists locally and syncs to backend API)
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Immediately commit all changes to reactive settingsStore
      updateSettings(draft);

      // 2. Sync notification context preferences
      updatePreferences({
        emailNotifications: draft.emailNotifications,
        pushNotifications: draft.pushNotifications,
        weeklyReports: draft.weeklyReports,
      });

      // 3. Sync supported fields to backend DB if logged in
      if (authLoaded && isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await fetch(`${API_URL}/api/settings`, {
              method: "PATCH",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                appearance: draft.appearance,
                emailNotifications: draft.emailNotifications,
                pushNotifications: draft.pushNotifications,
                weeklyReports: draft.weeklyReports,
              }),
            });
          }
        } catch (apiErr) {
          console.warn("Backend settings sync notice:", apiErr);
        }
      }

      setSaved(true);
      notifyEvent({
        title: "Settings Applied",
        message: `Workspace "${draft.workspaceName}" preferences and monitoring rules are now live.`,
        type: "success",
        link: "/settings",
      });

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Unable to save settings:", err);
      setError(
        err instanceof Error ? err.message : "Unable to save workspace settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset settings handler
  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all SocialInt workspace settings to their default configuration?"
    );
    if (!confirmed) return;

    resetSettings();
    notifyEvent({
      title: "Settings Reset",
      message: "All workspace parameters restored to default values.",
      type: "info",
      link: "/settings",
    });
  };

  // Export full workspace JSON
  const handleExportWorkspace = () => {
    try {
      const dataStr = generateWorkspaceExportData();
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `socialint-workspace-${draft.workspaceName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);

      notifyEvent({
        title: "Workspace Exported",
        message: "Full JSON archive of profiles, sources, and settings downloaded.",
        type: "success",
      });
    } catch (err) {
      console.error("Export failed:", err);
      setError("Failed to generate workspace export archive.");
    }
  };

  // Clear application cache
  const handleClearCache = () => {
    const confirmed = window.confirm(
      "Clear all cached reports, posts, and offline data? This will restore clean local state without affecting your cloud account."
    );
    if (!confirmed) return;

    clearLocalApplicationCache();
    window.location.reload();
  };

  // Toggle single source status
  const handleToggleSource = (id: string | number) => {
    const updated = toggleDataSourceStatus(id);
    setDataSourcesState([...updated]);
    const item = updated.find((s) => String(s.id) === String(id));
    notifyEvent({
      title: item?.status === "active" ? "Feed Resumed" : "Feed Paused",
      message: `${item?.name || "Data source"} monitoring has been ${item?.status === "active" ? "activated" : "paused"}.`,
      type: item?.status === "active" ? "success" : "info",
      link: "/data-sources",
    });
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut({ redirectUrl: "/" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#080b12] bg-grid-dashboard text-zinc-900 dark:text-zinc-100 selection:bg-[#457B9D]/30 transition-colors duration-200">
      {/* Ambient Dark Mode Radial Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#457B9D]/5 dark:bg-[#457B9D]/12 blur-[140px] rounded-full" />
        <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="lg:ml-[270px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <div className="px-4 py-5 sm:px-8 sm:py-8 max-w-6xl mx-auto overflow-x-hidden">
          <div className="space-y-6 sm:space-y-8">
            {/* HEADER */}
            <section className="mb-6 sm:mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-2 sm:mb-3 flex items-center justify-center sm:justify-start gap-2">
                <SettingsIcon size={15} className="text-[#457B9D] dark:text-[#7bb5d4]" />
                <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#457B9D] dark:text-[#7bb5d4]">
                  System Control Center
                </span>
              
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                <div>
                  <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl tracking-tight text-zinc-950 dark:text-white text-center sm:text-left">
                    Settings & Controls
                  </h1>
                  <p className="mt-1.5 sm:mt-2.5 max-w-2xl text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 text-center sm:text-left mx-auto sm:mx-0">
                    Fine-tune workspace identity, background monitoring cadence, AI crisis thresholds, and notification routing across the full application.
                  </p>
                </div>

                {/* Quick Save Pill Button */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="shrink-0 flex items-center justify-center gap-2 rounded-xl border border-[#457B9D] bg-[#457B9D] dark:bg-[#457B9D] dark:hover:bg-[#528dae] hover:bg-[#386480] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#457B9D]/20 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saved ? (
                    <>
                      <Check size={14} strokeWidth={3} />
                      <span>Saved Live</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* ERROR NOTICE */}
            {error && (
              <div className="mb-6 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-300 flex items-center gap-3">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* MAIN 2-COLUMN LAYOUT */}
            <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
              {/* SIDEBAR TABS */}
              <aside className="h-fit rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 bg-white/90 dark:bg-[#0d121f]/90 backdrop-blur-md p-1.5 sm:p-2.5 shadow-xs flex flex-row overflow-x-auto lg:flex-col scrollbar-none gap-1">
                <SettingsNav
                  icon={User}
                  label="Workspace & Profile"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
                <SettingsNav
                  icon={Database}
                  label="Data & Monitoring"
                  active={activeTab === "monitoring"}
                  onClick={() => setActiveTab("monitoring")}
                  badge={
                    draft.automaticMonitoring ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-amber-500 ml-auto" />
                    )
                  }
                />
                <SettingsNav
                  icon={Sparkles}
                  label="AI & Crisis Intelligence"
                  active={activeTab === "ai"}
                  onClick={() => setActiveTab("ai")}
                />
                <SettingsNav
                  icon={Bell}
                  label="Notifications"
                  active={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                />
                <SettingsNav
                  icon={Monitor}
                  label="Appearance"
                  active={activeTab === "appearance"}
                  onClick={() => setActiveTab("appearance")}
                />
                <SettingsNav
                  icon={Shield}
                  label="Privacy & Security"
                  active={activeTab === "security"}
                  onClick={() => setActiveTab("security")}
                />

                <div className="hidden lg:block my-2 border-t border-zinc-200 dark:border-zinc-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex shrink-0 w-auto lg:w-full items-center gap-2 sm:gap-3 rounded-xl px-3 py-2 sm:py-2.5 text-left text-xs sm:text-sm text-rose-600 dark:text-rose-400 transition hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-300 font-medium whitespace-nowrap"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </aside>

              {/* CONTENT AREA */}
              <div className="space-y-6">
                {/* ================================================== */}
                {/* 1. PROFILE & WORKSPACE TAB                         */}
                {/* ================================================== */}
                {activeTab === "profile" && (
                  <SettingsSection
                    icon={User}
                    title="Workspace & Profile"
                    description="Configure your workspace branding, identity, and target industry sector."
                  >
                    {/* Live Workspace Preview Card */}
                    <div className="mb-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-[#0d1322] dark:via-[#11192e] dark:to-[#0d1322] p-5 shadow-xs">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
                          Live Workspace Identity Preview
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#457B9D]/15 dark:bg-[#457B9D]/25 text-[#457B9D] dark:text-[#7bb5d4] border border-[#457B9D]/30 dark:border-[#457B9D]/40">
                          <Activity size={12} />
                          Active Workspace
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#457B9D]/10 dark:bg-[#457B9D]/20 border border-[#457B9D]/20 dark:border-[#457B9D]/40 text-[#457B9D] dark:text-[#7bb5d4]">
                          {user?.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-display text-xl font-bold">
                              {draft.workspaceName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-white truncate">
                              {draft.workspaceName || "Untitled Workspace"}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-200 dark:bg-[#18233c] text-zinc-700 dark:text-zinc-300 border border-transparent dark:border-zinc-700/60">
                              {draft.industry}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                            {draft.workspaceDescription}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
                            <span>Operator: {user?.fullName || user?.username || "Authenticated Lead"}</span>
                            <span>•</span>
                            <span>Entity: {activeProfileName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <InputField
                        label="Workspace Name"
                        value={draft.workspaceName}
                        placeholder="e.g. Social Intelligence"
                        onChange={(value) => updateDraft("workspaceName", value)}
                      />

                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Industry Sector
                        </label>
                        <select
                          value={draft.industry}
                          onChange={(e) => updateDraft("industry", e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#101726] px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-[#457B9D] dark:focus:border-[#64b5f6] focus:ring-2 focus:ring-[#457B9D]/20 dark:focus:ring-[#457B9D]/30 shadow-xs"
                        >
                          {INDUSTRY_OPTIONS.map((opt) => (
                            <option
                              key={opt}
                              value={opt}
                              className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100"
                            >
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Workspace Mission & Description
                      </label>
                      <textarea
                        value={draft.workspaceDescription}
                        onChange={(e) =>
                          updateDraft("workspaceDescription", e.target.value)
                        }
                        rows={3}
                        className="w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#101726] px-4 py-3 text-sm leading-6 text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-[#457B9D] dark:focus:border-[#64b5f6] focus:ring-2 focus:ring-[#457B9D]/20 dark:focus:ring-[#457B9D]/30 shadow-xs"
                      />
                    </div>
                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* 2. DATA & MONITORING TAB                           */}
                {/* ================================================== */}
                {activeTab === "monitoring" && (
                  <SettingsSection
                    icon={Database}
                    title="Data & Monitoring"
                    description="Govern automated social ingestion, refresh cadence, and active data streams."
                  >
                    {/* Master Switch */}
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-zinc-50/80 dark:bg-gradient-to-r dark:from-[#0d1527] dark:via-[#10192e] dark:to-[#0d1527] p-5 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                              Master Automatic Monitoring
                            </h3>
                            {draft.automaticMonitoring ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/40">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                LIVE INGESTION ACTIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/15 dark:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 dark:border-amber-500/40">
                                DATA COLLECTION PAUSED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                            When enabled, SocialInt polls connected platforms every{" "}
                            <strong className="text-zinc-900 dark:text-white">
                              {draft.refreshInterval} minutes
                            </strong>
                            . Disabling this puts data ingestion on standby across the entire dashboard, PR command center, and sidebar.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleImmediate(
                              "automaticMonitoring",
                              !draft.automaticMonitoring,
                              !draft.automaticMonitoring
                                ? "Monitoring Resumed"
                                : "Monitoring Paused",
                              !draft.automaticMonitoring
                                ? "Automatic social ingestion is now active across all feeds."
                                : "Data collection has been suspended across the workspace."
                            )
                          }
                          className={`shrink-0 relative h-7 w-13 rounded-full transition-colors p-1 ${
                            draft.automaticMonitoring
                              ? "bg-emerald-600 dark:bg-emerald-500"
                              : "bg-zinc-300 dark:bg-zinc-700"
                          }`}
                        >
                          <span
                            className={`block h-5 w-5 rounded-full bg-white transition-transform shadow-xs ${
                              draft.automaticMonitoring ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Cadence & Processing Rules */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/90 pb-5">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            Ingestion Refresh Interval
                          </p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            How frequently background workers scrape and pull new social comments.
                          </p>
                        </div>

                        <select
                          value={draft.refreshInterval}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft("refreshInterval", val);
                            updateSettings({ refreshInterval: val });
                          }}
                          className="rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#101726] px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#457B9D] dark:focus:border-[#64b5f6] shadow-xs"
                        >
                          <option value="1" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">Every 1 minute (Ultra Real-Time)</option>
                          <option value="5" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">Every 5 minutes (Standard Production)</option>
                          <option value="15" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">Every 15 minutes (Balanced)</option>
                          <option value="30" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">Every 30 minutes (Hourly Batch)</option>
                          <option value="60" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">Every 60 minutes (Periodic Ingestion)</option>
                        </select>
                      </div>

                      <ToggleRow
                        title="Auto-Analyze Ingested Posts"
                        description="Automatically run NLP sentiment, entity extraction, and toxicity scoring on newly pulled items."
                        enabled={draft.autoAnalyzeNewPosts}
                        onChange={(val) => {
                          updateDraft("autoAnalyzeNewPosts", val);
                          updateSettings({ autoAnalyzeNewPosts: val });
                        }}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/90 py-5">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            Ingestion Stream Pipeline
                          </p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Choose between immediate WebSocket streaming or buffered batch ingestion.
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-[#131b2e] border border-zinc-200 dark:border-zinc-750 dark:border-zinc-700/80">
                          {(["realtime", "batch", "manual"] as StreamingMode[]).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => {
                                updateDraft("streamingMode", mode);
                                updateSettings({ streamingMode: mode });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                                draft.streamingMode === mode
                                  ? "bg-white dark:bg-[#1a2540] text-[#457B9D] dark:text-[#7bb5d4] shadow-xs"
                                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Data Sources List */}
                    <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800/90 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <span>Active Data Feeds</span>
                            <span className="rounded-full bg-[#457B9D]/15 dark:bg-[#457B9D]/25 px-2.5 py-0.5 text-xs font-mono font-bold text-[#457B9D] dark:text-[#7bb5d4]">
                              {dataSources.length}
                            </span>
                          </h3>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            Control connected feeds directly or pause individual streams.
                          </p>
                        </div>

                        <Link
                          href="/data-sources"
                          className="flex items-center gap-1.5 rounded-xl border border-[#457B9D]/30 dark:border-[#457B9D]/40 bg-[#457B9D]/10 dark:bg-[#457B9D]/20 px-3 py-1.5 text-xs font-semibold text-[#457B9D] dark:text-[#7bb5d4] transition hover:bg-[#457B9D]/20"
                        >
                          <Plus size={13} strokeWidth={2.5} />
                          <span>Add feed</span>
                        </Link>
                      </div>

                      {dataSources.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6 text-center">
                          <p className="text-xs text-zinc-500">No data feeds connected yet.</p>
                          <Link
                            href="/data-sources"
                            className="mt-2 inline-block text-xs font-semibold text-[#457B9D] dark:text-[#7bb5d4] hover:underline"
                          >
                            Connect your first platform →
                          </Link>
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {dataSources.map((ds) => {
                            const isActive = ds.status === "active";
                            return (
                              <div
                                key={ds.id}
                                className="flex items-center justify-between rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-[#101726]/80 p-3.5 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#151f35] border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs">
                                    <PlatformPngIcon platform={ds.platform} size={22} />
                                  </div>
                                  <div className="min-w-0 truncate">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                      {ds.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                      {ds.handleOrUrl || "Connected Feed"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSource(ds.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                                      isActive
                                        ? "border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                                        : "border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                                    }`}
                                  >
                                    {isActive ? "Active" : "Paused"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* 3. AI & CRISIS INTELLIGENCE TAB                   */}
                {/* ================================================== */}
                {activeTab === "ai" && (
                  <SettingsSection
                    icon={Sparkles}
                    title="AI & Crisis Intelligence"
                    description="Configure the default reasoning model, crisis escalation thresholds, and automated briefs."
                  >
                    {/* Crisis Alert Threshold */}
                    <div className="rounded-2xl border border-zinc-200 dark:border-rose-950/40 bg-zinc-50/80 dark:bg-gradient-to-r dark:from-[#190e15] dark:via-[#161221] dark:to-[#0f1424] p-5 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Flame size={18} className="text-rose-500" />
                          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                            Crisis Alert Escalation Threshold
                          </h3>
                        </div>
                        <span className="font-mono text-base font-bold text-rose-600 dark:text-rose-400 px-3 py-1 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 dark:border-rose-500/40">
                          {draft.crisisAlertThreshold}%
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                        When audience sentiment drops and negative sentiment breaches this threshold, SocialInt automatically flags a{" "}
                        <strong className="text-rose-600 dark:text-rose-400 font-semibold">
                          High-Priority PR Crisis Alert
                        </strong>{" "}
                        in your notification center and sounds executive sirens.
                      </p>

                      <div className="space-y-3">
                        <input
                          type="range"
                          min="50"
                          max="95"
                          step="5"
                          value={draft.crisisAlertThreshold}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            updateDraft("crisisAlertThreshold", val);
                            updateSettings({ crisisAlertThreshold: val });
                          }}
                          className="w-full accent-rose-600 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                        />

                        {/* Preset quick buttons */}
                        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                          <span>50% (High Alert)</span>
                          <div className="flex gap-2">
                            {[60, 75, 85, 90].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                  updateDraft("crisisAlertThreshold", preset);
                                  updateSettings({ crisisAlertThreshold: preset });
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                                  draft.crisisAlertThreshold === preset
                                    ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                                    : "bg-zinc-200 dark:bg-[#1a2338] border-transparent dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-[#222e49]"
                                }`}
                              >
                                {preset}%
                              </button>
                            ))}
                          </div>
                          <span>95% (Extreme Only)</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Engine Selection */}
                    <div className="mb-6">
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Cpu size={16} className="text-[#457B9D] dark:text-[#7bb5d4]" />
                          <span>Default Intelligence Engine</span>
                        </h3>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          Select the foundation model powering post sentiment extraction and crisis briefings.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {AI_MODELS.map((model) => {
                          const isSelected = draft.defaultAiModel === model.id;
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                updateDraft("defaultAiModel", model.id);
                                updateSettings({ defaultAiModel: model.id });
                              }}
                              className={`p-4 rounded-xl border text-left transition relative ${
                                isSelected
                                  ? "border-[#457B9D] dark:border-[#64b5f6] bg-[#457B9D]/10 dark:bg-[#457B9D]/20 ring-1 ring-[#457B9D] dark:ring-[#64b5f6] shadow-sm shadow-[#457B9D]/15"
                                  : "border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#101726]/70 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-[#151f33]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                                  {model.name}
                                </span>
                                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#19243c] text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                                  {model.speed}
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-[#457B9D] dark:text-[#7bb5d4] mb-2 font-medium">
                                {model.provider} • {model.badge}
                              </p>
                              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                {model.description}
                              </p>
                              {isSelected && (
                                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#457B9D] dark:bg-[#5297bf] text-white">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Automation Rules */}
                    <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/90 pt-5">
                      <ToggleRow
                        title="Auto-Generate Intelligence Reports"
                        description="Automatically compile an executive intelligence report in the Reports Center whenever a post analysis detects viral engagement or crisis sentiment."
                        enabled={draft.autoGenerateReports}
                        onChange={(val) => {
                          updateDraft("autoGenerateReports", val);
                          updateSettings({ autoGenerateReports: val });
                        }}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/90 py-5">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            Sentiment Sensitivity Calibration
                          </p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Adjust how aggressively subtle sarcasm and negative sentiment are flagged.
                          </p>
                        </div>

                        <select
                          value={draft.sentimentSensitivity}
                          onChange={(e) => {
                            const val = e.target.value as SentimentSensitivity;
                            updateDraft("sentimentSensitivity", val);
                            updateSettings({ sentimentSensitivity: val });
                          }}
                          className="rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#101726] px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#457B9D] dark:focus:border-[#64b5f6] shadow-xs"
                        >
                          <option value="standard" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">Standard (Balanced calibration)</option>
                          <option value="high" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">High Sensitivity (Early threat detection)</option>
                          <option value="conservative" className="bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100">Conservative (High confidence only)</option>
                        </select>
                      </div>
                    </div>
                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* 4. NOTIFICATIONS TAB                               */}
                {/* ================================================== */}
                {activeTab === "notifications" && (
                  <SettingsSection
                    icon={Bell}
                    title="Notifications & Routing"
                    description="Configure how and where sentiment spikes and crisis events are delivered."
                  >
                    <div className="space-y-1">
                      <ToggleRow
                        title="In-App Push Toasts"
                        description="Display interactive notification toasts in the top-right corner when analyses complete or alerts trigger."
                        enabled={draft.pushNotifications}
                        onChange={(val) => {
                          updateDraft("pushNotifications", val);
                          updateSettings({ pushNotifications: val });
                          updatePreferences({ pushNotifications: val });
                        }}
                      />

                      <ToggleRow
                        title="Email Incident Alerts"
                        description="Dispatch emergency email notifications when negative sentiment breaches your crisis threshold."
                        enabled={draft.emailNotifications}
                        onChange={(val) => {
                          updateDraft("emailNotifications", val);
                          updateSettings({ emailNotifications: val });
                          updatePreferences({ emailNotifications: val });
                        }}
                      />

                      <ToggleRow
                        title="Weekly Executive Digest"
                        description="Receive a weekly compiled intelligence report covering brand health and trending conversations."
                        enabled={draft.weeklyReports}
                        onChange={(val) => {
                          updateDraft("weeklyReports", val);
                          updateSettings({ weeklyReports: val });
                          updatePreferences({ weeklyReports: val });
                        }}
                      />

                      <div className="border-t border-zinc-100 dark:border-zinc-800/90 pt-5 mt-4">
                        <InputField
                          label="Alert Delivery Email Address"
                          value={draft.alertEmail || ""}
                          placeholder="e.g. pr-team@company.com"
                          onChange={(val) => {
                            updateDraft("alertEmail", val);
                            updateSettings({ alertEmail: val });
                          }}
                        />
                      </div>
                    </div>
                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* 5. APPEARANCE TAB                                  */}
                {/* ================================================== */}
                {activeTab === "appearance" && (
                  <SettingsSection
                    icon={Monitor}
                    title="Appearance & Theme"
                    description="Personalize the visual theme, command center contrast, and workspace density."
                  >
                    <div className="grid gap-4 sm:grid-cols-3">
                      <AppearanceCard
                        type="dark"
                        title="Dark Mode"
                        description="Deep obsidian interface tailored for PR command centers"
                        icon={Moon}
                        selected={draft.appearance === "DARK"}
                        onClick={() => {
                          updateDraft("appearance", "DARK");
                          updateSettings({ appearance: "DARK" });
                          setTheme("DARK");
                        }}
                      />

                      <AppearanceCard
                        type="system"
                        title="System Default"
                        description="Automatically matches your operating system theme"
                        icon={Monitor}
                        selected={draft.appearance === "SYSTEM"}
                        onClick={() => {
                          updateDraft("appearance", "SYSTEM");
                          updateSettings({ appearance: "SYSTEM" });
                          setTheme("SYSTEM");
                        }}
                      />

                      <AppearanceCard
                        type="light"
                        title="Light Mode"
                        description="Bright, high-clarity interface for executive reporting"
                        icon={Sun}
                        selected={draft.appearance === "LIGHT"}
                        onClick={() => {
                          updateDraft("appearance", "LIGHT");
                          updateSettings({ appearance: "LIGHT" });
                          setTheme("LIGHT");
                        }}
                      />
                    </div>
                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* 6. PRIVACY & DATA MANAGEMENT                       */}
                {/* ================================================== */}
                {activeTab === "security" && (
                  <SettingsSection
                    icon={Shield}
                    title="Privacy & Data Management"
                    description="Export your intelligence archives, inspect cryptographic auth, and manage cached data."
                  >
                    <div className="space-y-4 mb-6">
                      <SecurityRow
                        title="Cryptographic Authentication"
                        description="Your session is secured with RSA-256 JWT tokens verified against Clerk OAuth."
                        badge="Protected"
                      />

                      <SecurityRow
                        title="Multi-Tenant Data Isolation"
                        description="All monitoring profiles, scraped posts, and sentiment telemetry are strictly segregated."
                        badge="Encrypted"
                      />
                    </div>

                    {/* Export Workspace Card */}
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-zinc-50/80 dark:bg-gradient-to-r dark:from-[#0d1527] dark:via-[#111c33] dark:to-[#0d1527] p-5 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
                            <Download size={16} className="text-[#457B9D] dark:text-[#7bb5d4]" />
                            <span>Export Full Workspace Archive</span>
                          </h3>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                            Generate and download a complete JSON backup containing all profiles, connected data feeds, analyzed posts, sentiment scores, and system configuration.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleExportWorkspace}
                          className="shrink-0 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#16223d] hover:dark:bg-[#1c2b4d] px-4 py-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 shadow-xs transition hover:bg-zinc-50"
                        >
                          {downloadSuccess ? (
                            <>
                              <Check size={14} className="text-emerald-500" />
                              <span>Downloaded!</span>
                            </>
                          ) : (
                            <>
                              <Download size={14} />
                              <span>Export JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Maintenance Actions */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800/90 pt-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            Clear Application Cache
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            Clear locally cached reports and temporary telemetry without affecting server data.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleClearCache}
                          className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#16223d] transition"
                        >
                          <Trash2 size={14} />
                          <span>Clear Local Cache</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/90">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            Sign out of SocialInt
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            End your current session across this browser.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
                        >
                          <LogOut size={14} />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  </SettingsSection>
                )}

                {/* BOTTOM SAVE / RESET BAR */}
                <div className="flex flex-col justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800/90 pt-6 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    <span>Reset All to Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#457B9D] bg-[#457B9D] dark:bg-[#457B9D] dark:hover:bg-[#528dae] hover:bg-[#386480] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#457B9D]/20 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : saved ? (
                      <>
                        <Check size={16} strokeWidth={3} />
                        <span>Saved Live</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Workspace Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================================================== */
/* SUBCOMPONENTS                                      */
/* ================================================== */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 bg-white/90 dark:bg-[#0d121f]/90 backdrop-blur-md p-5 sm:p-7 shadow-xs transition-colors">
      <div className="mb-6 flex items-start gap-3.5 border-b border-zinc-100 dark:border-zinc-800/90 pb-5">
        <div className="rounded-xl border border-[#457B9D]/20 dark:border-[#457B9D]/30 bg-[#457B9D]/10 dark:bg-[#457B9D]/20 p-2.5 text-[#457B9D] dark:text-[#7bb5d4]">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function SettingsNav({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-auto lg:w-full shrink-0 whitespace-nowrap items-center gap-2.5 sm:gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm transition font-medium ${
        active
          ? "bg-[#457B9D] text-white shadow-md shadow-[#457B9D]/20"
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#131b2e] hover:text-zinc-900 dark:hover:text-white"
      }`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate">{label}</span>
      {badge}
    </button>
  );
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#101726] px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition focus:border-[#457B9D] dark:focus:border-[#64b5f6] focus:ring-2 focus:ring-[#457B9D]/20 dark:focus:ring-[#457B9D]/30 shadow-xs"
      />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-zinc-100 dark:border-zinc-800/90 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
          {title}
        </p>
        <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          enabled ? "bg-[#457B9D] dark:bg-[#3d7294]" : "bg-zinc-300 dark:bg-zinc-700/80"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-xs ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function AppearanceCard({
  type,
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}: {
  type: "dark" | "system" | "light";
  title: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border p-4 text-left transition group ${
        selected
          ? "border-[#457B9D] dark:border-[#64b5f6] bg-[#457B9D]/10 dark:bg-[#457B9D]/20 ring-1 ring-[#457B9D] dark:ring-[#64b5f6] shadow-sm shadow-[#457B9D]/15"
          : "border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#101726]/70 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-[#151f33]"
      }`}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#457B9D] dark:bg-[#5297bf] text-white shadow-xs z-10">
          <Check size={12} strokeWidth={3} />
        </div>
      )}

      {/* Mini Mockup Visual Preview */}
      <div
        className={`mb-4 h-20 rounded-lg border overflow-hidden p-2 flex flex-col justify-between transition ${
          type === "dark"
            ? "bg-[#080b12] border-zinc-800"
            : type === "light"
            ? "bg-slate-50 border-zinc-200"
            : "bg-gradient-to-tr from-[#080b12] via-[#0e1629] to-slate-100 border-zinc-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                type === "dark" ? "bg-[#457B9D]" : type === "light" ? "bg-sky-500" : "bg-indigo-400"
              }`}
            />
            <div
              className={`h-1.5 w-12 rounded ${
                type === "dark" ? "bg-zinc-800" : type === "light" ? "bg-zinc-300" : "bg-zinc-700"
              }`}
            />
          </div>
          <Icon
            size={14}
            className={
              type === "dark"
                ? "text-zinc-500"
                : type === "light"
                ? "text-zinc-400"
                : "text-zinc-400"
            }
          />
        </div>

        <div className="space-y-1">
          <div
            className={`h-1.5 w-full rounded ${
              type === "dark" ? "bg-zinc-800/80" : type === "light" ? "bg-zinc-200" : "bg-zinc-700/80"
            }`}
          />
          <div
            className={`h-1.5 w-2/3 rounded ${
              type === "dark" ? "bg-[#457B9D]/30" : type === "light" ? "bg-sky-200" : "bg-indigo-900/60"
            }`}
          />
        </div>
      </div>

      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
        {title}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </button>
  );
}

function SecurityRow({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-[#101726]/80 p-4 transition-colors">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-zinc-100 dark:bg-[#151f35] border border-transparent dark:border-zinc-700/60 p-2 text-zinc-600 dark:text-[#7bb5d4]">
          <Shield size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-full border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[10px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
        {badge}
      </span>
    </div>
  );
}