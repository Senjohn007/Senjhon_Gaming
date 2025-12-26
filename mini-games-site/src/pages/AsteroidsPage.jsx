// src/pages/AsteroidsPage.jsx
import React, { useEffect } from "react";
import { initAsteroids } from "../games/asteroids";

export default function AsteroidsPage() {
  useEffect(() => {
    initAsteroids?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Subtle animated space background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black"></div>
        
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>
        
        {/* Slow moving nebula effect */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Asteroids
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Pilot your ship, dodge asteroids, and shoot them down. Arrow keys
            to turn/thrust, Space to shoot.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Space
              </span>
              <span className="text-xs text-slate-400">
                Arrows · Spacebar
              </span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <canvas
                id="asteroids-canvas"
                width="360"
                height="320"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              ></canvas>

              <div
                id="asteroids-status"
                className="feedback mt-3 text-sm text-slate-200 text-center"
              >
                Press Enter to start. Arrows to move, Space to shoot.
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Asteroids Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are based on destroyed asteroids in a single run.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="asteroids-leaderboard"
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