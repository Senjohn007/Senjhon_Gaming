// src/pages/RollDicePage.jsx
import React, { useEffect } from "react";
import { initRollDice } from "../games/roll-dice";

export default function RollDicePage() {
  useEffect(() => {
    if (typeof initRollDice === "function") {
      initRollDice();
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Roll Dice
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Click the button to roll two dice multiple times and try to get the highest total.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Dice Game
              </span>
              <span className="text-xs text-slate-400">
                Sessions · Best total
              </span>
            </div>

            <div id="game-root">
              {/* Match setup */}
              <div id="roll-setup" className="mb-3 flex flex-wrap items-center gap-2">
                <label
                  htmlFor="roll-rounds-select"
                  className="text-sm text-slate-200"
                >
                  Play:
                </label>
                <select
                  id="roll-rounds-select"
                  defaultValue="1"
                  className="h-9 rounded-lg bg-slate-950 border border-slate-700 px-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="1">1 roll</option>
                  <option value="3">Best of 3 rolls</option>
                  <option value="5">Best of 5 rolls</option>
                  <option value="10">Best of 10 rolls</option>
                </select>
                <button
                  id="roll-start-match-btn"
                  type="button"
                  className="h-9 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(56,189,248,0.45)] transition-colors"
                >
                  Start Session
                </button>
              </div>

              {/* Match status */}
              <div
                id="roll-status-bar"
                className="hidden mb-2 items-center text-xs sm:text-sm text-slate-200"
              >
                <span id="roll-round-info">Roll 1</span>
                <span className="mx-1">·</span>
                <span id="roll-score-info">Session total: 0</span>
                <button
                  id="roll-reset-match-btn"
                  type="button"
                  className="ml-2 px-2 py-1 rounded-md border border-slate-600 text-[11px] sm:text-xs text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Session
                </button>
              </div>

              <div className="mt-2 flex justify-center">
                <button
                  id="roll-button"
                  disabled
                  className="px-5 py-2.5 rounded-lg bg-slate-800 text-sm font-semibold text-slate-200 border border-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.9)] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Roll 🎲
                </button>
              </div>

              <div
                className="feedback mt-3 text-center text-sm text-slate-200 min-h-[1.25rem]"
                id="dice-result"
              >
                Choose “Start Session” to play.
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Roll Dice Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by highest total in a single session.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="roll-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>{/* rows filled by JS */}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
