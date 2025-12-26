// src/pages/HangmanPage.jsx
import React, { useEffect } from "react";
import { initHangman } from "../games/hangman";

export default function HangmanPage() {
  useEffect(() => {
    if (typeof initHangman === "function") {
      initHangman();
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Library-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-900"></div>
        
        {/* Floating letters */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-purple-400/10 font-serif text-2xl opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
            </div>
          ))}
        </div>
        
        {/* Book pages effect */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-amber-900/5 rounded-sm"
              style={{
                width: `${Math.random() * 150 + 100}px`,
                height: `${Math.random() * 200 + 150}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                animation: `float ${Math.random() * 25 + 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 15}s`,
              }}
            />
          ))}
        </div>
        
        {/* Mysterious glowing orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-purple-300 drop-shadow-[0_0_24px_rgba(196,181,253,0.6)]">
            Hangman
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Guess the hidden word one letter at a time. You have limited wrong guesses.
          </p>
        </div>

        {/* card */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Library effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Word Game
              </span>
              <span className="text-xs text-slate-400">
                Type letters · Limited lives
              </span>
            </div>

            <div id="game-root">
              <div
                id="hangman-word"
                className="feedback mt-2 text-center font-mono text-xl tracking-[0.25em]"
              ></div>

              <div
                id="hangman-info"
                className="feedback mt-3 text-sm text-slate-300 text-center"
              ></div>

              <div className="mt-4 flex gap-2 justify-center">
                <input
                  type="text"
                  id="hangman-input"
                  maxLength={1}
                  placeholder="Enter a letter"
                  className="w-32 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  id="hangman-guess"
                  className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 active:bg-purple-600 text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(196,181,253,0.45)] transition-colors"
                >
                  Guess letter
                </button>
              </div>

              <div
                id="hangman-wrong"
                className="feedback mt-3 text-sm text-rose-400 text-center min-h-[1.25rem]"
              ></div>

              <div className="mt-4 flex justify-center">
                <button
                  id="hangman-reset"
                  className="px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  New Word
                </button>
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Library effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Hangman Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by correctly guessed words in a single game.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="hangman-leaderboard"
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
              <span className="text-purple-400 mr-2">🔤</span>
              <span>Enter one letter at a time</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">❓</span>
              <span>Guess the hidden word</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">⚠️</span>
              <span>Wrong guesses add to the hangman</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🏆</span>
              <span>Score points for each correct word</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}