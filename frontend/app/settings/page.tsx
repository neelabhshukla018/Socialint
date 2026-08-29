"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Database,
  LogOut,
  Monitor,
  Moon,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  Shield,
  Sun,
  User,
} from "lucide-react";

import { useClerk, useUser } from "@clerk/nextjs";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

type SettingsTab =
  | "profile"
  | "notifications"
  | "monitoring"
  | "appearance"
  | "security";

type Appearance = "DARK" | "LIGHT" | "SYSTEM";

interface SettingsData {
  workspaceName: string;
  workspaceDescription: string;

  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;

  automaticMonitoring: boolean;
  refreshInterval: string;

  appearance: Appearance;
}

const DEFAULT_SETTINGS: SettingsData = {
  workspaceName: "Social Intelligence",

  workspaceDescription:
    "Monitor audience sentiment, emerging narratives and influence across connected social platforms.",

  emailNotifications: true,
  pushNotifications: true,
  weeklyReports: true,

  automaticMonitoring: true,
  refreshInterval: "5",

  appearance: "DARK",
};

const API_URL = "http://localhost:5000";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] =
    useState<SettingsTab>("profile");

  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /*
   * ==================================================
   * LOAD SETTINGS
   * ==================================================
   */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setError("");

        const response = await fetch(
          `${API_URL}/api/settings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": "1",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load settings."
          );
        }

        const data = result.data;

        if (data) {
          setSettings((current) => ({
            ...current,

            emailNotifications:
              data.emailNotifications ??
              current.emailNotifications,

            pushNotifications:
              data.pushNotifications ??
              current.pushNotifications,

            weeklyReports:
              data.weeklyReports ??
              current.weeklyReports,

            appearance:
              data.appearance ??
              current.appearance,
          }));
        }
      } catch (err) {
        console.error(
          "Unable to load settings:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load settings."
        );
      } finally {
        setLoaded(true);
      }
    };

    loadSettings();
  }, []);

  /*
   * ==================================================
   * UPDATE SETTING
   * ==================================================
   */

  const updateSetting = <
    K extends keyof SettingsData
  >(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
    setError("");
  };

  /*
   * ==================================================
   * SAVE SETTINGS
   * ==================================================
   */

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            "x-user-id": "1",
          },

          body: JSON.stringify({
            appearance: settings.appearance,

            emailNotifications:
              settings.emailNotifications,

            pushNotifications:
              settings.pushNotifications,

            weeklyReports:
              settings.weeklyReports,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save settings."
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Unable to save settings:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==================================================
   * RESET SETTINGS
   * ==================================================
   */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset all SocialInt settings to their default values?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      setSettings(DEFAULT_SETTINGS);

      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            "x-user-id": "1",
          },

          body: JSON.stringify({
            appearance:
              DEFAULT_SETTINGS.appearance,

            emailNotifications:
              DEFAULT_SETTINGS.emailNotifications,

            pushNotifications:
              DEFAULT_SETTINGS.pushNotifications,

            weeklyReports:
              DEFAULT_SETTINGS.weeklyReports,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to reset settings."
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Unable to reset settings:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset settings."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==================================================
   * LOGOUT
   * ==================================================
   */

  const handleLogout = async () => {
    try {
      await signOut({
        redirectUrl: "/",
      });
    } catch (err) {
      console.error(
        "Logout failed:",
        err
      );
    }
  };

  /*
   * ==================================================
   * LOADING
   * ==================================================
   */

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b12] text-white">
        <div className="text-sm text-zinc-500">
          Loading settings...
        </div>
      </div>
    );
  }

  /*
   * ==================================================
   * PAGE
   * ==================================================
   */

  return (
    <div className="min-h-screen bg-[#080b12] text-white dashboard-grid">

      <Sidebar />

      <main className="lg:ml-64">

        <DashboardHeader />

        <div className="p-5 sm:p-8">

          <div className="mx-auto max-w-6xl">

            {/* HEADER */}

            <section className="mb-8">

              <div className="mb-3 flex items-center gap-2">

                <SettingsIcon
                  size={15}
                  className="text-blue-400"
                />

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                  Configuration
                </span>

              </div>

              <h1 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
                Settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Manage your SocialInt workspace,
                monitoring, notifications,
                appearance and account.
              </p>

            </section>

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* MAIN LAYOUT */}

            <div className="grid gap-6 lg:grid-cols-[230px_1fr]">

              {/* SIDEBAR */}

              <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2">

                <SettingsNav
                  icon={User}
                  label="Profile"
                  active={
                    activeTab === "profile"
                  }
                  onClick={() =>
                    setActiveTab("profile")
                  }
                />

                <SettingsNav
                  icon={Bell}
                  label="Notifications"
                  active={
                    activeTab ===
                    "notifications"
                  }
                  onClick={() =>
                    setActiveTab(
                      "notifications"
                    )
                  }
                />

                <SettingsNav
                  icon={Database}
                  label="Data & Monitoring"
                  active={
                    activeTab === "monitoring"
                  }
                  onClick={() =>
                    setActiveTab("monitoring")
                  }
                />

                <SettingsNav
                  icon={Monitor}
                  label="Appearance"
                  active={
                    activeTab === "appearance"
                  }
                  onClick={() =>
                    setActiveTab("appearance")
                  }
                />

                <SettingsNav
                  icon={Shield}
                  label="Privacy & Security"
                  active={
                    activeTab === "security"
                  }
                  onClick={() =>
                    setActiveTab("security")
                  }
                />

                <div className="my-2 border-t border-zinc-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut size={16} />

                  <span>
                    Log out
                  </span>
                </button>

              </aside>

              {/* CONTENT */}

              <div className="space-y-6">

                {/* PART 2 GOES HERE */}
                                {/* ================================================== */}
                {/* PROFILE                                            */}
                {/* ================================================== */}

                {activeTab === "profile" && (
                  <SettingsSection
                    icon={User}
                    title="Profile"
                    description="Manage your SocialInt workspace information."
                  >
                    {/* USER INFORMATION */}

                    <div className="mb-6 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User
                            size={20}
                            className="text-zinc-400"
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {user?.fullName ||
                            user?.username ||
                            "User"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {user?.primaryEmailAddress
                            ?.emailAddress ||
                            "No email available"}
                        </p>
                      </div>
                    </div>

                    {/* WORKSPACE */}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <InputField
                        label="Workspace name"
                        value={settings.workspaceName}
                        onChange={(value) =>
                          updateSetting(
                            "workspaceName",
                            value
                          )
                        }
                      />

                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-400">
                          Workspace type
                        </label>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-400">
                          Social Intelligence
                        </div>
                      </div>
                    </div>

                    {/* DESCRIPTION */}

                    <div className="mt-5">
                      <label className="mb-2 block text-xs font-medium text-zinc-400">
                        Workspace description
                      </label>

                      <textarea
                        value={
                          settings.workspaceDescription
                        }
                        onChange={(event) =>
                          updateSetting(
                            "workspaceDescription",
                            event.target.value
                          )
                        }
                        rows={4}
                        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm leading-6 text-zinc-200 outline-none transition focus:border-zinc-600"
                      />
                    </div>

                    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <p className="text-xs leading-5 text-amber-300">
                        Workspace name and description
                        are currently frontend-only.
                        They are not stored in the
                        userSettings database table yet.
                      </p>
                    </div>
                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* NOTIFICATIONS                                     */}
                {/* ================================================== */}

                {activeTab === "notifications" && (
                  <SettingsSection
                    icon={Bell}
                    title="Notifications"
                    description="Choose which intelligence events should be enabled."
                  >
                    <ToggleRow
                      title="Email notifications"
                      description="Receive important monitoring updates by email."
                      enabled={
                        settings.emailNotifications
                      }
                      onChange={(value) =>
                        updateSetting(
                          "emailNotifications",
                          value
                        )
                      }
                    />

                    <ToggleRow
                      title="Push notifications"
                      description="Receive important monitoring alerts and intelligence updates."
                      enabled={
                        settings.pushNotifications
                      }
                      onChange={(value) =>
                        updateSetting(
                          "pushNotifications",
                          value
                        )
                      }
                    />

                    <ToggleRow
                      title="Weekly intelligence report"
                      description="Receive a weekly summary of trends and audience sentiment."
                      enabled={
                        settings.weeklyReports
                      }
                      onChange={(value) =>
                        updateSetting(
                          "weeklyReports",
                          value
                        )
                      }
                    />

                    <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                      <p className="text-xs font-medium text-blue-300">
                        Notification status
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Your notification preferences
                        are connected to the SocialInt
                        backend and stored in Neon.
                      </p>
                    </div>
                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* DATA & MONITORING                                 */}
                {/* ================================================== */}

                {activeTab === "monitoring" && (
                  <SettingsSection
                    icon={Database}
                    title="Data & Monitoring"
                    description="Control how SocialInt monitors connected platforms."
                  >
                    <ToggleRow
                      title="Automatic monitoring"
                      description="Continuously monitor your connected social platforms."
                      enabled={
                        settings.automaticMonitoring
                      }
                      onChange={(value) =>
                        updateSetting(
                          "automaticMonitoring",
                          value
                        )
                      }
                    />

                    <div className="border-t border-zinc-800 py-5">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            Refresh interval
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            How frequently new
                            conversations are checked.
                          </p>
                        </div>

                        <select
                          value={
                            settings.refreshInterval
                          }
                          onChange={(event) =>
                            updateSetting(
                              "refreshInterval",
                              event.target.value
                            )
                          }
                          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-zinc-600"
                        >
                          <option value="1">
                            Every 1 minute
                          </option>

                          <option value="5">
                            Every 5 minutes
                          </option>

                          <option value="15">
                            Every 15 minutes
                          </option>

                          <option value="30">
                            Every 30 minutes
                          </option>

                          <option value="60">
                            Every hour
                          </option>
                        </select>

                      </div>
                    </div>

                    {/* CONNECTED SOURCES */}

                    <div className="border-t border-zinc-800 pt-5">

                      <div className="flex items-center justify-between">

                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            Connected sources
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            Manage platforms connected
                            to this workspace.
                          </p>
                        </div>

                        <a
                          href="/data-sources"
                          className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-white"
                        >
                          Manage

                          <ChevronRight
                            size={14}
                          />
                        </a>

                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">

                        <SourceCard
                          name="X"
                          status="Connected"
                        />

                        <SourceCard
                          name="Telegram"
                          status="Connected"
                        />

                      </div>

                    </div>

                    <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

                      <p className="text-xs leading-5 text-amber-300">
                        Automatic monitoring and refresh
                        interval are currently frontend-only.
                        We can add these fields to the
                        database later.
                      </p>

                    </div>

                  </SettingsSection>
                )}

                {/* PART 3 GOES HERE */}

                                {/* ================================================== */}
                {/* APPEARANCE                                        */}
                {/* ================================================== */}

                {activeTab === "appearance" && (
                  <SettingsSection
                    icon={Monitor}
                    title="Appearance"
                    description="Choose how SocialInt should look."
                  >
                    <div className="grid gap-4 sm:grid-cols-3">

                      {/* DARK */}

                      <AppearanceCard
                        title="Dark"
                        description="Deep dark interface"
                        icon={Moon}
                        selected={
                          settings.appearance ===
                          "DARK"
                        }
                        onClick={() =>
                          updateSetting(
                            "appearance",
                            "DARK"
                          )
                        }
                      />

                      {/* SYSTEM */}

                      <AppearanceCard
                        title="System"
                        description="Follow your device preference"
                        icon={Monitor}
                        selected={
                          settings.appearance ===
                          "SYSTEM"
                        }
                        onClick={() =>
                          updateSetting(
                            "appearance",
                            "SYSTEM"
                          )
                        }
                      />

                      {/* LIGHT */}

                      <AppearanceCard
                        title="Light"
                        description="Bright interface"
                        icon={Sun}
                        selected={
                          settings.appearance ===
                          "LIGHT"
                        }
                        onClick={() =>
                          updateSetting(
                            "appearance",
                            "LIGHT"
                          )
                        }
                      />

                    </div>

                    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

                      <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-zinc-800 p-2">
                          <Monitor
                            size={16}
                            className="text-zinc-400"
                          />
                        </div>

                        <div>

                          <p className="text-sm font-medium text-zinc-200">
                            Current appearance
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {settings.appearance ===
                            "DARK"
                              ? "Dark mode"
                              : settings.appearance ===
                                "LIGHT"
                                ? "Light mode"
                                : "System mode"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* PRIVACY & SECURITY                                */}
                {/* ================================================== */}

                {activeTab === "security" && (
                  <SettingsSection
                    icon={Shield}
                    title="Privacy & Security"
                    description="Manage your account and SocialInt data."
                  >
                    <div className="space-y-4">

                      <SecurityRow
                        title="Public data analysis"
                        description="SocialInt analyzes publicly available or platform-authorized content."
                        badge="Protected"
                      />

                      <SecurityRow
                        title="Authentication"
                        description="Your account authentication is managed securely through Clerk."
                        badge="Active"
                      />

                    </div>

                    {/* LOGOUT */}

                    <div className="mt-6 border-t border-zinc-800 pt-6">

                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>

                          <p className="text-sm font-medium text-zinc-200">
                            Sign out of SocialInt
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            You can sign back in at any time.
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                          <LogOut size={15} />

                          Log out
                        </button>

                      </div>

                    </div>

                  </SettingsSection>
                )}

                {/* ================================================== */}
                {/* SAVE / RESET                                      */}
                {/* ================================================== */}

                <div className="flex flex-col justify-between gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center">

                  {/* RESET */}

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw
                      size={14}
                    />

                    Reset settings
                  </button>

                  {/* SAVE */}

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>Saving...</>
                    ) : saved ? (
                      <>
                        <Check size={16} />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save changes
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
}/* ================================================== */
/* SETTINGS SECTION                                  */
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
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-5 sm:p-6">

      <div className="mb-6 flex items-start gap-3">

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-2.5">
          <Icon
            size={17}
            className="text-zinc-400"
          />
        </div>

        <div>
          <h2 className="font-display text-lg tracking-wide text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {description}
          </p>
        </div>

      </div>

      {children}

    </section>
  );
}


/* ================================================== */
/* SETTINGS NAV                                      */
/* ================================================== */

function SettingsNav({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
      }`}
    >
      <Icon size={16} />

      <span>
        {label}
      </span>
    </button>
  );
}


