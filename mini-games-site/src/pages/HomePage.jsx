// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initUsernameUI } from "../games/username";
import { getCurrentUser } from "../auth";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // load logged-in user (if any)
    setUser(getCurrentUser());

    // set up global getPlayerInfo + optional guest name UI
    if (typeof initUsernameUI === "function") {
      initUsernameUI();
    }
  }, []); // Added empty dependency array

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-80px)] text-slate-100">
      {/* foreground content */}
      <div className="relative max-w-6xl mx-auto px-4 py-12">
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
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight
                       leading-tight md:leading-tight
                       text-transparent bg-clip-text
                       bg-gradient-to-r from-fuchsia-400 via-purple-300 to-sky-400
                       animate-gradient-bg"
          >
            Welcome to Senjhon Gaming
          </h2>
          <p className="mt-3 text-slate-300 text-sm md:text-base max-w-xl mx-auto">
            Choose a mini‑game, chase high scores, and climb the leaderboard.
          </p>
        </div>

        {/* cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-up">
          {/* Roll Dice */}
          <GameCard
            title="Roll Dice"
            description="Session‑based dice rolls with total score and leaderboard."
            linkTo="/roll-dice"
            gradientFrom="from-purple-500"
            gradientTo="to-indigo-500"
            hoverColor="purple"
          />

          {/* Rock Paper Scissors */}
          <GameCard
            title="Rock Paper Scissors"
            description="Best‑of matches versus the CPU with win/loss tracking."
            linkTo="/rps"
            gradientFrom="from-emerald-500"
            gradientTo="to-teal-500"
            hoverColor="emerald"
          />

          {/* Hangman */}
          <GameCard
            title="Hangman"
            description="Guess the hidden word before your chances run out."
            linkTo="/hangman"
            gradientFrom="from-rose-500"
            gradientTo="to-orange-500"
            hoverColor="rose"
          />

          {/* Snake */}
          <GameCard
            title="Snake"
            description="Classic grid‑based snake with score based on snake length."
            linkTo="/snake"
            gradientFrom="from-lime-400"
            gradientTo="to-emerald-500"
            hoverColor="lime"
            textClass="text-slate-900"
          />

          {/* Breakout */}
          <GameCard
            title="Breakout"
            description="Control the paddle, break all the bricks, and chase combos."
            linkTo="/breakout"
            gradientFrom="from-sky-500"
            gradientTo="to-indigo-500"
            hoverColor="sky"
          />

          {/* Typing Speed */}
          <GameCard
            title="Typing Speed"
            description="Type random paragraphs and track WPM and accuracy."
            linkTo="/typing-speed"
            gradientFrom="from-fuchsia-500"
            gradientTo="to-pink-500"
            hoverColor="fuchsia"
          />

          {/* Tic Tac Toe */}
          <GameCard
            title="Tic Tac Toe"
            description="Best‑of series against the CPU with match‑level scoring."
            linkTo="/tic-tac-toe"
            gradientFrom="from-amber-400"
            gradientTo="to-orange-500"
            hoverColor="amber"
            textClass="text-slate-900"
          />

          {/* Whack‑a‑Mole */}
          <GameCard
            title="Whack‑a‑Mole"
            description="20‑second reaction sprint. Hit as many moles as you can."
            linkTo="/wack-a-mole"
            gradientFrom="from-red-500"
            gradientTo="to-rose-500"
            hoverColor="red"
          />

          {/* Minesweeper */}
          <GameCard
            title="Minesweeper"
            description="Clear the board without hitting a mine. Right‑click to flag."
            linkTo="/minesweeper"
            gradientFrom="from-indigo-500"
            gradientTo="to-blue-500"
            hoverColor="indigo"
          />

          {/* Battleship */}
          <GameCard
            title="Battleship"
            description="Hunt down the CPU fleet before it sinks your ships."
            linkTo="/battleship"
            gradientFrom="from-cyan-400"
            gradientTo="to-sky-500"
            hoverColor="cyan"
            textClass="text-slate-900"
          />

          {/* Flappy Bird */}
          <GameCard
            title="Flappy Bird"
            description="Tap to flap and weave through endless pipe gaps to score."
            linkTo="/flappy"
            gradientFrom="from-green-400"
            gradientTo="to-emerald-500"
            hoverColor="green"
            textClass="text-slate-900"
          />

          {/* Asteroids */}
          <GameCard
            title="Asteroids"
            description="Pilot your ship, dodge rocks, and blast asteroids for points."
            linkTo="/asteroids"
            gradientFrom="from-orange-500"
            gradientTo="to-amber-500"
            hoverColor="orange"
            textClass="text-slate-900"
          />
        </div>
      </div>
    </section>
  );
}

// Reusable GameCard component
function GameCard({ title, description, linkTo, gradientFrom, gradientTo, hoverColor, textClass = "text-slate-50" }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(168,85,247,0.75)] hover:border-${hoverColor}-400/80`}>
      <div className={`absolute inset-px rounded-2xl bg-gradient-to-br ${gradientFrom}/10 via-slate-900 to-slate-950 pointer-events-none`} />
      <div className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl bg-${hoverColor}-500/15`} />
      <div className="relative p-5 flex flex-col gap-3">
        <h3 className="text-lg font-semibold tracking-wide text-slate-50">
          {title}
        </h3>
        <p className="text-sm text-slate-300">
          {description}
        </p>
        <Link
          to={linkTo}
          className={`mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} px-4 py-2 text-sm font-semibold ${textClass} shadow-[0_12px_30px_rgba(88,28,135,0.7)] hover:from-${hoverColor}-400 hover:to-${hoverColor}-400 transition-all group-hover:translate-y-0.5`}
        >
          Play
        </Link>
      </div>
    </div>
  );
}