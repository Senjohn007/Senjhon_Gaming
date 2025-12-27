// src/pages/WhackAMolePage.jsx
import React, { useEffect } from "react";
import { initWhackAMole } from "../games/whack-a-mole";

export default function WackAMolePage() {
  useEffect(() => {
    initWhackAMole?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Garden/field-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-green-950/20 to-slate-900"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}></div>
        </div>
        
        {/* Floating mole-like elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-15"
              style={{
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 20 + 15}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: "rgba(139, 69, 19, 0.2)",
                borderRadius: "50% 50% 40% 40%",
                animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Floating hammer elements */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-15"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-2 h-8 bg-gray-700/30"></div>
                <div className="w-6 h-6 bg-gray-600/30 rounded-sm"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Garden/field zones */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-lime-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-300 drop-shadow-[0_0_24px_rgba(251,191,36,0.6)]">
            Whack-a-Mole
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Click the mole as soon as it appears. You have 20 seconds!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Garden effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
            
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
                className="mt-4 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(251,191,36,0.45)] transition-colors"
              >
                Start
              </button>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Garden effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
            
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
        
        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">🔨</span>
              <span>Click on moles as they appear</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">⏱️</span>
              <span>You have 20 seconds to hit as many as possible</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">🎯</span>
              <span>Quick reflexes lead to higher scores</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">🏆</span>
              <span>Compete for the highest score</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}