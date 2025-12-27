// src/pages/FlappyPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initFlappy } from "../games/flappy";
import { initUsernameUI } from "../games/username";

export default function FlappyPage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=flappy&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading flappy leaderboard (React):", err)
      );
  }, []);

  useEffect(() => {
    let isMounted = true;

    // ensure window.getPlayerInfo exists
    initUsernameUI();

    const styleId = "flappy-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* all your animation CSS exactly as before, unchanged */
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-20px) rotate(5deg);} }
        /* ... keep the rest of your CSS here ... */
        .animated-bg { position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;overflow:hidden;
          background:linear-gradient(-45deg,#0c4a6e,#075985,#0c4a6e,#0369a1);background-size:400% 400%;animation:gradientShift 15s ease infinite;}
      `;
      document.head.appendChild(style);
    }

    // initial leaderboard
    loadLeaderboard();

    // init game with callback
    initFlappy?.({
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
      {/* Animated Background (same JSX as before) */}
      <div className="animated-bg">
        <div className="ground"></div>

        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        <div className="sun" style={{ top: "10%", right: "15%" }} />

        {[...Array(8)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="cloud"
            style={{
              width: `${Math.random() * 100 + 80}px`,
              height: `${Math.random() * 40 + 30}px`,
              top: `${Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 30}s`,
              animationDuration: `${Math.random() * 20 + 30}s`,
            }}
          />
        ))}

        {[...Array(10)].map((_, i) => (
          <div
            key={`bird-${i}`}
            className="bird"
            style={{
              top: `${Math.random() * 60 + 10}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`,
            }}
          >
            <div className="bird-eye" />
            <div className="bird-beak" />
          </div>
        ))}

        {[...Array(6)].map((_, i) => (
          <div
            key={`pipe-${i}`}
            className={`pipe ${Math.random() > 0.5 ? "pipe-top" : "pipe-bottom"}`}
            style={{
              height: `${Math.random() * 200 + 100}px`,
              top: Math.random() > 0.5 ? "0" : "auto",
              bottom: Math.random() > 0.5 ? "auto" : "0",
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 5 + 15}s`,
            }}
          />
        ))}

        {[...Array(15)].map((_, i) => (
          <div
            key={`feather-${i}`}
            className="feather"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}

        {[...Array(10)].map((_, i) => (
          <div
            key={`wind-${i}`}
            className="wind-line"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {[...Array(5)].map((_, i) => (
          <div
            key={`score-${i}`}
            className="score-indicator"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            +{Math.floor(Math.random() * 10) + 1}
          </div>
        ))}

        <div
          className="sky-zone"
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            left: "10%",
            backgroundColor: "rgba(251, 191, 36, 0.05)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="sky-zone"
          style={{
            width: "250px",
            height: "250px",
            bottom: "15%",
            right: "15%",
            backgroundColor: "rgba(34, 197, 94, 0.05)",
            animation: "floatReverse 12s ease-in-out infinite",
          }}
        />
        <div
          className="sky-zone"
          style={{
            width: "200px",
            height: "200px",
            top: "50%",
            left: "60%",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            animation: "float 18s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
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
              />
              <div
                id="flappy-status"
                className="feedback mt-3 text-sm text-slate-200 text-center"
              >
                Press Space or click to start.
              </div>
            </div>
          </div>

          {/* leaderboard — React renders rows */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
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

        {/* instructions (unchanged) */}
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
