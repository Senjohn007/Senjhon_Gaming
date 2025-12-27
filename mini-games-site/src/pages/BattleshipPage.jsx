// src/pages/BattleshipPage.jsx
import React, { useEffect } from "react";
import { initBattleship } from "../games/battleship";

export default function BattleshipPage() {
  useEffect(() => {
    // Add custom styles for animations
    const styleId = "battleship-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes waterWave {
          0% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-10px) scaleY(0.95); }
          100% { transform: translateY(0) scaleY(1); }
        }
        
        @keyframes radarSweep {
          0% { transform: rotate(0deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        
        @keyframes bubbleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.4; }
          100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
        }
        
        @keyframes shipMove {
          0% { transform: translateX(-100px) translateY(0); }
          25% { transform: translateX(0) translateY(-5px); }
          50% { transform: translateX(100px) translateY(5px); }
          75% { transform: translateX(0) translateY(-3px); }
          100% { transform: translateX(-100px) translateY(0); }
        }
        
        @keyframes explosion {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f172a, #0c4a6e, #0f172a, #083344);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .water-wave {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 80px;
          background: linear-gradient(to top, rgba(6, 95, 212, 0.1), transparent);
          border-radius: 50% 50% 0 0;
          transform-origin: center bottom;
          animation: waterWave 8s ease-in-out infinite;
        }
        
        .water-wave:nth-child(odd) {
          animation-delay: 0.5s;
          animation-duration: 7s;
        }
        
        .water-wave:nth-child(even) {
          animation-delay: 1s;
          animation-duration: 9s;
        }
        
        .bubble {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 70%);
          border-radius: 50%;
          animation: bubbleFloat 10s ease-in-out infinite;
        }
        
        .ship-silhouette {
          position: absolute;
          opacity: 0.15;
          animation: shipMove 20s linear infinite;
        }
        
        .ship-silhouette::before {
          content: '';
          position: absolute;
          width: 60px;
          height: 20px;
          background: linear-gradient(to right, #334155, #475569);
          border-radius: 10px 10px 0 0;
        }
        
        .ship-silhouette::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 30px;
          background: #334155;
          bottom: 10px;
          left: 15px;
        }
        
        .explosion-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, rgba(251, 146, 60, 0) 70%);
          border-radius: 50%;
          animation: explosion 8s ease-in-out infinite;
        }
        
        .radar-zone {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(34, 211, 238, 0.2);
        }
        
        .radar-sweep {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(34, 211, 238, 0.3) 30deg, transparent 60deg);
          animation: radarSweep 4s linear infinite;
        }
        
        .compass-icon {
          position: absolute;
          width: 40px;
          height: 40px;
          opacity: 0.2;
          animation: floatReverse 12s ease-in-out infinite;
        }
        
        .compass-icon::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 30px;
          background: rgba(34, 211, 238, 0.4);
          top: 5px;
          left: 19px;
        }
        
        .compass-icon::after {
          content: '';
          position: absolute;
          width: 30px;
          height: 2px;
          background: rgba(34, 211, 238, 0.4);
          top: 19px;
          left: 5px;
        }
      `;
      document.head.appendChild(style);
    }

    initBattleship?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Water Waves at the bottom */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="water-wave"
            style={{
              bottom: `${i * 15}px`,
              opacity: 0.3 - i * 0.05,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Bubbles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="bubble"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 30}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}
        
        {/* Ship Silhouettes */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`ship-${i}`}
            className="ship-silhouette"
            style={{
              top: `${20 + i * 20}%`,
              animationDelay: `${i * 7}s`,
              animationDuration: `${20 + i * 5}s`,
            }}
          />
        ))}
        
        {/* Explosion Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`explosion-${i}`}
            className="explosion-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70 + 15}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 3 + 8}s`,
            }}
          />
        ))}
        
        {/* Radar Zones */}
        <div 
          className="radar-zone"
          style={{
            width: '200px',
            height: '200px',
            top: '20%',
            left: '70%',
          }}
        >
          <div className="radar-sweep"></div>
        </div>
        <div 
          className="radar-zone"
          style={{
            width: '150px',
            height: '150px',
            bottom: '25%',
            left: '15%',
          }}
        >
          <div className="radar-sweep"></div>
        </div>
        
        {/* Compass Icons */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`compass-${i}`}
            className="compass-icon"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 12}s`,
            }}
          />
        ))}
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
            {/* Subtle cyan line at top */}
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
            {/* Subtle cyan line at top */}
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