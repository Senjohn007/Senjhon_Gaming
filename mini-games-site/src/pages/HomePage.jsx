// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initUsernameUI } from "../games/username";
import { getCurrentUser } from "../auth";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    if (typeof initUsernameUI === "function") {
      initUsernameUI();
    }
  }, []);

  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* top bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-sm text-slate-300">
            {user ? (
              <>
                Playing as{" "}
                <span className="font-semibold text-purple-300">
                  {user.name}
                </span>
              </>
            ) : (
              <>
                Playing as{" "}
                <span className="font-semibold text-slate-200">Guest</span>
              </>
            )}
          </p>
        </div>

        {/* hero */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-[0_0_25px_rgba(168,85,247,0.55)]">
            Welcome to Senjhon Gaming
          </h2>
          <p className="mt-3 text-slate-300 text-sm md:text-base">
            Choose a mini‑game, chase high scores, and climb the leaderboard.
          </p>
        </div>

        {/* cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Roll Dice */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-purple-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(129,140,248,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Roll Dice
              </h3>
              <p className="text-sm text-slate-300">
                Session‑based dice rolls with total score and leaderboard.
              </p>
              <Link
                to="/roll-dice"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(88,28,135,0.7)] hover:from-purple-400 hover:to-indigo-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Rock Paper Scissors */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-emerald-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,185,129,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-emerald-400/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Rock Paper Scissors
              </h3>
              <p className="text-sm text-slate-300">
                Best‑of matches versus the CPU with win/loss tracking.
              </p>
              <Link
                to="/rps"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(5,150,105,0.7)] hover:from-emerald-400 hover:to-teal-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Hangman */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-rose-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(244,63,94,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-rose-500/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Hangman
              </h3>
              <p className="text-sm text-slate-300">
                Guess the hidden word before your chances run out.
              </p>
              <Link
                to="/hangman"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(248,113,113,0.7)] hover:from-rose-400 hover:to-orange-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Snake */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-lime-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(190,242,100,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-lime-400/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Snake
              </h3>
              <p className="text-sm text-slate-300">
                Classic grid‑based snake with score based on snake length.
              </p>
              <Link
                to="/snake"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(132,204,22,0.7)] hover:from-lime-300 hover:to-emerald-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Breakout */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-sky-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(56,189,248,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-sky-400/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Breakout
              </h3>
              <p className="text-sm text-slate-300">
                Control the paddle, break all the bricks, and chase combos.
              </p>
              <Link
                to="/breakout"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(37,99,235,0.7)] hover:from-sky-400 hover:to-indigo-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Typing Speed */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-fuchsia-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(217,70,239,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-fuchsia-500/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Typing Speed
              </h3>
              <p className="text-sm text-slate-300">
                Type random paragraphs and track WPM and accuracy.
              </p>
              <Link
                to="/typing-speed"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(219,39,119,0.7)] hover:from-fuchsia-400 hover:to-pink-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Tic Tac Toe */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-amber-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(251,191,36,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-amber-400/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Tic Tac Toe
              </h3>
              <p className="text-sm text-slate-300">
                Best‑of series against the CPU with match‑level scoring.
              </p>
              <Link
                to="/tic-tac-toe"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(249,115,22,0.7)] hover:from-amber-300 hover:to-orange-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Whack‑a‑Mole */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-red-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(248,113,113,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-red-500/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Whack‑a‑Mole
              </h3>
              <p className="text-sm text-slate-300">
                20‑second reaction sprint. Hit as many moles as you can.
              </p>
              <Link
                to="/wack-a-mole"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(239,68,68,0.7)] hover:from-red-400 hover:to-rose-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Minesweeper */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-indigo-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(129,140,248,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Minesweeper
              </h3>
              <p className="text-sm text-slate-300">
                Clear the board without hitting a mine. Right‑click to flag.
              </p>
              <Link
                to="/minesweeper"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(79,70,229,0.7)] hover:from-indigo-400 hover:to-blue-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Battleship */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-cyan-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(34,211,238,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-cyan-400/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Battleship
              </h3>
              <p className="text-sm text-slate-300">
                Hunt down the CPU fleet before it sinks your ships.
              </p>
              <Link
                to="/battleship"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(56,189,248,0.7)] hover:from-cyan-300 hover:to-sky-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Flappy Bird */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-green-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(74,222,128,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-green-400/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Flappy Bird
              </h3>
              <p className="text-sm text-slate-300">
                Tap to flap and weave through endless pipe gaps to score.
              </p>
              <Link
                to="/flappy"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(34,197,94,0.7)] hover:from-green-300 hover:to-emerald-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>

          {/* Asteroids */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm hover:border-orange-400/70 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.7)] transition-all duration-200">
            <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="relative p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">
                Asteroids
              </h3>
              <p className="text-sm text-slate-300">
                Pilot your ship, dodge rocks, and blast asteroids for points.
              </p>
              <Link
                to="/asteroids"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(249,115,22,0.7)] hover:from-orange-400 hover:to-amber-400 transition-colors"
              >
                Play
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
