import React from "react";
import { useSettings } from "../context/SettingsContext.jsx";

export default function SettingsDrawer({ open, onClose }) {
  const { settings, setMuted, setVolume, setDifficulty } = useSettings();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* mute */}
          <div className="flex items-center justify-between">
            <span>Mute</span>
            <button
              onClick={() => setMuted(!settings.muted)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sm"
            >
              {settings.muted ? "Unmute" : "Mute"}
            </button>
          </div>

          {/* volume */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span>Music volume</span>
              <span className="text-xs text-slate-400">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* difficulty */}
          <div>
            <div className="mb-1 text-sm">Difficulty</div>
            <select
              value={settings.difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
