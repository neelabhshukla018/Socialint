"use client";

export type ProfileType = "person" | "brand" | "campaign" | "topic";

export interface MonitoringProfile {
  id: string | number;
  userId?: number;
  type: ProfileType;
  name: string;
  input: string; // handle or identifier e.g. @virat.kohli
  description?: string;
  category?: string;
  keywords?: string[];
  source?: string; // primary source e.g. 'instagram' | 'x'
  sources?: string[]; // list of all connected source platforms e.g. ['instagram', 'x']
  isActive?: boolean;
  createdAt?: string;
  monitoringStartedAt?: string;
  dataSources?: any[];
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
  id: string | number;
  platform: PlatformId;
  name: string;
  handleOrUrl: string;
  status: "active" | "syncing" | "paused" | "error" | "CONNECTED" | "DISCONNECTED" | "ERROR";
  profileId?: string | number;
  contentTypes?: string[];
  refreshInterval?: string;
  keywords?: string[];
  lastSyncedAt?: string;
  eventsCaptured?: number;
  healthPercent?: number;
}

const PROFILE_KEY = "socialintel_active_profile";
const PROFILES_LIST_KEY = "socialintel_user_profiles";
const DATA_SOURCES_KEY = "socialintel_datasources";

export const PROFILE_CHANGED_EVENT = "socialint:profile-changed";
export const SOURCES_CHANGED_EVENT = "socialint:sources-changed";

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

function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/* =========================================================
   PROFILE STORE & SYNC
   ========================================================= */

export function getActiveProfile(): MonitoringProfile | null {
  const raw = getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.id && parsed.name) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return null;
}

export function setActiveProfile(profile: MonitoringProfile | null, silent: boolean = false): void {
  if (!profile) {
    const hadProfile = getItem(PROFILE_KEY) !== null;
    removeItem(PROFILE_KEY);
    if (!silent && hadProfile && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(PROFILE_CHANGED_EVENT, { detail: null }));
    }
    return;
  }

  const current = getActiveProfile();
  const hasChanged = !current || current.id !== profile.id || JSON.stringify(current) !== JSON.stringify(profile);

  setItem(PROFILE_KEY, JSON.stringify(profile));

  // Also update in profiles list
  const list = getAllProfiles();
  const existingIdx = list.findIndex((p) => String(p.id) === String(profile.id));
  if (existingIdx >= 0) {
    list[existingIdx] = profile;
  } else {
    list.unshift(profile);
  }
  setItem(PROFILES_LIST_KEY, JSON.stringify(list));

  if (!silent && hasChanged && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PROFILE_CHANGED_EVENT, { detail: profile }));
  }
}

export function getAllProfiles(): MonitoringProfile[] {
  const raw = getItem(PROFILES_LIST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function setAllProfiles(profiles: MonitoringProfile[]): void {
  setItem(PROFILES_LIST_KEY, JSON.stringify(profiles));

  // If no active profile is set, or if active profile is not in the list, set active
  const currentActive = getActiveProfile();
  if (profiles.length > 0) {
    const matching = profiles.find((p) => p.isActive || (currentActive && String(p.id) === String(currentActive.id)));
    setActiveProfile(matching || profiles[0]);
  } else {
    setActiveProfile(null);
  }
}

export function saveProfile(profile: MonitoringProfile): MonitoringProfile {
  const list = getAllProfiles();
  const index = list.findIndex((p) => String(p.id) === String(profile.id));

  if (index >= 0) {
    list[index] = profile;
  } else {
    list.unshift(profile);
  }

  setItem(PROFILES_LIST_KEY, JSON.stringify(list));
  setActiveProfile(profile);
  return profile;
}

export function deleteProfile(id: string | number): MonitoringProfile[] {
  const list = getAllProfiles().filter((p) => String(p.id) !== String(id));
  setItem(PROFILES_LIST_KEY, JSON.stringify(list));

  const active = getActiveProfile();
  if (active && String(active.id) === String(id)) {
    setActiveProfile(list.length > 0 ? list[0] : null);
  }
  return list;
}

/* =========================================================
   DATA SOURCES STORE & SYNC
   ========================================================= */

export function getDataSources(): DataSourceItem[] {
  const raw = getItem(DATA_SOURCES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function setDataSources(sources: DataSourceItem[], silent: boolean = false): void {
  setItem(DATA_SOURCES_KEY, JSON.stringify(sources));

  // Sync active profile's connected source platforms quietly
  const active = getActiveProfile();
  if (active) {
    const activePlatforms = sources
      .filter((s) => s.status === "active" || s.status === "CONNECTED")
      .map((s) => s.platform.toLowerCase());

    const prevSources = (active.sources || []).slice().sort().join(",");
    const newSources = activePlatforms.slice().sort().join(",");

    if (prevSources !== newSources || !active.source || !activePlatforms.includes(active.source.toLowerCase())) {
      active.sources = activePlatforms;
      if (!active.source || !activePlatforms.includes(active.source.toLowerCase())) {
        active.source = activePlatforms[0] || undefined;
      }
      // Update profile silently to prevent recursive PROFILE_CHANGED_EVENT
      setActiveProfile(active, true);
    }
  }

  if (!silent && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SOURCES_CHANGED_EVENT, { detail: sources }));
  }
}

export function saveDataSource(item: DataSourceItem): DataSourceItem[] {
  const sources = getDataSources();
  const existingIdx = sources.findIndex((s) => String(s.id) === String(item.id));

  if (existingIdx >= 0) {
    sources[existingIdx] = item;
  } else {
    sources.unshift(item);
  }

  setDataSources(sources);
  return sources;
}

export function toggleDataSourceStatus(id: string | number): DataSourceItem[] {
  const sources = getDataSources().map((source) => {
    if (String(source.id) === String(id)) {
      const nextStatus =
        source.status === "active" || source.status === "CONNECTED"
          ? "paused"
          : "active";
      return { ...source, status: nextStatus as any };
    }
    return source;
  });

  setDataSources(sources);
  return sources;
}

export function deleteDataSource(id: string | number): DataSourceItem[] {
  const sources = getDataSources().filter((s) => String(s.id) !== String(id));
  setDataSources(sources);
  return sources;
}

/* =========================================================
   HELPERS TO CHECK DATA SOURCE READINESS
   ========================================================= */

export function hasConnectedDataSource(profile: MonitoringProfile | null, platform?: string): boolean {
  if (!profile) return false;

  // Check sources array on profile
  if (profile.sources && profile.sources.length > 0) {
    if (platform) {
      return profile.sources.some((s) => s.toLowerCase() === platform.toLowerCase());
    }
    return true;
  }

  // Check dataSources array if attached
  if (profile.dataSources && profile.dataSources.length > 0) {
    const connected = profile.dataSources.filter(
      (s: any) => s.status === "CONNECTED" || s.status === "active"
    );
    if (platform) {
      return connected.some((s: any) => String(s.platform).toLowerCase() === platform.toLowerCase());
    }
    return connected.length > 0;
  }

  // Check cached data sources for this profile
  const cachedSources = getDataSources().filter(
    (s) =>
      (!s.profileId || String(s.profileId) === String(profile.id)) &&
      (s.status === "active" || s.status === "CONNECTED")
  );

  if (platform) {
    return cachedSources.some((s) => s.platform.toLowerCase() === platform.toLowerCase());
  }

  return cachedSources.length > 0;
}
