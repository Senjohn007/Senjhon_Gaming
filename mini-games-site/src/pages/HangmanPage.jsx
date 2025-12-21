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
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Hangman
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Guess the hidden word one letter at a time. You have limited wrong guesses.
          </p>
        </div>

        {/* card */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
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
                  className="w-32 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <button
                  id="hangman-guess"
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(56,189,248,0.45)] transition-colors"
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
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
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
      </div>
    </main>
  );
}
