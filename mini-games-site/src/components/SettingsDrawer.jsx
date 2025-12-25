import React from "react";
import { useSettings } from "../context/SettingsContext.jsx";

export default function SettingsDrawer({ open, onClose }) {
  const { settings, setMuted, setVolume, setDifficulty } = useSettings();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 shadow-xl ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 id="settings-title" className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* mute */}
          <div className="flex items-center justify-between">
            <span className="text-slate-200">Mute</span>
            <button
              onClick={() => setMuted(!settings.muted)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                settings.muted 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              {settings.muted ? "Unmute" : "Mute"}
            </button>
          </div>

          {/* volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-200">Music volume</span>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
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
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              disabled={settings.muted}
            />
          </div>

          {/* difficulty */}
          <div>
            <div className="mb-2 text-sm font-medium text-slate-200">Game Difficulty</div>
            <div className="grid grid-cols-3 gap-2">
              {["easy", "normal", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize ${
                    settings.difficulty === level
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Additional settings could be added here */}
          
          {/* Reset button */}
          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={() => {
                setMuted(false);
                setVolume(0.6);
                setDifficulty("normal");
              }}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors text-sm font-medium"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </>
  );
}