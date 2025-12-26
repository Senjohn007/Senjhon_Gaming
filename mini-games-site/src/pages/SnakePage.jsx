// src/pages/SnakePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initSnake } from "../games/snake";
import { useSettings } from "../context/SettingsContext.jsx";

export default function SnakePage() {
  const { settings } = useSettings();

  // compute delay based on difficulty
  const tickDelay =
    settings.difficulty === "easy" ? 160 :
    settings.difficulty === "hard" ? 80 : 120;

  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch("http://localhost:5000/api/scores/leaderboard?game=snake&limit=10")
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading snake leaderboard (React):", err)
      );
  }, []);

  // initial load of leaderboard
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    if (typeof initSnake === "function") {
      // pass tickDelay and callback to refresh scores after save
      initSnake({ tickDelay, onScoreSaved: loadLeaderboard });
    }
  }, [tickDelay, loadLeaderboard]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Snake
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Use arrow keys to move. Eat food, avoid walls and yourself.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Classic
              </span>
              <span className="text-xs text-slate-400">
                Arrow keys · Endless
              </span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <canvas
                id="snake-canvas"
                width="320"
                height="320"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              ></canvas>

              <div
                className="feedback mt-3 text-sm text-slate-200 text-center"
                id="snake-status"
              >
                Press any arrow key to start.
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Snake Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by longest snake length in a single run.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="snake-leaderboard"
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
      </div>
    </main>
  );
}
