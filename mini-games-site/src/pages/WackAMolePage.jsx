// src/pages/WhackAMolePage.jsx
import React, { useEffect } from "react";
import { initWhackAMole } from "../games/whack-a-mole";

export default function WackAMolePage() {
  useEffect(() => {
    initWhackAMole?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Whack-a-Mole
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Click the mole as soon as it appears. You have 20 seconds!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Reflex
              </span>
              <span className="text-xs text-slate-400">
                Timed · Click fast
              </span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <div
                id="mole-grid"
                className="grid grid-cols-3 gap-3 justify-center my-4"
              >
                {/* holes created by JS; JS can add a base hole class for visuals */}
              </div>

              <div
                className="feedback text-sm text-slate-200 text-center"
                id="mole-status"
              >
                Press "Start" to begin.
              </div>

              <div
                className="feedback mt-1 text-sm text-slate-300 text-center"
                id="mole-score"
              >
                Score: 0
              </div>

              <button
                id="mole-start"
                className="mt-4 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(56,189,248,0.45)] transition-colors"
              >
                Start
              </button>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Whack-a-Mole Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by moles hit in a single round.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="mole-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Score</th>
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
