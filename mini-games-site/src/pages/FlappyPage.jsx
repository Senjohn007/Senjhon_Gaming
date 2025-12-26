// src/pages/FlappyPage.jsx
import React, { useEffect } from "react";
import { initFlappy } from "../games/flappy";

export default function FlappyPage() {
  useEffect(() => {
    initFlappy?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Sky-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-900 to-black"></div>
        
        {/* Animated clouds */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 60 + 30}px`,
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 30 + 40}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
        
        {/* Floating birds in the distance */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                top: `${Math.random() * 30 + 10}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 30}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 9.5C23 11.9853 20.9853 14 18.5 14C16.0147 14 14 11.9853 14 9.5C14 7.01472 16.0147 5 18.5 5C20.9853 5 23 7.01472 23 9.5Z" fill="white"/>
                <path d="M10 9.5C10 11.9853 7.98528 14 5.5 14C3.01472 14 1 11.9853 1 9.5C1 7.01472 3.01472 5 5.5 5C7.98528 5 10 7.01472 10 9.5Z" fill="white"/>
                <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14Z" fill="white"/>
              </svg>
            </div>
          ))}
        </div>
        
        {/* Sun/Moon element */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Subtle sky gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-900/20 opacity-30"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-green-300 drop-shadow-[0_0_24px_rgba(134,239,172,0.6)]">
            Flappy Bird
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Press Space or click to flap. Fly through gaps in the pipes and
            don&apos;t hit anything.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Sky effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Arcade
              </span>
              <span className="text-xs text-slate-400">
                Space/click · Endless
              </span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <canvas
                id="flappy-canvas"
                width="320"
                height="360"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              ></canvas>

              <div
                id="flappy-status"
                className="feedback mt-3 text-sm text-slate-200 text-center"
              >
                Press Space or click to start.
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Sky effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Flappy Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are the number of pipes passed in a single run.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="flappy-leaderboard"
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
              <span className="text-green-400 mr-2">🐦</span>
              <span>Press Space or click to flap wings</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">🚧</span>
              <span>Navigate through pipe gaps</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">💥</span>
              <span>Avoid hitting pipes or ground</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">🏆</span>
              <span>Score points for each pipe passed</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}