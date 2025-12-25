// src/pages/HomePage.jsx (updated sections)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initUsernameUI } from "../games/username";
import { getCurrentUser } from "../auth";
import GameCard from "../components/GameCard.jsx";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // load logged-in user (if any)
    setUser(getCurrentUser());
    
    // set up global getPlayerInfo + optional guest name UI
    if (typeof initUsernameUI === "function") {
      initUsernameUI();
    }
    
    // Trigger page load animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <section className={`relative overflow-hidden min-h-[calc(100vh-80px)] text-slate-100 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float animation-delay-2000" />
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-float animation-delay-4000" />
      </div>
      
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

        {/* hero with enhanced animation */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl md:text-6xl font-extrabold tracking-tight
                       leading-tight md:leading-tight
                       text-transparent bg-clip-text
                       bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400
                       animate-gradient-bg mb-4"
          >
            Welcome to Senjhon Gaming
          </h2>
          <p className="mt-4 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Choose a mini‑game, chase high scores, and climb the leaderboard.
          </p>
        </div>

        {/* cards grid with staggered animation */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Roll Dice */}
          <GameCard
            title="Roll Dice"
            description="Session‑based dice rolls with total score and leaderboard."
            linkTo="/roll-dice"
            gradientFrom="from-purple-500"
            gradientTo="to-indigo-500"
            hoverColor="purple"
            icon="🎲"
          />

          {/* Rock Paper Scissors */}
          <GameCard
            title="Rock Paper Scissors"
            description="Best‑of matches versus the CPU with win/loss tracking."
            linkTo="/rps"
            gradientFrom="from-emerald-500"
            gradientTo="to-teal-500"
            hoverColor="emerald"
            icon="✂️"
          />

          {/* Hangman */}
          <GameCard
            title="Hangman"
            description="Guess the hidden word before your chances run out."
            linkTo="/hangman"
            gradientFrom="from-rose-500"
            gradientTo="to-orange-500"
            hoverColor="rose"
            icon="🔤"
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
            icon="🐍"
          />

          {/* Breakout */}
          <GameCard
            title="Breakout"
            description="Control the paddle, break all the bricks, and chase combos."
            linkTo="/breakout"
            gradientFrom="from-sky-500"
            gradientTo="to-indigo-500"
            hoverColor="sky"
            icon="🧱"
          />

          {/* Typing Speed */}
          <GameCard
            title="Typing Speed"
            description="Type random paragraphs and track WPM and accuracy."
            linkTo="/typing-speed"
            gradientFrom="from-fuchsia-500"
            gradientTo="to-pink-500"
            hoverColor="fuchsia"
            icon="⌨️"
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
            icon="⭕"
          />

          {/* Whack‑a‑Mole */}
          <GameCard
            title="Whack‑a‑Mole"
            description="20‑second reaction sprint. Hit as many moles as you can."
            linkTo="/wack-a-mole"
            gradientFrom="from-red-500"
            gradientTo="to-rose-500"
            hoverColor="red"
            icon="🔨"
          />

          {/* Minesweeper */}
          <GameCard
            title="Minesweeper"
            description="Clear the board without hitting a mine. Right‑click to flag."
            linkTo="/minesweeper"
            gradientFrom="from-indigo-500"
            gradientTo="to-blue-500"
            hoverColor="indigo"
            icon="💣"
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
            icon="⚓"
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
            icon="🐦"
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
            icon="🚀"
          />
        </div>
      </div>
    </section>
  );
}