// src/pages/RpsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initRps } from "../games/rps";
import { initUsernameUI } from "../games/username";

export default function RpsPage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch("http://localhost:5000/api/scores/leaderboard?game=rps&limit=10")
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading RPS leaderboard (React):", err)
      );
  }, []);

  useEffect(() => {
    let isMounted = true;

    // ensure window.getPlayerInfo exists
    initUsernameUI();

    // Add custom styles for animations (same as before)
    const styleId = "rps-animations";
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
        @keyframes rockPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes paperFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes scissorsClash {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes trophyShine {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes medalSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes swordClash {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(10px) rotate(5deg); }
        }
        @keyframes shieldBlock {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes handClash {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f172a, #064e3b, #0f172a, #065f46);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        .rock-symbol {
          position: absolute;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6b7280, #4b5563);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: rockPulse 5s ease-in-out infinite;
        }
        .rock-symbol::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #9ca3af, #6b7280);
          border-radius: 50%;
        }
        .paper-symbol {
          position: absolute;
          width: 40px;
          height: 50px;
          background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
          border-radius: 3px;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
          animation: paperFloat 8s ease-in-out infinite;
        }
        .paper-symbol::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          height: 2px;
          background: #cbd5e1;
        }
        .paper-symbol::after {
          content: '';
          position: absolute;
          top: 12px;
          left: 5px;
          right: 15px;
          height: 2px;
          background: #cbd5e1;
        }
        .scissors-symbol {
          position: absolute;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scissorsClash 4s ease-in-out infinite;
        }
        .scissors-symbol::before,
        .scissors-symbol::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 30px;
          background: linear-gradient(to bottom, #ef4444, #dc2626);
          border-radius: 2px;
        }
        .scissors-symbol::before { transform: rotate(-10deg); }
        .scissors-symbol::after { transform: rotate(10deg); }
        .trophy {
          position: absolute;
          width: 30px;
          height: 40px;
          animation: trophyShine 6s ease-in-out infinite;
        }
        .trophy::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 25px;
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
          border-radius: 15px 15px 5px 5px;
        }
        .trophy::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 10px;
          width: 10px;
          height: 15px;
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
        }
        .medal {
          position: absolute;
          width: 25px;
          height: 25px;
          background: linear-gradient(135deg, #eab308, #ca8a04);
          border-radius: 50%;
          animation: medalSpin 8s linear infinite;
        }
        .medal::before {
          content: '1';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #713f12;
          font-weight: bold;
        }
        .sword {
          position: absolute;
          width: 3px;
          height: 40px;
          background: linear-gradient(to bottom, #94a3b8, #64748b);
          animation: swordClash 3s ease-in-out infinite;
        }
        .sword::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -6px;
          width: 15px;
          height: 15px;
          background: linear-gradient(135deg, #94a3b8, #64748b);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
        .shield {
          position: absolute;
          width: 30px;
          height: 35px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: shieldBlock 5s ease-in-out infinite;
        }
        .hand {
          position: absolute;
          width: 30px;
          height: 30px;
          animation: handClash 4s ease-in-out infinite;
        }
        .hand::before {
          content: '';
          position: absolute;
          width: 15px;
          height: 20px;
          background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
          border-radius: 10px 10px 5px 5px;
        }
        .hand::after {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          width: 5px;
          height: 10px;
          background: #cbd5e1;
          border-radius: 2px;
        }
        .battle-zone {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }
      `;
      document.head.appendChild(style);
    }

    // initial leaderboard load
    loadLeaderboard();

    // init game with callback so React reloads leaderboard after save
    initRps?.({
      onScoreSaved: () => {
        if (!isMounted) return;
        loadLeaderboard();
      },
    });

    return () => {
      isMounted = false;
    };
  }, [loadLeaderboard]);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {[...Array(8)].map((_, i) => (
          <div
            key={`rock-${i}`}
            className="rock-symbol"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}

        {[...Array(8)].map((_, i) => (
          <div
            key={`paper-${i}`}
            className="paper-symbol"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 8}s`,
            }}
          />
        ))}

        {[...Array(8)].map((_, i) => (
          <div
            key={`scissors-${i}`}
            className="scissors-symbol"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 4}s`,
            }}
          />
        ))}

        {[...Array(5)].map((_, i) => (
          <div
            key={`trophy-${i}`}
            className="trophy"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 3 + 6}s`,
            }}
          />
        ))}

        {[...Array(6)].map((_, i) => (
          <div
            key={`medal-${i}`}
            className="medal"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`,
            }}
          />
        ))}

        {[...Array(6)].map((_, i) => (
          <div
            key={`sword-${i}`}
            className="sword"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
            }}
          />
        ))}

        {[...Array(5)].map((_, i) => (
          <div
            key={`shield-${i}`}
            className="shield"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}

        {[...Array(6)].map((_, i) => (
          <div
            key={`hand-${i}`}
            className="hand"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 4}s`,
            }}
          />
        ))}

        <div
          className="battle-zone"
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            left: "10%",
            backgroundColor: "rgba(107, 114, 128, 0.05)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="battle-zone"
          style={{
            width: "250px",
            height: "250px",
            bottom: "15%",
            right: "15%",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            animation: "floatReverse 12s ease-in-out infinite",
          }}
        />
        <div
          className="battle-zone"
          style={{
            width: "200px",
            height: "200px",
            top: "50%",
            left: "60%",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            animation: "float 18s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-300 drop-shadow-[0_0_24px_rgba(110,231,183,0.6)]">
            Rock Paper Scissors
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Choose Rock, Paper, or Scissors and see if you can beat the
            computer.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

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
              />
            </div>
          </div>

          {/* leaderboard – React controls rows */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

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
          <h4 className="text-sm font-medium text-slate-300 mb-2">
            How to Play
          </h4>
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
