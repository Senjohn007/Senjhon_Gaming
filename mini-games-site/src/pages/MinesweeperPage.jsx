// src/pages/MinesweeperPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initMinesweeper, destroyMinesweeper } from "../games/minesweeper";
import { initUsernameUI } from "../games/username";

export default function MinesweeperPage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=minesweeper&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading minesweeper leaderboard (React):", err)
      );
  }, []);

  // animated background + game init
  useEffect(() => {
    const styleId = "minesweeper-animations";
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
        
        @keyframes minePulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes flagWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes explosion {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes numberPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes gridLine {
          0% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        
        @keyframes warningBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes cautionTape {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f172a, #7c2d12, #0f172a, #451a03);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .mine {
          position: absolute;
          width: 30px;
          height: 30px;
          animation: minePulse 5s ease-in-out infinite;
        }
        
        .mine::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #6b7280, #374151);
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
        
        .mine::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #ef4444;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .flag {
          position: absolute;
          width: 20px;
          height: 30px;
          animation: flagWave 4s ease-in-out infinite;
        }
        
        .flag::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 100%;
          background: #9ca3af;
          left: 2px;
        }
        
        .flag::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 10px;
          background: #ef4444;
          top: 5px;
          left: 4px;
          clip-path: polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%);
        }
        
        .explosion {
          position: absolute;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.7) 0%, rgba(239, 68, 68, 0) 70%);
          border-radius: 50%;
          animation: explosion 5s ease-in-out infinite;
        }
        
        .number {
          position: absolute;
          font-family: monospace;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.3);
          animation: numberPulse 3s ease-in-out infinite;
        }
        
        .grid-cell {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.05);
          animation: gridLine 4s ease-in-out infinite;
        }
        
        .warning-sign {
          position: absolute;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: warningBlink 2s ease-in-out infinite;
        }
        
        .warning-sign::after {
          content: '!';
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          color: #7c2d12;
        }
        
        .radar {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .radar::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(239, 68, 68, 0.3) 30deg, transparent 60deg);
          animation: radarSweep 4s linear infinite;
        }
        
        .caution-tape {
          position: absolute;
          height: 10px;
          background: repeating-linear-gradient(
            90deg,
            #fbbf24 0px,
            #fbbf24 20px,
            #000 20px,
            #000 40px
          );
          animation: cautionTape 10s linear infinite;
        }
        
        .binoculars {
          position: absolute;
          width: 40px;
          height: 20px;
          background: linear-gradient(135deg, #374151, #1f2937);
          border-radius: 10px;
          animation: float 10s ease-in-out infinite;
        }
        
        .binoculars::before,
        .binoculars::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          background: #111827;
          border-radius: 50%;
          top: 2.5px;
        }
        
        .binoculars::before {
          left: 5px;
        }
        
        .binoculars::after {
          right: 5px;
        }
        
        .compass {
          position: absolute;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #374151, #1f2937);
          border-radius: 50%;
          animation: floatReverse 12s ease-in-out infinite;
        }
        
        .compass::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 12px;
          background: #ef4444;
          top: 5px;
          left: 13px;
          border-radius: 2px;
        }
        
        .compass::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fbbf24;
          border-radius: 50%;
          top: 14px;
          left: 14px;
        }
        
        .field-zone {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }
      `;
      document.head.appendChild(style);
    }

    initUsernameUI();
    loadLeaderboard();
    initMinesweeper?.({ onScoreSaved: loadLeaderboard });

    return () => {
      if (typeof destroyMinesweeper === "function") {
        destroyMinesweeper();
      }
    };
  }, [loadLeaderboard]);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Grid Cells */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`grid-${i}`}
            className="grid-cell"
            style={{
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Mines */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`mine-${i}`}
            className="mine"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}

        {/* Flags */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`flag-${i}`}
            className="flag"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 4}s`,
            }}
          />
        ))}

        {/* Explosions */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`explosion-${i}`}
            className="explosion"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}

        {/* Numbers */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`number-${i}`}
            className="number"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 15}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
            }}
          >
            {Math.floor(Math.random() * 8) + 1}
          </div>
        ))}

        {/* Warning Signs */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`warning-${i}`}
            className="warning-sign"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 1 + 2}s`,
            }}
          />
        ))}

        {/* Radars */}
        <div
          className="radar"
          style={{
            width: "80px",
            height: "80px",
            top: "15%",
            right: "10%",
          }}
        />
        <div
          className="radar"
          style={{
            width: "60px",
            height: "60px",
            bottom: "20%",
            left: "15%",
          }}
        />

        {/* Caution Tapes */}
        <div
          className="caution-tape"
          style={{
            width: "100%",
            bottom: "10%",
            transform: "rotate(-2deg)",
          }}
        />
        <div
          className="caution-tape"
          style={{
            width: "80%",
            top: "15%",
            right: "0",
            transform: "rotate(1deg)",
          }}
        />

        {/* Binoculars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`binoculars-${i}`}
            className="binoculars"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}

        {/* Compasses */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`compass-${i}`}
            className="compass"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${Math.random() * 6 + 12}s`,
            }}
          />
        ))}

        {/* Field Zones */}
        <div
          className="field-zone"
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            left: "10%",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="field-zone"
          style={{
            width: "250px",
            height: "250px",
            bottom: "15%",
            right: "15%",
            backgroundColor: "rgba(251, 191, 36, 0.05)",
            animation: "floatReverse 12s ease-in-out infinite",
          }}
        />
        <div
          className="field-zone"
          style={{
            width: "200px",
            height: "200px",
            top: "50%",
            left: "60%",
            backgroundColor: "rgba(124, 45, 18, 0.05)",
            animation: "float 18s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-red-300 drop-shadow-[0_0_24px_rgba(252,165,165,0.6)]">
            Minesweeper
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Clear all safe cells without hitting a mine. Right-click to place
            flags.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Puzzle
              </span>
              <span className="text-xs text-slate-400">8×8 · 10 mines</span>
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

          {/* leaderboard – React renders rows */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
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
                  {scores.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-2 text-center text-slate-500"
                      >
                        No scores yet.
                      </td>
                    </tr>
                  ) : (
                    scores.map((row, index) => (
                      <tr key={row._id || index}>
                        <td>
                          {index + 1}. {row.username}
                        </td>
                        <td className="py-1 text-right">{row.value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">
            How to Play
          </h4>
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
