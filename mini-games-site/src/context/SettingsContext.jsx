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
  const [isLoaded, setIsLoaded] = useState(false);

  // load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULTS, ...parsed });
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error);
      // Keep defaults if there's an error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // save whenever settings change
  useEffect(() => {
    if (!isLoaded) return; // Don't save before initial load is complete
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  }, [settings, isLoaded]);

  const value = {
    settings,
    isLoaded,
    setMuted: (muted) => setSettings((s) => ({ ...s, muted })),
    setVolume: (volume) => setSettings((s) => ({ ...s, volume })),
    setDifficulty: (difficulty) =>
      setSettings((s) => ({ ...s, difficulty })),
    resetSettings: () => setSettings(DEFAULTS),
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