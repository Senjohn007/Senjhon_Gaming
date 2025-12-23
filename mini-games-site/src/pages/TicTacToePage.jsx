// src/pages/TicTacToePage.jsx
import React, { useEffect } from "react";
import { initTicTacToe, destroyTicTacToe } from "../games/tictactoe";

export default function TicTacToePage() {
  useEffect(() => {
    initTicTacToe();

    return () => {
      if (typeof destroyTicTacToe === "function") {
        destroyTicTacToe();
      }
    };
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Tic Tac Toe
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            You are X. Click a cell to make a move. The computer plays as O.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Grid Game
              </span>
              <span className="text-xs text-slate-400">
                Best-of rounds · CPU
              </span>
            </div>

            <div id="game-root">
              {/* Match setup */}
              <div
                id="ttt-setup"
                className="mb-3 flex flex-wrap items-center gap-2"
              >
                <label
                  htmlFor="ttt-rounds-select"
                  className="text-sm text-slate-200"
                >
                  Play:
                </label>
                <select
                  id="ttt-rounds-select"
                  defaultValue="3"
                  className="h-9 rounded-lg bg-slate-950 border border-slate-700 px-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="1">Best of 1</option>
                  <option value="3">Best of 3</option>
                  <option value="5">Best of 5</option>
                </select>
                <button
                  id="ttt-start-match-btn"
                  type="button"
                  className="h-9 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(56,189,248,0.45)] transition-colors"
                >
                  Start Match
                </button>
              </div>

              {/* Match status */}
              <div
                id="ttt-status-bar"
                className="hidden mb-2 items-center text-xs sm:text-sm text-slate-200"
              >
                <span id="ttt-round-info">Round 1</span>
                <span className="mx-1">·</span>
                <span id="ttt-score-info">You 0 - 0 CPU</span>
                <button
                  id="ttt-reset-match-btn"
                  type="button"
                  className="ml-2 px-2 py-1 rounded-md border border-slate-600 text-[11px] sm:text-xs text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Match
                </button>
              </div>

              {/* Grid & status */}
              <div
                id="ttt-grid"
                className="tictactoe-grid grid grid-cols-3 gap-2 mt-3 max-w-xs mx-auto"
              >
                {/* Cells filled by JS */}
              </div>

              <div
                className="status mt-3 text-center text-sm text-slate-200 min-h-[1.25rem]"
                id="ttt-status"
              >
                Choose “Start Match” to play.
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  id="ttt-reset"
                  className="px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Board
                </button>
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Tic Tac Toe Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by matches won in a single session.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="ttt-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="ttt-leaderboard-empty-row">
                    <td colSpan={2} className="py-2 text-center text-slate-500">
                      No scores yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
