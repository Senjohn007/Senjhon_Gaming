// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// game pages
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

// user authentication / profile pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// auth helpers
import { getCurrentUser, logout } from "./auth";

// global background audio (uses SettingsContext)
import GlobalAudio from "./components/GlobalAudio.jsx";
import SettingsDrawer from "./components/SettingsDrawer.jsx";

// animated background layer
import AnimatedBackground from "./components/AnimatedBackground.jsx";

function AppShell() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for auth check
    const timer = setTimeout(() => {
      setUser(getCurrentUser());
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 relative">
      {/* global animated background, behind everything */}
      <AnimatedBackground />

      {/* global music for whole app */}
      <GlobalAudio />

      {/* header */}
      <header className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex flex-col gap-4">
          {/* top row: brand + auth */}
          <div className="flex items-center justify-between gap-4">
            {/* brand */}
            <div className="flex items-baseline gap-2 shrink-0">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-[0.25em] text-slate-100 uppercase">
                Senjhon Gaming
              </h1>
              <span className="hidden md:inline text-sm font-medium text-slate-400">
                mini games hub
              </span>
            </div>

            {/* auth + profile + settings */}
            <div className="flex items-center justify-end gap-3 text-sm md:text-base shrink-0">
              {user ? (
                <>
                  <span className="text-slate-200 text-right">
                    <span className="block text-[11px] leading-3 text-slate-400">
                      Playing as
                    </span>
                    <span className="text-base md:text-lg font-semibold text-purple-300">
                      {user.name}
                    </span>
                  </span>

                  {/* Profile button */}
                  <Link
                    to="/profile"
                    className="px-3 py-1.5 rounded-full
                               bg-slate-900/90 border border-slate-700 text-slate-200 text-xs md:text-sm
                               shadow-sm
                               hover:bg-slate-800 hover:border-purple-500 hover:text-purple-200
                               hover:shadow-purple-500/40
                               transition-all duration-200 ease-out
                               hover:-translate-y-0.5 hover:scale-[1.02]
                               focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-full
                               bg-slate-900/90 border border-slate-700 text-slate-200 text-sm
                               shadow-sm
                               hover:bg-slate-800 hover:border-red-500 hover:text-red-200
                               hover:shadow-red-500/40
                               transition-all duration-200 ease-out
                               hover:-translate-y-0.5 hover:scale-[1.02]
                               focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Logout
                  </button>

                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="px-3 py-1.5 rounded-full
                               bg-slate-900/90 border border-slate-700 text-slate-200 text-xs md:text-sm
                               shadow-sm
                               hover:bg-slate-800 hover:border-indigo-500 hover:text-indigo-200
                               hover:shadow-indigo-500/40
                               transition-all duration-200 ease-out
                               hover:-translate-y-0.5 hover:scale-[1.02]
                               focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Settings
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 rounded-full bg-purple-600 text-slate-50 hover:bg-purple-500 transition-colors text-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* bottom row: nav */}
          <nav className="w-full">
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

          {/* auth + profile routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  // wrap AppShell so useLocation works (BrowserRouter is in main.jsx)
  return <AppShell />;
}