/* ================================================== */
/* INPUT FIELD                                       */
/* ================================================== */

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-600"
      />

    </div>
  );
}


/* ================================================== */
/* TOGGLE                                            */
/* ================================================== */

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
    <div className="flex items-center justify-between gap-5 border-b border-zinc-800 py-5 first:pt-0 last:border-b-0 last:pb-0">

      <div>

        <p className="text-sm font-medium text-zinc-200">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-emerald-400"
            : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}


/* ================================================== */
/* SOURCE CARD                                       */
/* ================================================== */

function SourceCard({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300">
          {name === "X" ? "𝕏" : "T"}
        </div>

        <span className="text-sm font-medium text-zinc-300">
          {name}
        </span>

      </div>

      <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">

        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

        {status}

      </span>

    </div>
  );
}


/* ================================================== */
/* APPEARANCE CARD                                   */
/* ================================================== */

function AppearanceCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}: {
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
      className={`relative rounded-xl border p-4 text-left transition ${
        selected
          ? "border-blue-500/50 bg-blue-500/5"
          : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
      }`}
    >

      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
          <Check
            size={12}
            strokeWidth={3}
            className="text-white"
          />
        </div>
      )}

      <div className="mb-4 flex h-16 items-center justify-center rounded-lg border border-zinc-800 bg-[#080b12]">
        <Icon
          size={20}
          className="text-zinc-500"
        />
      </div>

      <p className="text-sm font-medium text-zinc-200">
        {title}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {description}
      </p>

    </button>
  );
}


/* ================================================== */
/* SECURITY ROW                                      */
/* ================================================== */

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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

      <div className="flex items-start gap-3">

        <div className="rounded-lg bg-zinc-800 p-2">
          <Shield
            size={16}
            className="text-zinc-400"
          />
        </div>

        <div>

          <p className="text-sm font-medium text-zinc-200">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {description}
          </p>

        </div>

      </div>

      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
        {badge}
      </span>

    </div>
  );
}