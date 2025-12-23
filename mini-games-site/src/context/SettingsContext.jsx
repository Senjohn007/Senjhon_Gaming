// src/context/SettingsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

const DEFAULTS = {
  muted: false,
  volume: 0.6,      // 0–1
  difficulty: "normal",
};

const STORAGE_KEY = "senjhon-settings";

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  // load from localStorage once
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULTS, ...parsed });
      } catch {
        // ignore parse errors, keep defaults
      }
    }
  }, []);

  // save whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const value = {
    settings,
    setMuted: (muted) => setSettings((s) => ({ ...s, muted })),
    setVolume: (volume) => setSettings((s) => ({ ...s, volume })),
    setDifficulty: (difficulty) =>
      setSettings((s) => ({ ...s, difficulty })),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
