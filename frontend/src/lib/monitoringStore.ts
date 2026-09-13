"use client";

export type ProfileType = "person" | "brand" | "campaign" | "topic";

export interface MonitoringProfile {
  id: string;
  type: ProfileType;
  name: string;
  input: string; // handle or identifier e.g. @openai
  description?: string;
  category?: string;
  keywords?: string[];
  source?: string; // primary source
  sources?: string[]; // list of all connected source IDs
  createdAt: string;
  monitoringStartedAt?: string;
  isDefault?: boolean;
}

export type PlatformId =
  | "x"
  | "instagram"
  | "telegram"
  | "youtube"
  | "reddit"
  | "tiktok"
  | "facebook"
  | "news";

export interface DataSourceItem {
  id: string;
  platform: PlatformId;
  name: string;
  handleOrUrl: string;
  status: "active" | "syncing" | "paused" | "error";
  profileId?: string;
  contentTypes?: string[];
  refreshInterval?: string;
  keywords?: string[];
  lastSyncedAt?: string;
  eventsCaptured?: number;
  healthPercent?: number;
}

const PROFILE_KEY = "socialintel_profile";
const PROFILES_LIST_KEY = "socialintel_profiles";
const DATA_SOURCES_KEY = "socialintel_datasources";

// Default seed profile for fresh starts
export const DEFAULT_PROFILES: MonitoringProfile[] = [
  {
    id: "profile-openai",
    type: "brand",
    name: "OpenAI",
    input: "@openai",
    description: "Tracking global AI sentiment, model releases, and brand reputation.",
    category: "Technology & AI",
    keywords: ["GPT-5", "Sora", "AGI", "Sam Altman", "ChatGPT"],
    source: "x",
    sources: ["x", "telegram", "youtube"],
    createdAt: new Date().toISOString(),
    monitoringStartedAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: "profile-elon",
    type: "person",
    name: "Elon Musk",
    input: "@elonmusk",
    description: "Monitoring public discussions, executive commentary, and mentions.",
    category: "Executives & Tech",
    keywords: ["Tesla", "SpaceX", "xAI", "Starlink", "Grok"],
    source: "x",
    sources: ["x", "reddit"],
    createdAt: new Date().toISOString(),
    monitoringStartedAt: new Date().toISOString(),
  },
  {
    id: "profile-apple",
    type: "brand",
    name: "Apple",
    input: "@apple",
    description: "Tracking hardware announcements, iOS updates, and consumer sentiment.",
    category: "Consumer Tech",
    keywords: ["iPhone", "MacBook", "Apple Intelligence", "Tim Cook", "WWDC"],
    source: "youtube",
    sources: ["youtube", "instagram", "x"],
    createdAt: new Date().toISOString(),
    monitoringStartedAt: new Date().toISOString(),
  },
];

export const DEFAULT_DATA_SOURCES: DataSourceItem[] = [
  {
    id: "source-x-1",
    platform: "x",
    name: "X / Twitter",
    handleOrUrl: "@openai",
    status: "active",
    profileId: "profile-openai",
    contentTypes: ["Posts & Mentions", "Quotes & Reposts", "Replies"],
    refreshInterval: "realtime",
    lastSyncedAt: "Just now",
    eventsCaptured: 14250,
    healthPercent: 99.8,
  },
  {
    id: "source-tg-1",
    platform: "telegram",
    name: "Telegram",
    handleOrUrl: "t.me/techintelligence",
    status: "active",
    profileId: "profile-openai",
    contentTypes: ["Channel Broadcasts", "Discussion Groups"],
    refreshInterval: "5m",
    lastSyncedAt: "2 min ago",
    eventsCaptured: 3840,
    healthPercent: 100,
  },
  {
    id: "source-yt-1",
    platform: "youtube",
    name: "YouTube",
    handleOrUrl: "youtube.com/@OpenAI",
    status: "syncing",
    profileId: "profile-openai",
    contentTypes: ["Video Comments", "Community Posts", "Transcripts"],
    refreshInterval: "15m",
    lastSyncedAt: "12 min ago",
    eventsCaptured: 8910,
    healthPercent: 98.5,
  },
];

/* =========================================================
   LOCAL / SESSION STORAGE HELPERS
   ========================================================= */

function getItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/* =========================================================
   PROFILES API
   ========================================================= */

