// src/pages/BattleshipPage.jsx
import React, { useEffect } from "react";
import { initBattleship } from "../games/battleship";

export default function BattleshipPage() {
  useEffect(() => {
    initBattleship?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Battleship
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Sink the CPU&apos;s ships before it sinks yours. Click the CPU
            grid to fire.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Strategy
              </span>
              <span className="text-xs text-slate-400">
                6×6 · 2 ships
              </span>
            </div>

            <div id="game-root" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <div>
                  <div className="text-xs text-slate-400 mb-1 text-center">
                    Your Fleet
                  </div>
                  <div
                    id="bship-player-grid"
                    className="inline-grid"
                  ></div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1 text-center">
                    CPU Fleet
                  </div>
                  <div id="bship-cpu-grid" className="inline-grid"></div>
                </div>
              </div>

              <div
                id="bship-status"
                className="mt-2 text-sm text-slate-200 text-center min-h-[1.25rem]"
              >
                Your turn: click a cell on the CPU grid.
              </div>

              <div className="flex justify-center">
                <button
                  id="bship-reset"
                  className="mt-2 px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Match
                </button>
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Battleship Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Higher scores reward clean wins with fewer ships lost.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="bship-leaderboard"
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
