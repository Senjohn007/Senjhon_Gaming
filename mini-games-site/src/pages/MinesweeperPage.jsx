// src/pages/MinesweeperPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initMinesweeper } from "../games/minesweeper";

export default function MinesweeperPage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch("http://localhost:5000/api/scores/leaderboard?game=minesweeper&limit=10")
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading minesweeper leaderboard (React):", err)
      );
  }, []);

  // initial load of leaderboard
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    // pass callback so game can tell React to refresh after saving score
    initMinesweeper?.({ onScoreSaved: loadLeaderboard });
  }, [loadLeaderboard]);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Field/military-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>
        
        {/* Floating mine-like elements */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 30}, 70%, 50%)`,
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        
        {/* Warning symbols */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 25 + 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 15}s`,
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 21H23L12 2L1 21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16H12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
        
        {/* Danger zones */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-red-300 drop-shadow-[0_0_24px_rgba(252,165,165,0.6)]">
            Minesweeper
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Clear all safe cells without hitting a mine. Right-click to
            place flags.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Danger effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Puzzle
              </span>
              <span className="text-xs text-slate-400">
                8×8 · 10 mines
              </span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <div id="mines-grid" className="mt-1"></div>

              <div
                id="mines-status"
                className="feedback mt-3 text-sm text-slate-200 text-center min-h-[1.25rem]"
              >
                Click a cell to start. Right-click to place flags.
              </div>

              <button
                id="mines-reset"
                className="mt-3 px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Reset Board
              </button>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Danger effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Minesweeper Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Higher scores come from faster clears. No flags, no glory.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="mines-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((row, index) => (
                    <tr key={row._id || index}>
                      <td>{index + 1}. {row.username}</td>
                      <td className="py-1 text-right">{row.value}</td>
                    </tr>
                  ))}
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
              <span className="text-red-400 mr-2">👆</span>
              <span>Left-click to reveal a cell</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-400 mr-2">🚩</span>
              <span>Right-click to place/remove flag</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-400 mr-2">💣</span>
              <span>Avoid clicking on mines</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-400 mr-2">🏆</span>
              <span>Clear all safe cells to win</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
