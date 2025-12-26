// src/pages/RollDicePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initRollDice } from "../games/roll-dice";

export default function RollDicePage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch("http://localhost:5000/api/scores/leaderboard?game=roll-dice&limit=10")
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading Roll Dice leaderboard (React):", err)
      );
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    if (typeof initRollDice === "function") {
      initRollDice({ onScoreSaved: loadLeaderboard });
    }
  }, [loadLeaderboard]);
  
  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Casino/gambling-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-900"></div>
        
        {/* Floating dice */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-lg opacity-20"
              style={{
                width: `${Math.random() * 40 + 30}px`,
                height: `${Math.random() * 40 + 30}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {/* Dice dots */}
              <div className="relative w-full h-full">
                {[...Array(Math.floor(Math.random() * 6) + 1)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-1/5 h-1/5 bg-slate-800 rounded-full"
                    style={{
                      top: `${Math.random() * 70 + 15}%`,
                      left: `${Math.random() * 70 + 15}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Playing cards */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/5 rounded-lg opacity-15"
              style={{
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 40 + 30}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* Casino lights effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-30"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`,
                animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-purple-300 drop-shadow-[0_0_24px_rgba(196,181,253,0.6)]">
            Roll Dice
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Click the button to roll two dice multiple times and try to get the highest total.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Casino effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Dice Game
              </span>
              <span className="text-xs text-slate-400">
                Sessions · Best total
              </span>
            </div>

            <div id="game-root">
              {/* Match setup */}
              <div id="roll-setup" className="mb-3 flex flex-wrap items-center gap-2">
                <label
                  htmlFor="roll-rounds-select"
                  className="text-sm text-slate-200"
                >
                  Play:
                </label>
                <select
                  id="roll-rounds-select"
                  defaultValue="1"
                  className="h-9 rounded-lg bg-slate-950 border border-slate-700 px-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="1">1 roll</option>
                  <option value="3">Best of 3 rolls</option>
                  <option value="5">Best of 5 rolls</option>
                  <option value="10">Best of 10 rolls</option>
                </select>
                <button
                  id="roll-start-match-btn"
                  type="button"
                  className="h-9 px-3 rounded-lg bg-purple-500 hover:bg-purple-400 active:bg-purple-600 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(196,181,253,0.45)] transition-colors"
                >
                  Start Session
                </button>
              </div>

              {/* Match status */}
              <div
                id="roll-status-bar"
                className="hidden mb-2 items-center text-xs sm:text-sm text-slate-200"
              >
                <span id="roll-round-info">Roll 1</span>
                <span className="mx-1">·</span>
                <span id="roll-score-info">Session total: 0</span>
                <button
                  id="roll-reset-match-btn"
                  type="button"
                  className="ml-2 px-2 py-1 rounded-md border border-slate-600 text-[11px] sm:text-xs text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Session
                </button>
              </div>

              <div className="mt-2 flex justify-center">
                <button
                  id="roll-button"
                  disabled
                  className="px-5 py-2.5 rounded-lg bg-slate-800 text-sm font-semibold text-slate-200 border border-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.9)] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Roll 🎲
                </button>
              </div>

              <div
                className="feedback mt-3 text-center text-sm text-slate-200 min-h-[1.25rem]"
                id="dice-result"
              >
                Choose "Start Session" to play.
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Casino effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Roll Dice Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by highest total in a single session.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="roll-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Total</th>
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
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🎲</span>
              <span>Choose number of rolls and start session</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🎯</span>
              <span>Click Roll to roll two dice</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🏆</span>
              <span>Try to get the highest total</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">📊</span>
              <span>Best roll of the session counts</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
