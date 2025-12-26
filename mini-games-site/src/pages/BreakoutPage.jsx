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
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Retro arcade-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black"></div>
        
        {/* Retro scanline effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.03) 3px)",
            backgroundSize: "100% 4px"
          }}></div>
        </div>
        
        {/* Floating pixel blocks */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 15 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
                animation: `float ${Math.random() * 20 + 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* Neon grid effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: "linear-gradient(rgba(56,189,248,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.2) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
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
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Retro arcade effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
            
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
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Retro arcade effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
            
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
        
        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">←→</span>
              <span>Move paddle left and right</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">🧱</span>
              <span>Break all bricks to advance</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">⚡</span>
              <span>Don't let the ball fall</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">🏆</span>
              <span>Score points for each brick</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}