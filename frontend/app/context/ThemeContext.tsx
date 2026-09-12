"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@clerk/nextjs";

export type Theme = "LIGHT" | "DARK" | "SYSTEM";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "socialint_theme";
const API_URL = "http://localhost:5000";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("LIGHT");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  const { getToken, isSignedIn } = useAuth();

  // Apply theme class to documentElement
  const applyTheme = useCallback((resolved: ResolvedTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // Set theme handler
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // localStorage might be unavailable
      }

      const effective: ResolvedTheme =
        newTheme === "SYSTEM"
          ? getSystemTheme()
          : newTheme === "DARK"
          ? "dark"
          : "light";

      setResolvedTheme(effective);
      applyTheme(effective);

      // Async sync to backend /api/settings if logged in
      if (isSignedIn) {
        getToken()
          .then((token) => {
            if (!token) return;
            fetch(`${API_URL}/api/settings`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ appearance: newTheme }),
            }).catch(() => {
              // Silently ignore network failures for background theme sync
            });
          })
          .catch(() => {});
      }
    },
    [applyTheme, getToken, isSignedIn]
  );

  // Quick 1-click toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "LIGHT" : "DARK");
  }, [resolvedTheme, setTheme]);

  // Initial client mount
  useEffect(() => {
    setMounted(true);

    let savedTheme: Theme = "LIGHT";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "DARK" || stored === "LIGHT" || stored === "SYSTEM") {
        savedTheme = stored;
      }
    } catch {
      // fallback
    }

    setThemeState(savedTheme);

    const initialResolved: ResolvedTheme =
      savedTheme === "SYSTEM"
        ? getSystemTheme()
        : savedTheme === "DARK"
        ? "dark"
        : "light";

    setResolvedTheme(initialResolved);
    applyTheme(initialResolved);

    // If user is signed in, optionally check backend setting
    if (isSignedIn) {
      getToken()
        .then((token) => {
          if (!token) return;
          fetch(`${API_URL}/api/settings`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => (res.ok ? res.json() : null))
            .then((res) => {
              const backendAppearance = res?.data?.appearance;
              if (
                backendAppearance &&
                backendAppearance !== savedTheme &&
                ["LIGHT", "DARK", "SYSTEM"].includes(backendAppearance)
              ) {
                setThemeState(backendAppearance);
                const eff: ResolvedTheme =
                  backendAppearance === "SYSTEM"
                    ? getSystemTheme()
                    : backendAppearance === "DARK"
                    ? "dark"
                    : "light";
                setResolvedTheme(eff);
                applyTheme(eff);
                try {
                  localStorage.setItem(STORAGE_KEY, backendAppearance);
                } catch {}
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    }
  }, [applyTheme, getToken, isSignedIn]);

  // Listen to system preference changes when in SYSTEM mode
  useEffect(() => {
    if (!mounted || theme !== "SYSTEM") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const eff: ResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(eff);
      applyTheme(eff);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, theme, applyTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
