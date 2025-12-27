// src/pages/WhackAMolePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initWhackAMole } from "../games/whack-a-mole";
import { initUsernameUI } from "../games/username";

export default function WackAMolePage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=whack-a-mole&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading Whack-a-Mole leaderboard (React):", err)
      );
  }, []);

  useEffect(() => {
    let isMounted = true;

    initUsernameUI(); 

    // animations CSS
    const styleId = "whack-a-mole-animations";
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
        @keyframes molePop {
          0% { transform: translateY(100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes grassWave {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(5px) scaleY(0.95); }
          100% { transform: translateX(0) scaleY(1); }
        }
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg,#0f172a,#1e293b,#0f172a,#1e1b4b);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        .grass-blade {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 30px;
          background: linear-gradient(to top,#14532d,#22c55e);
          border-radius: 100% 0 0 0;
          transform-origin: bottom center;
          animation: grassWave 3s ease-in-out infinite;
        }
        .mole-silhouette {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(139,69,19,0.15);
          border-radius: 50% 50% 40% 40%;
          animation: molePop 8s ease-in-out infinite;
        }
        .hammer-icon,
        .dirt-particle,
        .garden-zone { position:absolute; }
      `;
      document.head.appendChild(style);
    }

    // initial leaderboard
    loadLeaderboard();

    // init game; callback guarded with isMounted
    initWhackAMole?.({
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
        {[...Array(30)].map((_, i) => (
          <div
            key={`grass-${i}`}
            className="grass-blade"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 20 + 20}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {[...Array(5)].map((_, i) => (
          <div
            key={`mole-${i}`}
            className="mole-silhouette"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 30}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 5 + 8}s`,
            }}
          />
        ))}

        {[...Array(4)].map((_, i) => (
          <div
            key={`hammer-${i}`}
            className="hammer-icon"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}

        {[...Array(15)].map((_, i) => (
          <div
            key={`dirt-${i}`}
            className="dirt-particle"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}

        <div
          className="garden-zone"
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            left: "10%",
            backgroundColor: "rgba(34,197,94,0.05)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="garden-zone"
          style={{
            width: "250px",
            height: "250px",
            bottom: "15%",
            right: "15%",
            backgroundColor: "rgba(251,191,36,0.05)",
            animation: "floatReverse 12s ease-in-out infinite",
          }}
        />
        <div
          className="garden-zone"
          style={{
            width: "200px",
            height: "200px",
            top: "50%",
            left: "60%",
            backgroundColor: "rgba(163,230,53,0.05)",
            animation: "float 18s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Reflex
              </span>
              <span className="text-xs text-slate-400">Timed · Click fast</span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <div
                id="mole-grid"
                className="grid grid-cols-3 gap-3 justify-center my-4"
              />

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

          {/* leaderboard (React only) */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
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

        {/* instructions */}
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
