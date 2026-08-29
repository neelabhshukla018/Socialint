"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Database,
  Lock,
  Monitor,
  Save,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [issueAlerts, setIssueAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white dashboard-grid">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="lg:ml-64">
        <DashboardHeader />

        <div className="p-5 sm:p-8">
          <div className="mx-auto max-w-6xl">

            {/* ================================================== */}
            {/* PAGE HEADER                                        */}
            {/* ================================================== */}

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
                Manage your SocialInt workspace, monitoring preferences,
                notifications and connected data.
              </p>
            </section>


            {/* ================================================== */}
            {/* SETTINGS LAYOUT                                   */}
            {/* ================================================== */}

            <div className="grid gap-6 lg:grid-cols-[230px_1fr]">

              {/* ================================================== */}
              {/* SETTINGS NAVIGATION                               */}
              {/* ================================================== */}

              <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2">

                <SettingsNav
                  icon={User}
                  label="Profile"
                  active
                />

                <SettingsNav
                  icon={Bell}
                  label="Notifications"
                />

                <SettingsNav
                  icon={Database}
                  label="Data & Monitoring"
                />

                <SettingsNav
                  icon={Monitor}
                  label="Appearance"
                />

                <SettingsNav
                  icon={Shield}
                  label="Privacy & Security"
                />

              </aside>


              {/* ================================================== */}
              {/* SETTINGS CONTENT                                  */}
              {/* ================================================== */}

              <div className="space-y-6">


                {/* ================================================== */}
                {/* PROFILE                                            */}
                {/* ================================================== */}

                <SettingsSection
                  icon={User}
                  title="Profile"
                  description="Manage your SocialInt workspace information."
                >

                  <div className="grid gap-5 sm:grid-cols-2">

                    <InputField
                      label="Workspace name"
                      value="Social Intelligence"
                    />

                    <InputField
                      label="Workspace type"
                      value="Social Intelligence"
                    />

                  </div>

                  <div className="mt-5">

                    <label className="mb-2 block text-xs font-medium text-zinc-400">
                      Workspace description
                    </label>

                    <textarea
                      defaultValue="Monitor audience sentiment, emerging narratives and influence across connected social platforms."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm leading-6 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                    />

                  </div>

                </SettingsSection>


                {/* ================================================== */}
                {/* NOTIFICATIONS                                     */}
                {/* ================================================== */}

                <SettingsSection
                  icon={Bell}
                  title="Notifications"
                  description="Choose what SocialInt should notify you about."
                >

                  <ToggleRow
                    title="Email notifications"
                    description="Receive important monitoring updates by email."
                    enabled={emailAlerts}
                    onChange={setEmailAlerts}
                  />

                  <ToggleRow
                    title="Emerging issue alerts"
                    description="Get notified when unusual negative conversations are detected."
                    enabled={issueAlerts}
                    onChange={setIssueAlerts}
                  />

                  <ToggleRow
                    title="Weekly intelligence report"
                    description="Receive a weekly summary of trends and audience sentiment."
                    enabled={weeklyReport}
                    onChange={setWeeklyReport}
                  />

                </SettingsSection>


                {/* ================================================== */}
                {/* DATA & MONITORING                                 */}
                {/* ================================================== */}

                <SettingsSection
                  icon={Database}
                  title="Data & Monitoring"
                  description="Control how frequently your connected sources are analyzed."
                >

                  <ToggleRow
                    title="Automatic monitoring"
                    description="Continuously monitor connected social platforms."
                    enabled={autoRefresh}
                    onChange={setAutoRefresh}
                  />

                  <div className="border-t border-zinc-800 py-5">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          Refresh interval
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          How frequently new conversations are checked.
                        </p>
                      </div>

                      <select
                        defaultValue="5"
                        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-zinc-600"
                      >
                        <option value="1">Every 1 minute</option>
                        <option value="5">Every 5 minutes</option>
                        <option value="15">Every 15 minutes</option>
                        <option value="30">Every 30 minutes</option>
                        <option value="60">Every hour</option>
                      </select>

                    </div>

                  </div>


                  {/* Connected sources */}

                  <div className="border-t border-zinc-800 pt-5">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          Connected sources
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Manage platforms connected to this workspace.
                        </p>
                      </div>

                      <a
                        href="/data-sources"
                        className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-white"
                      >
                        Manage
                        <ChevronRight size={14} />
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

                </SettingsSection>


                {/* ================================================== */}
                {/* APPEARANCE                                        */}
                {/* ================================================== */}

                <SettingsSection
                  icon={Monitor}
                  title="Appearance"
                  description="Customize how SocialInt looks on your screen."
                >

                  <div className="grid gap-4 sm:grid-cols-2">

                    <AppearanceCard
                      title="Dark"
                      description="Deep dark interface"
                      selected
                    />

                    <AppearanceCard
                      title="System"
                      description="Follow system preference"
                    />

                  </div>

                </SettingsSection>


                {/* ================================================== */}
                {/* PRIVACY                                            */}
                {/* ================================================== */}

                <SettingsSection
                  icon={Shield}
                  title="Privacy & Security"
                  description="Manage your workspace privacy and account security."
                >

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="rounded-lg bg-zinc-800 p-2">
                        <Lock
                          size={16}
                          className="text-zinc-400"
                        />
                      </div>

                      <div>

                        <p className="text-sm font-medium text-zinc-200">
                          Public data analysis
                        </p>

                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                          SocialInt only analyzes publicly available or
                          platform-authorized content.
                        </p>

                      </div>

                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                      Protected
                    </span>

                  </div>

                </SettingsSection>


                {/* ================================================== */}
                {/* SAVE                                               */}
                {/* ================================================== */}

                <div className="flex flex-col justify-between gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center">

                  <p className="text-xs text-zinc-600">
                    Changes are applied to this workspace.
                  </p>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                  >

                    {saved ? (
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
}


/* ================================================== */
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
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
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
/* INPUT                                             */
/* ================================================== */

function InputField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
      </label>

      <input
        defaultValue={value}
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
        onClick={() => onChange(!enabled)}
        aria-label={title}
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
  selected = false,
}: {
  title: string;
  description: string;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
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

      <div className="mb-4 h-16 rounded-lg border border-zinc-800 bg-[#080b12]" />

      <p className="text-sm font-medium text-zinc-200">
        {title}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {description}
      </p>

    </button>
  );
}