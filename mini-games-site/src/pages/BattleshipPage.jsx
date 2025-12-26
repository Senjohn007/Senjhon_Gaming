// src/pages/BattleshipPage.jsx
import React, { useEffect } from "react";
import { initBattleship } from "../games/battleship";

export default function BattleshipPage() {
  useEffect(() => {
    initBattleship?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Water-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-900"></div>
        
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900/20 to-transparent opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-cyan-900/15 to-transparent opacity-30 animate-pulse animation-delay-2000"></div>
        
        {/* Floating bubbles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-400/10 border border-cyan-400/20"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                bottom: `${Math.random() * 30}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Subtle water ripples */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-cyan-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.6)]">
            Battleship
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Sink the CPU&apos;s ships before it sinks yours. Click the CPU
            grid to fire.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Subtle water effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            
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
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Subtle water effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            
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
        
        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">🎯</span>
              <span>Click cells on the CPU grid to fire</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">⚓</span>
              <span>Find and sink all enemy ships</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">🚢</span>
              <span>Red = hit, Blue = miss</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">🏆</span>
              <span>Win with fewer shots for higher score</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}