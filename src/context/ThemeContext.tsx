"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeId = "dark" | "light";

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  description: string;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: "dark",
    name: "Dark",
    emoji: "🌑",
    description: "Modern Blue-Black Dark Mode",
    vars: {
      "--bg-color": "#0b0f1a",
      "--background": "#0b0f1a",
      "--background-secondary": "#111827",
      "--text-color": "#e5e7eb",
      "--foreground": "#e5e7eb",
      "--foreground-muted": "#9ca3af",
      "--accent-color": "#3b82f6",
      "--accent": "#3b82f6",
      "--primary": "#3b82f6",
      "--primary-light": "#60a5fa",
      "--primary-hover": "#60a5fa",
      "--primary-active": "#1d4ed8",
      "--primary-glow": "rgba(59, 130, 246, 0.45)",
      "--accent-glow": "rgba(59, 130, 246, 0.35)",
      "--interactive-hover": "rgba(255, 255, 255, 0.06)",
      "--interactive-hover-text": "#ffffff",
      "--card-bg": "rgba(255, 255, 255, 0.05)",
      "--card": "rgba(255, 255, 255, 0.05)",
      "--border-color": "rgba(255, 255, 255, 0.1)",
      "--card-border": "rgba(255, 255, 255, 0.1)",
      "--card-hover": "rgba(255, 255, 255, 0.08)",
      "--card-hover-border": "rgba(59, 130, 246, 0.35)",
      "--input-bg": "rgba(255, 255, 255, 0.04)",
      "--input-border": "rgba(255, 255, 255, 0.1)",
      "--input-focus": "rgba(59, 130, 246, 0.6)",
      "--navbar-bg": "rgba(11, 15, 26, 0.85)",
      "--sidebar-bg": "rgba(10, 10, 24, 0.4)",
      "--blob-1": "rgba(59, 130, 246, 0.4)",
      "--blob-2": "rgba(37, 99, 235, 0.3)",
      "--blob-3": "rgba(29, 78, 216, 0.25)",
      "--cursor-color": "rgba(59, 130, 246, 0.85)",
      "--cursor-trail": "rgba(96, 165, 250, 0.35)",
      "--dot-grid-color": "rgba(59, 130, 246, 0.06)",
      "--login-glow": "rgba(59, 130, 246, 0.18)",
      "--particle-opacity": "1",
      "--shadow-card": "0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
      "--shadow-card-hover": "0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
    },
  },
  {
    id: "light",
    name: "Light",
    emoji: "☀️",
    description: "Clean Light Mode",
    vars: {
      "--bg-color": "#f5f7fb",
      "--background": "#f5f7fb",
      "--background-secondary": "#ffffff",
      "--text-color": "#111827",
      "--foreground": "#111827",
      "--foreground-muted": "#4b5563",
      "--accent-color": "#2563eb",
      "--accent": "#2563eb",
      "--primary": "#2563eb",
      "--primary-light": "#3b82f6",
      "--primary-hover": "#1d4ed8",
      "--primary-active": "#1e40af",
      "--primary-glow": "rgba(37, 99, 235, 0.2)",
      "--accent-glow": "rgba(37, 99, 235, 0.15)",
      "--interactive-hover": "rgba(0, 0, 0, 0.05)",
      "--interactive-hover-text": "#2563eb",
      "--card-bg": "#ffffff",
      "--card": "#ffffff",
      "--border-color": "rgba(0, 0, 0, 0.08)",
      "--card-border": "rgba(0, 0, 0, 0.08)",
      "--card-hover": "#ffffff",
      "--card-hover-border": "rgba(37, 99, 235, 0.3)",
      "--input-bg": "rgba(255, 255, 255, 0.9)",
      "--input-border": "rgba(0, 0, 0, 0.12)",
      "--input-focus": "rgba(37, 99, 235, 0.3)",
      "--navbar-bg": "rgba(245, 247, 251, 0.92)",
      "--sidebar-bg": "rgba(240, 242, 248, 0.85)",
      "--blob-1": "rgba(37, 99, 235, 0.12)",
      "--blob-2": "rgba(29, 78, 216, 0.1)",
      "--blob-3": "rgba(59, 130, 246, 0.08)",
      "--cursor-color": "rgba(37, 99, 235, 0.8)",
      "--cursor-trail": "rgba(59, 130, 246, 0.25)",
      "--dot-grid-color": "rgba(37, 99, 235, 0.08)",
      "--login-glow": "rgba(37, 99, 235, 0.1)",
      "--particle-opacity": "0.5",
      "--shadow-card": "0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
      "--shadow-card-hover": "0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.07)",
    },
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[0],
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.setAttribute("data-theme", theme.id);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("dark");

  // Load from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem("studyq-theme") as ThemeId | null;
    const id = savedThemeId || "dark";
    setThemeId(id);
    const theme = THEMES.find((t) => t.id === id) || THEMES[0];
    applyTheme(theme);
  }, []);

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem("studyq-theme", id);
    const t = THEMES.find((th) => th.id === id) || THEMES[0];
    applyTheme(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