export function getActiveProfile(): MonitoringProfile {
  const raw = getItem(PROFILE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          id: parsed.id || "profile-active",
          type: parsed.type || "brand",
          name: parsed.name || (parsed.input ? parsed.input.replace("@", "") : "OpenAI"),
          input: parsed.input || "@openai",
          description: parsed.description || "Active PR & Social Monitoring Profile",
          category: parsed.category || "Technology",
          keywords: parsed.keywords || ["Sentiment", "Mentions", "Reach"],
          source: parsed.source || "x",
          sources: parsed.sources || (parsed.source ? [parsed.source] : ["x", "telegram"]),
          createdAt: parsed.createdAt || new Date().toISOString(),
          monitoringStartedAt: parsed.monitoringStartedAt || new Date().toISOString(),
        };
      }
    } catch {
      // fallback
    }
  }

  // If no profile is stored, seed with default
  const defaultProfile = DEFAULT_PROFILES[0];
  setActiveProfile(defaultProfile);
  return defaultProfile;
}

export function setActiveProfile(profile: MonitoringProfile): void {
  setItem(PROFILE_KEY, JSON.stringify(profile));

  // Also ensure it is present in the profiles list
  const list = getAllProfiles();
  const existingIdx = list.findIndex((p) => p.id === profile.id);
  if (existingIdx >= 0) {
    list[existingIdx] = profile;
  } else {
    list.unshift(profile);
  }
  setItem(PROFILES_LIST_KEY, JSON.stringify(list));
}

export function getAllProfiles(): MonitoringProfile[] {
  const raw = getItem(PROFILES_LIST_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  // Default seed list
  setItem(PROFILES_LIST_KEY, JSON.stringify(DEFAULT_PROFILES));
  return DEFAULT_PROFILES;
}

export function saveProfile(profile: MonitoringProfile): MonitoringProfile {
  const list = getAllProfiles();
  const index = list.findIndex((p) => p.id === profile.id);

  if (index >= 0) {
    list[index] = profile;
  } else {
    list.unshift(profile);
  }

  setItem(PROFILES_LIST_KEY, JSON.stringify(list));
  setActiveProfile(profile);
  return profile;
}

export function deleteProfile(id: string): MonitoringProfile[] {
  let list = getAllProfiles().filter((p) => p.id !== id);
  if (list.length === 0) {
    list = [DEFAULT_PROFILES[0]];
  }
  setItem(PROFILES_LIST_KEY, JSON.stringify(list));

  const active = getActiveProfile();
  if (active.id === id) {
    setActiveProfile(list[0]);
  }
  return list;
}

/* =========================================================
   DATA SOURCES API
   ========================================================= */

export function getDataSources(): DataSourceItem[] {
  const raw = getItem(DATA_SOURCES_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  setItem(DATA_SOURCES_KEY, JSON.stringify(DEFAULT_DATA_SOURCES));
  return DEFAULT_DATA_SOURCES;
}

export function saveDataSource(item: DataSourceItem): DataSourceItem[] {
  const sources = getDataSources();
  const existingIdx = sources.findIndex((s) => s.id === item.id);

  if (existingIdx >= 0) {
    sources[existingIdx] = item;
  } else {
    sources.unshift(item);
  }

  setItem(DATA_SOURCES_KEY, JSON.stringify(sources));

  // Sync active profile connected sources
  const active = getActiveProfile();
  const currentSources = new Set(active.sources || []);
  currentSources.add(item.platform);
  active.sources = Array.from(currentSources);
  if (!active.source) {
    active.source = item.platform;
  }
  setActiveProfile(active);

  return sources;
}

export function toggleDataSourceStatus(id: string): DataSourceItem[] {
  const sources = getDataSources().map((source) => {
    if (source.id === id) {
      const nextStatus = source.status === "active" ? "paused" : "active";
      return { ...source, status: nextStatus as "active" | "paused" };
    }
    return source;
  });

  setItem(DATA_SOURCES_KEY, JSON.stringify(sources));
  return sources;
}

export function deleteDataSource(id: string): DataSourceItem[] {
  const sources = getDataSources().filter((s) => s.id !== id);
  setItem(DATA_SOURCES_KEY, JSON.stringify(sources));

  // Sync active profile
  const active = getActiveProfile();
  const activePlatforms = sources.map((s) => s.platform);
  active.sources = activePlatforms;
  if (!activePlatforms.includes(active.source as PlatformId)) {
    active.source = activePlatforms[0] || undefined;
  }
  setActiveProfile(active);

  return sources;
}
