// src/pages/RpsPage.jsx
import React, { useEffect } from "react";
import { initRps } from "../games/rps";

export default function RpsPage() {
  useEffect(() => {
    if (typeof initRps === "function") {
      initRps();
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Competitive-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black"></div>
        
        {/* Floating RPS symbols */}
        <div className="absolute inset-0">
          {/* Rock symbols */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`rock-${i}`}
              className="absolute opacity-15"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <div className="w-10 h-10 bg-gray-700/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🗻</span>
              </div>
            </div>
          ))}
          
          {/* Paper symbols */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`paper-${i}`}
              className="absolute opacity-15"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <div className="w-10 h-10 bg-blue-700/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📃</span>
              </div>
            </div>
          ))}
          
          {/* Scissors symbols */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`scissors-${i}`}
              className="absolute opacity-15"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <div className="w-10 h-10 bg-red-700/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚔️</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Battle lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>
        
        {/* Competitive energy zones */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-red-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-300 drop-shadow-[0_0_24px_rgba(110,231,183,0.6)]">
            Rock Paper Scissors
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Choose Rock, Paper, or Scissors and see if you can beat the computer.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Competitive effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                RPS Match
              </span>
              <span className="text-xs text-slate-400">
                Best-of rounds · Score
              </span>
            </div>

            <div id="game-root">
              {/* Match setup */}
              <div
                id="rps-setup"
                className="mb-3 flex flex-wrap items-center gap-2"
              >
                <label
                  htmlFor="rps-rounds-select"
                  className="text-sm text-slate-200"
                >
                  Play:
                </label>
                <select
                  id="rps-rounds-select"
                  defaultValue="3"
                  className="h-9 rounded-lg bg-slate-950 border border-slate-700 px-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="3">Best of 3</option>
                  <option value="5">Best of 5</option>
                  <option value="7">Best of 7</option>
                </select>
                <button
                  id="rps-start-match-btn"
                  type="button"
                  className="h-9 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(110,231,183,0.45)] transition-colors"
                >
                  Start Match
                </button>
              </div>

              {/* Match status */}
              <div
                id="rps-status"
                className="hidden mb-2 items-center text-xs sm:text-sm text-slate-200"
              >
                <span id="rps-round-info">Round 1</span>
                <span className="mx-1">·</span>
                <span id="rps-score-info">You 0 - 0 CPU</span>
                <button
                  id="rps-reset-match-btn"
                  type="button"
                  className="ml-2 px-2 py-1 rounded-md border border-slate-600 text-[11px] sm:text-xs text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Choices */}
              <div className="rps-options mt-3 flex justify-center gap-4">
                <button
                  className="rps-choice-btn w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xl shadow-[0_12px_30px_rgba(15,23,42,0.9)] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                  data-choice="r"
                  disabled
                >
                  🗻
                </button>
                <button
                  className="rps-choice-btn w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xl shadow-[0_12px_30px_rgba(15,23,42,0.9)] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                  data-choice="p"
                  disabled
                >
                  📃
                </button>
                <button
                  className="rps-choice-btn w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xl shadow-[0_12px_30px_rgba(15,23,42,0.9)] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                  data-choice="s"
                  disabled
                >
                  ⚔️
                </button>
              </div>

              <div
                className="feedback mt-3 text-center text-sm text-slate-200 min-h-[1.25rem]"
                id="rps-result"
              >
                Choose "Start Match" to play.
              </div>

              <div
                id="rps-choices"
                className="mt-2 text-xs sm:text-sm text-slate-300 text-center min-h-[1.25rem]"
              ></div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Competitive effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top RPS Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by matches won in a single session.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="rps-leaderboard"
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
        
        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-emerald-400 mr-2">🗻</span>
              <span>Rock beats Scissors</span>
            </div>
            <div className="flex items-start">
              <span className="text-emerald-400 mr-2">📃</span>
              <span>Paper beats Rock</span>
            </div>
            <div className="flex items-start">
              <span className="text-emerald-400 mr-2">⚔️</span>
              <span>Scissors beats Paper</span>
            </div>
            <div className="flex items-start">
              <span className="text-emerald-400 mr-2">🏆</span>
              <span>Win more rounds to win the match</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}