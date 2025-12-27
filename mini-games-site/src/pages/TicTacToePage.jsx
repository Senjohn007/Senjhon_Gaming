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
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Grid/math-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>
        
        {/* Floating X and O symbols */}
        <div className="absolute inset-0">
          {/* X symbols */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`x-${i}`}
              className="absolute opacity-15"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
          
          {/* O symbols */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`o-${i}`}
              className="absolute opacity-15"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mathematical/geometric elements */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 30 + 20}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: Math.random() > 0.5 ? "0" : "50%",
                animation: `float ${Math.random() * 25 + 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 15}s`,
              }}
            />
          ))}
        </div>
        
        {/* Grid zones */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-yellow-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-300 drop-shadow-[0_0_24px_rgba(251,191,36,0.6)]">
            Tic Tac Toe
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            You are X. Click a cell to make a move. The computer plays as O.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Grid effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
            
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
                  className="h-9 rounded-lg bg-slate-950 border border-slate-700 px-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="1">Best of 1</option>
                  <option value="3">Best of 3</option>
                  <option value="5">Best of 5</option>
                </select>
                <button
                  id="ttt-start-match-btn"
                  type="button"
                  className="h-9 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(251,191,36,0.45)] transition-colors"
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
                Choose "Start Match" to play.
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
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Grid effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
            
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
        
        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">❌</span>
              <span>You play as X</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">⭕</span>
              <span>Computer plays as O</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">🎯</span>
              <span>Get three in a row to win</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">🏆</span>
              <span>Win more rounds to win the match</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}