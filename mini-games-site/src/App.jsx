// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RollDicePage from "./pages/RollDicePage.jsx";
import HangmanPage from "./pages/HangmanPage.jsx";
import SnakePage from "./pages/SnakePage.jsx";
import TypingSpeedPage from "./pages/TypingSpeedPage.jsx";
import RpsPage from "./pages/RpsPage.jsx";
import TicTacToePage from "./pages/TicTacToePage.jsx";
import WackAMolePage from "./pages/WackAMolePage.jsx";
import BreakoutPage from "./pages/BreakoutPage.jsx";
import MinesweeperPage from "./pages/MinesweeperPage.jsx";
import BattleshipPage from "./pages/BattleshipPage.jsx";
import FlappyPage from "./pages/FlappyPage.jsx";
import AsteroidsPage from "./pages/AsteroidsPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* header */}
<header className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950/95 backdrop-blur">
  <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    {/* brand */}
    <div className="flex items-baseline gap-2">
      <h1 className="text-xl md:text-2xl font-extrabold tracking-[0.2em] text-slate-100 uppercase">
        Senjhon Gaming
      </h1>
      <span className="hidden md:inline text-xs font-medium text-slate-400">
        mini games hub
      </span>
    </div>

    {/* nav */}
   <nav className="w-full md:w-auto">
  <div className="flex items-center gap-3 text-[11px] sm:text-xs md:text-sm overflow-x-auto whitespace-nowrap scroll-smooth">
        <Link
          to="/"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-slate-50 hover:bg-slate-800/70 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/roll-dice"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-violet-300 hover:bg-slate-800/70 transition-colors"
        >
          Roll Dice
        </Link>
        <Link
          to="/rps"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-emerald-300 hover:bg-slate-800/70 transition-colors"
        >
          RPS
        </Link>
        <Link
          to="/hangman"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-rose-300 hover:bg-slate-800/70 transition-colors"
        >
          Hangman
        </Link>
        <Link
          to="/snake"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-lime-300 hover:bg-slate-800/70 transition-colors"
        >
          Snake
        </Link>
        <Link
          to="/breakout"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-sky-300 hover:bg-slate-800/70 transition-colors"
        >
          Breakout
        </Link>
        <Link
          to="/typing-speed"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-fuchsia-300 hover:bg-slate-800/70 transition-colors"
        >
          Typing
        </Link>
        <Link
          to="/tic-tac-toe"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-amber-300 hover:bg-slate-800/70 transition-colors"
        >
          Tic Tac Toe
        </Link>
        <Link
          to="/wack-a-mole"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-red-300 hover:bg-slate-800/70 transition-colors"
        >
          Whack‑a‑Mole
        </Link>
        <Link
          to="/minesweeper"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-indigo-300 hover:bg-slate-800/70 transition-colors"
        >
          Minesweeper
        </Link>
        <Link
          to="/battleship"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-cyan-300 hover:bg-slate-800/70 transition-colors"
        >
          Battleship
        </Link>
        <Link
          to="/flappy"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-green-300 hover:bg-slate-800/70 transition-colors"
        >
          Flappy
        </Link>
        <Link
          to="/asteroids"
          className="px-2 py-1 rounded-full text-slate-300 hover:text-orange-300 hover:bg-slate-800/70 transition-colors"
        >
          Asteroids
        </Link>
      </div>
    </nav>
  </div>
</header>


      {/* main content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/roll-dice" element={<RollDicePage />} />
          <Route path="/rps" element={<RpsPage />} />
          <Route path="/hangman" element={<HangmanPage />} />
          <Route path="/snake" element={<SnakePage />} />
          <Route path="/breakout" element={<BreakoutPage />} />
          <Route path="/typing-speed" element={<TypingSpeedPage />} />
          <Route path="/tic-tac-toe" element={<TicTacToePage />} />
          <Route path="/wack-a-mole" element={<WackAMolePage />} />
          <Route path="/minesweeper" element={<MinesweeperPage />} />
          <Route path="/battleship" element={<BattleshipPage />} />
          <Route path="/flappy" element={<FlappyPage />} />
          <Route path="/asteroids" element={<AsteroidsPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/95">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Senjhon Gaming. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="hidden sm:inline">Powered by</span>
            <span className="font-semibold text-slate-200">
              React · Vite · Tailwind · MongoDB
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
