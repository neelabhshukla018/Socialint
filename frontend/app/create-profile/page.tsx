"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Loader2,
  Megaphone,
  Plus,
  Radio,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
  Users,
} from "lucide-react";

import {
  getAllProfiles,
  getActiveProfile,
  saveProfile,
  deleteProfile,
  setActiveProfile,
  setAllProfiles,
  type MonitoringProfile,
  type ProfileType,
} from "@/src/lib/monitoringStore";
import { useSocialIntApi } from "@/src/lib/api";
import CustomSelect from "../components/ui/CustomSelect";
import ThemeToggle from "../components/ThemeToggle";
import { useNotifications } from "../context/NotificationContext";

export default function ChangeProfilePage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const api = useSocialIntApi();
  const { notifyEvent } = useNotifications();

  // Mode: "switch" | "create" | "edit"
  const [viewMode, setViewMode] = useState<"switch" | "edit" | "create">("switch");
  const [profiles, setProfiles] = useState<MonitoringProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<MonitoringProfile | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [profileType, setProfileType] = useState<ProfileType>("brand");
  const [profileName, setProfileName] = useState("");
  const [profileInput, setProfileInput] = useState("");
  const [category, setCategory] = useState("Technology & AI");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch real profiles from backend whenever user is authenticated
  useEffect(() => {
    async function loadBackendProfiles() {
      if (!userLoaded) return;

      const clerkId = user?.id;
      if (clerkId) {
        setIsSyncing(true);
        try {
          const res = await api.getProfiles(clerkId);
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            const mappedProfiles: MonitoringProfile[] = res.data.map((p: any) => ({
              id: p.id,
              userId: p.userId,
              type: (p.type?.toLowerCase() as ProfileType) || "brand",
              name: p.name,
              input: p.identifier,
              description: p.description || "",
              category: "Technology & AI",
              keywords: [],
              isActive: p.isActive,
              dataSources: p.dataSources || [],
              sources: (p.dataSources || [])
                .filter((ds: any) => ds.status === "CONNECTED")
                .map((ds: any) => String(ds.platform).toLowerCase()),
              createdAt: p.createdAt,
            }));

            setAllProfiles(mappedProfiles);
            setProfiles(mappedProfiles);

            const active =
              mappedProfiles.find((p) => p.isActive) || mappedProfiles[0];
            setActiveProfile(active);
            setActiveProfileState(active);

            // Populate form with active profile data
            if (active) {
              setProfileType(active.type || "brand");
              setProfileName(active.name || "");
              setProfileInput(active.input || "");
              setDescription(active.description || "");
            }
            return;
          } else {
            // User has 0 profiles on backend: show creation mode immediately
            setAllProfiles([]);
            setProfiles([]);
            setActiveProfile(null);
            setActiveProfileState(null);
            setViewMode("create");
            return;
          }
        } catch (err) {
          console.warn("Could not fetch profiles from backend:", err);
        } finally {
          setIsSyncing(false);
        }
      }

      // Fallback to local storage if user not logged in yet
      const list = getAllProfiles();
      const current = getActiveProfile();
      setProfiles(list);
      setActiveProfileState(current);
      if (list.length === 0) {
        setViewMode("create");
      }
    }

    loadBackendProfiles();
  }, [user?.id, userLoaded]);

  const profileOptions = [
    {
      id: "person" as ProfileType,
      title: "Public Figure",
      description: "Monitor a creator, executive, athlete, or prominent public leader.",
      icon: User,
      badge: "Individual",
    },
    {
      id: "brand" as ProfileType,
      title: "Brand / Company",
      description: "Track sentiment, crisis signals, and brand reputation.",
      icon: Building2,
      badge: "Organization",
    },
    {
      id: "campaign" as ProfileType,
      title: "Campaign / Event",
      description: "Monitor a marketing launch, product keynote, or viral event.",
      icon: Megaphone,
      badge: "Initiative",
    },
    {
      id: "topic" as ProfileType,
      title: "Topic / Narrative",
      description: "Analyze discourse, hashtag trends, and public sentiment around a theme.",
      icon: TrendingUp,
      badge: "Trend / Debate",
    },
  ];

  const categoryOptions = [
    { value: "Technology & AI", label: "Technology & AI" },
    { value: "Consumer & Retail", label: "Consumer & Retail" },
    { value: "Finance & Fintech", label: "Finance & Fintech" },
    { value: "Media & Entertainment", label: "Media & Entertainment" },
    { value: "Healthcare & Biotech", label: "Healthcare & Biotech" },
    { value: "Politics & Public Policy", label: "Politics & Public Policy" },
    { value: "Sports & Fitness", label: "Sports & Fitness" },
    { value: "General / Other", label: "General / Other" },
  ];

  const presets = [
    {
      type: "brand" as ProfileType,
      name: "OpenAI",
      input: "@openai",
      category: "Technology & AI",
      keywords: ["GPT-5", "Sora", "Sam Altman", "ChatGPT"],
    },
    {
      type: "person" as ProfileType,
      name: "Elon Musk",
      input: "@elonmusk",
      category: "Technology & AI",
      keywords: ["Tesla", "SpaceX", "xAI", "Grok"],
    },
    {
      type: "brand" as ProfileType,
      name: "Apple",
      input: "@apple",
      category: "Consumer & Retail",
      keywords: ["iPhone", "WWDC", "Tim Cook", "Apple Intelligence"],
    },
    {
      type: "campaign" as ProfileType,
      name: "#CES2026",
      input: "#CES2026",
      category: "Technology & AI",
      keywords: ["Keynote", "Robotics", "Gadgets", "Innovation"],
    },
  ];

  const handleApplyPreset = (preset: (typeof presets)[0]) => {
    setProfileType(preset.type);
    setProfileName(preset.name);
    setProfileInput(preset.input);
    setCategory(preset.category);
    setKeywords(preset.keywords);
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim().replace(/^#/, "");
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (goToDataSources = false) => {
    if (!profileName.trim() || !profileInput.trim()) return;

    setIsSubmitting(true);
    const clerkId = user?.id || `anon-${Date.now()}`;
    const email = user?.primaryEmailAddress?.emailAddress || "user@socialintel.ai";

    try {
      if (viewMode === "create") {
        // Create in backend database
        const res = await api.createProfile({
          clerkId,
          email,
          name: user?.fullName || user?.username || profileName.trim(),
          username: user?.username || undefined,
          profileType:
            profileType === "person"
              ? "PERSON"
              : profileType === "campaign"
                ? "CAMPAIGN"
                : "BRAND",
          profileName: profileName.trim(),
          identifier: profileInput.trim(),
          description: description.trim() || undefined,
        });

        const createdDbProfile = res.data?.profile;
        const newProfile: MonitoringProfile = {
          id: createdDbProfile?.id || `profile-${Date.now()}`,
          userId: createdDbProfile?.userId,
          type: profileType,
          name: profileName.trim(),
          input: profileInput.trim(),
          category,
          description: description.trim(),
          keywords,
          source: "instagram",
          sources: [],
          dataSources: [],
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        saveProfile(newProfile);
        setActiveProfileState(newProfile);
        setProfiles(getAllProfiles());
        setSaveSuccess(true);

        notifyEvent({
          title: "Profile Created & Saved",
          message: `Target "${newProfile.name}" created and synced to database.`,
          type: "success",
        });

        setTimeout(() => {
          if (goToDataSources) {
            router.push("/data-sources");
          } else {
            router.push("/");
          }
        }, 450);
      } else if (viewMode === "edit" && activeProfile) {
        // Update in backend database
        if (typeof activeProfile.id === "number" || !isNaN(Number(activeProfile.id))) {
          await api.updateProfile(Number(activeProfile.id), {
            name: profileName.trim(),
            type:
              profileType === "person"
                ? "PERSON"
                : profileType === "campaign"
                  ? "CAMPAIGN"
                  : "BRAND",
            identifier: profileInput.trim(),
            description: description.trim(),
          });
        }

        const updated: MonitoringProfile = {
          ...activeProfile,
          type: profileType,
          name: profileName.trim(),
          input: profileInput.trim(),
          category,
          description: description.trim(),
          keywords,
        };

        saveProfile(updated);
        setActiveProfileState(updated);
        setProfiles(getAllProfiles());
        setSaveSuccess(true);

        notifyEvent({
          title: "Profile Updated",
          message: `Saved changes to "${updated.name}".`,
          type: "success",
        });

        setTimeout(() => {
          if (goToDataSources) {
            router.push("/data-sources");
          } else {
            router.push("/");
          }
        }, 450);
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      notifyEvent({
        title: "Action Failed",
        message: err?.message || "Failed to save profile.",
        type: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchProfile = async (p: MonitoringProfile) => {
    setActiveProfile(p);
    setActiveProfileState(p);
    setSaveSuccess(true);

    if (user?.id && (typeof p.id === "number" || !isNaN(Number(p.id)))) {
      try {
        await api.activateProfile(Number(p.id), user.id);
      } catch (err) {
        console.warn("Backend activate notice:", err);
      }
    }

    notifyEvent({
      title: "Profile Switched",
      message: `Active profile changed to "${p.name}".`,
      type: "info",
    });

    setTimeout(() => {
      router.push("/");
    }, 300);
  };

  const handleDeleteProfile = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this monitoring profile?")) {
      if (typeof id === "number" || !isNaN(Number(id))) {
        try {
          await api.deleteProfile(Number(id));
        } catch (err) {
          console.warn("Backend delete error:", err);
        }
      }

      const remaining = deleteProfile(id);
      setProfiles(remaining);
      const current = getActiveProfile();
      setActiveProfileState(current);

      notifyEvent({
        title: "Profile Removed",
        message: "Monitoring profile deleted from database.",
        type: "warning",
      });
    }
  };

  const getInitials = (text: string) => {
    if (!text) return "SI";
    return text
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-[#080b12] bg-grid-dashboard text-zinc-900 dark:text-zinc-100 selection:bg-[#457B9D]/20 transition-colors duration-200">
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#080b12]/90 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
          {/* Brand + Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs transition group-hover:bg-[#457B9D] dark:group-hover:bg-[#457B9D] dark:group-hover:text-white">
                <Activity size={18} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base sm:text-lg tracking-tight text-zinc-950 dark:text-zinc-100 leading-none">
                  SocialInt
                </span>
                <span className="text-[9px] font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase -mt-0.5 hidden xs:inline-block">
                  Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Mode Selector Pill Buttons */}
          <div className="flex items-center p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 text-xs overflow-x-auto max-w-[260px] sm:max-w-none scrollbar-none">
            <button
              type="button"
              onClick={() => setViewMode("switch")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                viewMode === "switch"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200"
              }`}
            >
              <Users size={13} />
              <span>Switch Profile ({profiles.length})</span>
            </button>

            {activeProfile && (
              <button
                type="button"
                onClick={() => {
                  setViewMode("edit");
                  setProfileType(activeProfile.type || "brand");
                  setProfileName(activeProfile.name || "");
                  setProfileInput(activeProfile.input || "");
                  setCategory(activeProfile.category || "Technology & AI");
                  setDescription(activeProfile.description || "");
                  setKeywords(activeProfile.keywords || []);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  viewMode === "edit"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200"
                }`}
              >
                Edit Current
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setViewMode("create");
                setProfileType("brand");
                setProfileName("");
                setProfileInput("");
                setDescription("");
                setKeywords([]);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                viewMode === "create"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200"
              }`}
            >
              <Plus size={13} />
              <span className="hidden sm:inline">New Profile</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Right side: Theme Toggle & Dashboard Link */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle className="!h-9 !w-9 sm:!h-10 sm:!w-10" />

            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition whitespace-nowrap"
            >
              <ArrowLeft size={14} />
              <span className="hidden md:inline">Back to Dashboard</span>
              <span className="md:hidden">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="sticky top-16 sm:top-20 z-20 bg-emerald-600 text-white py-2.5 px-4 text-center text-xs font-semibold shadow-md flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>Profile saved successfully! Redirecting...</span>
        </div>
      )}

      {/* ================================================== */}
      {/* MAIN CONTENT AREA                                  */}
      {/* ================================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ================================================== */}
        {/* VIEW 1: SWITCH PROFILE (SAVED PROFILES GRID)       */}
        {/* ================================================== */}
        {viewMode === "switch" && (
          <div className="mx-auto max-w-5xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="font-display text-2xl sm:text-4xl tracking-tight text-zinc-950 dark:text-zinc-50">
                  Switch Monitoring Profile
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Select an active target to monitor or configure a new PR intelligence profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewMode("create");
                  setProfileName("");
                  setProfileInput("");
                  setDescription("");
                  setKeywords([]);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#457B9D] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#386785] transition shrink-0"
              >
                <Plus size={15} />
                <span>Create New Profile</span>
              </button>
            </div>

            {/* Zero State if no profiles */}
            {profiles.length === 0 && !isSyncing && (
              <div className="rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 sm:p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#457B9D]/10 text-[#457B9D] mb-4">
                  <Users size={28} />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  No monitoring profiles found
                </h3>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                  Create your first monitoring profile to start tracking cross-platform sentiment, influencers, and brand alerts.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("create")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#457B9D] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#386785] transition"
                >
                  <Plus size={16} />
                  <span>Create Your First Profile</span>
                </button>
              </div>
            )}

            {/* Profiles Grid */}
            {profiles.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profiles.map((p) => {
                  const isActive = String(activeProfile?.id) === String(p.id);
                  const connectedSources = (p.dataSources || []).filter(
                    (s: any) => s.status === "CONNECTED"
                  );

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSwitchProfile(p)}
                      className={`group relative flex flex-col justify-between rounded-2xl p-5 border transition-all cursor-pointer ${
                        isActive
                          ? "border-[#457B9D] bg-white dark:bg-zinc-900 shadow-md ring-2 ring-[#457B9D]/20"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs"
                      }`}
                    >
                      <div>
                        {/* Top row: Initials & Active badge */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#457B9D]/30 bg-[#457B9D]/10 text-sm font-bold text-[#457B9D] shadow-2xs">
                            {getInitials(p.name)}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isActive ? (
                              <span className="flex items-center gap-1.5 rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Target
                              </span>
                            ) : (
                              <span className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 text-[10px] font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                {p.type}
                              </span>
                            )}

                            <button
                              type="button"
                              title="Delete profile"
                              onClick={(e) => handleDeleteProfile(p.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Name & Handle */}
                        <h3 className="font-display text-base font-bold text-zinc-950 dark:text-white">
                          {p.name}
                        </h3>
                        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {p.input}
                        </p>

                        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {p.description || `Category: ${p.category || "General Monitoring"}`}
                        </p>

                        {/* Connected Data Sources Badges */}
                        <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">
                            Sources:
                          </span>
                          {connectedSources.length > 0 ? (
                            connectedSources.map((ds: any) => (
                              <span
                                key={ds.id || ds.platform}
                                className="rounded-md border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-700 dark:text-emerald-400"
                              >
                                {ds.platform}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                              None connected
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                        <Link
                          href="/data-sources"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-[#457B9D] hover:underline"
                        >
                          Manage Data Sources &rarr;
                        </Link>
                        <span className="font-mono text-[11px] text-zinc-400">
                          {isActive ? "Selected" : "Click to select"}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Add Another Profile Box */}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("create");
                    setProfileName("");
                    setProfileInput("");
                    setDescription("");
                    setKeywords([]);
                  }}
                  className="flex flex-col items-center justify-center min-h-[220px] rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/30 p-6 text-center hover:border-[#457B9D] hover:bg-white dark:hover:bg-zinc-900/70 transition group"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-[#457B9D]/10 group-hover:text-[#457B9D] transition mb-3">
                    <Plus size={22} />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Add Another Profile
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px]">
                    Track competitors, executives, or other active campaign hashtags.
                  </p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* VIEW 2: EDIT OR CREATE PROFILE FORM                */}
        {/* ================================================== */}
        {(viewMode === "edit" || viewMode === "create") && (
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 animate-fadeIn">
            {/* LEFT COLUMN: FORM (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#457B9D] mb-1.5">
                  <Radio size={14} className="animate-pulse" />
                  <span>
                    {viewMode === "edit"
                      ? "Update Monitoring Target"
                      : "Create New Monitoring Target"}
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-4xl tracking-tight text-zinc-950 dark:text-zinc-50">
                  {viewMode === "edit"
                    ? `Change Profile: ${profileName || "Active Target"}`
                    : "What do you want to monitor?"}
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Define your target entity, brand handle, focus keywords, and vertical for cross-platform sentiment analysis.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Sparkles size={14} className="text-amber-500 shrink-0" />
                  <span>Quick Test Presets (Click to autofill):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/90 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-[#457B9D] hover:text-[#457B9D] dark:hover:text-[#457B9D] transition"
                    >
                      {preset.name} ({preset.input})
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Type Selector */}
              <div className="space-y-2.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Target Entity Type
                </label>
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
                  {profileOptions.map((opt) => {
                    const Icon = opt.icon;
                    const selected = profileType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setProfileType(opt.id)}
                        className={`relative rounded-2xl p-3 sm:p-3.5 text-left border transition-all ${
                          selected
                            ? "border-[#457B9D] bg-white dark:bg-zinc-900 shadow-xs ring-2 ring-[#457B9D]/20"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl mb-2 transition-colors ${
                            selected
                              ? "bg-[#457B9D]/15 text-[#457B9D]"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          <Icon size={17} />
                        </div>
                        <p className="font-display text-xs sm:text-sm font-bold text-zinc-950 dark:text-white leading-tight">
                          {opt.title}
                        </p>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                          {opt.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Profile Name & Handle Form */}
              <div className="space-y-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 shadow-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Target Entity Name *
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Virat Kohli or Apple Inc."
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Primary Handle or Identifier *
                    </label>
                    <input
                      type="text"
                      value={profileInput}
                      onChange={(e) => setProfileInput(e.target.value)}
                      placeholder="e.g. @virat.kohli or @apple"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Category / Industry
                  </label>
                  <CustomSelect
                    options={categoryOptions}
                    value={category}
                    onChange={(val) => setCategory(val)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Monitoring Scope & Objective (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what risks, competitors, or campaign narratives you want to track..."
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-none transition"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Key Topics & Hashtags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                      placeholder="e.g. PR, Keynote, Crisis"
                      className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-[#457B9D] focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 px-2.5 py-1 text-xs font-mono text-[#457B9D]"
                      >
                        #{kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(i)}
                          className="hover:text-rose-600"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting || !profileName.trim() || !profileInput.trim()}
                    onClick={() => handleSaveProfile(false)}
                    className="w-full sm:w-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-3 text-xs font-semibold text-zinc-900 dark:text-white shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    <span>Save & Dashboard</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || !profileName.trim() || !profileInput.trim()}
                    onClick={() => handleSaveProfile(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#457B9D] px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#386785] disabled:opacity-50 transition"
                  >
                    {isSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                    <span>Save & Configure Data Sources</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PREVIEW CARD (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Live Profile Preview
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    Real Data Ready
                  </span>
                </div>

                {/* Profile Card */}
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#457B9D]/15 blur-2xl pointer-events-none" />

                  {/* Profile Header */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl border border-[#457B9D]/30 bg-[#457B9D]/10 text-base sm:text-lg font-bold text-[#457B9D] shadow-2xs">
                      {getInitials(profileName || "SocialInt")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="font-display text-base sm:text-lg font-bold text-zinc-950 dark:text-white truncate">
                          {profileName || "Your Target Entity"}
                        </h2>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#457B9D] text-white">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      </div>

                      <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {profileInput || "@handle_or_hashtag"}
                      </p>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                          {category}
                        </span>
                        <span className="rounded-md border border-[#457B9D]/20 bg-[#457B9D]/10 px-2 py-0.5 text-[10px] font-medium text-[#457B9D] capitalize">
                          {profileType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                      &quot;{description || "Active monitoring profile configured for continuous PR & brand health analysis across public platforms."}&quot;
                    </p>
                  </div>

                  {/* Keywords Tag Cloud */}
                  <div className="mt-4">
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Tracked Keywords & Entities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.length > 0 ? (
                        keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300"
                          >
                            #{kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-400 font-mono italic">
                          No specific keywords added yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrics Pill */}
                  <div className="mt-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400">Database Connection</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Neon PostgreSQL
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400">Post Analysis Gating</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        Requires Data Source
                      </span>
                    </div>
                  </div>
                </div>

                {/* Help tip */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2.5 shadow-2xs">
                  <Sparkles size={16} className="text-[#457B9D] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Once saved, you will configure data sources (Instagram, X, YouTube, Telegram) so that all AI post analyses are tied directly to this monitoring profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}