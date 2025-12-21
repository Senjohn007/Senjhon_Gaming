// src/pages/BreakoutPage.jsx
import React, { useEffect } from "react";
import { initBreakout } from "../games/breakout";

export default function BreakoutPage() {
  useEffect(() => {
    if (typeof initBreakout === "function") {
      initBreakout();
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Breakout
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Move the paddle with your left and right arrow keys. Break all the
            bricks and set a new high score.
          </p>
        </div>

        {/* game container */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* canvas + status */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Arcade
              </span>
              <span className="text-xs text-slate-400">
                Arrow keys · Lives in HUD
              </span>
            </div>

            <div className="flex justify-center">
              <canvas
                id="breakout-canvas"
                width="360"
                height="320"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              />
            </div>

            <div
              id="breakout-status"
              className="mt-3 text-sm text-slate-200 font-medium"
            >
              Press left/right to start.
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-3">
              Top Breakout Scores
            </h3>
            <div className="text-xs text-slate-400 mb-2">
              Scores are ordered by bricks broken in a single game.
            </div>
            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="breakout-leaderboard"
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
